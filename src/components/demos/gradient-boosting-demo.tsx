"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { generateTemperature } from "@/lib/ml/datasets";
import { boostingPredict, fitGradientBoosting } from "@/lib/ml/ensemble";
import { rootMeanSquaredError } from "@/lib/ml/metrics";
import { predictValue } from "@/lib/ml/tree";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const MAX_TREES = 120;
const GRID = Array.from({ length: 481 }, (_, i) => (i / 480) * 24);

export default function GradientBoostingDemo() {
  const { train, test } = useMemo(() => generateTemperature(), []);
  const X = useMemo(() => train.map((p) => [p.x]), [train]);
  const y = useMemo(() => train.map((p) => p.y), [train]);
  const [eta, setEta] = useState(0.3);
  const [depth, setDepth] = useState(2);
  const [stage, setStage] = useState(1);

  const model = useMemo(() => fitGradientBoosting(X, y, MAX_TREES, eta, { maxDepth: depth }), [X, y, eta, depth]);
  const curve = useMemo(
    () =>
      Array.from({ length: MAX_TREES + 1 }, (_, t) => ({
        t,
        train: rootMeanSquaredError(y, X.map((x) => boostingPredict(model, x, eta, t))),
        test: rootMeanSquaredError(test.map((p) => p.y), test.map((p) => boostingPredict(model, [p.x], eta, t))),
      })),
    [model, X, y, test, eta],
  );
  const best = curve.reduce((a, b) => (b.test < a.test ? b : a));
  const ensemble = GRID.map((x) => ({ x, y: boostingPredict(model, [x], eta, stage) }));
  const current = stage > 0 ? model.stages[stage - 1]! : null;
  const treeFit = current ? GRID.map((x) => ({ x, y: predictValue(current.tree, [x]) })) : [];

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={260}
            xDomain={[0, 24]}
            yDomain={[0, 25]}
            xTicks={[0, 6, 12, 18, 24]}
            xLabel="Saat"
            yLabel="Temperatur (°C)"
            ariaLabel={`${stage} ağaclı bustinq ansamblının proqnozu. Test RMSE ${curve[stage]!.test.toFixed(2)}.`}
          >
            {(s) => (
              <g>
                {train.map((p, i) => (
                  <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={2.6} fill="var(--chart-1)" opacity={0.4} />
                ))}
                <path d={linePath(ensemble, s)} stroke="var(--chart-4)" strokeWidth={2.4} fill="none" />
              </g>
            )}
          </Plot>
          <p className="px-1 text-xs text-muted-foreground">
            {current ? `${stage}-ci ağacın öyrəndiyi qalıqlar (y − əvvəlki ansamblın proqnozu) və onun pilləli uyğunlaşması` : "Başlanğıc: bütün proqnozlar ortaya bərabərdir"}
          </p>
          <Plot height={170} xDomain={[0, 24]} yDomain={[-10, 10]} xTicks={[0, 6, 12, 18, 24]} xLabel="Saat" yLabel="Qalıq" ariaLabel="Cari ağacın öyrəndiyi qalıqlar">
            {(s) => (
              <g>
                <line x1={s.x(0)} x2={s.x(24)} y1={s.y(0)} y2={s.y(0)} stroke="var(--border)" />
                {current &&
                  train.map((p, i) => <circle key={i} cx={s.x(p.x)} cy={s.y(Math.max(-10, Math.min(10, current.residuals[i]!)))} r={2.4} fill="var(--chart-2)" opacity={0.6} />)}
                {current && <path d={linePath(treeFit, s)} stroke="var(--foreground)" strokeWidth={2} fill="none" />}
              </g>
            )}
          </Plot>
          <Plot height={160} xDomain={[0, MAX_TREES]} yDomain={[0, 8]} xLabel="Ağac sayı" yLabel="RMSE" formatX={(v) => v.toFixed(0)} ariaLabel="Ağac sayına görə təlim və test RMSE">
            {(s) => (
              <g>
                <path d={linePath(curve.map((c) => ({ x: c.t, y: Math.min(8, c.train) })), s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
                <path d={linePath(curve.map((c) => ({ x: c.t, y: Math.min(8, c.test) })), s)} stroke="var(--chart-4)" strokeWidth={2} fill="none" />
                <line x1={s.x(stage)} x2={s.x(stage)} y1={s.y(0)} y2={s.y(8)} stroke="var(--foreground)" strokeOpacity={0.4} />
                <circle cx={s.x(best.t)} cy={s.y(best.test)} r={4} fill="var(--success)" />
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim RMSE", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              { label: "Test RMSE", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
              { label: "Ən yaxşı test nöqtəsi", swatch: <circle cx={7} cy={7} r={4} fill="var(--success)" /> },
            ]}
          />
        </div>
      }
      controls={
        <>
          <SliderField label="Ağac sayı (mərhələ)" value={stage} min={0} max={MAX_TREES} onChange={setStage} />
          <SliderField label="Öyrənmə sürəti (η)" value={eta} min={0.05} max={1} step={0.05} onChange={setEta} format={(v) => v.toFixed(2)} />
          <SliderField label="Ağacın dərinliyi" value={depth} min={1} max={4} onChange={setDepth} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Təlim RMSE" value={curve[stage]!.train.toFixed(2)} />
            <Stat label="Test RMSE" value={curve[stage]!.test.toFixed(2)} />
            <Stat label="Ən yaxşı test" value={`${best.test.toFixed(2)} (${best.t} ağac)`} tone="good" />
            <Stat label="Küy səviyyəsi" value="1.50" />
          </div>
          <LiveRegion>
            Hər yeni ağac əvvəlki ansamblın <b>qalıqlarını</b> — hələ izah edilməmiş hissəni — öyrənir və proqnoza η qədər töhfə verir. Kiçik η daha çox
            ağac tələb edir, lakin adətən daha yaxşı ümumiləşdirir (shrinkage). Çox ağac isə yenidən overfitting-ə aparır.
          </LiveRegion>
        </>
      }
    />
  );
}
