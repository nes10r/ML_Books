"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { Digit, DigitOutput } from "@/lib/data/digits";
import { confusionMatrix } from "@/lib/ml/classification";
import { DigitsGate } from "./dataset-gate";
import { DemoLayout, LiveRegion, Stat } from "./demo-ui";
import { DigitImage } from "./digit-image";

type Mode = "count" | "row" | "errors";

/** Off-diagonal cell with the most errors. */
export function worstConfusion(m: number[][]): [number, number] {
  let best: [number, number] = [0, 1];
  let max = -1;
  m.forEach((row, i) =>
    row.forEach((v, j) => {
      if (i !== j && v > max) {
        max = v;
        best = [i, j];
      }
    }),
  );
  return best;
}

export default function ConfusionExplorerDemo() {
  return <DigitsGate>{({ digits, outputs }) => <Inner digits={digits} outputs={outputs} />}</DigitsGate>;
}

function Inner({ digits, outputs }: { digits: Digit[]; outputs: DigitOutput[] }) {
  const [mode, setMode] = useState<Mode>("errors");
  const matrix = useMemo(() => confusionMatrix(outputs.map((o) => o.label), outputs.map((o) => o.multiPred), 10), [outputs]);
  const [selected, setSelected] = useState<[number, number]>(() => worstConfusion(matrix));
  const byId = useMemo(() => new Map(digits.map((d) => [d.id, d])), [digits]);

  const rowTotals = matrix.map((r) => r.reduce((a, b) => a + b, 0));
  const value = (i: number, j: number) => {
    const v = matrix[i]![j]!;
    if (mode === "count") return v;
    if (mode === "errors" && i === j) return 0;
    return v / rowTotals[i]!;
  };
  const values = matrix.flatMap((row, i) => row.map((_, j) => value(i, j)));
  const max = Math.max(...values) || 1;
  const correct = matrix.reduce((s, row, i) => s + row[i]!, 0);
  const total = outputs.length;

  const [ti, pj] = selected;
  const examples = outputs.filter((o) => o.label === ti && o.multiPred === pj).slice(0, 18);

  const onKey = (e: KeyboardEvent, i: number, j: number) => {
    const moves: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    const mv = moves[e.key];
    if (mv) {
      e.preventDefault();
      const ni = Math.min(9, Math.max(0, i + mv[0]));
      const nj = Math.min(9, Math.max(0, j + mv[1]));
      setSelected([ni, nj]);
      document.getElementById(`cm-${ni}-${nj}`)?.focus();
    }
  };

  const fmt = (i: number, j: number) => {
    const v = value(i, j);
    if (mode === "count") return String(v);
    if (mode === "errors" && i === j) return "";
    return v === 0 ? "0" : `${Math.round(v * 100)}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SegmentedControl
          label="Göstərmə rejimi"
          value={mode}
          onChange={setMode}
          options={[
            { value: "count", label: "Say" },
            { value: "row", label: "Sətir üzrə %" },
            { value: "errors", label: "Yalnız səhvlər %" },
          ]}
        />
      </div>
      <DemoLayout
        plot={
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="mx-auto border-separate border-spacing-0.5 text-center text-xs" role="grid" aria-label="Qarışıqlıq matrisi: sətirlər həqiqi rəqəm, sütunlar proqnoz">
                <thead>
                  <tr>
                    <th className="px-1 text-[10px] font-normal text-muted-foreground">həq.\proq.</th>
                    {Array.from({ length: 10 }, (_, j) => (
                      <th key={j} scope="col" className="w-9 font-mono font-semibold">
                        {j}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <th scope="row" className="pr-1 font-mono font-semibold">
                        {i}
                      </th>
                      {row.map((_, j) => {
                        const intensity = value(i, j) / max;
                        const isSel = i === ti && j === pj;
                        return (
                          <td
                            key={j}
                            id={`cm-${i}-${j}`}
                            role="gridcell"
                            tabIndex={isSel ? 0 : -1}
                            aria-selected={isSel}
                            aria-label={`Həqiqi ${i}, proqnoz ${j}: ${matrix[i]![j]} şəkil`}
                            onClick={() => setSelected([i, j])}
                            onKeyDown={(e) => onKey(e, i, j)}
                            className="h-9 w-9 cursor-pointer rounded font-mono tabular-nums outline-offset-1 focus-visible:outline-2 focus-visible:outline-ring"
                            style={{
                              background: `color-mix(in oklch, ${i === j ? "var(--primary)" : "var(--chart-4)"} ${Math.round(intensity * 85)}%, var(--surface))`,
                              color: intensity > 0.55 ? "var(--primary-foreground)" : "var(--foreground)",
                              boxShadow: isSel ? "0 0 0 2px var(--foreground)" : undefined,
                            }}
                          >
                            {fmt(i, j)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">
                Həqiqi <b>{ti}</b> → proqnoz <b>{pj}</b>: {matrix[ti]![pj]} şəkil
                {examples.length < matrix[ti]![pj]! && ` (ilk ${examples.length})`}
              </p>
              {examples.length === 0 ? (
                <p className="text-sm text-muted-foreground">Bu xanada şəkil yoxdur.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {examples.map((o) => {
                    const d = byId.get(o.id);
                    return d ? (
                      <li key={o.id}>
                        <DigitImage pixels={d.pixels} label={`Şəkil ${o.id}: həqiqi ${o.label}, proqnoz ${o.multiPred}`} size={52} className="border" />
                      </li>
                    ) : null;
                  })}
                </ul>
              )}
            </div>
          </div>
        }
        controls={
          <>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Dəqiqlik" value={`${((correct / total) * 100).toFixed(1)}%`} />
              <Stat label="Səhv sayı" value={total - correct} />
              <Stat label={`Recall (${ti})`} value={`${((matrix[ti]![ti]! / rowTotals[ti]!) * 100).toFixed(0)}%`} />
              <Stat label={`${ti}-lərin payı bu xanada`} value={`${((matrix[ti]![pj]! / rowTotals[ti]!) * 100).toFixed(1)}%`} />
            </div>
            <LiveRegion>
              “Yalnız səhvlər” rejimində diaqonal gizlədilir və hər sətir öz ümumi sayına bölünür. Belə olduqda nadir, lakin sistematik səhvlər görünür. Xanaya
              klikləyib həmin səhv şəkillərə baxın: onları insan da qarışdırardımı?
            </LiveRegion>
          </>
        }
      />
    </div>
  );
}
