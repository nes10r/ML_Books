"use client";

import { Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/ui/slider-field";
import { generateCorrelatedCloud } from "@/lib/ml/datasets";
import { fitPCA, projectedVariance } from "@/lib/ml/pca";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const DOMAIN = [-6, 6] as const;

export default function PcaProjectionDemo() {
  const points = useMemo(() => generateCorrelatedCloud(), []);
  const X = useMemo(() => {
    const mx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const my = points.reduce((s, p) => s + p.y, 0) / points.length;
    return points.map((p) => [p.x - mx, p.y - my]);
  }, [points]);
  const pca = useMemo(() => fitPCA(X), [X]);
  const pcAngle = useMemo(() => {
    const [cx, cy] = pca.components[0]!;
    let a = (Math.atan2(cy!, cx!) * 180) / Math.PI;
    if (a < 0) a += 180;
    if (a >= 180) a -= 180;
    return a;
  }, [pca]);
  const [angle, setAngle] = useState(100);

  const rad = (angle * Math.PI) / 180;
  const dir: [number, number] = [Math.cos(rad), Math.sin(rad)];
  const variance = projectedVariance(X, dir);
  const total = pca.explainedVariance[0]! + pca.explainedVariance[1]!;
  const curve = useMemo(
    () => Array.from({ length: 181 }, (_, a) => ({ x: a, y: projectedVariance(X, [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]) })),
    [X],
  );

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={340}
            xDomain={DOMAIN}
            yDomain={[-4.5, 4.5]}
            xLabel="x₁"
            yLabel="x₂"
            formatX={(v) => v.toFixed(0)}
            formatY={(v) => v.toFixed(0)}
            ariaLabel={`Mərkəzləşdirilmiş nöqtələr və ${angle}° istiqamətli ox. Proyeksiyanın dispersiyası ${variance.toFixed(2)}, ümumi dispersiyanın ${((variance / total) * 100).toFixed(0)}%-i.`}
          >
            {(s) => (
              <g clipPath={`url(#${s.clipId})`}>
                {X.map(([a, b], i) => {
                  const t = a! * dir[0] + b! * dir[1];
                  return <line key={`l${i}`} x1={s.x(a!)} y1={s.y(b!)} x2={s.x(t * dir[0])} y2={s.y(t * dir[1])} stroke="var(--chart-4)" strokeOpacity={0.25} />;
                })}
                <path d={linePath([{ x: -8 * dir[0], y: -8 * dir[1] }, { x: 8 * dir[0], y: 8 * dir[1] }], s)} stroke="var(--foreground)" strokeWidth={2} />
                {X.map(([a, b], i) => (
                  <circle key={i} cx={s.x(a!)} cy={s.y(b!)} r={2.8} fill="var(--chart-1)" opacity={0.65} />
                ))}
                {X.map(([a, b], i) => {
                  const t = a! * dir[0] + b! * dir[1];
                  return <circle key={`p${i}`} cx={s.x(t * dir[0])} cy={s.y(t * dir[1])} r={2} fill="var(--chart-4)" />;
                })}
              </g>
            )}
          </Plot>
          <Plot
            height={170}
            xDomain={[0, 180]}
            yDomain={[0, Math.max(...curve.map((c) => c.y)) * 1.1]}
            xTicks={[0, 30, 60, 90, 120, 150, 180]}
            formatX={(v) => `${v}°`}
            formatY={(v) => v.toFixed(1)}
            xLabel="Oxun bucağı"
            yLabel="Dispersiya"
            ariaLabel="Proyeksiyanın dispersiyasının oxun bucağından asılılığı"
          >
            {(s) => (
              <g>
                <path d={linePath(curve, s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                <circle cx={s.x(pcAngle)} cy={s.y(pca.explainedVariance[0]!)} r={4.5} fill="var(--success)" />
                <circle cx={s.x(angle)} cy={s.y(variance)} r={4.5} fill="var(--foreground)" />
              </g>
            )}
          </Plot>
        </div>
      }
      controls={
        <>
          <SliderField label="Oxun bucağı" value={angle} min={0} max={179} onChange={setAngle} format={(v) => `${v}°`} />
          <Button size="sm" variant="outline" onClick={() => setAngle(Math.round(pcAngle))}>
            <Target /> Birinci əsas komponentə keç
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Proyeksiyanın dispersiyası" value={variance.toFixed(2)} tone={Math.abs(angle - pcAngle) < 1.5 ? "good" : "neutral"} />
            <Stat label="Saxlanılan pay" value={`${((variance / total) * 100).toFixed(1)}%`} />
            <Stat label="Orta kvadrat proyeksiya məsafəsi" value={((total - variance) * (X.length - 1) / X.length).toFixed(2)} />
            <Stat label="PC1 bucağı" value={`${pcAngle.toFixed(1)}°`} />
          </div>
          <LiveRegion>
            Nöqtələri bir xəttə proyeksiya etdikdə (qırmızı nöqtələr) informasiyanın bir hissəsi itir. PCA dispersiyanı maksimum saxlayan oxu seçir — bu,
            eyni zamanda nöqtələrlə onların proyeksiyaları arasındakı orta kvadrat məsafəni minimuma endirən oxdur.
          </LiveRegion>
        </>
      }
    />
  );
}
