import type { Point } from "./regression";
import { shuffle, type Rng } from "./random";

export interface Theta {
  t0: number; // intercept
  t1: number; // slope
}

/** MSE of ŷ = θ₀ + θ₁x. */
export function mse(points: readonly Point[], th: Theta): number {
  let s = 0;
  for (const p of points) s += (th.t0 + th.t1 * p.x - p.y) ** 2;
  return s / points.length;
}

/** ∇MSE over the given points: (2/m) Σ (ŷ − y)·[1, x]. */
export function mseGradient(points: readonly Point[], th: Theta): Theta {
  let g0 = 0;
  let g1 = 0;
  for (const p of points) {
    const e = th.t0 + th.t1 * p.x - p.y;
    g0 += e;
    g1 += e * p.x;
  }
  const k = 2 / points.length;
  return { t0: k * g0, t1: k * g1 };
}

const finite = (th: Theta) => Number.isFinite(th.t0) && Number.isFinite(th.t1) && Math.abs(th.t0) < 1e6 && Math.abs(th.t1) < 1e6;

/** Batch GD; returns every visited θ (stops early if it diverges). */
export function batchGradientDescent(points: readonly Point[], eta: number, steps: number, start: Theta): Theta[] {
  const path = [start];
  let th = start;
  for (let i = 0; i < steps; i++) {
    const g = mseGradient(points, th);
    th = { t0: th.t0 - eta * g.t0, t1: th.t1 - eta * g.t1 };
    path.push(th);
    if (!finite(th)) break;
  }
  return path;
}

export type Schedule = (t: number) => number;
export const constantSchedule = (eta: number): Schedule => () => eta;
/** η(t) = η₀ · t₁ / (t + t₁) — gradually shrinking steps. */
export const decaySchedule = (eta0: number, t1 = 50): Schedule => (t) => (eta0 * t1) / (t + t1);

/**
 * Mini-batch GD (batchSize = 1 → stochastic GD, batchSize = m → batch GD).
 * Records θ after every update.
 */
export function miniBatchGradientDescent(
  points: readonly Point[],
  batchSize: number,
  schedule: Schedule,
  epochs: number,
  start: Theta,
  rng: Rng,
): Theta[] {
  const path = [start];
  let th = start;
  let t = 0;
  for (let e = 0; e < epochs; e++) {
    const order = shuffle(points, rng);
    for (let i = 0; i < order.length; i += batchSize) {
      const g = mseGradient(order.slice(i, i + batchSize), th);
      const eta = schedule(t++);
      th = { t0: th.t0 - eta * g.t0, t1: th.t1 - eta * g.t1 };
      path.push(th);
      if (!finite(th)) return path;
    }
  }
  return path;
}

/** Closed-form OLS optimum — used to mark the bowl's minimum. */
export function olsTheta(points: readonly Point[]): Theta {
  const n = points.length;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
  }
  const t1 = sxx ? sxy / sxx : 0;
  return { t0: my - t1 * mx, t1 };
}
