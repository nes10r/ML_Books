"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { generateSparseRegression, SPARSE_TRUE_WEIGHTS } from "@/lib/ml/datasets";
import { elasticNet, regularizationPath, standardizeColumns } from "@/lib/ml/regularized";
import { cn } from "@/lib/utils";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

type Kind = "ridge" | "lasso" | "enet";
const L1: Record<Kind, number> = { ridge: 0, lasso: 1, enet: 0.5 };
const LOG_ALPHAS = Array.from({ length: 61 }, (_, i) => -3 + i * 0.075); // 10^-3 … 10^1.5
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export default function RegularizationPathsDemo() {
  const { Z, y } = useMemo(() => {
    const d = generateSparseRegression();
    return { Z: standardizeColumns(d.X).Z, y: d.y };
  }, []);
  const [kind, setKind] = useState<Kind>("lasso");
  const [logAlpha, setLogAlpha] = useState(-0.5);
  const alpha = 10 ** logAlpha;

  const paths = useMemo(() => regularizationPath(Z, y, LOG_ALPHAS.map((a) => 10 ** a), L1[kind]), [Z, y, kind]);
  const current = useMemo(() => elasticNet(Z, y, alpha, L1[kind]).coef, [Z, y, alpha, kind]);
  const zeros = current.filter((w) => Math.abs(w) < 1e-6).length;
  const informative = SPARSE_TRUE_WEIGHTS.map((w) => w !== 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Requlyarlaşdırma növü"
          value={kind}
          onChange={setKind}
          options={[
            { value: "ridge", label: "Ridge (ℓ₂)" },
            { value: "lasso", label: "Lasso (ℓ₁)" },
            { value: "enet", label: "Elastic Net (r = 0.5)" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <Plot
            height={360}
            xDomain={[-3, 1.5]}
            yDomain={[-2.5, 3.5]}
            xLabel="log₁₀ α (requlyarlaşdırma gücü →)"
            yLabel="Əmsal (standart əlamət üzrə)"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`${kind} üçün əmsal yolları. α = ${alpha.toPrecision(2)} olduqda ${zeros} əmsal sıfırdır.`}
          >
            {(s) => (
              <g>
                <line x1={s.x(-3)} x2={s.x(1.5)} y1={s.y(0)} y2={s.y(0)} stroke="var(--border)" />
                <g clipPath={`url(#${s.clipId})`}>
                  {SPARSE_TRUE_WEIGHTS.map((_, j) => (
                    <path
                      key={j}
                      d={linePath(LOG_ALPHAS.map((la, k) => ({ x: la, y: paths[k]![j]! })), s)}
                      stroke={informative[j] ? COLORS[j % 4] : "var(--muted-foreground)"}
                      strokeWidth={informative[j] ? 2.4 : 1.4}
                      strokeDasharray={informative[j] ? undefined : "4 3"}
                      fill="none"
                    />
                  ))}
                </g>
                <line x1={s.x(logAlpha)} x2={s.x(logAlpha)} y1={s.y(-2.5)} y2={s.y(3.5)} stroke="var(--foreground)" strokeOpacity={0.5} />
              </g>
            )}
          </Plot>
        }
        controls={
          <>
            <SliderField label="α" value={logAlpha} min={-3} max={1.5} step={0.05} onChange={setLogAlpha} format={(v) => (10 ** v).toPrecision(2)} />
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Cari əmsallar (həqiqi qiymət)</p>
              <ul className="space-y-1 font-mono text-xs">
                {current.map((w, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-6 text-muted-foreground">x{j + 1}</span>
                    <span className="relative h-2.5 flex-1 rounded-full bg-surface-muted">
                      <span
                        className="absolute inset-y-0 rounded-full"
                        style={{
                          left: w >= 0 ? "50%" : `${50 - Math.min(50, (Math.abs(w) / 3.5) * 50)}%`,
                          width: `${Math.min(50, (Math.abs(w) / 3.5) * 50)}%`,
                          background: informative[j] ? COLORS[j % 4] : "var(--muted-foreground)",
                        }}
                      />
                    </span>
                    <span className={cn("w-10 text-right tabular-nums", Math.abs(w) < 1e-6 && "text-success font-semibold")}>{w.toFixed(2)}</span>
                    <span className="w-8 text-right text-muted-foreground">({SPARSE_TRUE_WEIGHTS[j]})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Sıfır əmsal" value={`${zeros} / 8`} tone={zeros > 0 ? "good" : "neutral"} />
              <Stat label="Faydasız əlamət" value="4 (qırıq xətt)" />
            </div>
            <LiveRegion>
              {kind === "ridge"
                ? "Ridge bütün əmsalları tədricən sıfıra doğru sıxır, lakin heç birini tam sıfır etmir."
                : kind === "lasso"
                  ? "Lasso faydasız əlamətlərin əmsallarını tam sıfıra endirir — avtomatik əlamət seçimi edir."
                  : "Elastic Net ikisinin arasındadır: bəzi əmsalları sıfırlayır, korrelyasiyalı əlamətlərdə isə Lasso-dan sabitdir."}
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
