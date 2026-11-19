"use client";

import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import type { Apartment } from "@/lib/data/apartments";
import { createRng } from "@/lib/ml/random";
import { proportions, randomSplit, stratifiedSplit } from "@/lib/ml/splitting";
import { ApartmentsGate } from "./dataset-gate";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";

const pp = (v: number) => `${(v * 100).toFixed(1)}%`;

function maxDeviation(strata: string[], overall: Map<string, number>, test: number[]) {
  const p = proportions(strata, test);
  let max = 0;
  for (const [k, v] of overall) max = Math.max(max, Math.abs((p.get(k) ?? 0) - v));
  return max;
}

export default function StratifiedSplitDemo() {
  return <ApartmentsGate>{(data) => <Inner data={data} />}</ApartmentsGate>;
}

function Inner({ data }: { data: Apartment[] }) {
  const [testRatio, setTestRatio] = useState(0.2);
  const [seed, setSeed] = useState(1);
  const strata = useMemo(() => data.map((d) => d.rayon), [data]);
  const all = useMemo(() => strata.map((_, i) => i), [strata]);
  const overall = useMemo(() => proportions(strata, all), [strata, all]);
  const districts = useMemo(() => [...overall.keys()].sort((a, b) => overall.get(b)! - overall.get(a)!), [overall]);

  const rand = useMemo(() => randomSplit(strata.length, testRatio, createRng(seed)), [strata, testRatio, seed]);
  const strat = useMemo(() => stratifiedSplit(strata, testRatio, createRng(seed)), [strata, testRatio, seed]);
  const pRand = proportions(strata, rand.test);
  const pStrat = proportions(strata, strat.test);
  const devRand = maxDeviation(strata, overall, rand.test);
  const devStrat = maxDeviation(strata, overall, strat.test);

  // Average worst-case deviation over 100 different seeds — removes the "lucky split" effect.
  const avg = useMemo(() => {
    let r = 0;
    let s = 0;
    for (let k = 0; k < 100; k++) {
      r += maxDeviation(strata, overall, randomSplit(strata.length, testRatio, createRng(1000 + k)).test);
      s += maxDeviation(strata, overall, stratifiedSplit(strata, testRatio, createRng(1000 + k)).test);
    }
    return { rand: r / 100, strat: s / 100 };
  }, [strata, overall, testRatio]);

  const maxShare = Math.max(...[...overall.values(), ...pRand.values(), ...pStrat.values()]) * 1.1;
  const W = 640;
  const rowH = 30;
  const left = 96;
  const H = districts.length * rowH + 24;
  const x = (v: number) => left + (v / maxShare) * (W - left - 60);

  return (
    <DemoLayout
      plot={
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Rayonların ümumi, təsadüfi və stratifikasiyalı test dəstindəki payları. Maksimum fərq: təsadüfi ${pp(devRand)}, stratifikasiyalı ${pp(devStrat)}.`}>
            {districts.map((d, i) => {
              const y = 12 + i * rowH;
              const bars = [
                { v: overall.get(d) ?? 0, c: "var(--muted-foreground)", o: 0.35 },
                { v: pRand.get(d) ?? 0, c: "var(--chart-4)", o: 1 },
                { v: pStrat.get(d) ?? 0, c: "var(--chart-1)", o: 1 },
              ];
              return (
                <g key={d}>
                  <text x={left - 8} y={y + 15} textAnchor="end" fontSize={12} fill="var(--foreground)">
                    {d}
                  </text>
                  {bars.map((b, j) => (
                    <rect key={j} x={left} y={y + j * 8} width={Math.max(1, x(b.v) - left)} height={7} rx={2} fill={b.c} opacity={b.o} />
                  ))}
                  <text x={x(Math.max(...bars.map((b) => b.v))) + 6} y={y + 15} fontSize={10} fill="var(--muted-foreground)">
                    {pp(overall.get(d) ?? 0)}
                  </text>
                </g>
              );
            })}
          </svg>
          <Legend
            items={[
              { label: "Bütün məlumat", swatch: <rect x={1} y={4} width={12} height={6} rx={2} fill="var(--muted-foreground)" opacity={0.35} /> },
              { label: "Təsadüfi test dəsti", swatch: <rect x={1} y={4} width={12} height={6} rx={2} fill="var(--chart-4)" /> },
              { label: "Stratifikasiyalı test dəsti", swatch: <rect x={1} y={4} width={12} height={6} rx={2} fill="var(--chart-1)" /> },
            ]}
          />
        </>
      }
      controls={
        <>
          <SliderField label="Test dəstinin payı" value={testRatio} min={0.05} max={0.4} step={0.05} onChange={setTestRatio} format={(v) => `${Math.round(v * 100)}%`} />
          <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
            <Shuffle /> Yeni təsadüfi bölgü
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Test ölçüsü" value={rand.test.length} />
            <Stat label="Bölgü №" value={seed} />
            <Stat label="Maks. fərq (təsadüfi)" value={pp(devRand)} tone={devRand > 0.01 ? "bad" : "neutral"} />
            <Stat label="Maks. fərq (stratifik)" value={pp(devStrat)} tone="good" />
          </div>
          <LiveRegion>
            100 fərqli bölgüdə orta maksimum fərq: təsadüfi <b>{pp(avg.rand)}</b>, stratifikasiyalı <b>{pp(avg.strat)}</b>. Təsadüfi bölgüdə bəzi rayonların payı test dəstində nəzərəçarpacaq dərəcədə dəyişir. Stratifikasiya bu fərqi demək olar ki, sıfıra endirir.
          </LiveRegion>
        </>
      }
    />
  );
}
