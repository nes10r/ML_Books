import type { LabeledPoint } from "./clustering";
import type { Point } from "./regression";
import { createRng, randomNormal, randomUniform, shuffle } from "./random";

/**
 * Synthetic, original datasets for the demos. They are deterministic for a
 * given seed so the whole class sees the same picture.
 */

/** Apartment area (m²) → price (thousand AZN). Roughly linear with noise. */
export function generateApartments(seed = 7, n = 28): Point[] {
  const rng = createRng(seed);
  return Array.from({ length: n }, () => {
    const area = Math.round(randomUniform(rng, 35, 160));
    const price = 18 + 1.45 * area + randomNormal(rng, 0, 14);
    return { x: area, y: Math.max(20, Math.round(price)) };
  }).sort((a, b) => a.x - b.x);
}

/** Three Gaussian blobs in the unit square — for classification vs clustering. */
export function generateBlobs(seed = 3, perClass = 22): LabeledPoint[] {
  const rng = createRng(seed);
  const centers = [
    { x: 0.28, y: 0.7 },
    { x: 0.72, y: 0.68 },
    { x: 0.5, y: 0.27 },
  ];
  const points: LabeledPoint[] = [];
  centers.forEach((c, label) => {
    for (let i = 0; i < perClass; i++) {
      points.push({
        x: Math.min(0.98, Math.max(0.02, randomNormal(rng, c.x, 0.085))),
        y: Math.min(0.98, Math.max(0.02, randomNormal(rng, c.y, 0.085))),
        label,
      });
    }
  });
  return points;
}

/** Ground-truth function for the overfitting demo. */
export const trueCurve = (x: number) => Math.sin(2 * Math.PI * x) * 0.8 + 0.3 * x;

export interface SplitDataset {
  train: Point[];
  validation: Point[];
}

/** Noisy samples of `trueCurve` on [0, 1], split into train/validation sets. */
export function generateNoisyCurve(seed = 11, n = 30, validationFraction = 0.4): SplitDataset {
  const rng = createRng(seed);
  const all = Array.from({ length: n }, () => {
    const x = rng();
    return { x, y: trueCurve(x) + randomNormal(rng, 0, 0.22) };
  });
  const shuffled = shuffle(all, rng);
  const nVal = Math.round(n * validationFraction);
  return {
    validation: shuffled.slice(0, nVal).sort((a, b) => a.x - b.x),
    train: shuffled.slice(nVal).sort((a, b) => a.x - b.x),
  };
}

/**
 * Infinite stream for the online-learning demo. With `drift`, the underlying
 * relationship changes after `driftAt` samples (concept drift).
 */
export function createStream(seed = 5, options: { drift: boolean; driftAt?: number } = { drift: false }) {
  const rng = createRng(seed);
  const driftAt = options.driftAt ?? 60;
  let i = 0;
  return (): Point & { index: number; drifted: boolean } => {
    const drifted = options.drift && i >= driftAt;
    const x = rng();
    const y = drifted ? 0.85 - 0.6 * x : 0.15 + 0.7 * x;
    const point = { x, y: y + randomNormal(rng, 0, 0.06), index: i, drifted };
    i += 1;
    return point;
  };
}

/* ---------------------------- Chapter 4 data ---------------------------- */

/** y = 2 + 0.8x + noise on x ∈ [0, 10] — unscaled feature for the GD bowl demo. */
export function generateGdData(seed = 21, n = 50): Point[] {
  const rng = createRng(seed);
  return Array.from({ length: n }, () => {
    const x = randomUniform(rng, 0, 10);
    return { x, y: 2 + 0.8 * x + randomNormal(rng, 0, 1) };
  });
}

/** Quadratic ground truth y = 2 − 1.2x + 0.5x² + noise on [-3, 3] (learning-curve demo). */
export const quadraticTruth = (x: number) => 2 - 1.2 * x + 0.5 * x * x;
export function generateQuadratic(seed = 9, n = 120, noise = 0.8): SplitDataset {
  const rng = createRng(seed);
  const all = Array.from({ length: n }, () => {
    const x = randomUniform(rng, -3, 3);
    return { x, y: quadraticTruth(x) + randomNormal(rng, 0, noise) };
  });
  return { train: all.slice(0, 80), validation: all.slice(80) };
}

/** 8 features, only 4 informative (true weights below) — regularization-path demo. */
export const SPARSE_TRUE_WEIGHTS = [3, -2, 1.5, 0, 0, 0, 0.5, 0] as const;
export function generateSparseRegression(seed = 11, m = 60): { X: number[][]; y: number[] } {
  const rng = createRng(seed);
  const X = Array.from({ length: m }, () => SPARSE_TRUE_WEIGHTS.map(() => randomNormal(rng)));
  const y = X.map((row) => 1 + row.reduce((s, v, j) => s + v * SPARSE_TRUE_WEIGHTS[j]!, 0) + randomNormal(rng, 0, 1));
  return { X, y };
}

/** Synthetic exam outcomes: study hours (0–10) and sleep hours (4–9) → passed (0/1). */
export function generateExamData(seed = 4, m = 200): { X: number[][]; y: number[] } {
  const rng = createRng(seed);
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < m; i++) {
    const study = randomUniform(rng, 0, 10);
    const sleep = randomUniform(rng, 4, 9);
    const logit = -9 + 0.9 * study + 0.8 * sleep;
    X.push([study, sleep]);
    y.push(rng() < 1 / (1 + Math.exp(-logit)) ? 1 : 0);
  }
  return { X, y };
}

/* ---------------------------- Chapter 5 data ---------------------------- */

export const FRUIT_NAMES = ["naringi", "alma", "nar"] as const;

/** Synthetic fruits: diameter (cm) and weight (g); weight ≈ density · sphere volume. Classes overlap. */
export function generateFruits(seed = 5, perClass = 60): { X: number[][]; y: number[] } {
  const rng = createRng(seed);
  const params = [
    [5.5, 0.55, 0.62],
    [7.2, 0.7, 0.68],
    [8.6, 0.8, 0.82],
  ] as const;
  const X: number[][] = [];
  const y: number[] = [];
  params.forEach(([mu, sd, density], label) => {
    for (let i = 0; i < perClass; i++) {
      const d = randomNormal(rng, mu, sd);
      const w = density * 0.52 * d ** 3 * Math.exp(randomNormal(rng, 0, 0.1));
      X.push([Math.round(d * 10) / 10, Math.round(w * 10) / 10]);
      y.push(label);
    }
  });
  return { X, y };
}

/** Two interleaving half circles with Gaussian noise (“moons”). */
export function generateMoons(seed = 42, n = 300, noise = 0.3): { X: number[][]; y: number[] } {
  const rng = createRng(seed);
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const t = Math.PI * rng();
    const base = label === 0 ? [Math.cos(t), Math.sin(t)] : [1 - Math.cos(t), 0.5 - Math.sin(t)];
    X.push([base[0]! + randomNormal(rng, 0, noise), base[1]! + randomNormal(rng, 0, noise)]);
    y.push(label);
  }
  return { X, y };
}

/** Daily temperature curve: 12 + 8·sin((h − 9)/24 · 2π) + noise, h ∈ [0, 24). */
export const temperatureTruth = (h: number) => 12 + 8 * Math.sin(((h - 9) / 24) * 2 * Math.PI);
export function generateTemperature(seed = 8, n = 200): { train: Point[]; test: Point[] } {
  const rng = createRng(seed);
  const all = Array.from({ length: n }, () => {
    const x = randomUniform(rng, 0, 24);
    return { x, y: temperatureTruth(x) + randomNormal(rng, 0, 1.5) };
  });
  return { train: all.slice(0, 140), test: all.slice(140) };
}

/** Two classes separated by a straight line through the centre at the given angle (degrees). */
export function generateLinearBoundary(angleDeg: number, seed = 1, n = 300): { X: number[][]; y: number[] } {
  const rng = createRng(seed);
  const a = (angleDeg * Math.PI) / 180;
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = [randomUniform(rng, -1, 1), randomUniform(rng, -1, 1)];
    X.push(p);
    y.push(p[0]! * nx + p[1]! * ny > 0 ? 1 : 0);
  }
  return { X, y };
}

/* -------------------------- Chapters 6–8 data -------------------------- */

/** Five Gaussian blobs of different spreads (same centres as the Chapter 8 Python scripts). */
export const BLOB5_CENTERS = [
  [-3, 2.5],
  [-1.5, -1.5],
  [0.5, 2.8],
  [2.8, 0.5],
  [3.5, 3.5],
] as const;
export function generateBlobs5(seed = 7, perCluster = 60): { points: Point[]; labels: number[] } {
  const rng = createRng(seed);
  const stds = [0.7, 0.5, 0.6, 0.45, 0.35];
  const points: Point[] = [];
  const labels: number[] = [];
  BLOB5_CENTERS.forEach(([cx, cy], k) => {
    for (let i = 0; i < perCluster; i++) {
      points.push({ x: randomNormal(rng, cx, stds[k]!), y: randomNormal(rng, cy, stds[k]!) });
      labels.push(k);
    }
  });
  return { points, labels };
}

/** Correlated 2-D Gaussian cloud (for the PCA demo): main axis at ~30°, std 2 vs 0.6. */
export function generateCorrelatedCloud(seed = 3, n = 200): Point[] {
  const rng = createRng(seed);
  const a = Math.PI / 6;
  return Array.from({ length: n }, () => {
    const u = randomNormal(rng, 0, 2);
    const v = randomNormal(rng, 0, 0.6);
    return { x: u * Math.cos(a) - v * Math.sin(a), y: u * Math.sin(a) + v * Math.cos(a) };
  });
}

/** Three Gaussian clusters with different shapes (elongated, round, tilted) + a few far outliers. */
export function generateMixtureData(seed = 5): Point[] {
  const rng = createRng(seed);
  const sample = (mx: number, my: number, a: number, b: number, c: number, n: number) => {
    // Cholesky of [[a, b], [b, c]]
    const l11 = Math.sqrt(a);
    const l21 = b / l11;
    const l22 = Math.sqrt(c - l21 * l21);
    return Array.from({ length: n }, () => {
      const z1 = randomNormal(rng);
      const z2 = randomNormal(rng);
      return { x: mx + l11 * z1, y: my + l21 * z1 + l22 * z2 };
    });
  };
  return [
    ...sample(0, 0, 2.0, 1.4, 1.2, 160),
    ...sample(5, 3, 0.4, 0, 0.4, 100),
    ...sample(3, -2.5, 1.0, -0.6, 0.6, 100),
    { x: -4, y: 4 },
    { x: 7.5, y: -3 },
    { x: 1.5, y: 5.5 },
    { x: 8, y: 6 },
  ];
}
