"use client";

import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { generateLinearBoundary, generateMoons } from "@/lib/ml/datasets";
import { createRng, shuffle } from "@/lib/ml/random";
import { fitClassificationTree, predictClass, treeStats } from "@/lib/ml/tree";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { Marker, Plot } from "./plot";
import { DecisionRegions } from "./tree-ui";

type Mode = "rotation" | "variance";
const UNIT = [-1, 1] as const;
const MOON_X = [-1.8, 2.8] as const;
const MOON_Y = [-1.4, 1.9] as const;

export default function TreeInstabilityDemo() {
  const [mode, setMode] = useState<Mode>("rotation");
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Təcrübə"
          value={mode}
          onChange={setMode}
          options={[
            { value: "rotation", label: "Ox istiqaməti" },
            { value: "variance", label: "Yüksək dispersiya" },
          ]}
        />
      </div>
      {mode === "rotation" ? <Rotation /> : <Variance />}
    </div>
  );
}

function Rotation() {
  const [angle, setAngle] = useState(0);
  const data = useMemo(() => generateLinearBoundary(angle), [angle]);
  const tree = useMemo(() => fitClassificationTree(data.X, data.y, 2), [data]);
  const stats = treeStats(tree);
  const a = (angle * Math.PI) / 180;
  return (
    <DemoLayout
      plot={
        <Plot
          height={360}
          xDomain={UNIT}
          yDomain={UNIT}
          xLabel="x₁"
          yLabel="x₂"
          formatX={(v) => v.toFixed(1)}
          formatY={(v) => v.toFixed(1)}
          ariaLabel={`Sərhədi ${angle} dərəcə maili olan məlumat. Ağac ${stats.leaves} yarpaqla pilləli sərhəd qurur.`}
        >
          {(s) => (
            <g>
              <g clipPath={`url(#${s.clipId})`}>
                <DecisionRegions tree={tree} s={s} xDomain={UNIT} yDomain={UNIT} grid={90} opacity={0.22} />
                <line x1={s.x(-2 * Math.cos(a))} y1={s.y(-2 * Math.sin(a))} x2={s.x(2 * Math.cos(a))} y2={s.y(2 * Math.sin(a))} stroke="var(--foreground)" strokeDasharray="6 4" strokeWidth={1.5} />
              </g>
              {data.X.map(([p, q], i) => (
                <Marker key={i} cx={s.x(p!)} cy={s.y(q!)} cls={data.y[i]! ? 3 : 0} size={3} />
              ))}
            </g>
          )}
        </Plot>
      }
      controls={
        <>
          <SliderField label="Sərhədin bucağı" value={angle} min={0} max={45} onChange={setAngle} format={(v) => `${v}°`} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Yarpaq" value={stats.leaves} tone={stats.leaves > 4 ? "bad" : "good"} />
            <Stat label="Dərinlik" value={stats.depth} />
          </div>
          <LiveRegion>
            Ağac yalnız oxlara perpendikulyar kəsiklər edə bilir. Sərhəd oxlarla üst-üstə düşəndə (0°) bir kəsik kifayətdir. Mail sərhədi isə “pilləkən” ilə
            təqlid etməlidir: bucaq artdıqca yarpaq sayı artır və sərhəd yeni nöqtələrdə səhv edir.
          </LiveRegion>
        </>
      }
    />
  );
}

function Variance() {
  const data = useMemo(() => generateMoons(7, 300, 0.3), []);
  const [seed, setSeed] = useState(1);
  const base = useMemo(() => fitClassificationTree(data.X, data.y, 2), [data]);
  const subset = useMemo(() => {
    const idx = shuffle(
      data.X.map((_, i) => i),
      createRng(seed * 101),
    ).slice(0, 240);
    return { X: idx.map((i) => data.X[i]!), y: idx.map((i) => data.y[i]!), idx: new Set(idx) };
  }, [data, seed]);
  const tree = useMemo(() => fitClassificationTree(subset.X, subset.y, 2), [subset]);
  const stats = treeStats(tree);

  // Share of a dense grid where the subset tree disagrees with the tree trained on all data.
  const disagreement = useMemo(() => {
    let diff = 0;
    const g = 50;
    for (let i = 0; i < g; i++)
      for (let j = 0; j < g; j++) {
        const p = [MOON_X[0] + ((i + 0.5) / g) * (MOON_X[1] - MOON_X[0]), MOON_Y[0] + ((j + 0.5) / g) * (MOON_Y[1] - MOON_Y[0])];
        if (predictClass(tree, p) !== predictClass(base, p)) diff++;
      }
    return diff / (g * g);
  }, [tree, base]);

  return (
    <DemoLayout
      plot={
        <Plot
          height={360}
          xDomain={MOON_X}
          yDomain={MOON_Y}
          xLabel="x₁"
          yLabel="x₂"
          formatX={(v) => v.toFixed(1)}
          formatY={(v) => v.toFixed(1)}
          ariaLabel={`Məlumatın təsadüfi 80%-i ilə öyrədilmiş ağac: ${stats.leaves} yarpaq. Bütün məlumatla öyrədilmiş ağacdan ${(disagreement * 100).toFixed(0)}% sahədə fərqlənir.`}
        >
          {(s) => (
            <g>
              <g clipPath={`url(#${s.clipId})`}>
                <DecisionRegions tree={tree} s={s} xDomain={MOON_X} yDomain={MOON_Y} grid={80} opacity={0.22} />
              </g>
              {data.X.map(([p, q], i) => (
                <Marker key={i} cx={s.x(p!)} cy={s.y(q!)} cls={data.y[i]! ? 3 : 0} size={3} filled={subset.idx.has(i)} />
              ))}
            </g>
          )}
        </Plot>
      }
      controls={
        <>
          <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
            <Shuffle /> Başqa 80% alt-nümunə
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Alt-nümunə №" value={seed} />
            <Stat label="Yarpaq" value={stats.leaves} />
            <Stat label="Kök bölgüsü" value={`x${(tree.feature ?? 0) + 1} ≤ ${tree.threshold?.toFixed(2) ?? "—"}`} />
            <Stat label="Fərqli sahə" value={`${(disagreement * 100).toFixed(1)}%`} tone={disagreement > 0.1 ? "bad" : "neutral"} />
          </div>
          <LiveRegion>
            Boş dairələr bu ağacın görmədiyi 60 nöqtədir. Hər yeni alt-nümunə ilə bölgələr nəzərəçarpacaq dərəcədə dəyişir — kiçik məlumat fərqi böyük model
            fərqi yaradır. Fəsil 6-da bir çox belə ağacın ortalaması (təsadüfi meşə) bu dispersiyanı azaldacaq.
          </LiveRegion>
        </>
      }
    />
  );
}
