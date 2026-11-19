"use client";

import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import { generateGdData } from "@/lib/ml/datasets";
import { constantSchedule, decaySchedule, miniBatchGradientDescent, mse, olsTheta, type Theta } from "@/lib/ml/gradient-descent";
import { createRng } from "@/lib/ml/random";
import { mean, std } from "@/lib/ml/stats";
import { CostSurface, LossCurve } from "./cost-surface";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";

const VARIANTS = [
  { key: "batch", label: "Paket (m = 50)", batch: 50, color: "var(--chart-1)" },
  { key: "mini", label: "Mini-paket (8)", batch: 8, color: "var(--chart-3)" },
  { key: "sgd", label: "Stoxastik (1)", batch: 1, color: "var(--chart-4)" },
] as const;

export default function GdVariantsDemo() {
  const points = useMemo(() => {
    const raw = generateGdData();
    const xs = raw.map((p) => p.x);
    const mu = mean(xs);
    const sd = std(xs);
    return raw.map((p) => ({ x: (p.x - mu) / sd, y: p.y }));
  }, []);
  const optimum = useMemo(() => olsTheta(points), [points]);
  const xDomain = useMemo<[number, number]>(() => [optimum.t0 - 7, optimum.t0 + 7], [optimum]);
  const yDomain = useMemo<[number, number]>(() => [optimum.t1 - 7, optimum.t1 + 7], [optimum]);
  const [epochs, setEpochs] = useState(3);
  const [schedule, setSchedule] = useState(true);
  const [seed, setSeed] = useState(1);
  const eta0 = 0.1;
  const start = useMemo<Theta>(() => ({ t0: optimum.t0 - 6, t1: optimum.t1 - 5 }), [optimum]);

  const runs = useMemo(
    () =>
      VARIANTS.map((v) => {
        const sched = v.key !== "batch" && schedule ? decaySchedule(eta0, 30) : constantSchedule(eta0);
        const path = miniBatchGradientDescent(points, v.batch, sched, epochs, start, createRng(seed * 13 + v.batch));
        const final = path.at(-1)!;
        return { ...v, path, updates: path.length - 1, finalLoss: mse(points, final), losses: path.map((th) => mse(points, th)) };
      }),
    [points, epochs, schedule, seed, start],
  );
  const minLoss = mse(points, optimum);
  const maxLen = Math.max(...runs.map((r) => r.losses.length));

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <CostSurface
            points={points}
            xDomain={xDomain}
            yDomain={yDomain}
            optimum={optimum}
            paths={runs.map((r) => ({ key: r.key, path: r.path, color: r.color, label: r.label }))}
            ariaLabel={`Üç qradiyent enmə variantının ${epochs} epoxalıq yolları.`}
          />
          <Legend items={runs.map((r) => ({ label: r.label, swatch: <line x1={1} y1={7} x2={13} y2={7} stroke={r.color} strokeWidth={2.5} /> }))} />
          <p className="px-1 text-xs text-muted-foreground">Xərc / yeniləmə sayı (üfüqi ox stoxastik variantın yeniləmələrinə görədir)</p>
          <LossCurve
            series={runs.map((r) => ({
              key: r.key,
              color: r.color,
              // stretch shorter runs over the same epochs so curves are comparable per epoch
              values: Array.from({ length: maxLen }, (_, i) => r.losses[Math.min(r.losses.length - 1, Math.floor((i / (maxLen - 1)) * (r.losses.length - 1)))]!),
            }))}
          />
        </div>
      }
      controls={
        <>
          <SliderField label="Epoxa sayı" value={epochs} min={1} max={20} onChange={setEpochs} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
            <span>
              Öyrənmə cədvəli
              <span className="block text-xs text-muted-foreground">η(t) = η₀·30 / (t + 30) — addımlar tədricən kiçilir</span>
            </span>
          </label>
          <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
            <Shuffle /> Başqa təsadüfi sıra
          </Button>
          <div className="space-y-1.5">
            {runs.map((r) => (
              <div key={r.key} className="grid grid-cols-2 gap-2">
                <Stat label={`${r.label}: yeniləmə`} value={r.updates} />
                <Stat label="Artıq xərc" value={(r.finalLoss - minLoss).toFixed(4)} tone={r.finalLoss - minLoss < 0.01 ? "good" : "neutral"} />
              </div>
            ))}
          </div>
          <LiveRegion>
            Bir epoxada paket GD 1, mini-paket 7, stoxastik GD isə 50 yeniləmə edir. Stoxastik yol “titrəyir” və cədvəl olmadan minimumun ətrafında
            gəzməyə davam edir. Cədvəli söndürüb fərqə baxın.
          </LiveRegion>
        </>
      }
    />
  );
}
