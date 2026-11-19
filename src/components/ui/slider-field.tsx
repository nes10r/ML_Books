"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Labelled native range input — keyboard and screen-reader accessible out of the box. */
export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(v),
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  className?: string;
}) {
  const id = React.useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-xs tabular-nums text-muted-foreground">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--primary)]"
        style={{ background: `linear-gradient(to right, var(--primary) ${pct}%, var(--surface-muted) ${pct}%)` }}
      />
    </div>
  );
}
