import type { Point } from "./regression";
import type { Rng } from "./random";
import { shuffle } from "./random";

export interface LabeledPoint extends Point {
  label: number;
}

const sqDist = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export function nearestIndex(p: Point, centers: readonly Point[]): number {
  let best = 0;
  let bestD = Infinity;
  centers.forEach((c, i) => {
    const d = sqDist(p, c);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/** Picks k distinct data points as initial centroids. */
export function initCentroids(points: readonly Point[], k: number, rng: Rng): Point[] {
  return shuffle(points, rng)
    .slice(0, k)
    .map((p) => ({ x: p.x, y: p.y }));
}

export interface KMeansStepResult {
  assignments: number[];
  centroids: Point[];
  /** True when no assignment changed — the algorithm has converged. */
  converged: boolean;
}

/** One Lloyd iteration: assign every point to its nearest centroid, then move centroids to cluster means. */
export function kMeansStep(
  points: readonly Point[],
  centroids: readonly Point[],
  previousAssignments?: readonly number[],
): KMeansStepResult {
  const assignments = points.map((p) => nearestIndex(p, centroids));
  const next = centroids.map((c, ci) => {
    const members = points.filter((_, i) => assignments[i] === ci);
    if (members.length === 0) return { ...c }; // keep empty clusters in place
    return {
      x: members.reduce((s, p) => s + p.x, 0) / members.length,
      y: members.reduce((s, p) => s + p.y, 0) / members.length,
    };
  });
  const converged =
    previousAssignments !== undefined &&
    previousAssignments.length === assignments.length &&
    assignments.every((a, i) => a === previousAssignments[i]);
  return { assignments, centroids: next, converged };
}

/** Mean of each labelled class — the "training" step of a nearest-centroid classifier. */
export function fitNearestCentroid(points: readonly LabeledPoint[]): Map<number, Point> {
  const sums = new Map<number, { x: number; y: number; n: number }>();
  for (const p of points) {
    const s = sums.get(p.label) ?? { x: 0, y: 0, n: 0 };
    s.x += p.x;
    s.y += p.y;
    s.n += 1;
    sums.set(p.label, s);
  }
  const out = new Map<number, Point>();
  for (const [label, s] of sums) out.set(label, { x: s.x / s.n, y: s.y / s.n });
  return out;
}

export function predictNearestCentroid(model: Map<number, Point>, p: Point): number {
  let best = -1;
  let bestD = Infinity;
  for (const [label, c] of model) {
    const d = sqDist(p, c);
    if (d < bestD) {
      bestD = d;
      best = label;
    }
  }
  return best;
}
