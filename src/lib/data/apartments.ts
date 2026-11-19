import type { CsvRow } from "./csv";

export interface Apartment {
  id: number;
  rayon: string;
  enlik: number;
  uzunluq: number;
  sahe: number;
  otaq_sayi: number | null;
  mertebe: number;
  bina_mertebe: number;
  tikili: string;
  temir: string | null;
  metro_mesafe: number | null;
  kupca: number;
  qiymet: number;
}

export const APARTMENTS_URL = "/data/baku-apartments.csv";

const num = (v: unknown) => (typeof v === "number" ? v : null);
const str = (v: unknown) => (v === null || v === undefined ? null : String(v));

/** Typed view of the parsed CSV. Rows missing required fields are dropped. */
export function toApartments(rows: CsvRow[]): Apartment[] {
  const out: Apartment[] = [];
  for (const r of rows) {
    const id = num(r.id);
    const sahe = num(r.sahe);
    const qiymet = num(r.qiymet);
    const enlik = num(r.enlik);
    const uzunluq = num(r.uzunluq);
    if (id === null || sahe === null || qiymet === null || enlik === null || uzunluq === null) continue;
    out.push({
      id,
      rayon: str(r.rayon) ?? "?",
      enlik,
      uzunluq,
      sahe,
      otaq_sayi: num(r.otaq_sayi),
      mertebe: num(r.mertebe) ?? 1,
      bina_mertebe: num(r.bina_mertebe) ?? 1,
      tikili: str(r.tikili) ?? "?",
      temir: str(r.temir),
      metro_mesafe: num(r.metro_mesafe),
      kupca: num(r.kupca) ?? 0,
      qiymet,
    });
  }
  return out;
}

/** Same rule as the Python AreaTypoFixer: areas above 400 m² are decimal-point typos. */
export const AREA_TYPO_THRESHOLD = 400;
export const fixAreaTypo = (sahe: number) => (sahe > AREA_TYPO_THRESHOLD ? sahe / 10 : sahe);
