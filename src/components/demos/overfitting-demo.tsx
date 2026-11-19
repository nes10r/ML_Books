"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SliderField } from "@/components/ui/slider-field";
import { generateNoisyCurve, trueCurve } from "@/lib/ml/datasets";
import { rootMeanSquaredError } from "@/lib/ml/metrics";
import { fitPolynomialRidge, predictPolynomial, type Point, type PolynomialModel } from "@/lib/ml/regression";
import { diagnoseFit as diagnose, type FitDiagnosis } from "@/lib/ml/diagnostics";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const MAX_DEGREE = 12;
const DOMAIN = { xMin: 0, xMax: 1 };

function evaluate(model: PolynomialModel, pts: Point[]) {
  return rootMeanSquaredError(pts.map((p) => p.y), pts.map((p) => predictPolynomial(model, p.x)));
}

const diagnosisText: Record<FitDiagnosis, { label: string; body: string; variant: "warning" | "success" }> = {
  underfit: {
    label: "Underfitting",
    body: "Model çox sadədir: həm təlim, həm də validasiya xətası yüksəkdir. Dərəcəni artırın və ya λ-nı azaldın.",
    variant: "warning",
  },
  overfit: {
    label: "Overfitting",
    body: "Model təlim nöqtələrini əzbərləyir: təlim xətası aşağı, validasiya xətası isə yüksəkdir. λ-nı artırın və ya dərəcəni azaldın.",
    variant: "warning",
  },
  balanced: {
    label: "Yaxşı balans",
    body: "Model əsas qanunauyğunluğu tutur və yeni nöqtələrə yaxşı ümumiləşdirir.",
    variant: "success",
  },
};

export default function OverfittingDemo() {
  const { train, validation } = useMemo(() => generateNoisyCurve(11, 30, 0.4), []);
  const [degree, setDegree] = useState(3);
  const [logLambda, setLogLambda] = useState(-8);
  const [showVal, setShowVal] = useState(true);
  const [showTruth, setShowTruth] = useState(false);
  const lambda = logLambda <= -8 ? 0 : 10 ** logLambda;

  const model = useMemo(() => fitPolynomialRidge(train, degree, lambda, DOMAIN), [train, degree, lambda]);
  const trainRmse = evaluate(model, train);
  const valRmse = evaluate(model, validation);
  const dx = diagnose(trainRmse, valRmse);

  const curve = useMemo(() => {
    const pts: Point[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = i / 240;
      pts.push({ x, y: Math.max(-3, Math.min(3, predictPolynomial(model, x))) });
    }
    return pts;
  }, [model]);

  const truth = useMemo(() => Array.from({ length: 121 }, (_, i) => ({ x: i / 120, y: trueCurve(i / 120) })), []);

  const errorByDegree = useMemo(
    () =>
      Array.from({ length: MAX_DEGREE }, (_, i) => {
        const m = fitPolynomialRidge(train, i + 1, lambda, DOMAIN);
        return { degree: i + 1, train: evaluate(m, train), val: evaluate(m, validation) };
      }),
    [train, validation, lambda],
  );

  return (
    <DemoLayout
      plot={
        <>
          <Plot
            xDomain={[0, 1]}
            yDomain={[-1.6, 1.8]}
            xLabel="x"
            yLabel="y"
            formatX={(v) => v.toFixed(1)}
            formatY={(v) => v.toFixed(1)}
            ariaLabel={`Dərəcəsi ${degree} olan polinom model. Təlim RMSE ${trainRmse.toFixed(3)}, validasiya RMSE ${valRmse.toFixed(3)}. Diaqnoz: ${diagnosisText[dx].label}.`}
          >
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  {showTruth && <path d={linePath(truth, s)} stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="6 4" fill="none" />}
                  <path d={linePath(curve, s)} stroke="var(--chart-1)" strokeWidth={2.5} fill="none" />
                </g>
                {train.map((p, i) => (
                  <circle key={`t${i}`} cx={s.x(p.x)} cy={s.y(p.y)} r={4.5} fill="var(--chart-1)" />
                ))}
                {showVal &&
                  validation.map((p, i) => (
                    <circle key={`v${i}`} cx={s.x(p.x)} cy={s.y(p.y)} r={4.5} fill="var(--surface)" stroke="var(--chart-4)" strokeWidth={2} />
                  ))}
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim nöqtəsi", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--chart-1)" /> },
              { label: "Validasiya nöqtəsi", swatch: <circle cx={7} cy={7} r={4} fill="var(--surface)" stroke="var(--chart-4)" strokeWidth={2} /> },
              { label: "Model", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              ...(showTruth ? [{ label: "Həqiqi funksiya", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="3 2" /> }] : []),
            ]}
          />
          <ErrorCurve data={errorByDegree} current={degree} />
        </>
      }
      controls={
        <>
          <SliderField label="Polinomun dərəcəsi" value={degree} min={1} max={MAX_DEGREE} onChange={setDegree} />
          <SliderField
            label="Requlyarlaşdırma (λ)"
            value={logLambda}
            min={-8}
            max={0}
            step={0.5}
            onChange={setLogLambda}
            format={(v) => (v <= -8 ? "0" : `10^${v}`)}
          />
          <div className="space-y-1.5 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showVal} onChange={(e) => setShowVal(e.target.checked)} className="accent-[var(--primary)]" />
              Validasiya nöqtələrini göstər
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showTruth} onChange={(e) => setShowTruth(e.target.checked)} className="accent-[var(--primary)]" />
              Həqiqi funksiyanı göstər
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Təlim RMSE" value={trainRmse.toFixed(3)} />
            <Stat label="Validasiya RMSE" value={valRmse.toFixed(3)} tone={dx === "overfit" ? "bad" : dx === "balanced" ? "good" : "neutral"} />
          </div>
          <div className="space-y-2">
            <Badge variant={diagnosisText[dx].variant}>{diagnosisText[dx].label}</Badge>
            <LiveRegion>{diagnosisText[dx].body}</LiveRegion>
          </div>
        </>
      }
    />
  );
}

function ErrorCurve({ data, current }: { data: { degree: number; train: number; val: number }[]; current: number }) {
  const yMax = 0.8;
  const clamp = (v: number) => Math.min(yMax, v);
  return (
    <div className="pt-4">
      <p className="px-1 pb-1 text-xs text-muted-foreground">Xəta və model mürəkkəbliyi (validasiya xətası 0.8-də kəsilib)</p>
      <Plot
        height={200}
        xDomain={[1, MAX_DEGREE]}
        yDomain={[0, yMax]}
        xTicks={data.map((d) => d.degree)}
        yTicks={[0, 0.2, 0.4, 0.6, 0.8]}
        formatY={(v) => v.toFixed(1)}
        xLabel="Dərəcə"
        ariaLabel="Polinom dərəcəsinə görə təlim və validasiya xətası"
      >
        {(s) => (
          <g>
            <line x1={s.x(current)} x2={s.x(current)} y1={s.y(0)} y2={s.y(yMax)} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
            <path d={linePath(data.map((d) => ({ x: d.degree, y: clamp(d.train) })), s)} stroke="var(--chart-1)" strokeWidth={2} fill="none" />
            <path d={linePath(data.map((d) => ({ x: d.degree, y: clamp(d.val) })), s)} stroke="var(--chart-4)" strokeWidth={2} fill="none" />
            {data.map((d) => (
              <g key={d.degree}>
                <circle cx={s.x(d.degree)} cy={s.y(clamp(d.train))} r={d.degree === current ? 4.5 : 2.5} fill="var(--chart-1)" />
                <circle cx={s.x(d.degree)} cy={s.y(clamp(d.val))} r={d.degree === current ? 4.5 : 2.5} fill="var(--chart-4)" />
              </g>
            ))}
            <text x={s.x(MAX_DEGREE) - 4} y={s.y(clamp(data.at(-1)!.train)) - 6} fontSize={11} textAnchor="end" fill="var(--chart-1)">
              təlim
            </text>
            <text x={s.x(MAX_DEGREE) - 4} y={s.y(clamp(data.at(-1)!.val)) + 14} fontSize={11} textAnchor="end" fill="var(--chart-4)">
              validasiya
            </text>
          </g>
        )}
      </Plot>
    </div>
  );
}
