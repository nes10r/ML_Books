export type FitDiagnosis = "underfit" | "overfit" | "balanced";

/**
 * Heuristic bias/variance diagnosis from train/validation RMSE, calibrated for
 * the overfitting demo's noise level (σ ≈ 0.22).
 */
export function diagnoseFit(trainRmse: number, valRmse: number): FitDiagnosis {
  if (trainRmse > 0.3) return "underfit";
  if (valRmse > 0.3 && valRmse > trainRmse * 1.6) return "overfit";
  return "balanced";
}
