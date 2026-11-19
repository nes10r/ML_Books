import type { Point } from "./regression";

export interface KnnResult {
  prediction: number;
  /** Indices (into the training array) of the k nearest neighbours, closest first. */
  neighborIndices: number[];
}

/** k-nearest-neighbours regression on a single feature: mean target of the k closest x. */
export function knnRegress(train: readonly Point[], x: number, k: number): KnnResult {
  if (train.length === 0) throw new Error("knnRegress: boş məlumat");
  const kk = Math.max(1, Math.min(Math.floor(k), train.length));
  const neighborIndices = train
    .map((p, i) => ({ i, d: Math.abs(p.x - x) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, kk)
    .map((e) => e.i);
  const prediction = neighborIndices.reduce((s, i) => s + train[i]!.y, 0) / kk;
  return { prediction, neighborIndices };
}
