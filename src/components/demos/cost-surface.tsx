"use client";

import { useMemo } from "react";
import { mse, type Theta } from "@/lib/ml/gradient-descent";
import type { Point } from "@/lib/ml/regression";
import { Plot, linePath } from "./plot";

export interface PathSpec {
  key: string;
  path: Theta[];
  color: string;
  label: string;
}

const GRID = 44;

/** Heatmap of log(MSE) over (θ₀, θ₁) with optimisation paths drawn on top. */
export function CostSurface({
  points,
  xDomain,
  yDomain,
  optimum,
  paths,
  ariaLabel,
  height = 340,
}: {
  points: readonly Point[];
  xDomain: [number, number];
  yDomain: [number, number];
  optimum: Theta;
  paths: PathSpec[];
  ariaLabel: string;
  height?: number;
}) {
  // Heatmap cells are built once per surface in grid units (i, j) and positioned with a single
  // transform, so animation frames that only move the path never re-render these ~2 000 rects.
  const heatmap = useMemo(() => {
    const values: number[] = [];
    const dx = (xDomain[1] - xDomain[0]) / GRID;
    const dy = (yDomain[1] - yDomain[0]) / GRID;
    for (let j = 0; j < GRID; j++)
      for (let i = 0; i < GRID; i++) {
        const t0 = xDomain[0] + (i + 0.5) * dx;
        const t1 = yDomain[0] + (j + 0.5) * dy;
        values.push(Math.log(mse(points, { t0, t1 }) + 1e-9));
      }
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    return values.map((v, k) => {
      const i = k % GRID;
      const j = Math.floor(k / GRID);
      const shade = (v - lo) / (hi - lo || 1);
      return (
        <rect
          key={k}
          x={i}
          y={GRID - 1 - j}
          width={1.02}
          height={1.02}
          fill={`color-mix(in oklch, var(--chart-1) ${Math.round((1 - shade) * 70)}%, var(--surface))`}
        />
      );
    });
  }, [points, xDomain, yDomain]);

  const clipT = (th: Theta) => ({
    x: Math.min(xDomain[1] * 2, Math.max(xDomain[0] * 2 - Math.abs(xDomain[1]), th.t0)),
    y: Math.min(yDomain[1] + 50, Math.max(yDomain[0] - 50, th.t1)),
  });

  return (
    <Plot
      height={height}
      xDomain={xDomain}
      yDomain={yDomain}
      xLabel="θ₀ (kəsişmə)"
      yLabel="θ₁ (meyl)"
      formatX={(v) => v.toFixed(0)}
      formatY={(v) => (Math.abs(v) < 10 ? v.toFixed(1) : v.toFixed(0))}
      ariaLabel={ariaLabel}
    >
      {(s) => (
        <g>
          <g clipPath={`url(#${s.clipId})`}>
            <g
              transform={`translate(${s.x(xDomain[0])} ${s.y(yDomain[1])}) scale(${(s.x(xDomain[1]) - s.x(xDomain[0])) / GRID} ${(s.y(yDomain[0]) - s.y(yDomain[1])) / GRID})`}
            >
              {heatmap}
            </g>
            {paths.map((p) => (
              <g key={p.key}>
                <path d={linePath(p.path.map(clipT), s)} stroke={p.color} strokeWidth={2} fill="none" strokeLinejoin="round" />
                {p.path.length > 0 && (
                  <circle cx={s.x(clipT(p.path.at(-1)!).x)} cy={s.y(clipT(p.path.at(-1)!).y)} r={5.5} fill={p.color} stroke="var(--surface)" strokeWidth={2} />
                )}
              </g>
            ))}
          </g>
          <g transform={`translate(${s.x(optimum.t0)} ${s.y(optimum.t1)})`} aria-hidden>
            <path d="M-6,-6 L6,6 M6,-6 L-6,6" stroke="var(--surface)" strokeWidth={5} strokeLinecap="round" />
            <path d="M-6,-6 L6,6 M6,-6 L-6,6" stroke="var(--foreground)" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        </g>
      )}
    </Plot>
  );
}

/** Small log-scale loss-vs-step chart. */
export function LossCurve({ series, height = 150 }: { series: { key: string; values: number[]; color: string }[]; height?: number }) {
  const all = series.flatMap((s) => s.values).filter((v) => Number.isFinite(v) && v > 0);
  const lo = Math.log10(Math.max(1e-3, Math.min(...all)));
  const hi = Math.log10(Math.max(...all));
  const n = Math.max(2, ...series.map((s) => s.values.length));
  return (
    <Plot
      height={height}
      xDomain={[0, n - 1]}
      yDomain={[Math.floor(lo), Math.ceil(hi) + 0.01]}
      xLabel="Addım"
      formatY={(v) => (Number.isInteger(v) ? `10^${v}` : "")}
      formatX={(v) => v.toFixed(0)}
      ariaLabel="Xərc funksiyasının addımlara görə dəyişməsi (loqarifmik miqyas)"
    >
      {(s) => (
        <g clipPath={`url(#${s.clipId})`}>
          {series.map((sr) => (
            <path
              key={sr.key}
              d={linePath(
                sr.values.map((v, i) => ({ x: i, y: Number.isFinite(v) && v > 0 ? Math.log10(v) : Math.ceil(hi) + 1 })),
                s,
              )}
              stroke={sr.color}
              strokeWidth={1.8}
              fill="none"
            />
          ))}
        </g>
      )}
    </Plot>
  );
}
