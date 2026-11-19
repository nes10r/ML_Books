export interface BinaryCounts {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

/** Confusion counts for `score >= threshold` → positive. */
export function countsAtThreshold(scores: readonly number[], labels: readonly boolean[], threshold: number): BinaryCounts {
  const c = { tp: 0, fp: 0, tn: 0, fn: 0 };
  for (let i = 0; i < scores.length; i++) {
    const pred = scores[i]! >= threshold;
    if (pred && labels[i]) c.tp++;
    else if (pred) c.fp++;
    else if (labels[i]) c.fn++;
    else c.tn++;
  }
  return c;
}

/** Precision is undefined (no positive predictions) → returned as 1 by convention, matching scikit-learn's curve endpoints. */
export const precision = (c: BinaryCounts) => (c.tp + c.fp === 0 ? 1 : c.tp / (c.tp + c.fp));
export const recall = (c: BinaryCounts) => (c.tp + c.fn === 0 ? 0 : c.tp / (c.tp + c.fn));
export const falsePositiveRate = (c: BinaryCounts) => (c.fp + c.tn === 0 ? 0 : c.fp / (c.fp + c.tn));
export const accuracyOf = (c: BinaryCounts) => (c.tp + c.tn) / Math.max(1, c.tp + c.tn + c.fp + c.fn);

/** Harmonic mean of precision and recall. */
export function f1(c: BinaryCounts): number {
  const p = c.tp + c.fp === 0 ? 0 : c.tp / (c.tp + c.fp);
  const r = recall(c);
  return p + r === 0 ? 0 : (2 * p * r) / (p + r);
}

export interface CurvePoint {
  threshold: number;
  tpr: number; // = recall
  fpr: number;
  precision: number;
}

/**
 * Sweeps thresholds from high to low (ties grouped), producing ROC and PR
 * points. Starts at (0, 0) with threshold = +∞.
 */
export function thresholdCurve(scores: readonly number[], labels: readonly boolean[]): CurvePoint[] {
  const order = scores.map((s, i) => i).sort((a, b) => scores[b]! - scores[a]!);
  const P = labels.filter(Boolean).length;
  const N = labels.length - P;
  const points: CurvePoint[] = [{ threshold: Infinity, tpr: 0, fpr: 0, precision: 1 }];
  let tp = 0;
  let fp = 0;
  for (let k = 0; k < order.length; ) {
    const s = scores[order[k]!]!;
    while (k < order.length && scores[order[k]!] === s) {
      if (labels[order[k]!]) tp++;
      else fp++;
      k++;
    }
    points.push({ threshold: s, tpr: P ? tp / P : 0, fpr: N ? fp / N : 0, precision: tp / (tp + fp) });
  }
  return points;
}

/** Area under the ROC curve (trapezoidal rule; ties handled by grouped thresholds). */
export function rocAuc(points: readonly CurvePoint[]): number {
  let area = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    area += (b.fpr - a.fpr) * (a.tpr + b.tpr) / 2;
  }
  return area;
}

/** Average precision: Σ (Rₙ − Rₙ₋₁) · Pₙ — the step-wise PR-curve area used by scikit-learn. */
export function averagePrecision(points: readonly CurvePoint[]): number {
  let ap = 0;
  for (let i = 1; i < points.length; i++) ap += (points[i]!.tpr - points[i - 1]!.tpr) * points[i]!.precision;
  return ap;
}

/** K×K confusion matrix: rows = true class, columns = predicted class. */
export function confusionMatrix(actual: readonly number[], predicted: readonly number[], k: number): number[][] {
  const m = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  actual.forEach((a, i) => {
    const p = predicted[i]!;
    if (a >= 0 && a < k && p >= 0 && p < k) m[a]![p]!++;
  });
  return m;
}
