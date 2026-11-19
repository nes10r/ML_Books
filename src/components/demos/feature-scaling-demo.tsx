"use client";

import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { fixAreaTypo, type Apartment } from "@/lib/data/apartments";
import { fitScaler, type ScalingMethod } from "@/lib/ml/preprocessing";
import { histogram, mean, skewness, std } from "@/lib/ml/stats";
import { ApartmentsGate } from "./dataset-gate";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { Plot } from "./plot";

type Feature = "sahe" | "metro_mesafe" | "qiymet";
const FEATURE_LABEL: Record<Feature, string> = { sahe: "Sahə", metro_mesafe: "Metroya məsafə", qiymet: "Qiymət" };

const METHOD_TEXT: Record<Exclude<ScalingMethod, "log">, string> = {
  none: "Xam qiymətlər. Əlamətlərin miqyası çox fərqlidir: qiymət yüz minlərlədir, məsafə isə bir neçə km.",
  minmax: "Min-max: (x − min) / (max − min) → [0, 1]. Bir kənar qiymət bütün digərlərini sola “sıxa” bilər.",
  standard: "Standartlaşdırma: (x − μ) / σ → orta 0, standart kənarlaşma 1. Kənar qiymətlərə daha dözümlüdür, lakin əyilməni düzəltmir.",
  "log-standard": "Əvvəl log, sonra standartlaşdırma. Uzun sağ “quyruq” sıxılır, paylanma simmetrikə yaxınlaşır.",
};

export default function FeatureScalingDemo() {
  return <ApartmentsGate>{(data) => <Inner data={data} />}</ApartmentsGate>;
}

function Inner({ data }: { data: Apartment[] }) {
  const [feature, setFeature] = useState<Feature>("sahe");
  const [method, setMethod] = useState<Exclude<ScalingMethod, "log">>("none");
  const [keepTypos, setKeepTypos] = useState(true);

  const raw = useMemo(
    () =>
      data
        .map((a) => (feature === "sahe" ? (keepTypos ? a.sahe : fixAreaTypo(a.sahe)) : a[feature]))
        .filter((v): v is number => v !== null && v > 0),
    [data, feature, keepTypos],
  );
  const values = useMemo(() => {
    const f = fitScaler(method, raw);
    return raw.map(f);
  }, [raw, method]);

  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const bins = useMemo(() => histogram(values, 36, [lo, hi]), [values, lo, hi]);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const sk = skewness(values);
  const fmt = (v: number) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(2));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Əlamət"
          value={feature}
          onChange={setFeature}
          options={(Object.keys(FEATURE_LABEL) as Feature[]).map((f) => ({ value: f, label: FEATURE_LABEL[f] }))}
        />
      </div>
      <DemoLayout
        plot={
          <Plot
            xDomain={[lo, hi]}
            yDomain={[0, maxCount * 1.08]}
            xLabel={`${FEATURE_LABEL[feature]} — çevrilmiş qiymət`}
            yLabel="Mənzil sayı"
            formatX={fmt}
            formatY={(v) => v.toFixed(0)}
            ariaLabel={`${FEATURE_LABEL[feature]} əlamətinin histoqramı. Min ${fmt(lo)}, maks ${fmt(hi)}, əyilmə ${sk.toFixed(2)}.`}
          >
            {(s) => (
              <g>
                {bins.map((b, i) => (
                  <rect
                    key={i}
                    x={s.x(b.x0) + 0.5}
                    y={s.y(b.count)}
                    width={Math.max(0, s.x(b.x1) - s.x(b.x0) - 1)}
                    height={s.y(0) - s.y(b.count)}
                    fill="var(--chart-1)"
                    opacity={0.8}
                  />
                ))}
              </g>
            )}
          </Plot>
        }
        controls={
          <>
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Çevirmə</p>
              <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Çevirmə üsulu">
                {(Object.keys(METHOD_TEXT) as (keyof typeof METHOD_TEXT)[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={method === m}
                    onClick={() => setMethod(m)}
                    className="rounded-md border px-2 py-1.5 text-xs font-medium aria-checked:border-primary aria-checked:bg-primary-soft aria-checked:text-primary-soft-foreground"
                  >
                    {{ none: "Yoxdur", minmax: "Min-max", standard: "Standart", "log-standard": "Log + standart" }[m]}
                  </button>
                ))}
              </div>
            </div>
            {feature === "sahe" && (
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={keepTypos} onChange={(e) => setKeepTypos(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
                <span>
                  Yazı səhvlərini saxla
                  <span className="block text-xs text-muted-foreground">6 mənzil: 725 m², 1001 m²…</span>
                </span>
              </label>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Min" value={fmt(lo)} />
              <Stat label="Maks" value={fmt(hi)} />
              <Stat label="Orta (μ)" value={fmt(mean(values))} />
              <Stat label="Std (σ)" value={fmt(std(values))} />
              <Stat label="Əyilmə" value={sk.toFixed(2)} tone={Math.abs(sk) < 0.5 ? "good" : Math.abs(sk) > 1.5 ? "bad" : "neutral"} />
              <Stat label="Nümunə" value={values.length} />
            </div>
            <LiveRegion>{METHOD_TEXT[method]}</LiveRegion>
          </>
        }
      />
    </div>
  );
}
