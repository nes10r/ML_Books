"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import { generateApartments } from "@/lib/ml/datasets";
import { rootMeanSquaredError } from "@/lib/ml/metrics";
import { knnRegress } from "@/lib/ml/neighbors";
import { fitLinearRegression, predictLinear } from "@/lib/ml/regression";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

type Mode = "model" | "knn" | "both";
const X_DOMAIN = [30, 165] as const;
const Y_DOMAIN = [40, 280] as const;

export default function ModelVsInstanceDemo() {
  const data = useMemo(() => generateApartments(7), []);
  const linear = useMemo(() => fitLinearRegression(data), [data]);
  const [mode, setMode] = useState<Mode>("both");
  const [area, setArea] = useState(100);
  const [k, setK] = useState(3);

  const knn = knnRegress(data, area, k);
  const linPred = predictLinear(linear, area);
  const showModel = mode !== "knn";
  const showKnn = mode !== "model";

  const knnCurve = useMemo(() => {
    const pts = [];
    for (let x = X_DOMAIN[0]; x <= X_DOMAIN[1]; x += 0.5) pts.push({ x, y: knnRegress(data, x, k).prediction });
    return pts;
  }, [data, k]);

  const ys = data.map((p) => p.y);
  const rmseLinear = rootMeanSquaredError(ys, data.map((p) => predictLinear(linear, p.x)));
  // Training error of k-NN (each point is its own neighbour → optimistic for small k).
  const rmseKnn = rootMeanSquaredError(ys, data.map((p) => knnRegress(data, p.x, k).prediction));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Yanaşma"
          value={mode}
          onChange={setMode}
          options={[
            { value: "model", label: "Xətti model" },
            { value: "knn", label: "k-NN" },
            { value: "both", label: "Hər ikisi" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <>
            <Plot
              xDomain={X_DOMAIN}
              yDomain={Y_DOMAIN}
              xLabel="Sahə (m²)"
              yLabel="Qiymət (min ₼)"
              ariaLabel={`Mənzil qiymətləri: ${data.length} nümunə. ${area} m² üçün xətti model ${linPred.toFixed(0)}, ${k}-NN ${knn.prediction.toFixed(0)} min manat proqnozlaşdırır.`}
            >
              {(s) => (
                <g>
                  <g clipPath={`url(#${s.clipId})`}>
                    {showKnn && <path d={linePath(knnCurve, s)} stroke="var(--chart-2)" strokeWidth={2} fill="none" opacity={0.9} />}
                    {showModel && (
                      <path
                        d={linePath(
                          [
                            { x: X_DOMAIN[0], y: predictLinear(linear, X_DOMAIN[0]) },
                            { x: X_DOMAIN[1], y: predictLinear(linear, X_DOMAIN[1]) },
                          ],
                          s,
                        )}
                        stroke="var(--chart-1)"
                        strokeWidth={2.5}
                        fill="none"
                      />
                    )}
                  </g>
                  <line x1={s.x(area)} x2={s.x(area)} y1={s.y(Y_DOMAIN[0])} y2={s.y(Y_DOMAIN[1])} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                  {showKnn &&
                    knn.neighborIndices.map((i) => (
                      <line
                        key={`n${i}`}
                        x1={s.x(area)}
                        y1={s.y(knn.prediction)}
                        x2={s.x(data[i]!.x)}
                        y2={s.y(data[i]!.y)}
                        stroke="var(--chart-2)"
                        strokeOpacity={0.6}
                      />
                    ))}
                  {data.map((p, i) => {
                    const isNeighbor = showKnn && knn.neighborIndices.includes(i);
                    return (
                      <circle
                        key={i}
                        cx={s.x(p.x)}
                        cy={s.y(p.y)}
                        r={isNeighbor ? 6 : 4.5}
                        fill={isNeighbor ? "var(--chart-2)" : "var(--surface)"}
                        stroke={isNeighbor ? "var(--chart-2)" : "var(--muted-foreground)"}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                  {showModel && <circle cx={s.x(area)} cy={s.y(linPred)} r={7} fill="var(--chart-1)" stroke="var(--surface)" strokeWidth={2} />}
                  {showKnn && (
                    <rect x={s.x(area) - 6} y={s.y(knn.prediction) - 6} width={12} height={12} rx={2} fill="var(--chart-2)" stroke="var(--surface)" strokeWidth={2} />
                  )}
                </g>
              )}
            </Plot>
            <Legend
              items={[
                { label: "Təlim nümunəsi", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--surface)" stroke="var(--muted-foreground)" strokeWidth={1.5} /> },
                ...(showModel ? [{ label: "Xətti model", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> }] : []),
                ...(showKnn ? [{ label: `${k}-NN proqnozu / qonşular`, swatch: <rect x={2} y={2} width={10} height={10} rx={2} fill="var(--chart-2)" /> }] : []),
              ]}
            />
          </>
        }
        controls={
          <>
            <SliderField label="Yeni mənzilin sahəsi" value={area} min={35} max={160} onChange={setArea} format={(v) => `${v} m²`} />
            {showKnn && <SliderField label="Qonşu sayı (k)" value={k} min={1} max={15} onChange={setK} />}
            <div className="grid grid-cols-2 gap-2">
              {showModel && <Stat label="Xətti proqnoz" value={`${linPred.toFixed(0)} min ₼`} />}
              {showKnn && <Stat label={`${k}-NN proqnozu`} value={`${knn.prediction.toFixed(0)} min ₼`} />}
              {showModel && <Stat label="Təlim RMSE (xətti)" value={rmseLinear.toFixed(1)} />}
              {showKnn && <Stat label={`Təlim RMSE (${k}-NN)`} value={rmseKnn.toFixed(1)} />}
            </div>
            {showModel && (
              <div className="rounded-lg border bg-surface-muted/50 px-3 py-2 font-mono text-xs leading-6">
                <p className="text-muted-foreground">Öyrənilmiş model:</p>
                <p>
                  ŷ = <b>{linear.intercept.toFixed(1)}</b> + <b>{linear.slope.toFixed(3)}</b> · x
                </p>
              </div>
            )}
            <LiveRegion>
              {mode === "model"
                ? "Model iki ədəd (θ₀, θ₁) saxlayır. Təlim məlumatı artıq lazım deyil."
                : k === 1
                  ? "k = 1: proqnoz yalnız ən yaxın tək mənzilə bərabərdir — küyə çox həssasdır və təlim xətası sıfıra yaxındır."
                  : `k-NN ${k} ən yaxın mənzilin qiymətini ortalayır. Bunun üçün bütün təlim məlumatını yadda saxlayır.`}
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
