"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import type { CsvRow } from "@/lib/data/csv";
import { DIGITS_URL, toDigits, type Digit } from "@/lib/data/digits";
import { fitPCA, pcaInverse, pcaTransform } from "@/lib/ml/pca";
import { DatasetGate } from "./dataset-gate";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { DigitImage } from "./digit-image";
import { linePath, Plot } from "./plot";

const parseDigitsOnly = ([rows]: CsvRow[][]) => toDigits(rows!);
const SAMPLE_IDS = [1, 12, 23, 34, 45, 56, 67, 78];

export default function PcaCompressionDemo() {
  return <DatasetGate urls={[DIGITS_URL]} parse={parseDigitsOnly}>{(digits) => <Inner digits={digits} />}</DatasetGate>;
}

function Inner({ digits }: { digits: Digit[] }) {
  const pca = useMemo(() => fitPCA(digits.map((d) => d.pixels)), [digits]);
  const [k, setK] = useState(10);
  const cumulative = useMemo(() => {
    const out: number[] = [];
    for (const r of pca.explainedVarianceRatio) out.push((out.at(-1) ?? 0) + r);
    return out;
  }, [pca]);
  const samples = SAMPLE_IDS.map((id) => digits.find((d) => d.id === id)!).filter(Boolean);
  const recon = samples.map((d) => pcaInverse(pca, pcaTransform(pca, d.pixels, k)).map((v) => Math.min(16, Math.max(0, v))));
  const mse = useMemo(() => {
    let s = 0;
    for (const d of digits) {
      const r = pcaInverse(pca, pcaTransform(pca, d.pixels, k));
      for (let j = 0; j < 64; j++) s += (d.pixels[j]! - r[j]!) ** 2;
    }
    return s / (digits.length * 64);
  }, [digits, pca, k]);
  const need95 = cumulative.findIndex((c) => c >= 0.95) + 1;
  const eigen = pca.components.slice(0, 8).map((c) => {
    const max = Math.max(...c.map(Math.abs));
    return c.map((v) => (Math.abs(v) / max) * 16);
  });

  return (
    <DemoLayout
      plot={
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Orijinal (yuxarı) və {k} komponentdən bərpa (aşağı)</p>
            <div className="grid grid-cols-8 gap-1.5">
              {samples.map((d, i) => (
                <div key={d.id} className="space-y-1.5">
                  <DigitImage pixels={d.pixels} label={`Orijinal şəkil: rəqəm ${d.label}`} size={56} className="w-full border" />
                  <DigitImage pixels={recon[i]!} label={`${k} komponentdən bərpa olunmuş rəqəm ${d.label}`} size={56} className="w-full border border-primary/40" />
                </div>
              ))}
            </div>
          </div>
          <Plot
            height={200}
            xDomain={[1, 64]}
            yDomain={[0, 1.01]}
            xTicks={[1, 8, 16, 24, 32, 40, 48, 56, 64]}
            formatY={(v) => `${Math.round(v * 100)}%`}
            xLabel="Komponent sayı"
            yLabel="İzah olunan dispersiya"
            ariaLabel={`Kumulyativ izah olunan dispersiya. ${k} komponent dispersiyanın ${(cumulative[k - 1]! * 100).toFixed(1)}%-ni saxlayır.`}
          >
            {(s) => (
              <g>
                <line x1={s.x(1)} x2={s.x(64)} y1={s.y(0.95)} y2={s.y(0.95)} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <path d={linePath(cumulative.map((c, i) => ({ x: i + 1, y: c })), s)} stroke="var(--chart-1)" strokeWidth={2.2} fill="none" />
                <circle cx={s.x(k)} cy={s.y(cumulative[k - 1]!)} r={5} fill="var(--chart-4)" />
              </g>
            )}
          </Plot>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">İlk 8 əsas komponent (“məxsusi rəqəmlər”, mütləq qiymət)</p>
            <div className="grid grid-cols-8 gap-1.5">
              {eigen.map((px, i) => (
                <DigitImage key={i} pixels={px} label={`${i + 1}-ci əsas komponent`} size={48} className="w-full border" />
              ))}
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <SliderField label="Komponent sayı (d)" value={k} min={1} max={64} onChange={setK} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Saxlanılan dispersiya" value={`${(cumulative[k - 1]! * 100).toFixed(1)}%`} />
            <Stat label="Ölçü" value={`64 → ${k}`} />
            <Stat label="Orta kvadrat xəta" value={mse.toFixed(2)} />
            <Stat label="95% üçün lazım" value={`${need95} komponent`} />
          </div>
          <LiveRegion>
            Hər şəkil 64 piksel əvəzinə {k} ədədlə saxlanılır və bu ədədlərdən təxmini bərpa olunur. Bütün hesablama — 64×64 kovariasiya matrisinin məxsusi
            vektorları — brauzerdə aparılır.
          </LiveRegion>
        </>
      }
    />
  );
}
