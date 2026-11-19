"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { DIGIT_OUTPUTS_URL, type DigitOutput } from "@/lib/data/digits";
import { countsAtThreshold, f1, precision, recall, thresholdCurve } from "@/lib/ml/classification";
import { histogram, quantile } from "@/lib/ml/stats";
import { BinaryConfusionMatrix } from "./binary-metrics-ui";
import { DatasetGate, parseDigitOutputs } from "./dataset-gate";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

type ModelKey = "sgd" | "forest";
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function ThresholdExplorerDemo() {
  return (
    <DatasetGate urls={[DIGIT_OUTPUTS_URL]} parse={parseDigitOutputs}>
      {(outputs) => <Inner outputs={outputs} />}
    </DatasetGate>
  );
}

function Inner({ outputs }: { outputs: DigitOutput[] }) {
  const [model, setModel] = useState<ModelKey>("sgd");
  const labels = useMemo(() => outputs.map((o) => o.is5), [outputs]);
  const scores = useMemo(() => outputs.map((o) => (model === "sgd" ? o.sgdScore : o.forestProba)), [outputs, model]);
  const range = useMemo<[number, number]>(
    () => (model === "sgd" ? [Math.floor(quantile(scores, 0.03) / 100) * 100, Math.ceil(quantile(scores, 0.997) / 100) * 100] : [0, 1]),
    [scores, model],
  );
  const [thresholds, setThresholds] = useState<Record<ModelKey, number>>({ sgd: 0, forest: 0.5 });
  const threshold = thresholds[model];
  const step = model === "sgd" ? 50 : 0.01;

  const counts = countsAtThreshold(scores, labels, threshold);
  const p = precision(counts);
  const r = recall(counts);
  const curve = useMemo(() => thresholdCurve(scores, labels), [scores, labels]);

  const bins = 36;
  const { pos, neg } = useMemo(() => {
    const clip = (v: number) => Math.min(range[1], Math.max(range[0], v));
    return {
      pos: histogram(scores.filter((_, i) => labels[i]).map(clip), bins, range),
      neg: histogram(scores.filter((_, i) => !labels[i]).map(clip), bins, range),
    };
  }, [scores, labels, range]);
  const maxPos = Math.max(...pos.map((b) => b.count));
  const maxNeg = Math.max(...neg.map((b) => b.count));
  const fmt = (v: number) => (model === "sgd" ? v.toFixed(0) : v.toFixed(2));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Model"
          value={model}
          onChange={setModel}
          options={[
            { value: "sgd", label: "SGD (bal)" },
            { value: "forest", label: "Təsadüfi meşə (ehtimal)" },
          ]}
        />
        <p className="text-xs text-muted-foreground">“5-dirmi?” — {outputs.length} təlim şəkli, çarpaz validasiya balları</p>
      </div>
      <DemoLayout
        plot={
          <>
            <Plot
              height={300}
              xDomain={range}
              yDomain={[-maxNeg * 1.05, maxPos * 1.15]}
              xLabel={model === "sgd" ? "Qərar balı" : "“5” ehtimalı"}
              yLabel="Şəkil sayı"
              formatX={fmt}
              formatY={(v) => Math.abs(v).toFixed(0)}
              ariaLabel={`Müsbət (5) və mənfi siniflərin bal histoqramı, hədd ${fmt(threshold)}. Precision ${pct(p)}, recall ${pct(r)}.`}
            >
              {(s) => (
                <g>
                  {pos.map((b, i) => (
                    <rect key={`p${i}`} x={s.x(b.x0) + 0.5} y={s.y(b.count)} width={Math.max(0, s.x(b.x1) - s.x(b.x0) - 1)} height={s.y(0) - s.y(b.count)} fill="var(--chart-1)" />
                  ))}
                  {neg.map((b, i) => (
                    <rect key={`n${i}`} x={s.x(b.x0) + 0.5} y={s.y(0)} width={Math.max(0, s.x(b.x1) - s.x(b.x0) - 1)} height={s.y(-b.count) - s.y(0)} fill="var(--muted-foreground)" opacity={0.45} />
                  ))}
                  <line x1={s.x(range[0])} x2={s.x(range[1])} y1={s.y(0)} y2={s.y(0)} stroke="var(--border)" />
                  <line x1={s.x(threshold)} x2={s.x(threshold)} y1={s.y(-maxNeg * 1.05)} y2={s.y(maxPos * 1.15)} stroke="var(--chart-4)" strokeWidth={2.5} />
                  <text x={s.x(threshold) + 6} y={s.y(maxPos * 1.05)} fontSize={11} fill="var(--chart-4)">
                    hədd → “5”
                  </text>
                </g>
              )}
            </Plot>
            <Legend
              items={[
                { label: "Həqiqətən 5 (yuxarı)", swatch: <rect x={2} y={2} width={10} height={10} rx={2} fill="var(--chart-1)" /> },
                { label: "Digər rəqəmlər (aşağı)", swatch: <rect x={2} y={2} width={10} height={10} rx={2} fill="var(--muted-foreground)" opacity={0.45} /> },
                { label: "Qərar həddi", swatch: <line x1={7} y1={1} x2={7} y2={13} stroke="var(--chart-4)" strokeWidth={2.5} /> },
              ]}
            />
            <div className="pt-4">
              <p className="px-1 pb-1 text-xs text-muted-foreground">Precision–recall əyrisi (nöqtə = cari hədd)</p>
              <Plot height={220} xDomain={[0, 1]} yDomain={[0, 1.02]} xLabel="Recall" yLabel="Precision" formatX={(v) => v.toFixed(1)} formatY={(v) => v.toFixed(1)} ariaLabel="Precision-recall əyrisi">
                {(sc) => (
                  <g>
                    <path d={linePath(curve.slice(1).map((c) => ({ x: c.tpr, y: c.precision })), sc)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                    <circle cx={sc.x(r)} cy={sc.y(p)} r={6} fill="var(--chart-4)" stroke="var(--surface)" strokeWidth={2} />
                  </g>
                )}
              </Plot>
            </div>
          </>
        }
        controls={
          <>
            <SliderField
              label="Qərar həddi"
              value={threshold}
              min={range[0]}
              max={range[1]}
              step={step}
              onChange={(v) => setThresholds((t) => ({ ...t, [model]: v }))}
              format={fmt}
            />
            <BinaryConfusionMatrix counts={counts} positiveLabel="5" negativeLabel="5 deyil" />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Precision" value={pct(p)} />
              <Stat label="Recall" value={pct(r)} />
              <Stat label="F1" value={f1(counts).toFixed(3)} />
              <Stat label="Müsbət proqnoz" value={counts.tp + counts.fp} />
            </div>
            <LiveRegion>
              Həddi <b>artırsanız</b>, model yalnız əmin olduğu halda “5” deyir: precision artır, recall azalır. Həddi <b>azaltsanız</b>, daha çox 5 tutulur,
              lakin yanlış həyəcanlar da çoxalır.
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
