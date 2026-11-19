"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { DIGIT_OUTPUTS_URL, type DigitOutput } from "@/lib/data/digits";
import { averagePrecision, rocAuc, thresholdCurve, type CurvePoint } from "@/lib/ml/classification";
import { DatasetGate, parseDigitOutputs } from "./dataset-gate";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

/** Highest TPR achievable without exceeding the given FPR. */
export function tprAtFpr(curve: readonly CurvePoint[], maxFpr: number): CurvePoint {
  return curve.filter((c) => c.fpr <= maxFpr + 1e-12).reduce((best, c) => (c.tpr > best.tpr ? c : best), curve[0]!);
}

export default function RocCompareDemo() {
  return (
    <DatasetGate urls={[DIGIT_OUTPUTS_URL]} parse={parseDigitOutputs}>
      {(outputs) => <Inner outputs={outputs} />}
    </DatasetGate>
  );
}

function Inner({ outputs }: { outputs: DigitOutput[] }) {
  const [maxFpr, setMaxFpr] = useState(0.01);
  const labels = useMemo(() => outputs.map((o) => o.is5), [outputs]);
  const models = useMemo(
    () =>
      [
        { key: "sgd", name: "SGD", color: "var(--chart-2)", curve: thresholdCurve(outputs.map((o) => o.sgdScore), labels) },
        { key: "forest", name: "Təsadüfi meşə", color: "var(--chart-1)", curve: thresholdCurve(outputs.map((o) => o.forestProba), labels) },
      ].map((m) => ({ ...m, auc: rocAuc(m.curve), ap: averagePrecision(m.curve), at: tprAtFpr(m.curve, maxFpr) })),
    [outputs, labels, maxFpr],
  );
  const negatives = labels.filter((l) => !l).length;

  return (
    <DemoLayout
      plot={
        <>
          <Plot
            height={400}
            xDomain={[0, 1]}
            yDomain={[0, 1.02]}
            xLabel="Yanlış müsbət nisbəti (FPR)"
            yLabel="Düzgün müsbət nisbəti (TPR, recall)"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`ROC əyriləri. SGD AUC ${models[0]!.auc.toFixed(3)}, təsadüfi meşə AUC ${models[1]!.auc.toFixed(3)}.`}
          >
            {(s) => (
              <g>
                <rect x={s.x(0)} y={s.y(1.02)} width={s.x(maxFpr) - s.x(0)} height={s.y(0) - s.y(1.02)} fill="var(--chart-4)" opacity={0.08} />
                <line x1={s.x(0)} y1={s.y(0)} x2={s.x(1)} y2={s.y(1)} stroke="var(--muted-foreground)" strokeDasharray="5 4" />
                {models.map((m) => (
                  <g key={m.key}>
                    <path d={linePath(m.curve.map((c) => ({ x: c.fpr, y: c.tpr })), s)} stroke={m.color} strokeWidth={2.5} fill="none" />
                    <circle cx={s.x(m.at.fpr)} cy={s.y(m.at.tpr)} r={6} fill={m.color} stroke="var(--surface)" strokeWidth={2} />
                  </g>
                ))}
                <text x={s.x(0.55)} y={s.y(0.48)} fontSize={11} fill="var(--muted-foreground)" transform={`rotate(-33 ${s.x(0.55)} ${s.y(0.48)})`}>
                  təsadüfi təxmin (AUC = 0.5)
                </text>
              </g>
            )}
          </Plot>
          <Legend
            items={models.map((m) => ({ label: `${m.name} — AUC ${m.auc.toFixed(4)}`, swatch: <line x1={1} y1={7} x2={13} y2={7} stroke={m.color} strokeWidth={2.5} /> }))}
          />
        </>
      }
      controls={
        <>
          <SliderField
            label="İcazə verilən FPR"
            value={maxFpr}
            min={0.002}
            max={0.2}
            step={0.002}
            onChange={setMaxFpr}
            format={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <p className="text-xs text-muted-foreground">
            ≈ {Math.round(maxFpr * negatives)} yanlış həyəcan / {negatives} “5 deyil” şəkli
          </p>
          {models.map((m) => (
            <div key={m.key} className="space-y-1.5">
              <p className="text-sm font-medium" style={{ color: m.color }}>
                {m.name}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Bu FPR-də TPR" value={`${(m.at.tpr * 100).toFixed(1)}%`} />
                <Stat label="ROC AUC" value={m.auc.toFixed(4)} />
                <Stat label="PR AUC (AP)" value={m.ap.toFixed(4)} />
                <Stat label="Hədd" value={Number.isFinite(m.at.threshold) ? (m.key === "sgd" ? m.at.threshold.toFixed(0) : m.at.threshold.toFixed(2)) : "∞"} />
              </div>
            </div>
          ))}
          <LiveRegion>
            Əyri sol yuxarı küncə nə qədər yaxındırsa, model o qədər yaxşıdır. Praktikada vacib olan aşağı FPR bölgəsində təsadüfi meşə SGD-dən aydın şəkildə üstündür.
          </LiveRegion>
        </>
      }
    />
  );
}
