import { describe, expect, it } from "vitest";
import { fitNearestCentroid, initCentroids, kMeansStep, predictNearestCentroid } from "./clustering";
import { createStream, generateApartments, generateBlobs, generateNoisyCurve } from "./datasets";
import { diagnoseFit } from "./diagnostics";
import { solveLinearSystem } from "./linalg";
import { accuracy, meanSquaredError, rootMeanSquaredError } from "./metrics";
import { knnRegress } from "./neighbors";
import { createRng } from "./random";
import { fitLinearRegression, fitPolynomialRidge, predictLinear, predictPolynomial, sgdStep } from "./regression";

describe("random", () => {
  it("is deterministic for a seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe("linear regression", () => {
  it("matches the lesson's worked example (θ₁ = 1.5, θ₀ ≈ 18.33)", () => {
    const m = fitLinearRegression([
      { x: 60, y: 110 },
      { x: 90, y: 150 },
      { x: 120, y: 200 },
    ]);
    expect(m.slope).toBeCloseTo(1.5, 10);
    expect(m.intercept).toBeCloseTo(18.333, 3);
    expect(predictLinear(m, 100)).toBeCloseTo(168.33, 2);
  });

  it("matches the practice exercise solution (θ₁ ≈ 1.333, θ₀ = 30)", () => {
    const m = fitLinearRegression([
      { x: 50, y: 95 },
      { x: 80, y: 140 },
      { x: 110, y: 175 },
    ]);
    expect(m.slope).toBeCloseTo(4 / 3, 10);
    expect(m.intercept).toBeCloseTo(30, 10);
  });

  it("SGD converges to the generating line on a stream", () => {
    const next = createStream(1, { drift: false });
    let m = { intercept: 0, slope: 0 };
    for (let i = 0; i < 3000; i++) m = sgdStep(m, next(), 0.05);
    expect(m.intercept).toBeCloseTo(0.15, 1);
    expect(m.slope).toBeCloseTo(0.7, 1);
  });
});

describe("linear algebra", () => {
  it("solves a 3x3 system", () => {
    const x = solveLinearSystem(
      [
        [2, 1, -1],
        [-3, -1, 2],
        [-2, 1, 2],
      ],
      [8, -11, -3],
    )!;
    expect(x[0]).toBeCloseTo(2);
    expect(x[1]).toBeCloseTo(3);
    expect(x[2]).toBeCloseTo(-1);
  });

  it("returns null for singular matrices", () => {
    expect(
      solveLinearSystem(
        [
          [1, 2],
          [2, 4],
        ],
        [1, 2],
      ),
    ).toBeNull();
  });
});

describe("polynomial ridge", () => {
  const { train, validation } = generateNoisyCurve(11, 30, 0.4);
  const rmse = (m: ReturnType<typeof fitPolynomialRidge>, pts: typeof train) =>
    rootMeanSquaredError(pts.map((p) => p.y), pts.map((p) => predictPolynomial(m, p.x)));

  it("recovers an exact quadratic", () => {
    const pts = [0, 0.25, 0.5, 0.75, 1].map((x) => ({ x, y: 1 + 2 * x - 3 * x * x }));
    const m = fitPolynomialRidge(pts, 2, 0);
    for (const p of pts) expect(predictPolynomial(m, p.x)).toBeCloseTo(p.y, 6);
  });

  it("training error decreases with degree while validation error eventually rises (overfitting)", () => {
    const errs = [1, 3, 12].map((d) => {
      const m = fitPolynomialRidge(train, d, 0, { xMin: 0, xMax: 1 });
      return { train: rmse(m, train), val: rmse(m, validation) };
    });
    expect(errs[0]!.train).toBeGreaterThan(errs[1]!.train);
    expect(errs[1]!.train).toBeGreaterThan(errs[2]!.train);
    expect(errs[2]!.val).toBeGreaterThan(errs[1]!.val);
  });

  it("regularization reduces validation error of a high-degree model", () => {
    const loose = fitPolynomialRidge(train, 12, 0, { xMin: 0, xMax: 1 });
    const reg = fitPolynomialRidge(train, 12, 1e-3, { xMin: 0, xMax: 1 });
    expect(rmse(reg, validation)).toBeLessThan(rmse(loose, validation));
  });
});

describe("k-NN", () => {
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 10, y: 100 },
  ];
  it("averages the k nearest targets", () => {
    expect(knnRegress(data, 1.4, 1).prediction).toBe(10);
    expect(knnRegress(data, 1.4, 2).prediction).toBe(15);
    expect(knnRegress(data, 1.4, 2).neighborIndices).toEqual([0, 1]);
  });
  it("clamps k to the dataset size", () => {
    expect(knnRegress(data, 0, 99).prediction).toBeCloseTo(130 / 3);
  });
});

describe("clustering", () => {
  const blobs = generateBlobs(3);
  it("nearest-centroid classifier fits the training blobs well", () => {
    const model = fitNearestCentroid(blobs);
    const acc = accuracy(blobs.map((p) => p.label), blobs.map((p) => predictNearestCentroid(model, p)));
    expect(acc).toBeGreaterThan(0.9);
  });
  it("k-means converges in a bounded number of steps", () => {
    let centroids = initCentroids(blobs, 3, createRng(1));
    let prev: number[] | undefined;
    let converged = false;
    for (let i = 0; i < 50 && !converged; i++) {
      const r = kMeansStep(blobs, centroids, prev);
      centroids = r.centroids;
      prev = r.assignments;
      converged = r.converged;
    }
    expect(converged).toBe(true);
  });
});

describe("metrics, datasets & diagnostics", () => {
  it("MSE / RMSE", () => {
    expect(meanSquaredError([1, 2], [1, 4])).toBe(2);
    expect(rootMeanSquaredError([0, 0], [3, 4])).toBeCloseTo(Math.sqrt(12.5));
  });
  it("datasets are deterministic", () => {
    expect(generateApartments(7)).toEqual(generateApartments(7));
  });
  it("diagnoses under/overfitting", () => {
    expect(diagnoseFit(0.45, 0.5)).toBe("underfit");
    expect(diagnoseFit(0.05, 0.8)).toBe("overfit");
    expect(diagnoseFit(0.2, 0.24)).toBe("balanced");
  });
});
