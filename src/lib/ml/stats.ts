export function mean(xs: readonly number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
}

/** Population standard deviation. */
export function std(xs: readonly number[]): number {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

export function quantile(xs: readonly number[], q: number): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo]! + (s[hi]! - s[lo]!) * (pos - lo);
}

export const median = (xs: readonly number[]) => quantile(xs, 0.5);

/** Sample skewness (Fisher–Pearson, population form). 0 = symmetric, >0 = long right tail. */
export function skewness(xs: readonly number[]): number {
  const m = mean(xs);
  const s = std(xs);
  return s === 0 ? 0 : mean(xs.map((x) => ((x - m) / s) ** 3));
}

/** Pearson correlation coefficient r ∈ [-1, 1]. */
export function pearson(xs: readonly number[], ys: readonly number[]): number {
  if (xs.length !== ys.length || xs.length < 2) return NaN;
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i]! - mx;
    const dy = ys[i]! - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
}

export function histogram(xs: readonly number[], bins: number, range?: [number, number]): HistogramBin[] {
  const lo = range?.[0] ?? Math.min(...xs);
  const hi = range?.[1] ?? Math.max(...xs);
  const width = (hi - lo) / bins || 1;
  const out = Array.from({ length: bins }, (_, i) => ({ x0: lo + i * width, x1: lo + (i + 1) * width, count: 0 }));
  for (const x of xs) {
    const i = Math.min(bins - 1, Math.max(0, Math.floor((x - lo) / width)));
    out[i]!.count++;
  }
  return out;
}
