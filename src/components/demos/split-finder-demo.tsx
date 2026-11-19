"use client";

import { Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { FRUIT_NAMES, generateFruits } from "@/lib/ml/datasets";
import { classificationSplitCurve, giniFromCounts } from "@/lib/ml/tree";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Marker, Plot } from "./plot";

type Feature = 0 | 1;
const RANGE: Record<Feature, [number, number]> = { 0: [3.5, 11], 1: [0, 500] };
const LABEL: Record<Feature, string> = { 0: "Diametr (sm)", 1: "Çəki (q)" };

export default function SplitFinderDemo() {
  const data = useMemo(() => generateFruits(), []);
  const idx = useMemo(() => data.X.map((_, i) => i), [data]);
  const [feature, setFeature] = useState<Feature>(0);
  const [thresholds, setThresholds] = useState<Record<Feature, number>>({ 0: 6.5, 1: 150 });
  const t = thresholds[feature];

  const curve = useMemo(() => classificationSplitCurve(data.X, data.y, idx, feature, 3, "gini"), [data, idx, feature]);
  const best = curve.reduce((a, b) => (b.cost < a.cost ? b : a));
  const rootCounts = [0, 1, 2].map((c) => data.y.filter((v) => v === c).length);
  const rootGini = giniFromCounts(rootCounts, data.y.length);

  const left = [0, 0, 0];
  const right = [0, 0, 0];
  data.X.forEach((row, i) => (row[feature]! <= t ? left : right)[data.y[i]!]!++);
  const nL = left.reduce((a, b) => a + b, 0);
  const nR = right.reduce((a, b) => a + b, 0);
  const gL = giniFromCounts(left, nL);
  const gR = giniFromCounts(right, nR);
  const cost = (nL * gL + nR * gR) / data.y.length;
  const [lo, hi] = RANGE[feature];
  const jitter = (i: number) => ((i * 37) % 100) / 100; // deterministic vertical jitter

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Əlamət"
          value={String(feature) as "0" | "1"}
          onChange={(v) => setFeature(Number(v) as Feature)}
          options={[
            { value: "0", label: "Diametr" },
            { value: "1", label: "Çəki" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <div className="space-y-2">
            <Plot
              height={170}
              xDomain={[lo, hi]}
              yDomain={[0, 3]}
              yTicks={[]}
              xLabel={LABEL[feature]}
              formatX={(v) => v.toFixed(0)}
              ariaLabel={`${LABEL[feature]} üzrə nümunələr və hədd ${t.toFixed(1)}. Sol tərəfdə ${nL}, sağ tərəfdə ${nR} nümunə.`}
            >
              {(s) => (
                <g>
                  <rect x={s.x(lo)} y={s.y(3)} width={Math.max(0, s.x(Math.min(hi, t)) - s.x(lo))} height={s.y(0) - s.y(3)} fill="var(--chart-1)" opacity={0.06} />
                  {data.X.map((row, i) => (
                    <Marker key={i} cx={s.x(row[feature]!)} cy={s.y(0.25 + data.y[i]! * 0.9 + jitter(i) * 0.6)} cls={data.y[i]!} size={3.2} />
                  ))}
                  <line x1={s.x(t)} x2={s.x(t)} y1={s.y(0)} y2={s.y(3)} stroke="var(--foreground)" strokeWidth={2.5} />
                </g>
              )}
            </Plot>
            <Legend items={FRUIT_NAMES.map((n, i) => ({ label: n, swatch: <Marker cx={7} cy={7} cls={i} size={4.5} /> }))} />
            <p className="px-1 pt-2 text-xs text-muted-foreground">Çəkili Gini bütün mümkün hədlər üzrə (aşağı = daha yaxşı bölgü)</p>
            <Plot
              height={200}
              xDomain={[lo, hi]}
              yDomain={[0, 0.7]}
              xLabel={LABEL[feature]}
              yLabel="Çəkili Gini"
              formatX={(v) => v.toFixed(0)}
              formatY={(v) => v.toFixed(1)}
              ariaLabel={`Çəkili Gini əyrisi. Ən yaxşı hədd ${best.threshold.toFixed(2)}, Gini ${best.cost.toFixed(3)}.`}
            >
              {(s) => (
                <g>
                  <line x1={s.x(lo)} x2={s.x(hi)} y1={s.y(rootGini)} y2={s.y(rootGini)} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                  <text x={s.x(hi) - 4} y={s.y(rootGini) - 5} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
                    kök: {rootGini.toFixed(3)}
                  </text>
                  <path d={linePath(curve.map((c) => ({ x: c.threshold, y: c.cost })), s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                  <circle cx={s.x(best.threshold)} cy={s.y(best.cost)} r={5} fill="var(--success)" stroke="var(--surface)" strokeWidth={2} />
                  <circle cx={s.x(t)} cy={s.y(cost)} r={5} fill="var(--foreground)" stroke="var(--surface)" strokeWidth={2} />
                </g>
              )}
            </Plot>
          </div>
        }
        controls={
          <>
            <SliderField
              label="Hədd"
              value={t}
              min={lo}
              max={hi}
              step={feature === 0 ? 0.05 : 1}
              onChange={(v) => setThresholds((p) => ({ ...p, [feature]: v }))}
              format={(v) => (feature === 0 ? `${v.toFixed(2)} sm` : `${v.toFixed(0)} q`)}
            />
            <Button size="sm" variant="outline" onClick={() => setThresholds((p) => ({ ...p, [feature]: best.threshold }))}>
              <Target /> Ən yaxşı həddə keç
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Stat label={`Sol (≤): ${nL}`} value={`G = ${gL.toFixed(3)}`} />
              <Stat label={`Sağ (>): ${nR}`} value={`G = ${gR.toFixed(3)}`} />
              <Stat label="Çəkili Gini" value={cost.toFixed(3)} tone={Math.abs(cost - best.cost) < 1e-9 ? "good" : "neutral"} />
              <Stat label="Azalma" value={(rootGini - cost).toFixed(3)} />
            </div>
            <p className="font-mono text-[11px] leading-5 text-muted-foreground">
              sol [{left.join(", ")}] · sağ [{right.join(", ")}]
            </p>
            <LiveRegion>
              CART hər əlamət və hər hədd üçün çəkili Gini-ni hesablayır və ən kiçiyini seçir. {LABEL[feature]} üçün ən yaxşı hədd{" "}
              <b>{feature === 0 ? best.threshold.toFixed(2) : best.threshold.toFixed(1)}</b> (Gini {best.cost.toFixed(3)}). Hər iki əlaməti yoxlayın: hansı kökə
              daha yaxşıdır?
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
