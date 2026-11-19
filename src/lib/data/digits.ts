import type { CsvRow } from "./csv";

export const DIGITS_URL = "/data/digits-8x8.csv";
export const DIGIT_OUTPUTS_URL = "/data/digits-model-outputs.csv";

export interface Digit {
  id: number;
  label: number;
  /** 64 intensities in [0, 16], row-major. */
  pixels: number[];
}

export interface DigitOutput {
  id: number;
  label: number;
  is5: boolean;
  sgdScore: number;
  forestProba: number;
  multiPred: number;
}

const n = (v: unknown) => (typeof v === "number" ? v : NaN);

export function toDigits(rows: CsvRow[]): Digit[] {
  return rows
    .map((r) => ({
      id: n(r.id),
      label: n(r.label),
      pixels: Array.from({ length: 64 }, (_, i) => n(r[`p${i}`])),
    }))
    .filter((d) => Number.isFinite(d.id) && Number.isFinite(d.label) && d.pixels.every(Number.isFinite));
}

export function toDigitOutputs(rows: CsvRow[]): DigitOutput[] {
  return rows
    .map((r) => ({
      id: n(r.id),
      label: n(r.label),
      is5: n(r.is_5) === 1,
      sgdScore: n(r.sgd_score),
      forestProba: n(r.forest_proba),
      multiPred: n(r.multi_pred),
    }))
    .filter((d) => [d.id, d.label, d.sgdScore, d.forestProba, d.multiPred].every(Number.isFinite));
}
