"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Scales {
  x: (v: number) => number;
  y: (v: number) => number;
  invertX: (px: number) => number;
  invertY: (px: number) => number;
  innerWidth: number;
  innerHeight: number;
  clipId: string;
}

/** "Nice" evenly spaced ticks for a numeric domain. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min;
  if (span <= 0) return [min];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

export function linePath(points: { x: number; y: number }[], s: Pick<Scales, "x" | "y">): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${s.x(p.x).toFixed(2)},${s.y(p.y).toFixed(2)}`).join(" ");
}

const MARGIN = { top: 16, right: 16, bottom: 44, left: 52 };

/**
 * Minimal, dependency-free 2D plotting frame: axes, grid, labels and a
 * render-prop receiving linear scales. Responsive via viewBox.
 */
export function Plot({
  width = 640,
  height = 380,
  xDomain,
  yDomain,
  xLabel,
  yLabel,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  xTicks,
  yTicks,
  ariaLabel,
  onDataClick,
  className,
  children,
}: {
  width?: number;
  height?: number;
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
  xLabel?: string;
  yLabel?: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  xTicks?: number[];
  yTicks?: number[];
  ariaLabel: string;
  onDataClick?: (p: { x: number; y: number }) => void;
  className?: string;
  children: (s: Scales) => React.ReactNode;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const clipId = React.useId().replace(/:/g, "");
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;

  const s: Scales = {
    x: (v) => MARGIN.left + ((v - x0) / (x1 - x0)) * innerWidth,
    y: (v) => MARGIN.top + (1 - (v - y0) / (y1 - y0)) * innerHeight,
    invertX: (px) => x0 + ((px - MARGIN.left) / innerWidth) * (x1 - x0),
    invertY: (py) => y0 + (1 - (py - MARGIN.top) / innerHeight) * (y1 - y0),
    innerWidth,
    innerHeight,
    clipId,
  };

  const xt = xTicks ?? niceTicks(x0, x1, 6);
  const yt = yTicks ?? niceTicks(y0, y1, 5);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onDataClick || !svgRef.current) return;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    if (pt.x < MARGIN.left || pt.x > MARGIN.left + innerWidth || pt.y < MARGIN.top || pt.y > MARGIN.top + innerHeight) return;
    onDataClick({ x: s.invertX(pt.x), y: s.invertY(pt.y) });
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn("h-auto w-full select-none", onDataClick && "cursor-crosshair", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={MARGIN.left} y={MARGIN.top} width={innerWidth} height={innerHeight} />
        </clipPath>
      </defs>
      <rect x={MARGIN.left} y={MARGIN.top} width={innerWidth} height={innerHeight} fill="var(--surface)" />
      <g aria-hidden>
        {xt.map((v) => (
          <g key={`x${v}`}>
            <line x1={s.x(v)} x2={s.x(v)} y1={MARGIN.top} y2={MARGIN.top + innerHeight} stroke="var(--chart-grid)" />
            <text x={s.x(v)} y={MARGIN.top + innerHeight + 18} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
              {formatX(v)}
            </text>
          </g>
        ))}
        {yt.map((v) => (
          <g key={`y${v}`}>
            <line x1={MARGIN.left} x2={MARGIN.left + innerWidth} y1={s.y(v)} y2={s.y(v)} stroke="var(--chart-grid)" />
            <text x={MARGIN.left - 8} y={s.y(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
              {formatY(v)}
            </text>
          </g>
        ))}
        <rect x={MARGIN.left} y={MARGIN.top} width={innerWidth} height={innerHeight} fill="none" stroke="var(--border)" />
        {xLabel && (
          <text x={MARGIN.left + innerWidth / 2} y={height - 6} textAnchor="middle" fontSize={12} fill="var(--foreground)">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text
            transform={`translate(14 ${MARGIN.top + innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={12}
            fill="var(--foreground)"
          >
            {yLabel}
          </text>
        )}
      </g>
      {children(s)}
    </svg>
  );
}

/** Categorical marker with distinct shape per class — readable without color. */
export function Marker({
  cx,
  cy,
  cls,
  size = 5,
  filled = true,
  className,
}: {
  cx: number;
  cy: number;
  cls: number;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  const color = CLASS_COLORS[cls % CLASS_COLORS.length];
  const common = {
    fill: filled ? color : "var(--surface)",
    stroke: color,
    strokeWidth: 1.5,
    className,
  };
  switch (cls % 3) {
    case 1:
      return <rect x={cx - size} y={cy - size} width={size * 2} height={size * 2} rx={1.5} {...common} />;
    case 2:
      return <path d={`M${cx},${cy - size * 1.2} L${cx + size * 1.1},${cy + size * 0.9} L${cx - size * 1.1},${cy + size * 0.9} Z`} {...common} />;
    default:
      return <circle cx={cx} cy={cy} r={size} {...common} />;
  }
}

export const CLASS_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"] as const;
