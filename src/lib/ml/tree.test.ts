import { describe, expect, it } from "vitest";
import { generateFruits, generateLinearBoundary, generateMoons, generateTemperature } from "./datasets";
import {
  classificationSplitCurve,
  decisionPath,
  entropyFromCounts,
  fitClassificationTree,
  fitRegressionTree,
  giniFromCounts,
  predictClass,
  predictProba,
  predictValue,
  treeStats,
} from "./tree";

const acc = (tree: ReturnType<typeof fitClassificationTree>, X: number[][], y: number[]) =>
  y.filter((t, i) => predictClass(tree, X[i]!) === t).length / y.length;

describe("impurity", () => {
  it("gini and entropy reference values", () => {
    expect(giniFromCounts([45, 45, 45], 135)).toBeCloseTo(2 / 3, 10);
    expect(giniFromCounts([8, 2], 10)).toBeCloseTo(0.32, 10);
    expect(giniFromCounts([5, 0], 5)).toBe(0);
    expect(entropyFromCounts([45, 45, 45], 135)).toBeCloseTo(Math.log2(3), 10);
    expect(entropyFromCounts([4, 4], 8)).toBeCloseTo(1, 10);
  });
});

/** Reference values below were produced by scikit-learn 1.8 on the very same TS-generated data. */
describe("CART matches scikit-learn", () => {
  const fruits = generateFruits();

  it("depth-2 fruit tree: identical splits (weight ≤ 86.25, ≤ 69.35, ≤ 212.55)", () => {
    const t = fitClassificationTree(fruits.X, fruits.y, 3, { maxDepth: 2 });
    expect([t.feature, t.threshold]).toEqual([1, 86.25]);
    expect([t.left!.feature, t.left!.threshold]).toEqual([1, 69.35]);
    expect([t.right!.feature, t.right!.threshold]).toEqual([1, 212.55]);
  });

  it("moons: unrestricted vs min_samples_leaf = 8 (depth/leaves/test accuracy)", () => {
    const m = generateMoons();
    const [Xtr, ytr, Xte, yte] = [m.X.slice(0, 210), m.y.slice(0, 210), m.X.slice(210), m.y.slice(210)];
    const free = fitClassificationTree(Xtr, ytr, 2);
    const reg = fitClassificationTree(Xtr, ytr, 2, { minSamplesLeaf: 8 });
    expect(treeStats(free)).toMatchObject({ depth: 10, leaves: 26 });
    expect(treeStats(reg)).toMatchObject({ depth: 6, leaves: 12 });
    expect(acc(free, Xte, yte)).toBeCloseTo(0.9, 3);
    expect(acc(reg, Xte, yte)).toBeCloseTo(0.9, 3);
  });

  it("regression tree on temperature: same thresholds and leaf mean", () => {
    const { train } = generateTemperature();
    const r = fitRegressionTree(train.map((p) => [p.x]), train.map((p) => p.y), { maxDepth: 2 });
    expect(r.threshold).toBeCloseTo(8.373, 3);
    expect(r.left!.threshold).toBeCloseTo(5.65, 2);
    expect(r.right!.threshold).toBeCloseTo(20.516, 3);
    expect(r.left!.left!.value).toBeCloseTo(4.4, 2);
  });
});

describe("tree behaviour", () => {
  const fruits = generateFruits();

  it("probabilities are leaf class shares and sum to 1; decision path ends in that leaf", () => {
    const t = fitClassificationTree(fruits.X, fruits.y, 3, { maxDepth: 2 });
    const p = predictProba(t, [7, 120]);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    const leaf = decisionPath(t, [7, 120]).at(-1)!;
    expect(p).toEqual(leaf.counts.map((c) => c / leaf.samples));
  });

  it("min_samples_leaf is respected in every leaf", () => {
    const t = fitClassificationTree(fruits.X, fruits.y, 3, { minSamplesLeaf: 7 });
    const walk = (n: typeof t): number[] => (n.left && n.right ? [...walk(n.left), ...walk(n.right)] : [n.samples]);
    expect(Math.min(...walk(t))).toBeGreaterThanOrEqual(7);
  });

  it("split curve: best threshold equals the tree's root split", () => {
    const idx = fruits.X.map((_, i) => i);
    const best = classificationSplitCurve(fruits.X, fruits.y, idx, 1, 3, "gini").reduce((a, b) => (b.cost < a.cost ? b : a));
    expect(best.threshold).toBe(fitClassificationTree(fruits.X, fruits.y, 3, { maxDepth: 1 }).threshold);
  });

  it("axis-aligned boundary needs one split; a 45° boundary needs many leaves", () => {
    expect(treeStats(fitClassificationTree(generateLinearBoundary(0).X, generateLinearBoundary(0).y, 2)).leaves).toBe(2);
    const d = generateLinearBoundary(45);
    expect(treeStats(fitClassificationTree(d.X, d.y, 2)).leaves).toBeGreaterThan(10);
  });

  it("unrestricted regression tree memorizes training data and does not extrapolate", () => {
    const { train } = generateTemperature();
    const X = train.map((p) => [p.x]);
    const y = train.map((p) => p.y);
    const r = fitRegressionTree(X, y);
    expect(Math.max(...X.map((x, i) => Math.abs(predictValue(r, x) - y[i]!)))).toBeLessThan(1e-9);
    expect(predictValue(r, [30])).toBe(predictValue(r, [Math.max(...X.map((x) => x[0]!)) + 0.001]));
  });
});
