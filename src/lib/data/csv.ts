export type CsvValue = string | number | null;
export type CsvRow = Record<string, CsvValue>;

/**
 * Minimal RFC-4180-style CSV parser (quoted fields, escaped quotes, CRLF).
 * Empty cells become `null`; cells that parse as finite numbers become numbers.
 */
export function parseCsv(text: string): { columns: string[]; rows: CsvRow[] } {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let quoted = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      record.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  const [header = [], ...body] = records.filter((r) => r.length > 1 || r[0] !== "");
  const rows = body.map((r) => {
    const row: CsvRow = {};
    header.forEach((col, j) => {
      const raw = (r[j] ?? "").trim();
      if (raw === "") row[col] = null;
      else {
        const n = Number(raw);
        row[col] = Number.isFinite(n) ? n : raw;
      }
    });
    return row;
  });
  return { columns: header, rows };
}

export function numericColumn(rows: CsvRow[], col: string): (number | null)[] {
  return rows.map((r) => (typeof r[col] === "number" ? (r[col] as number) : null));
}
