/**
 * k-NN regression on feature vectors, optimised for evaluating many k values:
 * neighbours are sorted once per query and predictions for every k come from
 * prefix sums.
 */
export function knnPredictManyK(
  trainX: readonly number[][],
  trainY: readonly number[],
  queries: readonly number[][],
  ks: readonly number[],
): number[][] {
  if (ks.some((k, i) => k < 1 || (i > 0 && k <= ks[i - 1]!))) {
    throw new Error("knnPredictManyK: ks müsbət və ciddi artan olmalıdır");
  }
  const out: number[][] = ks.map(() => []);
  const n = trainX.length;
  const dist = new Float64Array(n);
  const order = Array.from({ length: n }, (_, i) => i);
  for (const q of queries) {
    for (let i = 0; i < n; i++) {
      const row = trainX[i]!;
      let d = 0;
      for (let j = 0; j < q.length; j++) d += (row[j]! - q[j]!) ** 2;
      dist[i] = d;
    }
    order.sort((a, b) => dist[a]! - dist[b]!);
    let sum = 0;
    let filled = 0;
    ks.forEach((k, ki) => {
      const kk = Math.min(k, n);
      while (filled < kk) sum += trainY[order[filled++]!]!;
      out[ki]!.push(sum / kk);
    });
  }
  return out;
}
