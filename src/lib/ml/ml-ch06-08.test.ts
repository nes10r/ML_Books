import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/data/csv";
import { toDigits } from "@/lib/data/digits";
import {
  dbscan,
  emStep,
  inertia,
  initMixture,
  kMeansPlusPlusInit,
  runKMeans,
  silhouetteScore,
} from "./clustering-advanced";
import { generateBlobs5, generateMixtureData, generateMoons, generateTemperature } from "./datasets";
import {
  boostingPredict,
  correlatedMajorityAccuracy,
  fitBaggedTrees,
  fitGradientBoosting,
  forestPredict,
  majorityAccuracy,
  oobAccuracy,
} from "./ensemble";
import { fitPCA, pcaInverse, pcaTransform, projectedVariance, symmetricEigen } from "./pca";
import { createRng } from "./random";
import { fitClassificationTree, predictClass, treeStats } from "./tree";

const toPoints = (X: number[][]) => X.map(([x, y]) => ({ x: x!, y: y! }));

describe("ensemble: voting theory", () => {
  it("majority of independent 51% voters improves with more voters", () => {
    expect(majorityAccuracy(1, 0.51)).toBeCloseTo(0.51, 10);
    expect(majorityAccuracy(1001, 0.51)).toBeCloseTo(0.737, 3);
    expect(majorityAccuracy(10001, 0.51)).toBeGreaterThan(0.97);
  });

  it("correlated voters gain much less than independent ones", () => {
    const indep = majorityAccuracy(101, 0.6);
    const corr = correlatedMajorityAccuracy(101, 0.6, 0.5);
    expect(indep).toBeGreaterThan(0.97);
    expect(corr).toBeLessThan(0.65);
    expect(corr).toBeGreaterThan(0.55);
  });
});

describe("ensemble: bagging, random forests, boosting", () => {
  const { X, y } = generateMoons(11, 600, 0.32);
  const Xtr = X.slice(0, 400);
  const ytr = y.slice(0, 400);
  const Xte = X.slice(400);
  const yte = y.slice(400);
  const acc = (pred: (x: number[]) => number) => Xte.filter((x, i) => pred(x) === yte[i]).length / Xte.length;

  it("a bagged forest beats a single unrestricted tree on held-out data", () => {
    const tree = fitClassificationTree(Xtr, ytr, 2);
    const forest = fitBaggedTrees(Xtr, ytr, 2, { nTrees: 60, seed: 3 });
    expect(acc((x) => forestPredict(forest, x))).toBeGreaterThan(acc((x) => predictClass(tree, x)));
  });

  it("OOB accuracy is a reasonable estimate of test accuracy", () => {
    const forest = fitBaggedTrees(Xtr, ytr, 2, { nTrees: 60, seed: 3 });
    const oob = oobAccuracy(forest, Xtr, ytr);
    expect(Math.abs(oob - acc((x) => forestPredict(forest, x)))).toBeLessThan(0.06);
    // each bootstrap sample leaves out roughly 1 - 1/e ≈ 37% of instances
    const outFrac = 1 - forest.inBag[0]!.size / Xtr.length;
    expect(outFrac).toBeGreaterThan(0.3);
    expect(outFrac).toBeLessThan(0.44);
  });

  it("random thresholds (Extra-Trees) give a different, still accurate tree", () => {
    const normal = fitClassificationTree(Xtr, ytr, 2, { maxDepth: 6 });
    const extra = fitClassificationTree(Xtr, ytr, 2, { maxDepth: 6, randomThresholds: true, rng: createRng(5) });
    expect(JSON.stringify(normal)).not.toBe(JSON.stringify(extra));
    expect(acc((x) => predictClass(extra, x))).toBeGreaterThan(0.75);
  });

  it("maxFeatures = 1 restricts each split to one random feature", () => {
    const t = fitClassificationTree(Xtr, ytr, 2, { maxDepth: 4, maxFeatures: 1, rng: createRng(2) });
    expect(treeStats(t).depth).toBeLessThanOrEqual(4);
  });

  it("gradient boosting shrinks the residuals stage by stage", () => {
    const { train } = generateTemperature();
    const Xg = train.map((p) => [p.x]);
    const yg = train.map((p) => p.y);
    const model = fitGradientBoosting(Xg, yg, 40, 0.3, { maxDepth: 2 });
    const sse = (r: number[]) => r.reduce((a, b) => a + b * b, 0);
    expect(sse(model.stages[39]!.residuals)).toBeLessThan(sse(model.stages[0]!.residuals) * 0.3);
    const rmse = (count: number) =>
      Math.sqrt(Xg.reduce((a, x, i) => a + (boostingPredict(model, x, 0.3, count) - yg[i]!) ** 2, 0) / Xg.length);
    expect(rmse(40)).toBeLessThan(rmse(5));
  });
});

describe("PCA", () => {
  it("Jacobi eigen-decomposition recovers a known symmetric matrix", () => {
    const { values, vectors } = symmetricEigen([
      [2, 1],
      [1, 2],
    ]);
    expect(values[0]).toBeCloseTo(3, 10);
    expect(values[1]).toBeCloseTo(1, 10);
    expect(Math.abs(vectors[0]![0]!)).toBeCloseTo(Math.SQRT1_2, 8);
  });

  it("matches scikit-learn on the digits dataset", () => {
    const csv = readFileSync(path.join(process.cwd(), "public/data/digits-8x8.csv"), "utf8");
    const digits = toDigits(parseCsv(csv).rows);
    expect(digits).toHaveLength(1797);
    const model = fitPCA(digits.map((d) => d.pixels));
    expect(model.explainedVarianceRatio[0]).toBeCloseTo(0.1489, 4);
    expect(model.explainedVarianceRatio[1]).toBeCloseTo(0.1362, 4);
    expect(model.explainedVarianceRatio[2]).toBeCloseTo(0.1179, 4);
    const needed = (target: number) => {
      let c = 0;
      return model.explainedVarianceRatio.findIndex((r) => (c += r) >= target) + 1;
    };
    expect(needed(0.95)).toBe(29);
    // full reconstruction is lossless
    const x = digits[0]!.pixels;
    const back = pcaInverse(model, pcaTransform(model, x, 64));
    back.forEach((v, i) => expect(v).toBeCloseTo(x[i]!, 6));
  });

  it("the first component maximises projected variance", () => {
    const rng = createRng(4);
    const X = Array.from({ length: 300 }, () => {
      const t = rng() * 2 - 1;
      return [t * 3, t * 3 + (rng() - 0.5)];
    });
    const model = fitPCA(X);
    const pc = model.components[0]! as [number, number];
    expect(projectedVariance(X, pc)).toBeGreaterThan(projectedVariance(X, [1, 0]));
    expect(projectedVariance(X, pc)).toBeCloseTo(model.explainedVariance[0]!, 4);
  });
});

describe("clustering: k-means, silhouette, DBSCAN, GMM", () => {
  it("k-means++ on the 5 blobs reaches silhouette ≈ 0.7087", () => {
    const { points } = generateBlobs5();
    const res = runKMeans(points, kMeansPlusPlusInit(points, 5, createRng(1)));
    expect(res.inertia).toBeCloseTo(inertia(points, res.centroids), 6);
    expect(silhouetteScore(points, res.assignments)).toBeCloseTo(0.7087, 3);
  });

  it("DBSCAN separates the moons with eps = 0.2 and fragments them with eps = 0.05", () => {
    const points = toPoints(generateMoons(42, 300, 0.06).X);
    const good = dbscan(points, 0.2, 5);
    expect(good.nClusters).toBe(2);
    expect(good.labels.filter((l) => l === -1)).toHaveLength(0);
    const tiny = dbscan(points, 0.05, 5);
    expect(tiny.nClusters).toBe(15);
    expect(tiny.labels.filter((l) => l === -1)).toHaveLength(207);
  });

  it("EM never decreases the log-likelihood", () => {
    const points = generateMixtureData();
    let model = initMixture([
      { x: -1, y: 1 },
      { x: 2, y: -1 },
      { x: 4, y: 2 },
    ]);
    let prev = -Infinity;
    for (let i = 0; i < 25; i++) {
      const step = emStep(points, model);
      expect(step.logLikelihood).toBeGreaterThanOrEqual(prev - 1e-6);
      prev = step.logLikelihood;
      model = step.model;
    }
    const weights = model.map((g) => g.weight).sort((a, b) => b - a);
    expect(weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 8);
    expect(weights[2]).toBeGreaterThan(0.15);
  });
});
