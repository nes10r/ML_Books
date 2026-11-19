"use client";

import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { fixAreaTypo, type Apartment } from "@/lib/data/apartments";
import { knnPredictManyK } from "@/lib/ml/knn-multi";
import { rootMeanSquaredError } from "@/lib/ml/metrics";
import { scaleMatrix, type ScalingMethod } from "@/lib/ml/preprocessing";
import { createRng, shuffle } from "@/lib/ml/random";
import { kFold } from "@/lib/ml/splitting";
import { median, std as stdev } from "@/lib/ml/stats";
import { ApartmentsGate } from "./dataset-gate";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";

const KS = [1, 2, 3, 5, 8, 12, 20, 35] as const;
const SCALINGS: { id: ScalingMethod; label: string }[] = [
  { id: "none", label: "Miqyaslama yoxdur" },
  { id: "minmax", label: "Min-max" },
  { id: "standard", label: "Standart" },
];
const FOLDS = 5;
const SAMPLE = 1200;
const FEATURES = ["sahe", "metro_mesafe", "enlik", "uzunluq", "otaq_sayi"] as const;

interface Cell {
  scaling: ScalingMethod;
  k: number;
  mean: number;
  std: number;
  folds: number[];
}

/** Builds the feature matrix: typo fix + median imputation (fitted on the whole sample for brevity). */
function buildMatrix(data: Apartment[]) {
  const sample = shuffle(data, createRng(7)).slice(0, SAMPLE);
  const med = {
    metro_mesafe: median(sample.flatMap((a) => (a.metro_mesafe === null ? [] : [a.metro_mesafe]))),
    otaq_sayi: median(sample.flatMap((a) => (a.otaq_sayi === null ? [] : [a.otaq_sayi]))),
  };
  const X = sample.map((a) =>
    FEATURES.map((f) => {
      if (f === "sahe") return fixAreaTypo(a.sahe);
      const v = a[f];
      return v ?? med[f as keyof typeof med];
    }),
  );
  return { X, y: sample.map((a) => a.qiymet) };
}

export function runGridSearch(X: number[][], y: number[]): Cell[] {
  const folds = kFold(X.length, FOLDS, createRng(42));
  const cells: Cell[] = [];
  for (const { id: scaling } of SCALINGS) {
    const perK: number[][] = KS.map(() => []);
    for (const f of folds) {
      const { train, test } = scaleMatrix(
        scaling,
        f.train.map((i) => X[i]!),
        f.validation.map((i) => X[i]!),
      );
      const preds = knnPredictManyK(train, f.train.map((i) => y[i]!), test, KS);
      const actual = f.validation.map((i) => y[i]!);
      preds.forEach((p, ki) => perK[ki]!.push(rootMeanSquaredError(actual, p)));
    }
    KS.forEach((k, ki) => {
      const foldsRmse = perK[ki]!;
      cells.push({ scaling, k, folds: foldsRmse, mean: foldsRmse.reduce((a, b) => a + b, 0) / FOLDS, std: stdev(foldsRmse) });
    });
  }
  return cells;
}

export default function GridSearchDemo() {
  return <ApartmentsGate>{(data) => <Inner data={data} />}</ApartmentsGate>;
}

function Inner({ data }: { data: Apartment[] }) {
  const { X, y } = useMemo(() => buildMatrix(data), [data]);
  const [cells, setCells] = useState<Cell[] | null>(null);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<Cell | null>(null);

  const run = () => {
    setRunning(true);
    // Yield to the browser so the "computing" state paints before the CPU-bound work.
    window.setTimeout(() => {
      const result = runGridSearch(X, y);
      setCells(result);
      setSelected(result.reduce((a, b) => (b.mean < a.mean ? b : a)));
      setRunning(false);
    }, 30);
  };

  const best = cells?.reduce((a, b) => (b.mean < a.mean ? b : a));
  const minR = cells ? Math.min(...cells.map((c) => c.mean)) : 0;
  const maxR = cells ? Math.max(...cells.map((c) => c.mean)) : 1;
  const k$ = (v: number) => `${(v / 1000).toFixed(1)}k`;

  const W = 640;
  const left = 132;
  const top = 28;
  const cw = (W - left - 8) / KS.length;
  const ch = 56;

  return (
    <DemoLayout
      plot={
        cells ? (
          <svg viewBox={`0 0 ${W} ${top + ch * SCALINGS.length + 30}`} className="h-auto w-full" role="img" aria-label={`Şəbəkə axtarışı nəticəsi: ən yaxşı kombinasiya ${best!.k} qonşu, ${SCALINGS.find((s) => s.id === best!.scaling)!.label}, CV RMSE ${k$(best!.mean)} AZN.`}>
            {KS.map((k, j) => (
              <text key={k} x={left + j * cw + cw / 2} y={18} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
                k={k}
              </text>
            ))}
            {SCALINGS.map((sc, i) => (
              <g key={sc.id}>
                <text x={left - 8} y={top + i * ch + ch / 2 + 4} textAnchor="end" fontSize={12} fill="var(--foreground)">
                  {sc.label}
                </text>
                {KS.map((k, j) => {
                  const c = cells.find((x) => x.scaling === sc.id && x.k === k)!;
                  const strength = 1 - (c.mean - minR) / (maxR - minR || 1);
                  const isBest = c === best;
                  const isSel = c === selected;
                  return (
                    <g key={k} onClick={() => setSelected(c)} className="cursor-pointer">
                      <rect
                        x={left + j * cw + 2}
                        y={top + i * ch + 2}
                        width={cw - 4}
                        height={ch - 4}
                        rx={6}
                        fill={`color-mix(in oklch, var(--primary) ${Math.round(10 + strength * 80)}%, var(--surface))`}
                        stroke={isSel ? "var(--foreground)" : isBest ? "var(--success)" : "none"}
                        strokeWidth={isSel || isBest ? 2.5 : 0}
                      />
                      <text
                        x={left + j * cw + cw / 2}
                        y={top + i * ch + ch / 2 + 4}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={isBest ? 700 : 500}
                        fill={strength > 0.55 ? "var(--primary-foreground)" : "var(--foreground)"}
                      >
                        {k$(c.mean)}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
            <text x={left} y={top + ch * SCALINGS.length + 20} fontSize={11} fill="var(--muted-foreground)">
              Xana: 5 qatlı CV RMSE (AZN). Tünd = daha yaxşı. Yaşıl çərçivə = ən yaxşı.
            </text>
          </svg>
        ) : (
          <div className="grid min-h-64 place-items-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {running ? (
              <p role="status">Hesablanır… {SCALINGS.length * KS.length} kombinasiya × {FOLDS} qat</p>
            ) : (
              <p>“Axtarışı başlat” düyməsini basın: {SCALINGS.length} miqyaslama × {KS.length} k qiyməti = {SCALINGS.length * KS.length} kombinasiya, hər biri {FOLDS} qatlı çarpaz validasiya ilə yoxlanılacaq.</p>
            )}
          </div>
        )
      }
      controls={
        <>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Model: k-NN reqressiyası. Əlamətlər: sahə, metroya məsafə, enlik, uzunluq, otaq sayı ({SAMPLE} mənzil).
          </p>
          <Button size="sm" onClick={run} disabled={running}>
            <Play />
            {cells ? "Yenidən hesabla" : "Axtarışı başlat"}
          </Button>
          {selected && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Seçilmiş k" value={selected.k} />
                <Stat label="CV RMSE" value={k$(selected.mean)} tone={selected === best ? "good" : "neutral"} />
                <Stat label="Qatlar arası σ" value={k$(selected.std)} />
                <Stat label="Miqyaslama" value={SCALINGS.find((s) => s.id === selected.scaling)!.label.split(" ")[0]} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">Qatlar: {selected.folds.map(k$).join(" · ")}</p>
            </>
          )}
          {cells && (
            <LiveRegion>
              Miqyaslama olmadan k-NN məsafəni demək olar ki, yalnız <b>sahə</b> ilə ölçür. Enlik və uzunluq 0.01° qədər dəyişir və “görünmür”. Miqyaslama
              bütün əlamətlərə söz haqqı verir, xəta kəskin azalır. Xanaya klikləyərək qatlar üzrə nəticələrə baxın.
            </LiveRegion>
          )}
        </>
      }
    />
  );
}
