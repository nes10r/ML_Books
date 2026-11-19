/**
 * Elastic-net family via cyclic coordinate descent on standardized features.
 * Objective (same form as scikit-learn's ElasticNet):
 *   (1/2m)‖y − Xw − b‖² + α·r·‖w‖₁ + (α·(1−r)/2)·‖w‖²
 * r = 0 → ridge-like, r = 1 → lasso.
 */
export interface ElasticNetResult {
  intercept: number;
  coef: number[];
}

const softThreshold = (z: number, g: number) => (z > g ? z - g : z < -g ? z + g : 0);

/** Standardizes columns (mean 0, std 1). Returns transformed matrix and stats. */
export function standardizeColumns(X: number[][]) {
  const m = X.length;
  const n = X[0]?.length ?? 0;
  const mean = Array.from({ length: n }, (_, j) => X.reduce((s, r) => s + r[j]!, 0) / m);
  const std = Array.from({ length: n }, (_, j) => Math.sqrt(X.reduce((s, r) => s + (r[j]! - mean[j]!) ** 2, 0) / m) || 1);
  return { Z: X.map((r) => r.map((v, j) => (v - mean[j]!) / std[j]!)), mean, std };
}

export function elasticNet(Z: number[][], y: number[], alpha: number, l1Ratio: number, maxSweeps = 500, tol = 1e-7): ElasticNetResult {
  const m = Z.length;
  const n = Z[0]?.length ?? 0;
  const yMean = y.reduce((a, b) => a + b, 0) / m;
  const yc = y.map((v) => v - yMean);
  const w = new Array<number>(n).fill(0);
  const residual = yc.slice(); // r = yc − Zw
  const colSq = Array.from({ length: n }, (_, j) => Z.reduce((s, row) => s + row[j]! ** 2, 0) / m);
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let maxDelta = 0;
    for (let j = 0; j < n; j++) {
      let rho = 0;
      for (let i = 0; i < m; i++) rho += Z[i]![j]! * residual[i]!;
      rho = rho / m + colSq[j]! * w[j]!;
      const next = softThreshold(rho, alpha * l1Ratio) / (colSq[j]! + alpha * (1 - l1Ratio));
      const delta = next - w[j]!;
      if (delta !== 0) {
        for (let i = 0; i < m; i++) residual[i]! -= delta * Z[i]![j]!;
        w[j] = next;
        maxDelta = Math.max(maxDelta, Math.abs(delta));
      }
    }
    if (maxDelta < tol) break;
  }
  return { intercept: yMean, coef: w };
}

/** Coefficient paths over a grid of α values (warm starts are unnecessary at this size). */
export function regularizationPath(Z: number[][], y: number[], alphas: number[], l1Ratio: number): number[][] {
  return alphas.map((a) => elasticNet(Z, y, a, l1Ratio).coef);
}
