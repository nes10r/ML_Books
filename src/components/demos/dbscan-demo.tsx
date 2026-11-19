"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { kMeansPlusPlusInit, runKMeans, dbscan } from "@/lib/ml/clustering-advanced";
import { generateMoons } from "@/lib/ml/datasets";
import { createRng } from "@/lib/ml/random";
import { clusterColor } from "./cluster-palette";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { Plot } from "./plot";

type Algo = "dbscan" | "kmeans";

export default function DbscanDemo() {
  const points = useMemo(() => generateMoons(42, 300, 0.06).X.map(([x, y]) => ({ x: x!, y: y! })), []);
  const [algo, setAlgo] = useState<Algo>("dbscan");
  const [eps, setEps] = useState(0.1);
  const [minSamples, setMinSamples] = useState(5);

  const db = useMemo(() => dbscan(points, eps, minSamples), [points, eps, minSamples]);
  const km = useMemo(() => runKMeans(points, kMeansPlusPlusInit(points, 2, createRng(3))), [points]);
  const noise = db.labels.filter((l) => l === -1).length;
  const nCore = db.core.filter(Boolean).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Alqoritm"
          value={algo}
          onChange={setAlgo}
          options={[
            { value: "dbscan", label: "DBSCAN" },
            { value: "kmeans", label: "k-means (k = 2)" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <>
            <Plot
              height={340}
              xDomain={[-1.4, 2.4]}
              yDomain={[-0.8, 1.3]}
              xLabel="x₁"
              yLabel="x₂"
              formatX={(v) => v.toFixed(1)}
              formatY={(v) => v.toFixed(1)}
              ariaLabel={
                algo === "dbscan"
                  ? `DBSCAN, eps = ${eps}, min_samples = ${minSamples}: ${db.nClusters} klaster, ${noise} küy nöqtəsi.`
                  : "k-means iki klaster: aylar düz xətt boyunca kəsilir."
              }
            >
              {(s) => (
                <g>
                  {algo === "dbscan" &&
                    points.map((p, i) =>
                      db.core[i] ? <circle key={`e${i}`} cx={s.x(p.x)} cy={s.y(p.y)} r={Math.abs(s.x(eps) - s.x(0))} fill={clusterColor(db.labels[i]!)} opacity={0.05} /> : null,
                    )}
                  {points.map((p, i) => {
                    if (algo === "kmeans") return <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3.4} fill={clusterColor(km.assignments[i]!)} />;
                    const label = db.labels[i]!;
                    if (label === -1)
                      return <path key={i} d={`M${s.x(p.x) - 3},${s.y(p.y) - 3} l6,6 m0,-6 l-6,6`} stroke="var(--muted-foreground)" strokeWidth={1.6} />;
                    return db.core[i] ? (
                      <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3.4} fill={clusterColor(label)} />
                    ) : (
                      <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3.4} fill="var(--surface)" stroke={clusterColor(label)} strokeWidth={1.8} />
                    );
                  })}
                </g>
              )}
            </Plot>
            {algo === "dbscan" && (
              <Legend
                items={[
                  { label: "Əsas nöqtə (core)", swatch: <circle cx={7} cy={7} r={4} fill="var(--chart-1)" /> },
                  { label: "Sərhəd nöqtəsi", swatch: <circle cx={7} cy={7} r={4} fill="var(--surface)" stroke="var(--chart-1)" strokeWidth={1.8} /> },
                  { label: "Küy (anomaliya)", swatch: <path d="M3,3 l8,8 m0,-8 l-8,8" stroke="var(--muted-foreground)" strokeWidth={1.6} /> },
                ]}
              />
            )}
          </>
        }
        controls={
          algo === "dbscan" ? (
            <>
              <SliderField label="ε (qonşuluq radiusu)" value={eps} min={0.03} max={0.5} step={0.01} onChange={setEps} format={(v) => v.toFixed(2)} />
              <SliderField label="min_samples" value={minSamples} min={2} max={20} onChange={setMinSamples} />
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Klaster" value={db.nClusters} tone={db.nClusters === 2 ? "good" : "neutral"} />
                <Stat label="Küy nöqtəsi" value={noise} />
                <Stat label="Əsas nöqtə" value={nCore} />
                <Stat label="Sərhəd nöqtəsi" value={points.length - nCore - noise} />
              </div>
              <LiveRegion>
                ε radiuslu qonşuluğunda ən azı min_samples nöqtə olan nöqtələr <b>əsas</b> nöqtələrdir. Bir-birinin qonşuluğunda olan əsas nöqtələr bir
                klaster təşkil edir; heç bir klasterə çatmayan nöqtələr küy sayılır. Kiçik ε → çoxlu klaster və küy, böyük ε → hər şey bir klaster.
              </LiveRegion>
            </>
          ) : (
            <LiveRegion>
              k-means hər klasteri bir mərkəz ətrafında “dəyirmi” qrup kimi təsəvvür edir, ona görə də iç-içə keçmiş ayları düz xətt boyunca kəsir. Belə
              formalar üçün sıxlığa əsaslanan DBSCAN daha uyğundur.
            </LiveRegion>
          )
        }
      />
    </div>
  );
}
