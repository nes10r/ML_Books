"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { covarianceEllipse, emStep, initMixture, kMeansPlusPlusInit, mixtureDensity, type Gaussian2D } from "@/lib/ml/clustering-advanced";
import { generateMixtureData } from "@/lib/ml/datasets";
import { createRng } from "@/lib/ml/random";
import type { Point } from "@/lib/ml/regression";
import { quantile } from "@/lib/ml/stats";
import { clusterColor } from "./cluster-palette";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const EM_ITERATIONS = 150;

function fitGmm(points: Point[], k: number): { model: Gaussian2D[]; logLikelihood: number } {
  // best of 3 k-means++-seeded runs (higher log-likelihood wins)
  let best: { model: Gaussian2D[]; logLikelihood: number } | null = null;
  for (let s = 1; s <= 3; s++) {
    let model = initMixture(kMeansPlusPlusInit(points, k, createRng(k * 17 + s)));
    let ll = -Infinity;
    for (let i = 0; i < EM_ITERATIONS; i++) {
      const r = emStep(points, model);
      model = r.model;
      if (Math.abs(r.logLikelihood - ll) < 1e-6) break;
      ll = r.logLikelihood;
    }
    ll = points.reduce((sum, p) => sum + Math.log(mixtureDensity(model, p)), 0);
    if (!best || ll > best.logLikelihood) best = { model, logLikelihood: ll };
  }
  return best!;
}

/** BIC = −2·log L + p·ln m, with p = 6k − 1 free parameters for 2-D full-covariance mixtures. */
const bic = (ll: number, k: number, m: number) => -2 * ll + (6 * k - 1) * Math.log(m);

export default function GmmAnomalyDemo() {
  const points = useMemo(() => generateMixtureData(), []);
  const fits = useMemo(() => [1, 2, 3, 4, 5].map((k) => fitGmm(points, k)), [points]);
  const [k, setK] = useState(3);
  const [percent, setPercent] = useState(2);
  const { model, logLikelihood } = fits[k - 1]!;
  const bics = fits.map((f, i) => bic(f.logLikelihood, i + 1, points.length));
  const bestK = bics.indexOf(Math.min(...bics)) + 1;

  const densities = useMemo(() => points.map((p) => Math.log(mixtureDensity(model, p))), [points, model]);
  const threshold = quantile(densities, percent / 100);
  const anomalies = densities.filter((d) => d < threshold).length;

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={360}
            xDomain={[-5, 9]}
            yDomain={[-5, 7]}
            xLabel="x₁"
            yLabel="x₂"
            formatX={(v) => v.toFixed(0)}
            formatY={(v) => v.toFixed(0)}
            ariaLabel={`${k} komponentli Qauss qarışığı, ${anomalies} anomaliya (sıxlığı ən aşağı ${percent}%).`}
          >
            {(s) => (
              <g>
                {model.map((g, j) => {
                  // Build the ellipse in data units, then map to pixels with one transform
                  // (scale handles unequal axis scales and the flipped y axis).
                  const e = covarianceEllipse(g.cov);
                  const sx = s.x(1) - s.x(0);
                  const sy = s.y(0) - s.y(1);
                  return (
                    <g
                      key={j}
                      transform={`translate(${s.x(g.mean[0])} ${s.y(g.mean[1])}) scale(${sx} ${-sy}) rotate(${(e.angle * 180) / Math.PI})`}
                    >
                      {[1, 2].map((m) => (
                        <ellipse
                          key={m}
                          rx={e.rx * m}
                          ry={e.ry * m}
                          fill={m === 1 ? clusterColor(j) : "none"}
                          fillOpacity={0.1}
                          stroke={clusterColor(j)}
                          strokeWidth={m === 1 ? 2 : 1.2}
                          strokeDasharray={m === 2 ? "5 4" : undefined}
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </g>
                  );
                })}
                {points.map((p, i) =>
                  densities[i]! < threshold ? (
                    <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={5.5} fill="none" stroke="var(--danger)" strokeWidth={2.2} />
                  ) : (
                    <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={2.6} fill="var(--foreground)" opacity={0.45} />
                  ),
                )}
                {model.map((g, j) => (
                  <circle key={`m${j}`} cx={s.x(g.mean[0])} cy={s.y(g.mean[1])} r={4.5} fill={clusterColor(j)} stroke="var(--surface)" strokeWidth={2} />
                ))}
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "1σ və 2σ ellipsləri", swatch: <ellipse cx={7} cy={7} rx={6} ry={3.5} fill="none" stroke="var(--chart-1)" strokeWidth={1.8} /> },
              { label: "Anomaliya (aşağı sıxlıq)", swatch: <circle cx={7} cy={7} r={4.5} fill="none" stroke="var(--danger)" strokeWidth={2} /> },
            ]}
          />
          <Plot height={150} xDomain={[1, 5]} yDomain={[Math.min(...bics) * 0.98, Math.max(...bics) * 1.01]} xTicks={[1, 2, 3, 4, 5]} xLabel="Komponent sayı" yLabel="BIC" formatY={(v) => v.toFixed(0)} ariaLabel="BIC-in komponent sayından asılılığı">
            {(s) => (
              <g>
                <path d={linePath(bics.map((b, i) => ({ x: i + 1, y: b })), s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                {bics.map((b, i) => (
                  <circle key={i} cx={s.x(i + 1)} cy={s.y(b)} r={i + 1 === k ? 5 : 3} fill={i + 1 === bestK ? "var(--success)" : "var(--chart-1)"} />
                ))}
              </g>
            )}
          </Plot>
        </div>
      }
      controls={
        <>
          <SliderField label="Komponent sayı" value={k} min={1} max={5} onChange={setK} />
          <SliderField label="Anomaliya həddi (ən aşağı sıxlıq)" value={percent} min={1} max={10} step={0.5} onChange={setPercent} format={(v) => `${v}%`} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Log likelihood" value={logLikelihood.toFixed(1)} />
            <Stat label="BIC" value={bics[k - 1]!.toFixed(1)} tone={k === bestK ? "good" : "neutral"} />
            <Stat label="Anomaliya" value={anomalies} />
            <Stat label="Ən kiçik BIC" value={`k = ${bestK}`} tone="good" />
          </div>
          <div className="space-y-1 text-xs">
            {model.map((g, j) => (
              <p key={j} className="font-mono">
                <span style={{ color: clusterColor(j) }}>●</span> çəki {g.weight.toFixed(2)}, orta ({g.mean[0].toFixed(1)}, {g.mean[1].toFixed(1)})
              </p>
            ))}
          </div>
          <LiveRegion>
            EM alqoritmi hər nöqtənin hər komponentə aid olma ehtimalını hesablayır (E-addımı), sonra komponentlərin çəkisini, ortasını və formasını yeniləyir
            (M-addımı). Klasterlər dəyirmi olmaya bilər — ellipslər hər klasterin formasını öyrənir. Sıxlığı ən aşağı olan nöqtələr anomaliya sayılır.
          </LiveRegion>
        </>
      }
    />
  );
}
