"use client";

import { useId, useMemo, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { fixAreaTypo, type Apartment } from "@/lib/data/apartments";
import { pearson, quantile } from "@/lib/ml/stats";
import { ApartmentsGate } from "./dataset-gate";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { Plot } from "./plot";

type FeatureKey =
  | "sahe"
  | "otaq_sayi"
  | "metro_mesafe"
  | "mertebe"
  | "bina_mertebe"
  | "enlik"
  | "uzunluq"
  | "otaq_sahesi"
  | "mertebe_nisbeti";

const FEATURES: { key: FeatureKey; label: string; derived?: boolean }[] = [
  { key: "sahe", label: "Sahə (m²)" },
  { key: "otaq_sayi", label: "Otaq sayı" },
  { key: "metro_mesafe", label: "Metroya məsafə (km)" },
  { key: "mertebe", label: "Mərtəbə" },
  { key: "bina_mertebe", label: "Binanın mərtəbə sayı" },
  { key: "enlik", label: "Enlik" },
  { key: "uzunluq", label: "Uzunluq" },
  { key: "otaq_sahesi", label: "Otağa düşən sahə (yeni)", derived: true },
  { key: "mertebe_nisbeti", label: "Mərtəbə nisbəti (yeni)", derived: true },
];

function featureValue(a: Apartment, key: FeatureKey, fixTypos: boolean): number | null {
  const sahe = fixTypos ? fixAreaTypo(a.sahe) : a.sahe;
  switch (key) {
    case "sahe":
      return sahe;
    case "otaq_sahesi":
      return a.otaq_sayi ? sahe / a.otaq_sayi : null;
    case "mertebe_nisbeti":
      return a.mertebe / a.bina_mertebe;
    default:
      return a[key];
  }
}

export default function CorrelationExplorerDemo() {
  return <ApartmentsGate>{(data) => <Inner data={data} />}</ApartmentsGate>;
}

function Inner({ data }: { data: Apartment[] }) {
  const selectId = useId();
  const [mode, setMode] = useState<"scatter" | "map">("scatter");
  const [feature, setFeature] = useState<FeatureKey>("sahe");
  const [fixTypos, setFixTypos] = useState(false);

  const correlations = useMemo(
    () =>
      FEATURES.map((f) => {
        const pairs = data
          .map((a) => [featureValue(a, f.key, fixTypos), a.qiymet] as const)
          .filter((p): p is readonly [number, number] => p[0] !== null);
        return { ...f, r: pearson(pairs.map((p) => p[0]), pairs.map((p) => p[1])) };
      }).sort((a, b) => Math.abs(b.r) - Math.abs(a.r)),
    [data, fixTypos],
  );

  const points = useMemo(
    () =>
      data
        .map((a) => ({ x: featureValue(a, feature, fixTypos), y: a.qiymet / 1000 }))
        .filter((p): p is { x: number; y: number } => p.x !== null),
    [data, feature, fixTypos],
  );
  const current = correlations.find((c) => c.key === feature)!;
  const xs = points.map((p) => p.x);
  const xDomain: [number, number] = [Math.min(...xs), Math.max(...xs)];
  const pad = (xDomain[1] - xDomain[0]) * 0.04 || 1;

  const perM2 = useMemo(() => data.map((a) => a.qiymet / fixAreaTypo(a.sahe)), [data]);
  const [lo, hi] = [quantile(perM2, 0.05), quantile(perM2, 0.95)];
  const color = (v: number) => {
    const p = Math.round(Math.min(1, Math.max(0, (v - lo) / (hi - lo))) * 100);
    return `color-mix(in oklch, var(--chart-4) ${p}%, var(--chart-1))`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Görünüş"
          value={mode}
          onChange={setMode}
          options={[
            { value: "scatter", label: "Səpələnmə" },
            { value: "map", label: "Xəritə" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          mode === "scatter" ? (
            <Plot
              xDomain={[xDomain[0] - pad, xDomain[1] + pad]}
              yDomain={[0, 950]}
              xLabel={current.label}
              yLabel="Qiymət (min AZN)"
              formatX={(v) => (Math.abs(v) < 10 ? v.toFixed(2) : v.toFixed(0))}
              ariaLabel={`${current.label} və qiymət arasında səpələnmə qrafiki, ${points.length} mənzil. Korrelyasiya r = ${current.r.toFixed(2)}.`}
            >
              {(s) => (
                <g clipPath={`url(#${s.clipId})`}>
                  {points.map((p, i) => (
                    <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={2.2} fill="var(--chart-1)" opacity={0.28} />
                  ))}
                </g>
              )}
            </Plot>
          ) : (
            <>
              <Plot
                xDomain={[49.77, 50.19]}
                yDomain={[40.32, 40.49]}
                xLabel="Uzunluq"
                yLabel="Enlik"
                height={360}
                formatX={(v) => v.toFixed(2)}
                formatY={(v) => v.toFixed(2)}
                ariaLabel="Mənzillərin coğrafi xəritəsi, rəng 1 m² qiymətini göstərir: mərkəzdə daha bahalıdır."
              >
                {(s) => (
                  <g clipPath={`url(#${s.clipId})`}>
                    {data.map((a, i) => (
                      <circle key={a.id} cx={s.x(a.uzunluq)} cy={s.y(a.enlik)} r={2.4} fill={color(perM2[i]!)} opacity={0.65} />
                    ))}
                  </g>
                )}
              </Plot>
              <div className="flex items-center gap-2 px-1 pt-2 text-xs text-muted-foreground">
                <span>1 m² qiyməti: {Math.round(lo)} AZN</span>
                <span className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(to right, var(--chart-1), var(--chart-4))" }} aria-hidden />
                <span>{Math.round(hi)} AZN</span>
              </div>
            </>
          )
        }
        controls={
          mode === "scatter" ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor={selectId} className="text-sm font-medium">
                  Əlamət
                </label>
                <select
                  id={selectId}
                  value={feature}
                  onChange={(e) => setFeature(e.target.value as FeatureKey)}
                  className="h-9 w-full rounded-lg border bg-surface px-2 text-sm"
                >
                  {FEATURES.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={fixTypos} onChange={(e) => setFixTypos(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
                <span>
                  Sahədəki yazı səhvlərini düzəlt
                  <span className="block text-xs text-muted-foreground">400 m²-dən böyük qiymətlər ÷ 10</span>
                </span>
              </label>
              <Stat label="Pearson r (qiymət ilə)" value={current.r.toFixed(3)} />
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Bütün əlamətlər (|r|-ə görə)</p>
                <ul className="space-y-1">
                  {correlations.map((c) => (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => setFeature(c.key)}
                        aria-pressed={c.key === feature}
                        className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-xs hover:bg-surface-muted aria-pressed:bg-primary-soft"
                      >
                        <span className="w-28 truncate">{c.label}</span>
                        <span className="relative h-2 flex-1 rounded-full bg-surface-muted">
                          <span
                            className="absolute top-0 h-2 rounded-full"
                            style={{
                              width: `${Math.abs(c.r) * 50}%`,
                              left: c.r >= 0 ? "50%" : `${50 - Math.abs(c.r) * 50}%`,
                              background: c.r >= 0 ? "var(--chart-1)" : "var(--chart-4)",
                            }}
                          />
                        </span>
                        <span className="w-11 text-right font-mono tabular-nums">{c.r.toFixed(2)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <LiveRegion>
              Hər nöqtə bir mənzildir, rəng isə 1 m²-in qiymətidir. Mərkəzi rayonlar (Səbail, Nəsimi) ən bahalıdır, şərqə və şimala getdikcə qiymət
              düşür. Bu, enlik və uzunluğun niyə güclü əlamət olduğunu izah edir.
            </LiveRegion>
          )
        }
      />
    </div>
  );
}
