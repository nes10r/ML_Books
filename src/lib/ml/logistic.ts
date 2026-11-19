export const sigmoid = (t: number) => 1 / (1 + Math.exp(-t));

export interface LogisticModel {
  bias: number;
  weights: number[];
}

export function predictProba(model: LogisticModel, x: readonly number[]): number {
  let t = model.bias;
  for (let j = 0; j < x.length; j++) t += model.weights[j]! * x[j]!;
  return sigmoid(t);
}

/** Mean log loss (binary cross-entropy), with probabilities clipped for stability. */
export function logLoss(model: LogisticModel, X: readonly number[][], y: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < X.length; i++) {
    const p = Math.min(1 - 1e-12, Math.max(1e-12, predictProba(model, X[i]!)));
    s += y[i]! ? -Math.log(p) : -Math.log(1 - p);
  }
  return s / X.length;
}

/**
 * Batch gradient-descent steps on log loss + (λ/2)‖w‖² (bias not penalised).
 * ∇ = (1/m) Xᵀ(σ(Xθ) − y) + λw
 */
export function logisticGDSteps(model: LogisticModel, X: readonly number[][], y: readonly number[], eta: number, lambda: number, steps: number): LogisticModel {
  let { bias, weights } = model;
  weights = weights.slice();
  const m = X.length;
  for (let s = 0; s < steps; s++) {
    let gb = 0;
    const gw = new Array<number>(weights.length).fill(0);
    for (let i = 0; i < m; i++) {
      const e = predictProba({ bias, weights }, X[i]!) - y[i]!;
      gb += e;
      for (let j = 0; j < weights.length; j++) gw[j]! += e * X[i]![j]!;
    }
    bias -= (eta * gb) / m;
    weights = weights.map((w, j) => w - eta * (gw[j]! / m + lambda * w));
  }
  return { bias, weights };
}
