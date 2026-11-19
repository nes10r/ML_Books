"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import { generateExamData } from "@/lib/ml/datasets";
import { logisticGDSteps, logLoss, predictProba, type LogisticModel } from "@/lib/ml/logistic";
import { mean, std } from "@/lib/ml/stats";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { Plot } from "./plot";

const GRID = 30;
const STEPS_PER_TICK = 10;
const ETA = 0.5;
const INITIAL: LogisticModel = { bias: 0, weights: [0, 0] };

export default function LogisticBoundaryDemo() {
  const data = useMemo(() => generateExamData(), []);
  const stats = useMemo(() => {
    const cols = [0, 1].map((j) => data.X.map((r) => r[j]!));
    return { mu: cols.map(mean), sd: cols.map(std) };
  }, [data]);
  const Z = useMemo(() => data.X.map((r) => r.map((v, j) => (v - stats.mu[j]!) / stats.sd[j]!)), [data, stats]);

  const [model, setModel] = useState<LogisticModel>(INITIAL);
  const [iterations, setIterations] = useState(0);
  const [running, setRunning] = useState(false);
  const [logLambda, setLogLambda] = useState(-3);
  const lambda = logLambda <= -3 ? 0 : 10 ** logLambda;

  const MAX_ITER = 600;
  const active = running && iterations < MAX_ITER;
  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => {
      setModel((m) => logisticGDSteps(m, Z, data.y, ETA, lambda, STEPS_PER_TICK));
      setIterations((i) => i + STEPS_PER_TICK);
    }, 50);
    return () => window.clearTimeout(id);
  }, [active, iterations, Z, data.y, lambda]);

  const z = (x: number[]) => x.map((v, j) => (v - stats.mu[j]!) / stats.sd[j]!);
  const prob = (study: number, sleep: number) => predictProba(model, z([study, sleep]));
  const loss = logLoss(model, Z, data.y);
  const acc = data.y.filter((t, i) => (predictProba(model, Z[i]!) >= 0.5 ? 1 : 0) === t).length / data.y.length;

  // Boundary θ₀ + θ₁z₁ + θ₂z₂ = 0 in original units: sleep as a function of study.
  const [w1, w2] = model.weights as [number, number];
  const boundarySleep = (study: number) => stats.mu[1]! + (stats.sd[1]! * (-model.bias - w1 * ((study - stats.mu[0]!) / stats.sd[0]!))) / w2;

  const reset = () => {
    setModel(INITIAL);
    setIterations(0);
    setRunning(false);
  };

  return (
    <DemoLayout
      plot={
        <>
          <Plot
            height={380}
            xDomain={[0, 10]}
            yDomain={[4, 9]}
            xLabel="Həftəlik oxuma saatı"
            yLabel="Yuxu saatı"
            formatX={(v) => v.toFixed(0)}
            formatY={(v) => v.toFixed(0)}
            ariaLabel={`İmtahan məlumatı: ${data.y.length} tələbə. Logistik reqressiya ${iterations} iterasiyadan sonra dəqiqlik ${(acc * 100).toFixed(0)}%.`}
          >
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  {Array.from({ length: GRID * GRID }, (_, k) => {
                    const i = k % GRID;
                    const j = Math.floor(k / GRID);
                    const study = (i + 0.5) * (10 / GRID);
                    const sleep = 4 + (j + 0.5) * (5 / GRID);
                    const p = prob(study, sleep);
                    return (
                      <rect
                        key={k}
                        x={s.x(i * (10 / GRID))}
                        y={s.y(4 + (j + 1) * (5 / GRID))}
                        width={s.innerWidth / GRID + 0.6}
                        height={s.innerHeight / GRID + 0.6}
                        fill={`color-mix(in oklch, var(--chart-1) ${Math.round(p * 100)}%, var(--chart-4))`}
                        opacity={0.22}
                      />
                    );
                  })}
                  {iterations > 0 && Math.abs(w2) > 1e-9 && (
                    <line x1={s.x(0)} y1={s.y(boundarySleep(0))} x2={s.x(10)} y2={s.y(boundarySleep(10))} stroke="var(--foreground)" strokeWidth={2.5} strokeDasharray="6 4" />
                  )}
                </g>
                {data.X.map(([study, sleep], i) => (
                  <circle
                    key={i}
                    cx={s.x(study!)}
                    cy={s.y(sleep!)}
                    r={4}
                    fill={data.y[i] ? "var(--chart-1)" : "var(--surface)"}
                    stroke={data.y[i] ? "var(--chart-1)" : "var(--chart-4)"}
                    strokeWidth={1.8}
                  />
                ))}
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Keçdi", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--chart-1)" /> },
              { label: "Keçmədi", swatch: <circle cx={7} cy={7} r={4} fill="var(--surface)" stroke="var(--chart-4)" strokeWidth={2} /> },
              { label: "Qərar sərhədi (p = 0.5)", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--foreground)" strokeWidth={2} strokeDasharray="3 2" /> },
            ]}
          />
        </>
      }
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setRunning(!active)} disabled={iterations >= MAX_ITER}>
              {active ? <Pause /> : <Play />}
              {active ? "Dayandır" : "Öyrət"}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw /> Sıfırla
            </Button>
          </div>
          <SliderField
            label="ℓ₂ requlyarlaşdırma (λ)"
            value={logLambda}
            min={-3}
            max={0.5}
            step={0.1}
            onChange={(v) => {
              setLogLambda(v);
              reset();
            }}
            format={(v) => (v <= -3 ? "0" : (10 ** v).toPrecision(2))}
          />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="İterasiya" value={iterations} />
            <Stat label="Log itki" value={loss.toFixed(3)} />
            <Stat label="Dəqiqlik" value={`${(acc * 100).toFixed(1)}%`} />
            <Stat label="p(5 saat, 7 saat)" value={prob(5, 7).toFixed(2)} />
          </div>
          <LiveRegion>
            {iterations === 0
              ? "Başlanğıcda bütün çəkilər sıfırdır: model hər tələbə üçün p = 0.5 deyir (log itki = ln 2 ≈ 0.693). “Öyrət” düyməsini basın."
              : "Fonun rəngi keçmə ehtimalını göstərir. Sərhəd düz xəttdir: logistik reqressiya xətti təsnifatçıdır. λ-nı artırdıqda keçid bulanıqlaşır — model daha az əmin olur."}
          </LiveRegion>
        </>
      }
    />
  );
}
