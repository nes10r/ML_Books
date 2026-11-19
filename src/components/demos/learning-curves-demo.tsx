"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { generateQuadratic, quadraticTruth } from "@/lib/ml/datasets";
import { polynomialLearningCurve } from "@/lib/ml/learning-curve";
import { fitPolynomialRidge, predictPolynomial } from "@/lib/ml/regression";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";

const DOMAIN = { xMin: -3, xMax: 3 };
const SIZES = Array.from({ length: 79 }, (_, i) => i + 2);
const Y_MAX = 4;

export default function LearningCurvesDemo() {
  const { train, validation } = useMemo(() => generateQuadratic(), []);
  const [degree, setDegree] = useState(1);
  const [size, setSize] = useState(80);

  const curve = useMemo(() => polynomialLearningCurve(train, validation, degree, SIZES, DOMAIN), [train, validation, degree]);
  const at = curve.find((c) => c.size === size)!;
  const model = useMemo(() => fitPolynomialRidge(train.slice(0, size), degree, 1e-8, DOMAIN), [train, size, degree]);
  const fit = Array.from({ length: 121 }, (_, i) => {
    const x = -3 + i * 0.05;
    return { x, y: Math.max(-6, Math.min(14, predictPolynomial(model, x))) };
  });
  const truth = Array.from({ length: 61 }, (_, i) => ({ x: -3 + i * 0.1, y: quadraticTruth(-3 + i * 0.1) }));
  const tail = curve.slice(-10);
  const endTrain = tail.reduce((s, c) => s + c.train, 0) / tail.length;
  const endVal = tail.reduce((s, c) => s + c.validation, 0) / tail.length;
  const clamp = (v: number) => Math.min(Y_MAX, v);

  const diagnosis =
    endTrain > 1.2
      ? "Underfitting: hər iki əyri yüksək platoya çatıb və bir-birinə yaxındır. Daha çox məlumat kömək etməyəcək — daha mürəkkəb model lazımdır."
      : endVal - endTrain > 0.15
        ? "Overfitting əlaməti: əyrilər arasında boşluq var — təlim xətası validasiyadan xeyli aşağıdır. Daha çox məlumat və ya requlyarlaşdırma kömək edər."
        : "Yaxşı uyğunluq: hər iki əyri küy səviyyəsinə (σ = 0.8) yaxın aşağı platoya enir.";

  return (
    <DemoLayout
      plot={
        <div className="space-y-4">
          <Plot
            height={300}
            xDomain={[2, 80]}
            yDomain={[0, Y_MAX]}
            xLabel="Təlim dəstinin ölçüsü (m)"
            yLabel="RMSE"
            formatY={(v) => v.toFixed(1)}
            formatX={(v) => v.toFixed(0)}
            ariaLabel={`Dərəcəsi ${degree} olan polinom üçün öyrənmə əyriləri. m = ${size}: təlim RMSE ${at.train.toFixed(2)}, validasiya RMSE ${at.validation.toFixed(2)}.`}
          >
            {(s) => (
              <g>
                <line x1={s.x(2)} x2={s.x(80)} y1={s.y(0.8)} y2={s.y(0.8)} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <text x={s.x(79)} y={s.y(0.8) - 5} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
                  küy səviyyəsi
                </text>
                <g clipPath={`url(#${s.clipId})`}>
                  <path d={linePath(curve.map((c) => ({ x: c.size, y: clamp(c.train) })), s)} stroke="var(--chart-1)" strokeWidth={2.2} fill="none" />
                  <path d={linePath(curve.map((c) => ({ x: c.size, y: clamp(c.validation) })), s)} stroke="var(--chart-4)" strokeWidth={2.2} fill="none" />
                </g>
                <line x1={s.x(size)} x2={s.x(size)} y1={s.y(0)} y2={s.y(Y_MAX)} stroke="var(--foreground)" strokeOpacity={0.35} />
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim RMSE", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-1)" strokeWidth={2.5} /> },
              { label: "Validasiya RMSE (4-də kəsilib)", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
            ]}
          />
          <Plot height={220} xDomain={[-3, 3]} yDomain={[-2, 12]} xLabel="x" yLabel="y" formatX={(v) => v.toFixed(0)} formatY={(v) => v.toFixed(0)} ariaLabel={`İlk ${size} təlim nöqtəsi və öyrənilmiş model`}>
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  <path d={linePath(truth, s)} stroke="var(--chart-3)" strokeDasharray="5 4" strokeWidth={1.8} fill="none" />
                  <path d={linePath(fit, s)} stroke="var(--chart-1)" strokeWidth={2.2} fill="none" />
                </g>
                {train.slice(0, size).map((p, i) => (
                  <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3} fill="var(--chart-1)" opacity={0.6} />
                ))}
              </g>
            )}
          </Plot>
        </div>
      }
      controls={
        <>
          <SliderField label="Polinomun dərəcəsi" value={degree} min={1} max={12} onChange={setDegree} />
          <SliderField label="Təlim nümunələri (m)" value={size} min={2} max={80} onChange={setSize} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label={`Təlim RMSE (m=${size})`} value={at.train.toFixed(2)} />
            <Stat label="Validasiya RMSE" value={at.validation > 99 ? ">99" : at.validation.toFixed(2)} />
          </div>
          <LiveRegion>{diagnosis}</LiveRegion>
          <p className="text-xs text-muted-foreground">Həqiqi funksiya (qırıq xətt): y = 2 − 1.2x + 0.5x². Validasiya dəsti: 40 nöqtə.</p>
        </>
      }
    />
  );
}
