import { cn } from "@/lib/utils";

/** Renders an 8×8 digit (intensities 0–16) as an SVG grid. Ink uses the foreground colour, so it works in both themes. */
export function DigitImage({
  pixels,
  label,
  size = 48,
  className,
}: {
  pixels: readonly number[];
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 8 8" width={size} height={size} role="img" aria-label={label} className={cn("rounded-sm bg-surface", className)} shapeRendering="crispEdges">
      {pixels.map((v, i) =>
        v > 0 ? <rect key={i} x={i % 8} y={Math.floor(i / 8)} width={1} height={1} fill="var(--foreground)" opacity={v / 16} /> : null,
      )}
    </svg>
  );
}
