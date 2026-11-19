import type { Point } from "./regression";
import type { Rng } from "./random";
import { kMeansStep, nearestIndex } from "./clustering";

const d2 = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** k-means++ seeding: each new centre is chosen with probability ∝ D(x)² to the nearest existing centre. */
export function kMeansPlusPlusInit(points: readonly Point[], k: number, rng: Rng): Point[] {
  const centers: Point[] = [{ ...points[Math.floor(rng() * points.length)]! }];
  while (centers.length < k) {
    const dist = points.map((p) => Math.min(...centers.map((c) => d2(p, c))));
    const total = dist.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    let idx = 0;
    while (idx < points.length - 1 && r > dist[idx]!) r -= dist[idx++]!;
    centers.push({ ...points[idx]! });
  }
  return centers;
}

export function inertia(points: readonly Point[], centers: readonly Point[]): number {
  return points.reduce((s, p) => s + d2(p, centers[nearestIndex(p, centers)]!), 0);
}

/** Runs Lloyd iterations until assignments stop changing. */
export function runKMeans(points: readonly Point[], init: Point[], maxIter = 100) {
  let centroids = init;
  let assignments: number[] | undefined;
  let iterations = 0;
  for (; iterations < maxIter; iterations++) {
    const r = kMeansStep(points, centroids, assignments);
    centroids = r.centroids;
    const done = r.converged;
    assignments = r.assignments;
    if (done) break;
  }
  return { centroids, assignments: assignments!, iterations, inertia: inertia(points, centroids) };
}

/** Mean silhouette coefficient (O(m²) — fine for a few hundred points). */
export function silhouetteScore(points: readonly Point[], labels: readonly number[]): number {
  const k = Math.max(...labels) + 1;
  let total = 0;
  let counted = 0;
  points.forEach((p, i) => {
    const sums = new Array<number>(k).fill(0);
    const counts = new Array<number>(k).fill(0);
    points.forEach((q, j) => {
      if (i === j) return;
      sums[labels[j]!]! += Math.sqrt(d2(p, q));
      counts[labels[j]!]!++;
    });
    const own = labels[i]!;
    if (counts[own] === 0) return;
    const a = sums[own]! / counts[own]!;
    let b = Infinity;
    for (let c = 0; c < k; c++) if (c !== own && counts[c]! > 0) b = Math.min(b, sums[c]! / counts[c]!);
    if (!Number.isFinite(b)) return;
    total += (b - a) / Math.max(a, b);
    counted++;
  });
  return counted ? total / counted : 0;
}

/* ------------------------------ DBSCAN ------------------------------ */

export interface DbscanResult {
  labels: number[]; // −1 = noise
  core: boolean[];
  nClusters: number;
}

export function dbscan(points: readonly Point[], eps: number, minSamples: number): DbscanResult {
  const m = points.length;
  const eps2 = eps * eps;
  const neighbors = points.map((p) => {
    const out: number[] = [];
    points.forEach((q, j) => {
      if (d2(p, q) <= eps2) out.push(j); // includes the point itself, like scikit-learn
    });
    return out;
  });
  const core = neighbors.map((n) => n.length >= minSamples);
  const labels = new Array<number>(m).fill(-1);
  let cluster = 0;
  for (let i = 0; i < m; i++) {
    if (!core[i] || labels[i] !== -1) continue;
    const queue = [i];
    labels[i] = cluster;
    while (queue.length) {
      const j = queue.pop()!;
      if (!core[j]) continue;
      for (const nb of neighbors[j]!) {
        if (labels[nb] === -1) {
          labels[nb] = cluster;
          if (core[nb]) queue.push(nb);
        }
      }
    }
    cluster++;
  }
  return { labels, core, nClusters: cluster };
}

/* --------------------- Gaussian mixture (2-D, EM) ------------------- */

export interface Gaussian2D {
  weight: number;
  mean: [number, number];
  cov: [[number, number], [number, number]];
}

export function gaussianPdf(g: Gaussian2D, p: Point): number {
  const [[a, b], [, c]] = g.cov;
  const det = a * c - b * b;
  const dx = p.x - g.mean[0];
  const dy = p.y - g.mean[1];
  const q = (c * dx * dx - 2 * b * dx * dy + a * dy * dy) / det;
  return Math.exp(-0.5 * q) / (2 * Math.PI * Math.sqrt(det));
}

export function mixtureDensity(model: readonly Gaussian2D[], p: Point): number {
  return model.reduce((s, g) => s + g.weight * gaussianPdf(g, p), 0);
}

/** One EM iteration (E-step responsibilities, M-step weights/means/covariances). */
export function emStep(points: readonly Point[], model: readonly Gaussian2D[], reg = 1e-6): { model: Gaussian2D[]; logLikelihood: number } {
  const k = model.length;
  const resp = points.map((p) => {
    const w = model.map((g) => g.weight * gaussianPdf(g, p));
    const s = w.reduce((a, b) => a + b, 0) || 1e-300;
    return w.map((v) => v / s);
  });
  const logLikelihood = points.reduce((s, p) => s + Math.log(mixtureDensity(model, p) || 1e-300), 0);
  const next: Gaussian2D[] = [];
  for (let j = 0; j < k; j++) {
    const nj = resp.reduce((s, r) => s + r[j]!, 0) || 1e-12;
    const mx = points.reduce((s, p, i) => s + resp[i]![j]! * p.x, 0) / nj;
    const my = points.reduce((s, p, i) => s + resp[i]![j]! * p.y, 0) / nj;
    let sxx = 0;
    let sxy = 0;
    let syy = 0;
    points.forEach((p, i) => {
      const r = resp[i]![j]!;
      sxx += r * (p.x - mx) ** 2;
      sxy += r * (p.x - mx) * (p.y - my);
      syy += r * (p.y - my) ** 2;
    });
    next.push({
      weight: nj / points.length,
      mean: [mx, my],
      cov: [
        [sxx / nj + reg, sxy / nj],
        [sxy / nj, syy / nj + reg],
      ],
    });
  }
  return { model: next, logLikelihood };
}

/** Initial mixture: k-means-like seeding from given centres, unit covariance, equal weights. */
export function initMixture(centers: readonly Point[]): Gaussian2D[] {
  return centers.map((c) => ({ weight: 1 / centers.length, mean: [c.x, c.y], cov: [[1, 0], [0, 1]] }));
}

/** Axes of the 1-σ ellipse of a 2×2 covariance: semi-axis lengths and rotation (radians). */
export function covarianceEllipse(cov: Gaussian2D["cov"]): { rx: number; ry: number; angle: number } {
  const [[a, b], [, c]] = cov;
  const tr = (a + c) / 2;
  const det = Math.sqrt(((a - c) / 2) ** 2 + b * b);
  const l1 = tr + det;
  const l2 = tr - det;
  const angle = 0.5 * Math.atan2(2 * b, a - c);
  return { rx: Math.sqrt(Math.max(l1, 0)), ry: Math.sqrt(Math.max(l2, 0)), angle };
}
