"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { generateMoons } from "@/lib/ml/datasets";
import { fitBaggedTrees, forestPredict, oobAccuracy } from "@/lib/ml/ensemble";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { CLASS_COLORS, Marker, Plot, type Scales } from "./plot";

type Mode = "bagging" | "forest" | "extra";
const X_DOMAIN = [-1.8, 2.8] as const;
const Y_DOMAIN = [-1.4, 1.9] as const;
const N_TRAIN = 700;
const MAX_TREES = 100;
const MODE_TEXT: Record<Mode, string> = {
  bagging: "Bagging: hər ağac təlim dəstinin təsadüfi bootstrap nüsxəsində öyrənir və hər düyündə bütün əlamətlərə baxır.",
  forest: "Təsadüfi meşə: bagging + hər düyündə yalnız təsadüfi seçilmiş əlamətlər (burada 2-dən 1-i) yoxlanılır — ağaclar daha müxtəlif olur.",
  extra: "Extra-Trees: təsadüfi meşə + hər əlamət üçün ən yaxşı yox, təsadüfi hədd — daha da müxtəlif və daha sürətli ağaclar.",
};

function ForestRegions({ predict, s, grid = 56 }: { predict: (p: number[]) => number; s: Scales; grid?: number }) {
  const cells = useMemo(() => {
    const out: React.ReactNode[] = [];
    const dx = (X_DOMAIN[1] - X_DOMAIN[0]) / grid;
    const dy = (Y_DOMAIN[1] - Y_DOMAIN[0]) / grid;
    for (let j = 0; j < grid; j++)
      for (let i = 0; i < grid; i++) {
        const c = predict([X_DOMAIN[0] + (i + 0.5) * dx, Y_DOMAIN[0] + (j + 0.5) * dy]);
        out.push(<rect key={j * grid + i} x={i} y={grid - 1 - j} width={1.03} height={1.03} fill={c ? CLASS_COLORS[3] : CLASS_COLORS[0]} />);
      }
    return out;
  }, [predict, grid]);
  return (
    <g
      opacity={0.2}
      transform={`translate(${s.x(X_DOMAIN[0])} ${s.y(Y_DOMAIN[1])}) scale(${(s.x(X_DOMAIN[1]) - s.x(X_DOMAIN[0])) / grid} ${(s.y(Y_DOMAIN[0]) - s.y(Y_DOMAIN[1])) / grid})`}
    >
      {cells}
    </g>
  );
}

export default function BaggingForestDemo() {
  const { Xtr, ytr, Xte, yte } = useMemo(() => {
    const d = generateMoons(11, 1000, 0.32);
    return { Xtr: d.X.slice(0, N_TRAIN), ytr: d.y.slice(0, N_TRAIN), Xte: d.X.slice(N_TRAIN), yte: d.y.slice(N_TRAIN) };
  }, []);
  const [mode, setMode] = useState<Mode>("bagging");
  const [count, setCount] = useState(1);

  const forest = useMemo(
    () =>
      fitBaggedTrees(Xtr, ytr, 2, {
        nTrees: MAX_TREES,
        seed: 3,
        maxFeatures: mode === "bagging" ? undefined : 1,
        randomThresholds: mode === "extra",
      }),
    [Xtr, ytr, mode],
  );
  const predict = useMemo(() => (p: number[]) => forestPredict(forest, p, count), [forest, count]);
  const testAcc = yte.filter((t, i) => predict(Xte[i]!) === t).length / yte.length;
  const singleAcc = useMemo(() => yte.filter((t, i) => forestPredict(forest, Xte[i]!, 1) === t).length / yte.length, [forest, Xte, yte]);
  const oob = useMemo(() => oobAccuracy(forest, Xtr, ytr), [forest, Xtr, ytr]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Ansambl növü"
          value={mode}
          onChange={setMode}
          options={[
            { value: "bagging", label: "Bagging" },
            { value: "forest", label: "Təsadüfi meşə" },
            { value: "extra", label: "Extra-Trees" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <Plot
            height={360}
            xDomain={X_DOMAIN}
            yDomain={Y_DOMAIN}
            xLabel="x₁"
            yLabel="x₂"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`${count} ağaclı ansamblın qərar bölgələri. Test dəqiqliyi ${(testAcc * 100).toFixed(1)}%.`}
          >
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  <ForestRegions predict={predict} s={s} />
                </g>
                {Xte.map(([a, b], i) => (
                  <Marker key={i} cx={s.x(a!)} cy={s.y(b!)} cls={yte[i]! ? 3 : 0} size={3} filled={false} />
                ))}
              </g>
            )}
          </Plot>
        }
        controls={
          <>
            <SliderField label="Ağac sayı" value={count} min={1} max={MAX_TREES} onChange={setCount} />
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Tək ağac (test)" value={`${(singleAcc * 100).toFixed(1)}%`} />
              <Stat label={`${count} ağac (test)`} value={`${(testAcc * 100).toFixed(1)}%`} tone={testAcc > singleAcc ? "good" : "neutral"} />
              <Stat label="OOB (100 ağac)" value={`${(oob * 100).toFixed(1)}%`} />
              <Stat label="Test nöqtəsi" value={yte.length} />
            </div>
            <LiveRegion>
              {MODE_TEXT[mode]} Ağac sayını 1-dən 100-ə qaldırın: tək ağacın xırda, “cırıq” bölgələri ortalama ilə hamarlanır.
            </LiveRegion>
            <p className="text-xs text-muted-foreground">
              Qrafikdə yalnız 300 test nöqtəsi göstərilib. OOB qiyməti test dəstindən istifadə etmədən, hər təlim nümunəsini onu görməyən ağaclarla
              qiymətləndirir.
            </p>
          </>
        }
      />
    </div>
  );
}
