"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { FRUIT_NAMES, generateFruits } from "@/lib/ml/datasets";
import { decisionPath, fitClassificationTree, predictProba, treeStats, type ClassCriterion } from "@/lib/ml/tree";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { Marker, Plot } from "./plot";
import { DecisionRegions, TreeDiagram } from "./tree-ui";

const X_DOMAIN = [3.5, 11] as const;
const Y_DOMAIN = [0, 500] as const;
const FEATURES = ["diametr", "çəki"] as const;

export default function TreeBuilderDemo() {
  const data = useMemo(() => generateFruits(), []);
  const [depth, setDepth] = useState(2);
  const [minLeaf, setMinLeaf] = useState(1);
  const [criterion, setCriterion] = useState<ClassCriterion>("gini");
  const [query, setQuery] = useState<[number, number]>([7, 120]);

  const tree = useMemo(
    () => fitClassificationTree(data.X, data.y, 3, { maxDepth: depth, minSamplesLeaf: minLeaf, criterion }),
    [data, depth, minLeaf, criterion],
  );
  const stats = treeStats(tree);
  const path = useMemo(() => decisionPath(tree, query), [tree, query]);
  const pathIds = useMemo(() => new Set(path.map((n) => n.id)), [path]);
  const proba = predictProba(tree, query);
  const leaf = path.at(-1)!;
  const trainAcc = data.y.filter((t, i) => decisionPath(tree, data.X[i]!).at(-1)!.prediction === t).length / data.y.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Qeyri-müəyyənlik ölçüsü"
          value={criterion}
          onChange={setCriterion}
          options={[
            { value: "gini", label: "Gini" },
            { value: "entropy", label: "Entropiya" },
          ]}
        />
        <p className="text-xs text-muted-foreground">Proqnoz yolunu görmək üçün qrafikə klikləyin</p>
      </div>
      <DemoLayout
        plot={
          <div className="space-y-3">
            <Plot
              height={340}
              xDomain={X_DOMAIN}
              yDomain={Y_DOMAIN}
              xLabel="Diametr (sm)"
              yLabel="Çəki (q)"
              formatX={(v) => v.toFixed(0)}
              ariaLabel={`Meyvələr: ${data.y.length} nümunə və dərinliyi ${stats.depth} olan qərar ağacının bölgələri. Seçilmiş nöqtə ${FRUIT_NAMES[leaf.prediction]} kimi təsnif olunur.`}
              onDataClick={(p) => setQuery([p.x, p.y])}
            >
              {(s) => (
                <g>
                  <g clipPath={`url(#${s.clipId})`}>
                    <DecisionRegions tree={tree} s={s} xDomain={X_DOMAIN} yDomain={Y_DOMAIN} />
                  </g>
                  {data.X.map(([d, w], i) => (
                    <Marker key={i} cx={s.x(d!)} cy={s.y(w!)} cls={data.y[i]!} size={3.6} />
                  ))}
                  <circle cx={s.x(query[0])} cy={s.y(query[1])} r={8} fill="var(--foreground)" stroke="var(--surface)" strokeWidth={2.5} />
                </g>
              )}
            </Plot>
            <Legend items={FRUIT_NAMES.map((n, i) => ({ label: n, swatch: <Marker cx={7} cy={7} cls={i} size={4.5} /> }))} />
            <TreeDiagram root={tree} featureNames={FEATURES} classNames={FRUIT_NAMES} pathIds={pathIds} />
          </div>
        }
        controls={
          <>
            <SliderField label="max_depth" value={depth} min={1} max={10} onChange={setDepth} />
            <SliderField label="min_samples_leaf" value={minLeaf} min={1} max={25} onChange={setMinLeaf} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Dərinlik" value={stats.depth} />
              <Stat label="Yarpaq" value={stats.leaves} />
              <Stat label="Təlim dəqiqliyi" value={`${(trainAcc * 100).toFixed(1)}%`} />
              <Stat label="Yarpaqdakı nümunə" value={leaf.samples} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Nöqtə ({query[0].toFixed(1)} sm, {query[1].toFixed(0)} q) üçün ehtimallar
              </p>
              <ul className="space-y-1 text-xs">
                {FRUIT_NAMES.map((n, k) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="w-14">{n}</span>
                    <span className="relative h-2.5 flex-1 rounded-full bg-surface-muted">
                      <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${proba[k]! * 100}%`, background: `var(--chart-${k + 1})` }} />
                    </span>
                    <span className="w-10 text-right font-mono tabular-nums">{proba[k]!.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <LiveRegion>
              Proqnoz: <b>{FRUIT_NAMES[leaf.prediction]}</b>. Ehtimal yarpaqdakı nümunələrin payıdır: [{leaf.counts.join(", ")}] / {leaf.samples}. Yarpaq
              daxilində bütün nöqtələr eyni ehtimalı alır.
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
