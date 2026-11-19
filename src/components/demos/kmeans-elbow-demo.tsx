"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { kMeansPlusPlusInit, runKMeans, silhouetteScore } from "@/lib/ml/clustering-advanced";
import { generateBlobs5 } from "@/lib/ml/datasets";
import { createRng } from "@/lib/ml/random";
import { clusterColor } from "./cluster-palette";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const KS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function KMeansElbowDemo() {
  const { points } = useMemo(() => generateBlobs5(), []);
  const results = useMemo(
    () =>
      KS.map((k) => {
        // best of 3 k-means++ runs, like n_init in scikit-learn
        const runs = [1, 2, 3].map((s) => runKMeans(points, kMeansPlusPlusInit(points, k, createRng(k * 31 + s))));
        const best = runs.reduce((a, b) => (b.inertia < a.inertia ? b : a));
        return { k, ...best, silhouette: k > 1 ? silhouetteScore(points, best.assignments) : NaN };
      }),
    [points],
  );
  const [k, setK] = useState(3);
  const cur = results[k - 1]!;
  const bestSil = results.slice(1).reduce((a, b) => (b.silhouette > a.silhouette ? b : a));
  const maxInertia = results[0]!.inertia;

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot height={300} xDomain={[-5.5, 5.5]} yDomain={[-3.5, 5.5]} xLabel="x₁" yLabel="x₂" formatX={(v) => v.toFixed(0)} formatY={(v) => v.toFixed(0)} ariaLabel={`k = ${k} ilə klasterlər. Silhouette ${cur.silhouette.toFixed(3)}.`}>
            {(s) => (
              <g>
                {points.map((p, i) => (
                  <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3} fill={clusterColor(cur.assignments[i]!)} opacity={0.75} />
                ))}
              </g>
            )}
          </Plot>
          <div className="grid gap-3 sm:grid-cols-2">
            <Plot height={190} xDomain={[1, 10]} yDomain={[0, maxInertia * 1.05]} xTicks={KS} xLabel="k" yLabel="Inertia" formatY={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v.toFixed(0))} ariaLabel="Inertia-nın k-dan asılılığı (dirsək qrafiki)">
              {(s) => (
                <g>
                  <path d={linePath(results.map((r) => ({ x: r.k, y: r.inertia })), s)} stroke="var(--chart-1)" strokeWidth={2.2} fill="none" />
                  {results.map((r) => (
                    <circle key={r.k} cx={s.x(r.k)} cy={s.y(r.inertia)} r={r.k === k ? 5 : 3} fill={r.k === k ? "var(--chart-4)" : "var(--chart-1)"} />
                  ))}
                </g>
              )}
            </Plot>
            <Plot height={190} xDomain={[1, 10]} yDomain={[0.3, 0.8]} xTicks={KS} xLabel="k" yLabel="Silhouette" formatY={(v) => v.toFixed(1)} ariaLabel="Silhouette balının k-dan asılılığı">
              {(s) => (
                <g>
                  <path d={linePath(results.slice(1).map((r) => ({ x: r.k, y: r.silhouette })), s)} stroke="var(--chart-3)" strokeWidth={2.2} fill="none" />
                  {results.slice(1).map((r) => (
                    <circle key={r.k} cx={s.x(r.k)} cy={s.y(r.silhouette)} r={r.k === k ? 5 : 3} fill={r.k === bestSil.k ? "var(--success)" : r.k === k ? "var(--chart-4)" : "var(--chart-3)"} />
                  ))}
                </g>
              )}
            </Plot>
          </div>
        </div>
      }
      controls={
        <>
          <SliderField label="Klaster sayı (k)" value={k} min={1} max={10} onChange={setK} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Inertia" value={cur.inertia.toFixed(1)} />
            <Stat label="Silhouette" value={k > 1 ? cur.silhouette.toFixed(3) : "—"} tone={k === bestSil.k ? "good" : "neutral"} />
            <Stat label="Ən yaxşı silhouette" value={`k = ${bestSil.k}`} tone="good" />
            <Stat label="Həqiqi qrup sayı" value="5" />
          </div>
          <LiveRegion>
            Inertia k artdıqca <b>həmişə</b> azalır — ona görə ən kiçik inertia-nı seçmək olmaz. “Dirsək” (əyrinin kəskin əyildiyi yer) ipucu verir.
            Silhouette balı isə hər nöqtənin öz klasterinə nə qədər yaxın, qonşu klasterdən nə qədər uzaq olduğunu ölçür və ən yüksək qiymət yaxşı k-ya
            işarə edir.
          </LiveRegion>
        </>
      }
    />
  );
}
