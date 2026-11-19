/**
 * Deterministic pseudo-random utilities. Demos must render identically on the
 * server and the client (no hydration mismatch) and be reproducible in class,
 * so `Math.random` is never used for data generation.
 */

export type Rng = () => number;

/** Mulberry32 — tiny, fast, good-enough PRNG returning floats in [0, 1). */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal sample via Box–Muller. */
export function randomNormal(rng: Rng, mean = 0, std = 1): number {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function randomUniform(rng: Rng, min: number, max: number): number {
  return min + (max - min) * rng();
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}
