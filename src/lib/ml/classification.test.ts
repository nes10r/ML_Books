import { describe, expect, it } from "vitest";
import {
  accuracyOf,
  averagePrecision,
  confusionMatrix,
  countsAtThreshold,
  f1,
  falsePositiveRate,
  precision,
  recall,
  rocAuc,
  thresholdCurve,
} from "./classification";

describe("binary metrics", () => {
  const scores = [0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.1];
  const labels = [true, true, false, true, false, false, true, false];

  it("counts at a threshold", () => {
    const c = countsAtThreshold(scores, labels, 0.5);
    expect(c).toEqual({ tp: 3, fp: 1, tn: 3, fn: 1 });
    expect(precision(c)).toBe(0.75);
    expect(recall(c)).toBe(0.75);
    expect(f1(c)).toBe(0.75);
    expect(falsePositiveRate(c)).toBe(0.25);
    expect(accuracyOf(c)).toBe(0.75);
  });

  it("matches the lesson's worked example (TP=128, FP=4, FN=17)", () => {
    const c = { tp: 128, fp: 4, fn: 17, tn: 1288 };
    expect(precision(c)).toBeCloseTo(0.97, 3);
    expect(recall(c)).toBeCloseTo(0.883, 3);
    expect(f1(c)).toBeCloseTo(0.924, 3);
  });

  it("F1 is low when one metric is low (harmonic mean)", () => {
    // precision = 1, recall = 0.05
    expect(f1({ tp: 1, fp: 0, fn: 19, tn: 100 })).toBeCloseTo(0.095, 3);
  });

  it("ROC AUC: perfect, random-like and pairwise-probability interpretation", () => {
    expect(rocAuc(thresholdCurve([0.9, 0.8, 0.2, 0.1], [true, true, false, false]))).toBe(1);
    expect(rocAuc(thresholdCurve([0.5, 0.5, 0.5, 0.5], [true, false, true, false]))).toBe(0.5); // ties → diagonal
    // Brute force P(score+ > score-) with ties counting 1/2
    const pos = scores.filter((_, i) => labels[i]);
    const neg = scores.filter((_, i) => !labels[i]);
    let wins = 0;
    for (const p of pos) for (const n of neg) wins += p > n ? 1 : p === n ? 0.5 : 0;
    expect(rocAuc(thresholdCurve(scores, labels))).toBeCloseTo(wins / (pos.length * neg.length), 10);
  });

  it("average precision of a perfect ranking is 1", () => {
    expect(averagePrecision(thresholdCurve([3, 2, 1], [true, true, false]))).toBe(1);
  });
});

describe("confusionMatrix", () => {
  it("rows = actual, columns = predicted", () => {
    expect(confusionMatrix([0, 0, 1, 2, 2], [0, 1, 1, 2, 0], 3)).toEqual([
      [1, 1, 0],
      [0, 1, 0],
      [1, 0, 1],
    ]);
  });
});
