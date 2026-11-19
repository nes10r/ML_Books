"use client";

import { FastForward, Shuffle, StepForward } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { initCentroids, kMeansStep } from "@/lib/ml/clustering";
import { inertia, kMeansPlusPlusInit } from "@/lib/ml/clustering-advanced";
import { generateBlobs5 } from "@/lib/ml/datasets";
import { createRng } from "@/lib/ml/random";
import type { Point } from "@/lib/ml/regression";
import { clusterColor } from "./cluster-palette";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { Plot } from "./plot";

type Init = "random" | "kpp";

interface State {
  centroids: Point[];
  assignments?: number[];
  iteration: number;
  converged: boolean;
}

export default function KMeansStepsDemo() {
  const { points } = useMemo(() => generateBlobs5(), []);
  const [k, setK] = useState(5);
  const [init, setInit] = useState<Init>("random");
  const [seed, setSeed] = useState(4);
  const start = (kk: number, ii: Init, ss: number): State => ({
    centroids: ii === "kpp" ? kMeansPlusPlusInit(points, kk, createRng(ss)) : initCentroids(points, kk, createRng(ss)),
    iteration: 0,
    converged: false,
  });
  const [state, setState] = useState<State>(() => start(5, "random", 4));

  const restart = (kk = k, ii = init, ss = seed) => setState(start(kk, ii, ss));
  const step = () =>
    setState((s) => {
      if (s.converged) return s;
      const r = kMeansStep(points, s.centroids, s.assignments);
      return { centroids: r.centroids, assignments: r.assignments, iteration: s.iteration + 1, converged: r.converged };
    });
  const runAll = () =>
    setState((s) => {
      let cur = s;
      for (let i = 0; i < 100 && !cur.converged; i++) {
        const r = kMeansStep(points, cur.centroids, cur.assignments);
        cur = { centroids: r.centroids, assignments: r.assignments, iteration: cur.iteration + 1, converged: r.converged };
      }
      return cur;
    });

  const value = inertia(points, state.centroids);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="İnisializasiya"
          value={init}
          onChange={(v) => {
            setInit(v);
            restart(k, v, seed);
          }}
          options={[
            { value: "random", label: "Təsadüfi" },
            { value: "kpp", label: "k-means++" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <Plot
            height={380}
            xDomain={[-5.5, 5.5]}
            yDomain={[-3.5, 5.5]}
            xLabel="x₁"
            yLabel="x₂"
            formatX={(v) => v.toFixed(0)}
            formatY={(v) => v.toFixed(0)}
            ariaLabel={`k-means, k = ${k}, iterasiya ${state.iteration}, inertia ${value.toFixed(1)}.`}
          >
            {(s) => (
              <g>
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={s.x(p.x)}
                    cy={s.y(p.y)}
                    r={3}
                    fill={state.assignments ? clusterColor(state.assignments[i]!) : "var(--muted-foreground)"}
                    opacity={state.assignments ? 0.75 : 0.45}
                  />
                ))}
                {state.centroids.map((c, i) => (
                  <g key={i} transform={`translate(${s.x(c.x)} ${s.y(c.y)})`}>
                    <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="var(--surface)" strokeWidth={6} strokeLinecap="round" />
                    <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke={clusterColor(i)} strokeWidth={3} strokeLinecap="round" />
                  </g>
                ))}
              </g>
            )}
          </Plot>
        }
        controls={
          <>
            <SliderField
              label="Klaster sayı (k)"
              value={k}
              min={2}
              max={8}
              onChange={(v) => {
                setK(v);
                restart(v);
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={step} disabled={state.converged}>
                <StepForward /> Addım
              </Button>
              <Button size="sm" variant="outline" onClick={runAll} disabled={state.converged}>
                <FastForward /> Sona qədər
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSeed((s) => s + 1);
                  restart(k, init, seed + 1);
                }}
              >
                <Shuffle /> Yeni başlanğıc
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="İterasiya" value={state.iteration} />
              <Stat label="Vəziyyət" value={state.converged ? "Yığıldı" : "Davam edir"} tone={state.converged ? "good" : "neutral"} />
              <Stat label="Inertia" value={value.toFixed(1)} />
              <Stat label="Başlanğıc №" value={seed} />
            </div>
            <LiveRegion>
              Hər addım iki hissədən ibarətdir: nöqtələr ən yaxın mərkəzə bağlanır, sonra mərkəzlər öz nöqtələrinin ortasına köçür. Təsadüfi başlanğıcla bəzən
              iki mərkəz bir qrupa düşür və alqoritm pis yerli minimumda “ilişir” — “Yeni başlanğıc” ilə yoxlayın, sonra k-means++ ilə müqayisə edin.
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
