"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import { generateGdData } from "@/lib/ml/datasets";
import { batchGradientDescent, mse, olsTheta, type Theta } from "@/lib/ml/gradient-descent";
import { mean, std } from "@/lib/ml/stats";
import { CostSurface, LossCurve } from "./cost-surface";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";

const MAX_STEPS = 200;

export default function GradientDescentDemo() {
  const raw = useMemo(() => generateGdData(), []);
  const [scaled, setScaled] = useState(false);
  const [logEta, setLogEta] = useState(-2.3);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const eta = 10 ** logEta;

  const points = useMemo(() => {
    if (!scaled) return raw;
    const xs = raw.map((p) => p.x);
    const mu = mean(xs);
    const sd = std(xs);
    return raw.map((p) => ({ x: (p.x - mu) / sd, y: p.y }));
  }, [raw, scaled]);

  const optimum = useMemo(() => olsTheta(points), [points]);
  const xDomain = useMemo<[number, number]>(() => [optimum.t0 - 7, optimum.t0 + 7], [optimum]);
  const yDomain = useMemo<[number, number]>(
    () => (scaled ? [optimum.t1 - 7, optimum.t1 + 7] : [optimum.t1 - 1.6, optimum.t1 + 1.6]),
    [optimum, scaled],
  );
  const start = useMemo<Theta>(
    () => (scaled ? { t0: optimum.t0 - 6, t1: optimum.t1 - 5 } : { t0: optimum.t0 - 6, t1: optimum.t1 + 1.3 }),
    [optimum, scaled],
  );

  const path = useMemo(() => batchGradientDescent(points, eta, MAX_STEPS, start), [points, eta, start]);
  const diverged = path.length < MAX_STEPS + 1;
  const visible = path.slice(0, Math.min(shown, path.length - 1) + 1);
  const current = visible.at(-1)!;
  const losses = visible.map((th) => mse(points, th));
  const minLoss = mse(points, optimum);

  // "Active" is derived, so reaching the end stops the animation without an extra state update.
  const active = running && shown < path.length - 1;
  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), 60);
    return () => window.clearTimeout(id);
  }, [active, shown]);

  const reset = () => {
    setShown(0);
    setRunning(false);
  };

  const gap = losses.at(-1)! - minLoss;
  const finished = shown >= path.length - 1;
  const message = diverged
    ? "Öyrənmə sürəti çox böyükdür: hər addım minimumdan daha uzağa atır və xərc sonsuzluğa gedir."
    : shown === 0
      ? "“Başlat” düyməsini basın: hər addımda θ xərc funksiyasının ən dik eniş istiqamətində hərəkət edir."
      : gap < 1e-3
        ? "Minimuma çatdıq (×)."
        : finished && !scaled
          ? "Miqyaslanmamış əlamətdə η ≈ 0.03-dən böyük olduqda uzaqlaşma başlayır, kiçik η ilə isə θ dar “dərə” boyu çox yavaş irəliləyir. Əlaməti standartlaşdırın və η-nı artırın."
          : finished
            ? "η çox kiçikdir: 200 addımda minimuma çatmaq olmur. Standartlaşdırılmış əlamətdə η = 0.1–0.6 həm sürətli, həm dayanıqlıdır."
            : `Minimuma qədər xərc fərqi: ${gap.toFixed(3)}`;

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <CostSurface
            points={points}
            xDomain={xDomain}
            yDomain={yDomain}
            optimum={optimum}
            paths={[{ key: "gd", path: visible, color: "var(--chart-4)", label: "Qradiyent enmə" }]}
            ariaLabel={`Xərc funksiyasının səthi və qradiyent enmənin ${visible.length - 1} addımlıq yolu. ${scaled ? "Əlamət standartlaşdırılıb" : "Əlamət miqyaslanmayıb"}.`}
          />
          <p className="px-1 text-xs text-muted-foreground">Tünd = aşağı xərc. × = minimum (normal tənliyin həlli).</p>
          <LossCurve series={[{ key: "gd", values: losses, color: "var(--chart-4)" }]} />
        </div>
      }
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (active) setRunning(false);
                else {
                  if (shown >= path.length - 1) setShown(0);
                  setRunning(true);
                }
              }}
            >
              {active ? <Pause /> : <Play />}
              {active ? "Dayandır" : "Başlat"}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw /> Sıfırla
            </Button>
          </div>
          <SliderField
            label="Öyrənmə sürəti (η)"
            value={logEta}
            min={-3.5}
            max={0.1}
            step={0.05}
            onChange={(v) => {
              setLogEta(v);
              reset();
            }}
            format={(v) => (10 ** v).toPrecision(2)}
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={scaled}
              onChange={(e) => {
                setScaled(e.target.checked);
                reset();
              }}
              className="mt-0.5 accent-[var(--primary)]"
            />
            <span>
              Əlaməti standartlaşdır
              <span className="block text-xs text-muted-foreground">x: 0–10 → orta 0, std 1</span>
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Addım" value={visible.length - 1} />
            <Stat label="MSE" value={Number.isFinite(losses.at(-1)!) ? losses.at(-1)!.toFixed(3) : "∞"} tone={diverged ? "bad" : gap < 1e-3 ? "good" : "neutral"} />
            <Stat label="θ₀" value={Number.isFinite(current.t0) ? current.t0.toFixed(2) : "∞"} />
            <Stat label="θ₁" value={Number.isFinite(current.t1) ? current.t1.toFixed(2) : "∞"} />
          </div>
          <LiveRegion>{message}</LiveRegion>
        </>
      }
    />
  );
}
