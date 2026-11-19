/** Eight theme-aware cluster colours derived from the four chart tokens. */
export const CLUSTER_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "color-mix(in oklch, var(--chart-1) 55%, var(--foreground))",
  "color-mix(in oklch, var(--chart-2) 55%, var(--foreground))",
  "color-mix(in oklch, var(--chart-3) 55%, var(--foreground))",
  "color-mix(in oklch, var(--chart-4) 55%, var(--foreground))",
] as const;

export const clusterColor = (k: number) => (k < 0 ? "var(--muted-foreground)" : CLUSTER_COLORS[k % CLUSTER_COLORS.length]!);
