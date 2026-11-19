"use client";

import { RotateCcw, StepForward } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import {
  fitNearestCentroid,
  initCentroids,
  kMeansStep,
  predictNearestCentroid,
  type KMeansStepResult,
} from "@/lib/ml/clustering";
import { generateBlobs } from "@/lib/ml/datasets";
import type { Point } from "@/lib/ml/regression";
import { createRng } from "@/lib/ml/random";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { CLASS_COLORS, Marker, Plot } from "./plot";

type Mode = "supervised" | "unsupervised";
const CLASS_NAMES = ["A sinfi", "B sinfi", "C sinfi"];
const GRID = 28;

export default function SupervisionTypesDemo() {
  const points = useMemo(() => generateBlobs(3), []);
  const [mode, setMode] = useState<Mode>("supervised");

  // Supervised state
  const model = useMemo(() => fitNearestCentroid(points), [points]);
  const [query, setQuery] = useState<Point | null>(null);
  const regions = useMemo(() => {
    const cells: { x: number; y: number; cls: number }[] = [];
    for (let i = 0; i < GRID; i++)
      for (let j = 0; j < GRID; j++) {
        const p = { x: (i + 0.5) / GRID, y: (j + 0.5) / GRID };
        cells.push({ ...p, cls: predictNearestCentroid(model, p) });
      }
    return cells;
  }, [model]);

  // Unsupervised state
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(1);
  const [km, setKm] = useState<(KMeansStepResult & { iteration: number }) | null>(null);
  const initial = useMemo(() => initCentroids(points, k, createRng(seed * 97 + k)), [points, k, seed]);
  const centroids = km?.centroids ?? initial;

  const step = () => {
    const res = kMeansStep(points, centroids, km?.assignments);
    setKm({ ...res, iteration: (km?.iteration ?? 0) + 1 });
  };
  const resetKMeans = (nextK = k) => {
    setKm(null);
    setSeed((s) => s + 1);
    setK(nextK);
  };

  const predicted = query ? predictNearestCentroid(model, query) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Öyrənmə növü"
          value={mode}
          onChange={setMode}
          options={[
            { value: "supervised", label: "Nəzarətli" },
            { value: "unsupervised", label: "Nəzarətsiz" },
          ]}
        />
        <p className="text-xs text-muted-foreground">
          {mode === "supervised" ? "Etiketlər məlumdur → təsnifat" : "Etiketlər yoxdur → klasterləşdirmə"}
        </p>
      </div>
      <DemoLayout
        plot={
          <>
            <Plot
              xDomain={[0, 1]}
              yDomain={[0, 1]}
              xLabel="Əlamət 1 (x₁)"
              yLabel="Əlamət 2 (x₂)"
              formatX={(v) => v.toFixed(1)}
              formatY={(v) => v.toFixed(1)}
              ariaLabel={
                mode === "supervised"
                  ? "Üç etiketli sinifdən ibarət nöqtələr və ən yaxın mərkəz təsnifatçısının qərar bölgələri. Yeni nöqtəni təsnif etmək üçün klikləyin."
                  : `Etiketsiz nöqtələr və ${k} klaster mərkəzi. k-means iterasiyası: ${km?.iteration ?? 0}.`
              }
              onDataClick={mode === "supervised" ? setQuery : undefined}
            >
              {(s) => (
                <g>
                  {mode === "supervised" &&
                    regions.map((c) => (
                      <rect
                        key={`${c.x}-${c.y}`}
                        x={s.x(c.x - 0.5 / GRID)}
                        y={s.y(c.y + 0.5 / GRID)}
                        width={s.innerWidth / GRID + 0.5}
                        height={s.innerHeight / GRID + 0.5}
                        fill={CLASS_COLORS[c.cls]}
                        opacity={0.09}
                      />
                    ))}
                  {points.map((p, i) => {
                    const cls = mode === "supervised" ? p.label : km ? (km.assignments[i] ?? 0) : -1;
                    return cls < 0 ? (
                      <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={4.5} fill="var(--muted-foreground)" opacity={0.55} />
                    ) : (
                      <Marker key={i} cx={s.x(p.x)} cy={s.y(p.y)} cls={cls} size={4.5} />
                    );
                  })}
                  {mode === "supervised" &&
                    [...model.entries()].map(([label, c]) => (
                      <g key={label} aria-hidden>
                        <circle cx={s.x(c.x)} cy={s.y(c.y)} r={9} fill="none" stroke={CLASS_COLORS[label]} strokeWidth={2} strokeDasharray="3 2" />
                      </g>
                    ))}
                  {mode === "supervised" && query && predicted !== null && (
                    <g>
                      <line
                        x1={s.x(query.x)}
                        y1={s.y(query.y)}
                        x2={s.x(model.get(predicted)!.x)}
                        y2={s.y(model.get(predicted)!.y)}
                        stroke={CLASS_COLORS[predicted]}
                        strokeDasharray="4 3"
                      />
                      <circle cx={s.x(query.x)} cy={s.y(query.y)} r={8} fill="var(--foreground)" stroke="var(--surface)" strokeWidth={2} />
                      <text x={s.x(query.x) + 12} y={s.y(query.y) + 4} fontSize={12} fontWeight={600} fill="var(--foreground)">
                        ? → {CLASS_NAMES[predicted]}
                      </text>
                    </g>
                  )}
                  {mode === "unsupervised" &&
                    centroids.map((c, i) => (
                      <g key={i} transform={`translate(${s.x(c.x)} ${s.y(c.y)})`}>
                        <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="var(--surface)" strokeWidth={6} strokeLinecap="round" />
                        <path
                          d="M-8,-8 L8,8 M8,-8 L-8,8"
                          stroke={km ? CLASS_COLORS[i % CLASS_COLORS.length] : "var(--foreground)"}
                          strokeWidth={3}
                          strokeLinecap="round"
                        />
                      </g>
                    ))}
                </g>
              )}
            </Plot>
            <Legend
              items={
                mode === "supervised"
                  ? CLASS_NAMES.map((name, i) => ({ label: name, swatch: <Marker cx={7} cy={7} cls={i} size={4.5} /> }))
                  : [
                      { label: "Etiketsiz nöqtə", swatch: <circle cx={7} cy={7} r={4.5} fill="var(--muted-foreground)" opacity={0.6} /> },
                      { label: "Klaster mərkəzi", swatch: <path d="M2,2 L12,12 M12,2 L2,12" stroke="var(--foreground)" strokeWidth={2.5} /> },
                    ]
              }
            />
          </>
        }
        controls={
          mode === "supervised" ? (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Model hər sinfin <b className="text-foreground">orta nöqtəsini</b> (qırıq dairə) öyrənib. Yeni nöqtə ən yaxın mərkəzin
                sinfinə aid edilir. Fon rəngləri qərar bölgələridir.
              </p>
              <LiveRegion>
                {query && predicted !== null ? (
                  <>
                    Nöqtə ({query.x.toFixed(2)}, {query.y.toFixed(2)}) → <b>{CLASS_NAMES[predicted]}</b>
                  </>
                ) : (
                  "Proqnoz üçün qrafikdə istənilən yerə klikləyin."
                )}
              </LiveRegion>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Təlim nümunələri" value={points.length} />
                <Stat label="Siniflər" value={model.size} />
              </div>
              <Button variant="outline" size="sm" onClick={() => setQuery(null)} disabled={!query}>
                <RotateCcw /> Təmizlə
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Alqoritm etiketləri <b className="text-foreground">görmür</b>. Hər addımda nöqtələri ən yaxın mərkəzə bağlayır, sonra mərkəzləri
                qrupun ortasına köçürür.
              </p>
              <SliderField label="Klaster sayı (k)" value={k} min={2} max={4} onChange={(v) => resetKMeans(v)} />
              <div className="flex gap-2">
                <Button size="sm" onClick={step} disabled={km?.converged}>
                  <StepForward /> k-means addımı
                </Button>
                <Button size="sm" variant="outline" onClick={() => resetKMeans()}>
                  <RotateCcw /> Sıfırla
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="İterasiya" value={km?.iteration ?? 0} />
                <Stat label="Vəziyyət" value={km?.converged ? "Yığıldı ✓" : "Davam edir"} tone={km?.converged ? "good" : "neutral"} />
              </div>
              <LiveRegion>
                {km?.converged
                  ? "Təyinatlar artıq dəyişmir — alqoritm yığıldı. Klasterlər həqiqi siniflərə nə qədər uyğundur?"
                  : km
                    ? `${km.iteration}-ci addım tamamlandı.`
                    : "Mərkəzlər təsadüfi nöqtələrdən seçildi. Addım düyməsini basın."}
              </LiveRegion>
            </>
          )
        }
      />
    </div>
  );
}
