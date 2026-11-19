import { shuffle, type Rng } from "./random";

/** Random train/test split of indices. */
export function randomSplit(n: number, testRatio: number, rng: Rng): { train: number[]; test: number[] } {
  const idx = shuffle(
    Array.from({ length: n }, (_, i) => i),
    rng,
  );
  const nTest = Math.round(n * testRatio);
  return { test: idx.slice(0, nTest), train: idx.slice(nTest) };
}

/** Stratified split: every stratum keeps (approximately) the same share in train and test. */
export function stratifiedSplit(strata: readonly string[], testRatio: number, rng: Rng): { train: number[]; test: number[] } {
  const groups = new Map<string, number[]>();
  strata.forEach((s, i) => groups.set(s, [...(groups.get(s) ?? []), i]));
  const train: number[] = [];
  const test: number[] = [];
  for (const members of groups.values()) {
    const idx = shuffle(members, rng);
    const nTest = Math.round(idx.length * testRatio);
    test.push(...idx.slice(0, nTest));
    train.push(...idx.slice(nTest));
  }
  return { train, test };
}

/** Share of each category among the given indices. */
export function proportions(strata: readonly string[], indices: readonly number[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const i of indices) counts.set(strata[i]!, (counts.get(strata[i]!) ?? 0) + 1);
  const out = new Map<string, number>();
  for (const [k, c] of counts) out.set(k, c / indices.length);
  return out;
}

/** k-fold partition of shuffled indices. */
export function kFold(n: number, k: number, rng: Rng): { train: number[]; validation: number[] }[] {
  const idx = shuffle(
    Array.from({ length: n }, (_, i) => i),
    rng,
  );
  return Array.from({ length: k }, (_, f) => {
    const validation = idx.filter((_, i) => i % k === f);
    const train = idx.filter((_, i) => i % k !== f);
    return { train, validation };
  });
}
