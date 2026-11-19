"use client";

import { motion, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import { createStream } from "@/lib/ml/datasets";
import { predictLinear, sgdStep, type LinearModel, type Point } from "@/lib/ml/regression";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const VISIBLE = 30;
const ERROR_WINDOW = 15;
const INITIAL: LinearModel = { intercept: 0.5, slope: 0 };
const clampParam = (v: number) => Math.max(-20, Math.min(20, v));

interface Sample extends Point {
  index: number;
  drifted: boolean;
}

export default function OnlineLearningDemo() {
  const reduceMotion = useReducedMotion();
  const [learningRate, setLearningRate] = useState(0.2);
  const [drift, setDrift] = useState(false);
  const [running, setRunning] = useState(false);
  const [model, setModel] = useState<LinearModel>(INITIAL);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [errors, setErrors] = useState<number[]>([]);
  const streamRef = useRef(createStream(5, { drift: false }));
  const modelRef = useRef<LinearModel>(INITIAL);

  const reset = useCallback((nextDrift = drift) => {
    streamRef.current = createStream(5, { drift: nextDrift });
    modelRef.current = INITIAL;
    setModel(INITIAL);
    setSamples([]);
    setErrors([]);
    setRunning(false);
  }, [drift]);

  const step = useCallback(() => {
    const sample = streamRef.current();
    const current = modelRef.current;
    // Prequential evaluation: measure the error on the new sample *before* learning from it.
    const err = (predictLinear(current, sample.x) - sample.y) ** 2;
    const updated = sgdStep(current, sample, learningRate);
    const next = { intercept: clampParam(updated.intercept), slope: clampParam(updated.slope) };
    modelRef.current = next;
    setModel(next);
    setErrors((e) => [...e.slice(-199), err]);
    setSamples((s) => [...s.slice(-(VISIBLE - 1)), sample]);
  }, [learningRate]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, reduceMotion ? 450 : 220);
    return () => window.clearInterval(id);
  }, [running, step, reduceMotion]);

  const seen = samples.at(-1) ? samples.at(-1)!.index + 1 : 0;
  const recent = errors.slice(-ERROR_WINDOW);
  const rollingMse = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : null;
  const driftActive = drift && samples.at(-1)?.drifted;

  return (
    <DemoLayout
      plot={
        <>
          <Plot
            xDomain={[0, 1]}
            yDomain={[-0.2, 1.2]}
            xLabel="x (giriş)"
            yLabel="y (hədəf)"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`Onlayn öyrənmə: ${seen} nümunə görülüb. Cari model y = ${model.intercept.toFixed(2)} + ${model.slope.toFixed(2)}x.`}
          >
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  {samples.map((p, i) => {
                    const age = samples.length - 1 - i;
                    const opacity = Math.max(0.12, 1 - age / VISIBLE);
                    return (
                      <motion.circle
                        key={p.index}
                        cx={s.x(p.x)}
                        cy={s.y(p.y)}
                        initial={reduceMotion ? false : { r: 0 }}
                        animate={{ r: age === 0 ? 7 : 4.5 }}
                        transition={{ duration: 0.25 }}
                        fill={p.drifted ? "var(--chart-2)" : "var(--chart-1)"}
                        opacity={opacity}
                      />
                    );
                  })}
                  <path
                    d={linePath([{ x: 0, y: predictLinear(model, 0) }, { x: 1, y: predictLinear(model, 1) }], s)}
                    stroke="var(--foreground)"
                    strokeWidth={2.5}
                    fill="none"
                  />
                </g>
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Yeni nümunə (köhnələr solğunlaşır)", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--chart-1)" /> },
              { label: "Sürüşmədən sonrakı nümunə", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--chart-2)" /> },
              { label: "Cari model", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--foreground)" strokeWidth={2.5} /> },
            ]}
          />
          <ErrorSparkline errors={errors} />
        </>
      }
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setRunning((r) => !r)}>
              {running ? <Pause /> : <Play />}
              {running ? "Dayandır" : "Başlat"}
            </Button>
            <Button size="sm" variant="outline" onClick={step} disabled={running}>
              <StepForward /> Addım
            </Button>
            <Button size="sm" variant="ghost" onClick={() => reset()}>
              <RotateCcw /> Sıfırla
            </Button>
          </div>
          <SliderField
            label="Öyrənmə sürəti (η)"
            value={learningRate}
            min={0.02}
            max={1.5}
            step={0.02}
            onChange={setLearningRate}
            format={(v) => v.toFixed(2)}
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={drift}
              onChange={(e) => {
                setDrift(e.target.checked);
                reset(e.target.checked);
              }}
              className="mt-0.5 accent-[var(--primary)]"
            />
            <span>
              Konsept sürüşməsi
              <span className="block text-xs text-muted-foreground">60-cı nümunədən sonra əlaqə dəyişir</span>
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Görülən nümunə" value={seen} />
            <Stat label={`MSE (son ${ERROR_WINDOW})`} value={rollingMse === null ? "—" : rollingMse.toFixed(3)} tone={rollingMse !== null && rollingMse < 0.01 ? "good" : "neutral"} />
            <Stat label="θ₀" value={model.intercept.toFixed(3)} />
            <Stat label="θ₁" value={model.slope.toFixed(3)} />
          </div>
          <LiveRegion>
            {seen === 0
              ? "Model hələ heç bir nümunə görməyib."
              : driftActive
                ? "Sürüşmə baş verdi! Model köhnə əlaqəni unudub yenisinə uyğunlaşmalıdır."
                : learningRate > 1
                  ? "Öyrənmə sürəti çox böyükdür — model hər nümunəyə həddindən artıq reaksiya verir."
                  : "Model hər yeni nümunədən sonra bir addım yenilənir."}
          </LiveRegion>
        </>
      }
    />
  );
}

function ErrorSparkline({ errors }: { errors: number[] }) {
  const W = 640;
  const H = 70;
  if (errors.length < 2) {
    return <p className="px-1 pt-3 text-xs text-muted-foreground">Xəta qrafiki nümunələr gəldikcə görünəcək.</p>;
  }
  // Smoothed (moving average) error, log-ish scaled for readability.
  const smooth = errors.map((_, i) => {
    const w = errors.slice(Math.max(0, i - ERROR_WINDOW + 1), i + 1);
    return w.reduce((a, b) => a + b, 0) / w.length;
  });
  const max = Math.max(0.05, ...smooth);
  const d = smooth
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (smooth.length - 1)) * W).toFixed(1)},${(H - 4 - (Math.sqrt(v / max) * (H - 8))).toFixed(1)}`)
    .join(" ");
  return (
    <figure className="pt-3">
      <figcaption className="px-1 pb-1 text-xs text-muted-foreground">Proqnoz xətası zamanla (hamarlanmış)</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-md bg-surface-muted/60" role="img" aria-label="Zamanla xəta qrafiki">
        <path d={d} fill="none" stroke="var(--chart-4)" strokeWidth={2} />
      </svg>
    </figure>
  );
}
