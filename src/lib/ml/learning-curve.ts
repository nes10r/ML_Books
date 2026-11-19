import { rootMeanSquaredError } from "./metrics";
import { fitPolynomialRidge, predictPolynomial, type Point } from "./regression";

export interface LearningCurvePoint {
  size: number;
  train: number;
  validation: number;
}

/** Train/validation RMSE of a polynomial model as the training set grows (first `size` points). */
export function polynomialLearningCurve(
  train: readonly Point[],
  validation: readonly Point[],
  degree: number,
  sizes: readonly number[],
  domain: { xMin: number; xMax: number },
  lambda = 1e-8,
): LearningCurvePoint[] {
  return sizes.map((size) => {
    const subset = train.slice(0, size);
    const model = fitPolynomialRidge(subset, degree, lambda, domain);
    const rmse = (pts: readonly Point[]) => rootMeanSquaredError(pts.map((p) => p.y), pts.map((p) => predictPolynomial(model, p.x)));
    return { size, train: rmse(subset), validation: rmse(validation) };
  });
}
