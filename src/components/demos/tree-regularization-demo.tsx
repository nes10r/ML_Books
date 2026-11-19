"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { generateMoons } from "@/lib/ml/datasets";
import { fitClassificationTree, predictClass, treeStats, type ClassNode } from "@/lib/ml/tree";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Marker, Plot } from "./plot";
import { DecisionRegions } from "./tree-ui";

const X_DOMAIN = [-1.8, 2.8] as const;
const Y_DOMAIN = [-1.4, 1.9] as const;
const N_TRAIN = 210;

const accuracy = (tree: ClassNode, X: number[][], y: number[]) => y.filter((t, i) => predictClass(tree, X[i]!) === t).length / y.length;

export default function TreeRegularizationDemo() {
  const { Xtr, ytr, Xva, yva } = useMemo(() => {
    const d = generateMoons();
    return { Xtr: d.X.slice(0, N_TRAIN), ytr: d.y.slice(0, N_TRAIN), Xva: d.X.slice(N_TRAIN), yva: d.y.slice(N_TRAIN) };
  }, []);
  const [depthSetting, setDepthSetting] = useState(13); // 13 = None (unrestricted)
  const [minLeaf, setMinLeaf] = useState(1);
  const maxDepth = depthSetting >= 13 ? Infinity : depthSetting;

  const tree = useMemo(() => fitClassificationTree(Xtr, ytr, 2, { maxDepth, minSamplesLeaf: minLeaf }), [Xtr, ytr, maxDepth, minLeaf]);
  const stats = treeStats(tree);
  const trainAcc = accuracy(tree, Xtr, ytr);
  const valAcc = accuracy(tree, Xva, yva);

  const curve = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const t = fitClassificationTree(Xtr, ytr, 2, { maxDepth: i + 1, minSamplesLeaf: minLeaf });
        return { depth: i + 1, train: accuracy(t, Xtr, ytr), val: accuracy(t, Xva, yva) };
      }),
    [Xtr, ytr, Xva, yva, minLeaf],
  );

  const gap = trainAcc - valAcc;

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={330}
            xDomain={X_DOMAIN}
            yDomain={Y_DOMAIN}
            xLabel="x₁"
            yLabel="x₂"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`“Aylar” məlumatı və qərar ağacının bölgələri: dərinlik ${stats.depth}, ${stats.leaves} yarpaq. Təlim dəqiqliyi ${(trainAcc * 100).toFixed(0)}%, validasiya ${(valAcc * 100).toFixed(0)}%.`}
          >
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  <DecisionRegions tree={tree} s={s} xDomain={X_DOMAIN} yDomain={Y_DOMAIN} grid={80} opacity={0.2} />
                </g>
                {Xtr.map(([a, b], i) => (
                  <Marker key={`t${i}`} cx={s.x(a!)} cy={s.y(b!)} cls={ytr[i]! === 0 ? 0 : 3} size={3.4} />
                ))}
                {Xva.map(([a, b], i) => (
                  <Marker key={`v${i}`} cx={s.x(a!)} cy={s.y(b!)} cls={yva[i]! === 0 ? 0 : 3} size={3.4} filled={false} />
                ))}
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim nöqtəsi (dolu)", swatch: <circle cx={7} cy={7} r={4} fill="var(--foreground)" /> },
              { label: "Validasiya nöqtəsi (boş)", swatch: <circle cx={7} cy={7} r={4} fill="var(--surface)" stroke="var(--foreground)" strokeWidth={1.5} /> },
            ]}
          />
          <Plot
            height={190}
            xDomain={[1, 12]}
            yDomain={[0.7, 1.01]}
            xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            xLabel="max_depth"
            yLabel="Dəqiqlik"
            formatY={(v) => v.toFixed(2)}
            ariaLabel="Təlim və validasiya dəqiqliyinin max_depth-ə görə dəyişməsi"
          >
            {(s) => (
              <g>
                <path d={linePath(curve.map((c) => ({ x: c.depth, y: c.train })), s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                <path d={linePath(curve.map((c) => ({ x: c.depth, y: c.val })), s)} stroke="var(--chart-4)" strokeWidth={2} fill="none" />
                {Number.isFinite(maxDepth) && <line x1={s.x(maxDepth)} x2={s.x(maxDepth)} y1={s.y(0.7)} y2={s.y(1.01)} stroke="var(--foreground)" strokeOpacity={0.4} />}
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              { label: "Validasiya", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
            ]}
          />
        </div>
      }
      controls={
        <>
          <SliderField label="max_depth" value={depthSetting} min={1} max={13} onChange={setDepthSetting} format={(v) => (v >= 13 ? "None" : String(v))} />
          <SliderField label="min_samples_leaf" value={minLeaf} min={1} max={30} onChange={setMinLeaf} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Dərinlik" value={stats.depth} />
            <Stat label="Yarpaq" value={stats.leaves} />
            <Stat label="Təlim dəqiqliyi" value={`${(trainAcc * 100).toFixed(1)}%`} />
            <Stat label="Validasiya" value={`${(valAcc * 100).toFixed(1)}%`} tone={gap > 0.06 ? "bad" : "good"} />
          </div>
          <LiveRegion>
            {gap > 0.06
              ? "Təlim dəqiqliyi validasiyadan xeyli yüksəkdir — ağac küyü əzbərləyir (overfitting). Ada-ada xırda bölgələrə baxın."
              : trainAcc < 0.85
                ? "Ağac çox sadədir — “ayların” formasını tuta bilmir (underfitting)."
                : "Məhdudiyyətlər işləyir: sərhəd daha hamar, təlim və validasiya nəticələri bir-birinə yaxındır."}
          </LiveRegion>
        </>
      }
    />
  );
}
