import { solveLinearSystem } from "./linalg";

export interface Point {
  x: number;
  y: number;
}

export interface LinearModel {
  intercept: number; // θ₀
  slope: number; // θ₁
}

/** Ordinary least squares for one feature (closed form). */
export function fitLinearRegression(points: readonly Point[]): LinearModel {
  const n = points.length;
  if (n === 0) throw new Error("fitLinearRegression: boş məlumat");
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sxy += (p.x - meanX) * (p.y - meanY);
    sxx += (p.x - meanX) ** 2;
  }
  const slope = sxx === 0 ? 0 : sxy / sxx;
  return { intercept: meanY - slope * meanX, slope };
}

export function predictLinear(model: LinearModel, x: number): number {
  return model.intercept + model.slope * x;
}

/**
 * One stochastic gradient descent step on the squared error of a single
 * sample: θ ← θ − η · ∇(½(ŷ − y)²).
 */
export function sgdStep(model: LinearModel, sample: Point, learningRate: number): LinearModel {
  const error = predictLinear(model, sample.x) - sample.y;
  return {
    intercept: model.intercept - learningRate * error,
    slope: model.slope - learningRate * error * sample.x,
  };
}

/* ------------------------------------------------------------------ */
/* Polynomial ridge regression                                         */
/* ------------------------------------------------------------------ */

export interface PolynomialModel {
  degree: number;
  /** Coefficients for the *scaled* input t ∈ [-1, 1], lowest power first. */
  coefficients: number[];
  xMin: number;
  xMax: number;
}

function scale(x: number, xMin: number, xMax: number): number {
  return xMax === xMin ? 0 : (2 * (x - xMin)) / (xMax - xMin) - 1;
}

function powers(t: number, degree: number): number[] {
  const out = new Array<number>(degree + 1);
  let v = 1;
  for (let d = 0; d <= degree; d++) {
    out[d] = v;
    v *= t;
  }
  return out;
}

/**
 * Fits y ≈ Σ wₖ tᵏ with an L2 penalty λ‖w‖² (intercept not penalised).
 * Inputs are rescaled to [-1, 1] to keep the normal equations well conditioned.
 */
export function fitPolynomialRidge(
  points: readonly Point[],
  degree: number,
  lambda: number,
  domain?: { xMin: number; xMax: number },
): PolynomialModel {
  if (points.length === 0) throw new Error("fitPolynomialRidge: boş məlumat");
  const xMin = domain?.xMin ?? Math.min(...points.map((p) => p.x));
  const xMax = domain?.xMax ?? Math.max(...points.map((p) => p.x));
  const k = degree + 1;
  const XtX = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  const Xty = new Array<number>(k).fill(0);

  for (const p of points) {
    const row = powers(scale(p.x, xMin, xMax), degree);
    for (let i = 0; i < k; i++) {
      Xty[i]! += row[i]! * p.y;
      for (let j = 0; j < k; j++) XtX[i]![j]! += row[i]! * row[j]!;
    }
  }
  // Tiny floor keeps high-degree systems solvable even when λ = 0.
  const reg = Math.max(lambda, 1e-10);
  for (let i = 1; i < k; i++) XtX[i]![i]! += reg;

  const coefficients = solveLinearSystem(XtX, Xty) ?? new Array<number>(k).fill(0);
  return { degree, coefficients, xMin, xMax };
}

export function predictPolynomial(model: PolynomialModel, x: number): number {
  const row = powers(scale(x, model.xMin, model.xMax), model.degree);
  return row.reduce((s, v, i) => s + v * (model.coefficients[i] ?? 0), 0);
}
