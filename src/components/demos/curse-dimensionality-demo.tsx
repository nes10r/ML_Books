"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { createRng } from "@/lib/ml/random";
import { histogram } from "@/lib/ml/stats";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const DIMS = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500, 1000];

/** Distances from one random query to 400 random points in the unit hypercube [0,1]^d. */
function sampleDistances(d: number, seed: number): number[] {
  const rng = createRng(seed);
  const q = Array.from({ length: d }, () => rng());
  return Array.from({ length: 400 }, () => {
    let s = 0;
    for (let j = 0; j < d; j++) s += (rng() - q[j]!) ** 2;
    return Math.sqrt(s);
  });
}

export default function CurseDimensionalityDemo() {
  const [dimIndex, setDimIndex] = useState(4);
  const d = DIMS[dimIndex]!;

  const stats = useMemo(
    () =>
      DIMS.map((dim, i) => {
        const dist = sampleDistances(dim, 100 + i);
        return {
          dim,
          ratio: Math.min(...dist) / Math.max(...dist),
          edge: 1 - 0.98 ** dim, // P(at least one coordinate within 0.01 of a face)
        };
      }),
    [],
  );
  const dist = useMemo(() => sampleDistances(d, 100 + dimIndex), [d, dimIndex]);
  const rel = dist.map((v) => v / Math.max(...dist));
  const bins = histogram(rel, 30, [0, 1]);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const current = stats[dimIndex]!;

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={240}
            xDomain={[0, 3]}
            yDomain={[0, 1.02]}
            xTicks={[0, 1, 2, 3]}
            formatX={(v) => String(10 ** v)}
            formatY={(v) => `${Math.round(v * 100)}%`}
            xLabel="Ölçü sayı (d) — loqarifmik"
            ariaLabel={`Ölçü artdıqca: kənara yaxın nöqtələrin payı və ən yaxın/ən uzaq məsafə nisbəti. d = ${d}: ${(current.edge * 100).toFixed(0)}% və ${current.ratio.toFixed(2)}.`}
          >
            {(s) => (
              <g>
                <path d={linePath(stats.map((p) => ({ x: Math.log10(p.dim), y: p.edge })), s)} stroke="var(--chart-1)" strokeWidth={2.4} fill="none" />
                <path d={linePath(stats.map((p) => ({ x: Math.log10(p.dim), y: p.ratio })), s)} stroke="var(--chart-4)" strokeWidth={2.4} fill="none" />
                <line x1={s.x(Math.log10(d))} x2={s.x(Math.log10(d))} y1={s.y(0)} y2={s.y(1.02)} stroke="var(--foreground)" strokeOpacity={0.35} />
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Kənara 0.01-dən yaxın nöqtələrin payı", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              { label: "Ən yaxın / ən uzaq qonşu məsafəsi", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
            ]}
          />
          <p className="px-1 pt-1 text-xs text-muted-foreground">d = {d}: təsadüfi sorğu nöqtəsindən 400 nöqtəyə məsafələr (ən uzaq məsafəyə nisbətdə)</p>
          <Plot height={180} xDomain={[0, 1]} yDomain={[0, maxCount * 1.1]} formatX={(v) => v.toFixed(1)} formatY={(v) => v.toFixed(0)} xLabel="Nisbi məsafə" ariaLabel="Məsafələrin histoqramı">
            {(s) => (
              <g>
                {bins.map((b, i) => (
                  <rect key={i} x={s.x(b.x0) + 0.5} y={s.y(b.count)} width={Math.max(0, s.x(b.x1) - s.x(b.x0) - 1)} height={s.y(0) - s.y(b.count)} fill="var(--chart-1)" opacity={0.8} />
                ))}
              </g>
            )}
          </Plot>
        </div>
      }
      controls={
        <>
          <SliderField label="Ölçü sayı (d)" value={dimIndex} min={0} max={DIMS.length - 1} onChange={setDimIndex} format={(i) => String(DIMS[i])} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Kənara yaxın" value={`${(current.edge * 100).toFixed(1)}%`} />
            <Stat label="Yaxın / uzaq" value={current.ratio.toFixed(2)} tone={current.ratio > 0.6 ? "bad" : "neutral"} />
          </div>
          <LiveRegion>
            Ölçü artdıqca demək olar ki, bütün nöqtələr kubun “kənarına” yaxınlaşır və məsafələr bir-birinə bənzəyir: histoqram dar zirvəyə çevrilir. Ən
            yaxın qonşu ən uzaq qonşudan az fərqlənirsə, “oxşarlıq” anlayışı (k-NN, klasterləşdirmə) mənasını itirir.
          </LiveRegion>
        </>
      }
    />
  );
}
