/**
 * CART decision trees (classification: Gini/entropy, regression: MSE) — a
 * compact, dependency-free implementation used by the Chapter 5 demos.
 * Split search sorts each feature once per node and sweeps thresholds with
 * incremental statistics, so every candidate split costs O(1).
 */

export type ClassCriterion = "gini" | "entropy";

export interface TreeParams {
  maxDepth?: number;
  minSamplesLeaf?: number;
  minSamplesSplit?: number;
  /** Random forest: number of features examined at each node (default: all). Requires `rng`. */
  maxFeatures?: number;
  /** Extra-Trees: one random threshold per examined feature instead of the best one. Requires `rng`. */
  randomThresholds?: boolean;
  rng?: () => number;
}

interface NodeBase {
  id: number;
  depth: number;
  samples: number;
  impurity: number;
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}
export interface ClassNode extends NodeBase {
  kind: "class";
  counts: number[];
  prediction: number;
  left?: ClassNode;
  right?: ClassNode;
}
export interface RegNode extends NodeBase {
  kind: "reg";
  value: number;
  left?: RegNode;
  right?: RegNode;
}
export type TreeNode = ClassNode | RegNode;

/* ----------------------------- impurity ----------------------------- */

export function giniFromCounts(counts: readonly number[], n: number): number {
  if (n === 0) return 0;
  let s = 0;
  for (const c of counts) s += (c / n) ** 2;
  return 1 - s;
}

export function entropyFromCounts(counts: readonly number[], n: number): number {
  if (n === 0) return 0;
  let h = 0;
  for (const c of counts) if (c > 0) h -= (c / n) * Math.log2(c / n);
  return h;
}

const impurityFn = (c: ClassCriterion) => (c === "gini" ? giniFromCounts : entropyFromCounts);

/* ------------------------------ splits ------------------------------ */

export interface SplitCandidate {
  feature: number;
  threshold: number;
  /** Weighted child impurity (m_left·G_left + m_right·G_right) / m. */
  cost: number;
  nLeft: number;
  nRight: number;
}

/** All valid thresholds for one feature with their weighted Gini/entropy (used by the split-finder demo). */
export function classificationSplitCurve(
  X: readonly number[][],
  y: readonly number[],
  idx: readonly number[],
  feature: number,
  nClasses: number,
  criterion: ClassCriterion,
  minSamplesLeaf = 1,
): SplitCandidate[] {
  const imp = impurityFn(criterion);
  const order = [...idx].sort((a, b) => X[a]![feature]! - X[b]![feature]!);
  const total = new Array<number>(nClasses).fill(0);
  for (const i of order) total[y[i]!]!++;
  const left = new Array<number>(nClasses).fill(0);
  const right = total.slice();
  const n = order.length;
  const out: SplitCandidate[] = [];
  for (let k = 0; k < n - 1; k++) {
    const c = y[order[k]!]!;
    left[c]!++;
    right[c]!--;
    const v = X[order[k]!]![feature]!;
    const next = X[order[k + 1]!]![feature]!;
    const nL = k + 1;
    const nR = n - nL;
    if (v === next || nL < minSamplesLeaf || nR < minSamplesLeaf) continue;
    out.push({ feature, threshold: (v + next) / 2, cost: (nL * imp(left, nL) + nR * imp(right, nR)) / n, nLeft: nL, nRight: nR });
  }
  return out;
}

function bestRegressionSplit(X: readonly number[][], y: readonly number[], idx: number[], minLeaf: number): SplitCandidate | null {
  const d = X[0]?.length ?? 0;
  let best: SplitCandidate | null = null;
  const n = idx.length;
  for (let f = 0; f < d; f++) {
    const order = [...idx].sort((a, b) => X[a]![f]! - X[b]![f]!);
    let sumAll = 0;
    let sqAll = 0;
    for (const i of order) {
      sumAll += y[i]!;
      sqAll += y[i]! ** 2;
    }
    let sumL = 0;
    let sqL = 0;
    for (let k = 0; k < n - 1; k++) {
      const yi = y[order[k]!]!;
      sumL += yi;
      sqL += yi * yi;
      const v = X[order[k]!]![f]!;
      const next = X[order[k + 1]!]![f]!;
      const nL = k + 1;
      const nR = n - nL;
      if (v === next || nL < minLeaf || nR < minLeaf) continue;
      const sseL = sqL - (sumL * sumL) / nL;
      const sumR = sumAll - sumL;
      const sseR = sqAll - sqL - (sumR * sumR) / nR;
      const cost = (sseL + sseR) / n; // = weighted MSE of the children
      if (!best || cost < best.cost - 1e-12) best = { feature: f, threshold: (v + next) / 2, cost, nLeft: nL, nRight: nR };
    }
  }
  return best;
}

/* ------------------------- randomisation helpers -------------------- */

/** Feature indices to examine at a node: all, or a random subset of size maxFeatures. */
function candidateFeatures(d: number, p: TreeParams): number[] {
  const all = Array.from({ length: d }, (_, i) => i);
  if (!p.maxFeatures || p.maxFeatures >= d || !p.rng) return all;
  for (let i = d - 1; i > 0; i--) {
    const j = Math.floor(p.rng() * (i + 1));
    [all[i], all[j]] = [all[j]!, all[i]!];
  }
  return all.slice(0, p.maxFeatures);
}

/** Extra-Trees: pick the valid split whose threshold is closest to a uniformly random value. */
function randomThresholdSplit(curve: SplitCandidate[], rng: () => number): SplitCandidate {
  const lo = curve[0]!.threshold;
  const hi = curve[curve.length - 1]!.threshold;
  const t = lo + (hi - lo) * rng();
  return curve.reduce((a, b) => (Math.abs(b.threshold - t) < Math.abs(a.threshold - t) ? b : a));
}

/* ------------------------------ fitting ----------------------------- */

const defaults = (p: TreeParams) => ({
  maxDepth: p.maxDepth ?? Infinity,
  minSamplesLeaf: Math.max(1, p.minSamplesLeaf ?? 1),
  minSamplesSplit: Math.max(2, p.minSamplesSplit ?? 2),
});

export function fitClassificationTree(
  X: readonly number[][],
  y: readonly number[],
  nClasses: number,
  params: TreeParams & { criterion?: ClassCriterion } = {},
): ClassNode {
  const { maxDepth, minSamplesLeaf, minSamplesSplit } = defaults(params);
  const criterion = params.criterion ?? "gini";
  const imp = impurityFn(criterion);
  let nextId = 0;

  const build = (idx: number[], depth: number): ClassNode => {
    const counts = new Array<number>(nClasses).fill(0);
    for (const i of idx) counts[y[i]!]!++;
    const impurity = imp(counts, idx.length);
    const node: ClassNode = {
      kind: "class",
      id: nextId++,
      depth,
      samples: idx.length,
      counts,
      impurity,
      prediction: counts.indexOf(Math.max(...counts)),
    };
    if (depth >= maxDepth || idx.length < minSamplesSplit || impurity === 0) return node;
    let best: SplitCandidate | null = null;
    for (const f of candidateFeatures(X[0]?.length ?? 0, params)) {
      const curve = classificationSplitCurve(X, y, idx, f, nClasses, criterion, minSamplesLeaf);
      const pool = params.randomThresholds && params.rng && curve.length ? [randomThresholdSplit(curve, params.rng)] : curve;
      for (const c of pool) {
        if (!best || c.cost < best.cost - 1e-12) best = c;
      }
    }
    if (!best || best.cost >= impurity - 1e-12) return node;
    node.feature = best.feature;
    node.threshold = best.threshold;
    node.left = build(idx.filter((i) => X[i]![best.feature]! <= best.threshold), depth + 1);
    node.right = build(idx.filter((i) => X[i]![best.feature]! > best.threshold), depth + 1);
    return node;
  };
  return build(
    X.map((_, i) => i),
    0,
  );
}

export function fitRegressionTree(X: readonly number[][], y: readonly number[], params: TreeParams = {}): RegNode {
  const { maxDepth, minSamplesLeaf, minSamplesSplit } = defaults(params);
  let nextId = 0;
  const build = (idx: number[], depth: number): RegNode => {
    const n = idx.length;
    const mean = idx.reduce((s, i) => s + y[i]!, 0) / n;
    const impurity = idx.reduce((s, i) => s + (y[i]! - mean) ** 2, 0) / n;
    const node: RegNode = { kind: "reg", id: nextId++, depth, samples: n, value: mean, impurity };
    if (depth >= maxDepth || n < minSamplesSplit || impurity === 0) return node;
    const best = bestRegressionSplit(X, y, idx, minSamplesLeaf);
    if (!best || best.cost >= impurity - 1e-12) return node;
    node.feature = best.feature;
    node.threshold = best.threshold;
    node.left = build(idx.filter((i) => X[i]![best.feature]! <= best.threshold), depth + 1);
    node.right = build(idx.filter((i) => X[i]![best.feature]! > best.threshold), depth + 1);
    return node;
  };
  return build(
    X.map((_, i) => i),
    0,
  );
}

/* ----------------------------- inference ---------------------------- */

/** Nodes visited from the root to the leaf that handles x. */
export function decisionPath<T extends TreeNode>(root: T, x: readonly number[]): T[] {
  const path: T[] = [root];
  let node: TreeNode = root;
  while (node.left && node.right && node.feature !== undefined && node.threshold !== undefined) {
    node = x[node.feature]! <= node.threshold ? node.left : node.right;
    path.push(node as T);
  }
  return path;
}

export const leafOf = <T extends TreeNode>(root: T, x: readonly number[]) => decisionPath(root, x).at(-1)!;

export function predictClass(root: ClassNode, x: readonly number[]): number {
  return leafOf(root, x).prediction;
}

export function predictProba(root: ClassNode, x: readonly number[]): number[] {
  const leaf = leafOf(root, x);
  return leaf.counts.map((c) => c / leaf.samples);
}

export function predictValue(root: RegNode, x: readonly number[]): number {
  return leafOf(root, x).value;
}

export function treeStats(root: TreeNode): { depth: number; leaves: number; nodes: number } {
  let depth = 0;
  let leaves = 0;
  let nodes = 0;
  const walk = (n: TreeNode) => {
    nodes++;
    depth = Math.max(depth, n.depth);
    if (!n.left || !n.right) leaves++;
    else {
      walk(n.left);
      walk(n.right);
    }
  };
  walk(root);
  return { depth, leaves, nodes };
}
