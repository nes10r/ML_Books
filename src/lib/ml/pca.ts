/** Covariance matrix of row-major data (columns = features). Returns the mean too. */
export function covariance(X: readonly number[][]): { mean: number[]; cov: number[][] } {
  const m = X.length;
  const n = X[0]?.length ?? 0;
  const mean = Array.from({ length: n }, (_, j) => X.reduce((s, r) => s + r[j]!, 0) / m);
  const cov = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (const r of X)
    for (let a = 0; a < n; a++) {
      const da = r[a]! - mean[a]!;
      if (da === 0) continue;
      for (let b = a; b < n; b++) cov[a]![b]! += da * (r[b]! - mean[b]!);
    }
  for (let a = 0; a < n; a++)
    for (let b = a; b < n; b++) {
      cov[a]![b]! /= m - 1;
      cov[b]![a] = cov[a]![b]!;
    }
  return { mean, cov };
}

/**
 * Eigen-decomposition of a symmetric matrix with the cyclic Jacobi method.
 * Returns eigenvalues (descending) and the matching unit eigenvectors.
 */
export function symmetricEigen(A: readonly number[][], maxSweeps = 100, tol = 1e-12): { values: number[]; vectors: number[][] } {
  const n = A.length;
  const a = A.map((r) => r.slice());
  const v: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p]![q]! ** 2;
    if (off < tol) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p]![q]!) < 1e-15) continue;
        const theta = (a[q]![q]! - a[p]![p]!) / (2 * a[p]![q]!);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k]![p]!;
          const akq = a[k]![q]!;
          a[k]![p] = c * akp - s * akq;
          a[k]![q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p]![k]!;
          const aqk = a[q]![k]!;
          a[p]![k] = c * apk - s * aqk;
          a[q]![k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k]![p]!;
          const vkq = v[k]![q]!;
          v[k]![p] = c * vkp - s * vkq;
          v[k]![q] = s * vkp + c * vkq;
        }
      }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => a[j]![j]! - a[i]![i]!);
  return { values: order.map((i) => Math.max(0, a[i]![i]!)), vectors: order.map((i) => v.map((row) => row[i]!)) };
}

export interface PCAModel {
  mean: number[];
  components: number[][]; // rows = principal axes (unit vectors), descending variance
  explainedVariance: number[];
  explainedVarianceRatio: number[];
}

export function fitPCA(X: readonly number[][]): PCAModel {
  const { mean, cov } = covariance(X);
  const { values, vectors } = symmetricEigen(cov);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return { mean, components: vectors, explainedVariance: values, explainedVarianceRatio: values.map((v) => v / total) };
}

export function pcaTransform(model: PCAModel, x: readonly number[], k: number): number[] {
  return model.components.slice(0, k).map((c) => c.reduce((s, cj, j) => s + cj * (x[j]! - model.mean[j]!), 0));
}

export function pcaInverse(model: PCAModel, z: readonly number[]): number[] {
  return model.mean.map((mu, j) => mu + z.reduce((s, zk, k) => s + zk * model.components[k]![j]!, 0));
}

/** Variance of the data projected onto a unit direction (2-D helper for the PCA demo). */
export function projectedVariance(X: readonly number[][], dir: readonly [number, number]): number {
  const proj = X.map((r) => r[0]! * dir[0] + r[1]! * dir[1]);
  const mu = proj.reduce((a, b) => a + b, 0) / proj.length;
  return proj.reduce((s, p) => s + (p - mu) ** 2, 0) / (proj.length - 1);
}
