import type { BinaryCounts } from "@/lib/ml/classification";
import { cn } from "@/lib/utils";

/** 2×2 confusion matrix with the standard TN/FP/FN/TP layout (rows = actual, columns = predicted). */
export function BinaryConfusionMatrix({ counts, positiveLabel, negativeLabel }: { counts: BinaryCounts; positiveLabel: string; negativeLabel: string }) {
  const cells = [
    { k: "TN", v: counts.tn, good: true, hint: "düzgün mənfi" },
    { k: "FP", v: counts.fp, good: false, hint: "yanlış müsbət" },
    { k: "FN", v: counts.fn, good: false, hint: "yanlış mənfi" },
    { k: "TP", v: counts.tp, good: true, hint: "düzgün müsbət" },
  ];
  return (
    <table className="w-full table-fixed border-separate border-spacing-1 text-center text-xs">
      <caption className="sr-only">Qarışıqlıq matrisi: sətirlər həqiqi sinif, sütunlar proqnoz</caption>
      <thead>
        <tr>
          <th className="w-16" />
          <th className="font-medium text-muted-foreground">Proqnoz: {negativeLabel}</th>
          <th className="font-medium text-muted-foreground">Proqnoz: {positiveLabel}</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1].map((r) => (
          <tr key={r}>
            <th scope="row" className="text-left font-medium text-muted-foreground">
              {r === 0 ? negativeLabel : positiveLabel}
            </th>
            {[0, 1].map((c) => {
              const cell = cells[r * 2 + c]!;
              return (
                <td
                  key={c}
                  className={cn("rounded-md px-1 py-2", cell.good ? "bg-success-soft/70" : "bg-danger-soft/70")}
                  title={cell.hint}
                >
                  <span className="block font-mono text-sm font-semibold tabular-nums">{cell.v}</span>
                  <span className="text-[10px] text-muted-foreground">{cell.k}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
