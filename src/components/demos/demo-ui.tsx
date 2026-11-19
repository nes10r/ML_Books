import type * as React from "react";
import { cn } from "@/lib/utils";

/** Shared layout pieces so every demo looks and behaves consistently. */
export function DemoLayout({ plot, controls }: { plot: React.ReactNode; controls: React.ReactNode }) {
  return (
    <div className="grid gap-0 md:grid-cols-[1fr_260px]">
      <div className="min-w-0 p-3 sm:p-4">{plot}</div>
      <div className="space-y-5 border-t p-4 md:border-t-0 md:border-l">{controls}</div>
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "good" | "bad" | "neutral" }) {
  return (
    <div className="rounded-lg bg-surface-muted/70 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-mono text-sm font-semibold tabular-nums",
          tone === "good" && "text-success",
          tone === "bad" && "text-danger",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function LiveRegion({ children }: { children: React.ReactNode }) {
  return (
    <p aria-live="polite" className="rounded-lg border border-dashed px-3 py-2 text-sm leading-relaxed">
      {children}
    </p>
  );
}

export function Legend({ items }: { items: { label: string; swatch: React.ReactNode }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 px-1 pt-2 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            {i.swatch}
          </svg>
          {i.label}
        </li>
      ))}
    </ul>
  );
}
