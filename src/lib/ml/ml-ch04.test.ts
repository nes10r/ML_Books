import { describe, expect, it } from "vitest";
import { generateExamData, generateGdData, generateSparseRegression } from "./datasets";
import {
  batchGradientDescent,
  constantSchedule,
  decaySchedule,
  miniBatchGradientDescent,
  mse,
  mseGradient,
  olsTheta,
} from "./gradient-descent";
import { solveLinearSystem } from "./linalg";
import { logisticGDSteps, logLoss, predictProba, sigmoid } from "./logistic";
import { createRng } from "./random";
import { elasticNet, standardizeColumns } from "./regularized";
import { mean, std } from "./stats";

const scaled = () => {
  const raw = generateGdData();
  const xs = raw.map((p) => p.x);
  const mu = mean(xs);
  const sd = std(xs);
  return raw.map((p) => ({ x: (p.x - mu) / sd, y: p.y }));
};

describe("gradient descent", () => {
  it("gradient is zero at the OLS optimum", () => {
    const pts = generateGdData();
    const g = mseGradient(pts, olsTheta(pts));
    expect(Math.abs(g.t0)).toBeLessThan(1e-9);
    expect(Math.abs(g.t1)).toBeLessThan(1e-9);
  });

  it("batch GD converges on standardized data and diverges with a too-large η", () => {
    const pts = scaled();
    const opt = olsTheta(pts);
    const ok = batchGradientDescent(pts, 0.1, 300, { t0: 0, t1: 0 }).at(-1)!;
    expect(ok.t0).toBeCloseTo(opt.t0, 6);
    expect(ok.t1).toBeCloseTo(opt.t1, 6);
    expect(batchGradientDescent(pts, 1.3, 300, { t0: 0, t1: 0 }).length).toBeLessThan(301); // stopped early: diverged
  });

  it("unscaled data: η above ≈0.03 diverges (the lesson's claim)", () => {
    const pts = generateGdData();
    const o = olsTheta(pts);
    const start = { t0: o.t0 - 6, t1: o.t1 + 1.3 };
    expect(batchGradientDescent(pts, 0.025, 200, start).length).toBe(201);
    expect(batchGradientDescent(pts, 0.032, 200, start).length).toBeLessThan(201);
  });

  it("mini-batch with batchSize = m equals batch GD; a decaying schedule calms SGD", () => {
    const pts = scaled();
    const start = { t0: 0, t1: 0 };
    const viaMini = miniBatchGradientDescent(pts, pts.length, constantSchedule(0.1), 50, start, createRng(1)).at(-1)!;
    const viaBatch = batchGradientDescent(pts, 0.1, 50, start).at(-1)!;
    expect(viaMini.t0).toBeCloseTo(viaBatch.t0, 9);
    const min = mse(pts, olsTheta(pts));
    const noisy = miniBatchGradientDescent(pts, 1, constantSchedule(0.1), 20, start, createRng(14));
    const calm = miniBatchGradientDescent(pts, 1, decaySchedule(0.1, 30), 20, start, createRng(14));
    expect(mse(pts, calm.at(-1)!) - min).toBeLessThan(mse(pts, noisy.at(-1)!) - min);
  });
});

describe("elastic net (coordinate descent)", () => {
  const { X, y } = generateSparseRegression();
  const { Z } = standardizeColumns(X);
  const m = Z.length;
  const yMean = y.reduce((a, b) => a + b, 0) / m;
  const correlations = (w: number[]) => {
    const r = y.map((v, i) => v - yMean - Z[i]!.reduce((s, z, j) => s + z * w[j]!, 0));
    return w.map((_, j) => Z.reduce((s, row, i) => s + row[j]! * r[i]!, 0) / m);
  };

  it("lasso solution satisfies the KKT optimality conditions", () => {
    const alpha = 0.3;
    const w = elasticNet(Z, y, alpha, 1, 5000, 1e-12).coef;
    correlations(w).forEach((c, j) => {
      if (Math.abs(w[j]!) > 1e-8) expect(c).toBeCloseTo(alpha * Math.sign(w[j]!), 5);
      else expect(Math.abs(c)).toBeLessThanOrEqual(alpha + 1e-6);
    });
    expect(w.filter((v, j) => Math.abs(v) < 1e-8 && [3, 4, 5, 7].includes(j)).length).toBe(4); // useless features zeroed
  });

  it("r = 0 matches the closed-form ridge solution (ZᵀZ/m + αI)⁻¹ Zᵀy/m", () => {
    const alpha = 0.5;
    const w = elasticNet(Z, y, alpha, 0, 5000, 1e-12).coef;
    const n = Z[0]!.length;
    const A = Array.from({ length: n }, (_, a) =>
      Array.from({ length: n }, (_, b) => Z.reduce((s, row) => s + row[a]! * row[b]!, 0) / m + (a === b ? alpha : 0)),
    );
    const rhs = Array.from({ length: n }, (_, a) => Z.reduce((s, row, i) => s + row[a]! * (y[i]! - yMean), 0) / m);
    const exact = solveLinearSystem(A, rhs)!;
    w.forEach((v, j) => expect(v).toBeCloseTo(exact[j]!, 6));
  });
});

describe("logistic regression", () => {
  it("sigmoid basics", () => {
    expect(sigmoid(0)).toBe(0.5);
    expect(sigmoid(10)).toBeGreaterThan(0.9999);
    expect(sigmoid(-10)).toBeLessThan(0.0001);
  });

  it("zero weights → log loss ln 2; training lowers it and improves accuracy", () => {
    const { X, y } = generateExamData();
    const cols = [0, 1].map((j) => X.map((r) => r[j]!));
    const Z = X.map((r) => r.map((v, j) => (v - mean(cols[j]!)) / std(cols[j]!)));
    const m0 = { bias: 0, weights: [0, 0] };
    expect(logLoss(m0, Z, y)).toBeCloseTo(Math.LN2, 10);
    const trained = logisticGDSteps(m0, Z, y, 0.5, 0, 300);
    expect(logLoss(trained, Z, y)).toBeLessThan(0.4);
    const acc = y.filter((t, i) => (predictProba(trained, Z[i]!) >= 0.5 ? 1 : 0) === t).length / y.length;
    expect(acc).toBeGreaterThan(0.8);
    expect(trained.weights.every((w) => w > 0)).toBe(true); // more study & sleep → higher pass probability
  });

  it("L2 penalty shrinks the weights", () => {
    const { X, y } = generateExamData();
    const Z = X.map((r) => [r[0]! / 10, r[1]! / 9]);
    const free = logisticGDSteps({ bias: 0, weights: [0, 0] }, Z, y, 0.5, 0, 500);
    const shrunk = logisticGDSteps({ bias: 0, weights: [0, 0] }, Z, y, 0.5, 1, 500);
    const norm = (w: number[]) => Math.hypot(...w);
    expect(norm(shrunk.weights)).toBeLessThan(norm(free.weights));
  });
});
