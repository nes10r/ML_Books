"use client";

import { Eraser, Pencil, Shuffle, Trash2 } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SliderField } from "@/components/ui/slider-field";
import type { Digit, DigitOutput } from "@/lib/data/digits";
import { cn } from "@/lib/utils";
import { DigitsGate } from "./dataset-gate";
import { DemoLayout, LiveRegion } from "./demo-ui";
import { DigitImage } from "./digit-image";

const EMPTY = () => new Array<number>(64).fill(0);

/** k-NN vote over 64-pixel vectors. Returns votes per class and the nearest examples. */
export function classifyDigit(pixels: readonly number[], data: readonly Digit[], k: number) {
  const nearest = data
    .map((d) => {
      let dist = 0;
      for (let i = 0; i < 64; i++) dist += (d.pixels[i]! - pixels[i]!) ** 2;
      return { d, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k);
  const votes = new Array<number>(10).fill(0);
  nearest.forEach((n) => votes[n.d.label]!++);
  const best = votes.indexOf(Math.max(...votes));
  return { votes, nearest, prediction: best };
}

export default function DigitDrawDemo() {
  return <DigitsGate>{({ digits, outputs }) => <Inner digits={digits} outputs={outputs} />}</DigitsGate>;
}

/** The model only "knows" the training images; samples come from the held-out test images (no leakage). */
function useSplit(digits: Digit[], outputs: DigitOutput[]) {
  return useMemo(() => {
    const trainIds = new Set(outputs.map((o) => o.id));
    return { train: digits.filter((d) => trainIds.has(d.id)), test: digits.filter((d) => !trainIds.has(d.id)) };
  }, [digits, outputs]);
}

function Inner({ digits, outputs }: { digits: Digit[]; outputs: DigitOutput[] }) {
  const { train, test } = useSplit(digits, outputs);
  const [pixels, setPixels] = useState<number[]>(() => test[16]?.pixels.slice() ?? EMPTY());
  const [trueLabel, setTrueLabel] = useState<number | null>(() => test[16]?.label ?? null);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [k, setK] = useState(5);
  const [sample, setSample] = useState(17);
  const [focus, setFocus] = useState(27);
  const drawing = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const blank = pixels.every((v) => v === 0);
  const result = useMemo(() => (blank ? null : classifyDigit(pixels, train, k)), [pixels, train, k, blank]);

  /** Soft brush: full ink at the cell, partial ink on orthogonal neighbours (8×8 digits are blurry). */
  const paint = (idx: number) => {
    setTrueLabel(null);
    setPixels((prev) => {
      const next = prev.slice();
      const r = Math.floor(idx / 8);
      const c = idx % 8;
      const apply = (rr: number, cc: number, amount: number) => {
        if (rr < 0 || rr > 7 || cc < 0 || cc > 7) return;
        const j = rr * 8 + cc;
        next[j] = tool === "draw" ? Math.min(16, Math.max(next[j]!, amount)) : amount === 16 ? 0 : Math.max(0, next[j]! - 6);
      };
      apply(r, c, 16);
      apply(r - 1, c, 7);
      apply(r + 1, c, 7);
      apply(r, c - 1, 7);
      apply(r, c + 1, 7);
      return next;
    });
  };

  const cellFromPointer = (e: PointerEvent) => {
    const el = gridRef.current;
    if (!el) return -1;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * 8);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * 8);
    return r >= 0 && r < 8 && c >= 0 && c < 8 ? r * 8 + c : -1;
  };

  const onKey = (e: KeyboardEvent, idx: number) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 8, ArrowUp: -8 };
    if (e.key in moves) {
      e.preventDefault();
      const next = Math.min(63, Math.max(0, idx + moves[e.key]!));
      setFocus(next);
      (gridRef.current?.children[next] as HTMLElement | undefined)?.focus();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      paint(idx);
    }
  };

  const loadSample = () => {
    const d = test[(sample * 37) % test.length]!; // deterministic walk through the test images
    setSample((s) => s + 1);
    setPixels(d.pixels.slice());
    setTrueLabel(d.label);
  };

  const maxVote = result ? Math.max(...result.votes) : 0;

  return (
    <DemoLayout
      plot={
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="space-y-2">
            <div
              ref={gridRef}
              role="grid"
              aria-label="8×8 rəqəm lövhəsi. Ox düymələri ilə hərəkət edin, boşluq və ya Enter ilə rəngləyin."
              className="grid aspect-square w-64 touch-none grid-cols-8 overflow-hidden rounded-lg border-2 border-border bg-surface select-none sm:w-72"
              onPointerDown={(e) => {
                drawing.current = true;
                (e.target as Element).releasePointerCapture?.(e.pointerId);
                const idx = cellFromPointer(e);
                if (idx >= 0) paint(idx);
              }}
              onPointerMove={(e) => {
                if (!drawing.current) return;
                const idx = cellFromPointer(e);
                if (idx >= 0) paint(idx);
              }}
              onPointerUp={() => (drawing.current = false)}
              onPointerLeave={() => (drawing.current = false)}
            >
              {pixels.map((v, i) => (
                <div
                  key={i}
                  role="gridcell"
                  tabIndex={i === focus ? 0 : -1}
                  aria-label={`Sətir ${Math.floor(i / 8) + 1}, sütun ${(i % 8) + 1}: ${v}`}
                  onKeyDown={(e) => onKey(e, i)}
                  onFocus={() => setFocus(i)}
                  className="border-[0.5px] border-border/40 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring"
                  style={{ background: `color-mix(in oklch, var(--foreground) ${Math.round((v / 16) * 100)}%, var(--surface))` }}
                />
              ))}
            </div>
            <SegmentedControl
              label="Alət"
              value={tool}
              onChange={setTool}
              options={[
                { value: "draw", label: <span className="inline-flex items-center gap-1"><Pencil className="size-3.5" aria-hidden />Çək</span> },
                { value: "erase", label: <span className="inline-flex items-center gap-1"><Eraser className="size-3.5" aria-hidden />Poz</span> },
              ]}
            />
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Qonşuların səsləri (k = {k})</p>
              <ul className="space-y-1">
                {Array.from({ length: 10 }, (_, d) => {
                  const v = result?.votes[d] ?? 0;
                  return (
                    <li key={d} className="flex items-center gap-2 text-xs">
                      <span className={cn("w-4 font-mono font-semibold", result?.prediction === d && "text-primary")}>{d}</span>
                      <span className="relative h-3 flex-1 rounded-full bg-surface-muted">
                        <span
                          className={cn("absolute inset-y-0 left-0 rounded-full", result?.prediction === d ? "bg-primary" : "bg-muted-foreground/40")}
                          style={{ width: `${maxVote ? (v / k) * 100 : 0}%` }}
                        />
                      </span>
                      <span className="w-6 text-right font-mono tabular-nums text-muted-foreground">{v}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {result && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Ən yaxın təlim şəkilləri</p>
                <ul className="flex flex-wrap gap-2">
                  {result.nearest.map(({ d }) => (
                    <li key={d.id} className="text-center">
                      <DigitImage pixels={d.pixels} label={`Qonşu: rəqəm ${d.label}`} size={44} className="border" />
                      <span className="font-mono text-[10px] text-muted-foreground">{d.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      }
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => { setPixels(EMPTY()); setTrueLabel(null); }}>
              <Trash2 /> Təmizlə
            </Button>
            <Button size="sm" variant="outline" onClick={loadSample}>
              <Shuffle /> Test şəkli
            </Button>
          </div>
          <SliderField label="Qonşu sayı (k)" value={k} min={1} max={15} step={2} onChange={setK} />
          <LiveRegion>
            {result ? (
              <>
                Proqnoz: <b className="text-lg">{result.prediction}</b> ({result.votes[result.prediction]}/{k} səs).{" "}
                {trueLabel !== null && (result.prediction === trueLabel ? `Düzgündür — həqiqi etiket ${trueLabel}. ` : `Səhv — həqiqi etiket ${trueLabel}. `)}
                {result.votes[result.prediction]! < k * 0.6 && "Qonşular razılaşmır — model əmin deyil."}
              </>
            ) : (
              "Lövhəyə rəqəm çəkin (siçan, barmaq və ya klaviatura ilə)."
            )}
          </LiveRegion>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Model {train.length} təlim şəkli arasında piksel-piksel ən oxşar k şəkli tapır və səsverməyə qoyur. “Test şəkli” düyməsi modelin heç vaxt
            görmədiyi {test.length} şəkildən birini yükləyir. Öz rəqəminizi lövhənin ortasında, qalın xətlərlə çəkin — təlim şəkilləri belədir.
          </p>
        </>
      }
    />
  );
}
