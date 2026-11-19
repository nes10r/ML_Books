import { createRng, type Rng } from "./random";
import { fitClassificationTree, fitRegressionTree, predictProba, predictValue, type ClassNode, type RegNode, type TreeParams } from "./tree";

/* ------------------------------ voting ------------------------------ */

/** P(majority of n independent voters is correct), each correct with probability p (n odd). */
export function majorityAccuracy(n: number, p: number): number {
  let total = 0;
  let logC = 0; // log C(n, k), updated incrementally
  for (let k = 0; k <= n; k++) {
    if (k > 0) logC += Math.log(n - k + 1) - Math.log(k);
    if (k > n / 2) total += Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  return total;
}

/**
 * Monte-Carlo majority accuracy for correlated voters: on each question, every voter
 * copies a shared “common” outcome with probability ρ, otherwise answers independently.
 */
export function correlatedMajorityAccuracy(n: number, p: number, rho: number, trials = 4000, seed = 1): number {
  const rng = createRng(seed);
  let correct = 0;
  for (let t = 0; t < trials; t++) {
    const common = rng() < p;
    let votes = 0;
    for (let v = 0; v < n; v++) votes += (rng() < rho ? common : rng() < p) ? 1 : 0;
    if (votes > n / 2) correct++;
  }
  return correct / trials;
}

/* ------------------------- bagging / forests ------------------------ */

export interface BaggedForest {
  trees: ClassNode[];
  /** For each tree, which training indices were in its bag (for OOB evaluation). */
  inBag: Set<number>[];
  nClasses: number;
}

export interface ForestOptions extends TreeParams {
  nTrees: number;
  /** Fraction of the training set drawn for each tree. */
  sampleFraction?: number;
  bootstrap?: boolean;
  seed?: number;
}

export function fitBaggedTrees(X: number[][], y: number[], nClasses: number, opts: ForestOptions): BaggedForest {
  const rng: Rng = createRng(opts.seed ?? 1);
  const m = X.length;
  const size = Math.max(1, Math.round(m * (opts.sampleFraction ?? 1)));
  const trees: ClassNode[] = [];
  const inBag: Set<number>[] = [];
  for (let t = 0; t < opts.nTrees; t++) {
    let idx: number[];
    if (opts.bootstrap ?? true) idx = Array.from({ length: size }, () => Math.floor(rng() * m));
    else {
      const perm = Array.from({ length: m }, (_, i) => i);
      for (let i = m - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [perm[i], perm[j]] = [perm[j]!, perm[i]!];
      }
      idx = perm.slice(0, size);
    }
    trees.push(fitClassificationTree(idx.map((i) => X[i]!), idx.map((i) => y[i]!), nClasses, { ...opts, rng }));
    inBag.push(new Set(idx));
  }
  return { trees, inBag, nClasses };
}

/** Soft vote: average of the trees' class probabilities (first `count` trees). */
export function forestProba(forest: BaggedForest, x: readonly number[], count = forest.trees.length): number[] {
  const acc = new Array<number>(forest.nClasses).fill(0);
  for (let t = 0; t < count; t++) predictProba(forest.trees[t]!, x).forEach((p, k) => (acc[k]! += p / count));
  return acc;
}

export const forestPredict = (forest: BaggedForest, x: readonly number[], count?: number) => {
  const p = forestProba(forest, x, count);
  return p.indexOf(Math.max(...p));
};

/** Out-of-bag accuracy: each training sample is predicted only by trees that did not see it. */
export function oobAccuracy(forest: BaggedForest, X: number[][], y: number[]): number {
  let correct = 0;
  let counted = 0;
  X.forEach((x, i) => {
    const acc = new Array<number>(forest.nClasses).fill(0);
    let used = 0;
    forest.trees.forEach((tree, t) => {
      if (forest.inBag[t]!.has(i)) return;
      predictProba(tree, x).forEach((p, k) => (acc[k]! += p));
      used++;
    });
    if (!used) return;
    counted++;
    if (acc.indexOf(Math.max(...acc)) === y[i]) correct++;
  });
  return counted ? correct / counted : NaN;
}

/* ------------------------- gradient boosting ------------------------ */

export interface BoostingStage {
  tree: RegNode;
  /** Residuals the tree was fitted on. */
  residuals: number[];
}

/** Gradient boosting for squared error: each tree fits the residuals of the current ensemble. */
export function fitGradientBoosting(
  X: number[][],
  y: number[],
  nTrees: number,
  learningRate: number,
  treeParams: TreeParams,
): { init: number; stages: BoostingStage[] } {
  const init = y.reduce((a, b) => a + b, 0) / y.length;
  const pred = y.map(() => init);
  const stages: BoostingStage[] = [];
  for (let t = 0; t < nTrees; t++) {
    const residuals = y.map((v, i) => v - pred[i]!);
    const tree = fitRegressionTree(X, residuals, treeParams);
    stages.push({ tree, residuals });
    X.forEach((x, i) => (pred[i]! += learningRate * predictValue(tree, x)));
  }
  return { init, stages };
}

export function boostingPredict(model: { init: number; stages: BoostingStage[] }, x: readonly number[], learningRate: number, count = model.stages.length): number {
  let v = model.init;
  for (let t = 0; t < count; t++) v += learningRate * predictValue(model.stages[t]!.tree, x);
  return v;
}
