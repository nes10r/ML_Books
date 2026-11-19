export function meanSquaredError(actual: readonly number[], predicted: readonly number[]): number {
  if (actual.length !== predicted.length) {
    throw new Error("meanSquaredError: massivlərin uzunluğu fərqlidir");
  }
  if (actual.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < actual.length; i++) sum += (actual[i]! - predicted[i]!) ** 2;
  return sum / actual.length;
}

export function rootMeanSquaredError(actual: readonly number[], predicted: readonly number[]): number {
  return Math.sqrt(meanSquaredError(actual, predicted));
}

export function accuracy<T>(actual: readonly T[], predicted: readonly T[]): number {
  if (actual.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < actual.length; i++) if (actual[i] === predicted[i]) correct++;
  return correct / actual.length;
}
