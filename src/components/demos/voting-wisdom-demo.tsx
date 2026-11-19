"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { correlatedMajorityAccuracy, majorityAccuracy } from "@/lib/ml/ensemble";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const NS = [1, 3, 5, 11, 21, 51, 101, 201, 501, 1001];
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function VotingWisdomDemo() {
  const [p, setP] = useState(0.55);
  const [rho, setRho] = useState(0);
  const [nIndex, setNIndex] = useState(6);
  const n = NS[nIndex]!;

  const independent = useMemo(() => NS.map((k) => ({ x: Math.log10(k), y: majorityAccuracy(k, p) })), [p]);
  const correlated = useMemo(() => NS.map((k, i) => ({ x: Math.log10(k), y: correlatedMajorityAccuracy(k, p, rho, 3000, 17 + i) })), [p, rho]);
  const indepAt = majorityAccuracy(n, p);
  const corrAt = correlated[nIndex]!.y;

  return (
    <DemoLayout
      plot={
        <>
          <Plot
            height={340}
            xDomain={[0, 3]}
            yDomain={[0.45, 1.01]}
            xTicks={[0, 1, 2, 3]}
            formatX={(v) => String(10 ** v)}
            formatY={(v) => `${Math.round(v * 100)}%`}
            xLabel="Seçicilərin (təsnifatçıların) sayı — loqarifmik"
            yLabel="Səs çoxluğunun dəqiqliyi"
            ariaLabel={`Hər biri ${pct(p)} dəqiqlikli ${n} təsnifatçının səs çoxluğu: müstəqil halda ${pct(indepAt)}, korrelyasiya ${rho} olduqda ${pct(corrAt)}.`}
          >
            {(s) => (
              <g>
                <line x1={s.x(0)} x2={s.x(3)} y1={s.y(p)} y2={s.y(p)} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <text x={s.x(3) - 4} y={s.y(p) + 14} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
                  tək təsnifatçı: {pct(p)}
                </text>
                <path d={linePath(independent, s)} stroke="var(--chart-1)" strokeWidth={2.5} fill="none" />
                <path d={linePath(correlated, s)} stroke="var(--chart-4)" strokeWidth={2.5} strokeDasharray={rho > 0 ? undefined : "4 3"} fill="none" />
                <line x1={s.x(Math.log10(n))} x2={s.x(Math.log10(n))} y1={s.y(0.45)} y2={s.y(1.01)} stroke="var(--foreground)" strokeOpacity={0.35} />
                <circle cx={s.x(Math.log10(n))} cy={s.y(indepAt)} r={5} fill="var(--chart-1)" />
                <circle cx={s.x(Math.log10(n))} cy={s.y(corrAt)} r={5} fill="var(--chart-4)" />
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Müstəqil təsnifatçılar (binomial düstur)", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              { label: `Korrelyasiyalı (ρ = ${rho.toFixed(2)}, simulyasiya)`, swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
            ]}
          />
        </>
      }
      controls={
        <>
          <SliderField label="Hər təsnifatçının dəqiqliyi (p)" value={p} min={0.5} max={0.75} step={0.01} onChange={setP} format={pct} />
          <SliderField label="Təsnifatçı sayı" value={nIndex} min={0} max={NS.length - 1} onChange={setNIndex} format={(i) => String(NS[i])} />
          <SliderField label="Səhvlərin korrelyasiyası (ρ)" value={rho} min={0} max={0.9} step={0.05} onChange={setRho} format={(v) => v.toFixed(2)} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Müstəqil" value={pct(indepAt)} tone="good" />
            <Stat label="Korrelyasiyalı" value={pct(corrAt)} tone={corrAt < indepAt - 0.05 ? "bad" : "neutral"} />
          </div>
          <LiveRegion>
            Hər təsnifatçı təsadüfi təxmindən cəmi bir az yaxşıdırsa belə, çoxlu <b>müstəqil</b> təsnifatçının səs çoxluğu çox dəqiq ola bilər. Lakin
            səhvlər korrelyasiyalı olduqda (eyni məlumat, eyni alqoritm) qazanc sürətlə yox olur — ansambl üçün <b>müxtəliflik</b> lazımdır.
          </LiveRegion>
        </>
      }
    />
  );
}
