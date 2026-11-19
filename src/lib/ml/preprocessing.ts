import { mean, std } from "./stats";

export type ScalingMethod = "none" | "minmax" | "standard" | "log" | "log-standard";

/** Fits a 1-D scaler on `fitOn` and returns a transform function (no data leakage when fitOn = train). */
export function fitScaler(method: ScalingMethod, fitOn: readonly number[]): (x: number) => number {
  switch (method) {
    case "none":
      return (x) => x;
    case "minmax": {
      const lo = Math.min(...fitOn);
      const hi = Math.max(...fitOn);
      const span = hi - lo || 1;
      return (x) => (x - lo) / span;
    }
    case "standard": {
      const m = mean(fitOn);
      const s = std(fitOn) || 1;
      return (x) => (x - m) / s;
    }
    case "log":
      return (x) => Math.log(Math.max(x, 1e-9));
    case "log-standard": {
      const logs = fitOn.map((x) => Math.log(Math.max(x, 1e-9)));
      const m = mean(logs);
      const s = std(logs) || 1;
      return (x) => (Math.log(Math.max(x, 1e-9)) - m) / s;
    }
  }
}

/** Column-wise scaling of a feature matrix, fitted on `train` and applied to both. */
export function scaleMatrix(method: ScalingMethod, train: number[][], test: number[][]) {
  const d = train[0]?.length ?? 0;
  const fns = Array.from({ length: d }, (_, j) => fitScaler(method, train.map((r) => r[j]!)));
  const apply = (m: number[][]) => m.map((r) => r.map((v, j) => fns[j]!(v)));
  return { train: apply(train), test: apply(test) };
}
