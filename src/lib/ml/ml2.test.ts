import { describe, expect, it } from "vitest";
import { knnPredictManyK } from "./knn-multi";
import { fitScaler, scaleMatrix } from "./preprocessing";
import { createRng } from "./random";
import { kFold, proportions, randomSplit, stratifiedSplit } from "./splitting";
import { histogram, mean, median, pearson, quantile, skewness, std } from "./stats";

describe("stats", () => {
  it("basic moments and quantiles", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(std([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
    expect(median([5, 1, 3])).toBe(3);
    expect(quantile([0, 10], 0.25)).toBe(2.5);
  });
  it("pearson r", () => {
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(pearson([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1);
    expect(pearson([-1, 0, 1], [1, 0, 1])).toBeCloseTo(0); // U shape: r ≈ 0 despite perfect relation
  });
  it("skewness sign and histogram counts", () => {
    expect(skewness([1, 1, 1, 2, 10])).toBeGreaterThan(0);
    const h = histogram([0, 0.5, 1, 2, 3, 4], 4, [0, 4]);
    expect(h.map((b) => b.count)).toEqual([2, 1, 1, 2]); // last bin is closed: [3, 4]
  });
});

describe("preprocessing", () => {
  it("scalers fitted on train map values as expected", () => {
    expect(fitScaler("minmax", [10, 20, 30])(20)).toBe(0.5);
    const z = fitScaler("standard", [2, 4, 4, 4, 5, 5, 7, 9]);
    expect(z(5)).toBe(0);
    expect(z(9)).toBe(2);
  });
  it("log-standard reduces skewness of a long-tailed sample", () => {
    const xs = Array.from({ length: 200 }, (_, i) => Math.exp(i / 40));
    const f = fitScaler("log-standard", xs);
    expect(Math.abs(skewness(xs.map(f)))).toBeLessThan(Math.abs(skewness(xs)));
  });
  it("scaleMatrix uses train statistics only (no leakage)", () => {
    const { test } = scaleMatrix("minmax", [[0], [10]], [[20]]);
    expect(test[0]![0]).toBe(2);
  });
});

describe("splitting", () => {
  const strata = [...Array(80).fill("A"), ...Array(20).fill("B")] as string[];
  it("random split sizes", () => {
    const s = randomSplit(100, 0.2, createRng(1));
    expect(s.test).toHaveLength(20);
    expect(new Set([...s.train, ...s.test]).size).toBe(100);
  });
  it("stratified split preserves proportions exactly when divisible", () => {
    const s = stratifiedSplit(strata, 0.2, createRng(1));
    expect(proportions(strata, s.test).get("B")).toBeCloseTo(0.2);
  });
  it("k-fold partitions every index exactly once into validation", () => {
    const folds = kFold(23, 5, createRng(3));
    const all = folds.flatMap((f) => f.validation).sort((a, b) => a - b);
    expect(all).toEqual(Array.from({ length: 23 }, (_, i) => i));
  });
});

describe("knnPredictManyK", () => {
  it("matches brute-force k-NN for several k", () => {
    const X = [[0], [1], [2], [10]];
    const y = [0, 10, 20, 100];
    const [k1, k2, k4] = knnPredictManyK(X, y, [[0.9]], [1, 2, 4]);
    expect(k1).toEqual([10]);
    expect(k2).toEqual([5]);
    expect(k4).toEqual([32.5]);
  });
  it("rejects non-increasing k lists", () => {
    expect(() => knnPredictManyK([[0]], [0], [[0]], [3, 1])).toThrow();
  });
});
