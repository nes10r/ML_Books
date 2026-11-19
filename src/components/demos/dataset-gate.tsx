"use client";

import { AlertTriangle } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { APARTMENTS_URL, toApartments, type Apartment } from "@/lib/data/apartments";
import type { CsvRow } from "@/lib/data/csv";
import { DIGIT_OUTPUTS_URL, DIGITS_URL, toDigitOutputs, toDigits, type Digit, type DigitOutput } from "@/lib/data/digits";
import { useCsvDatasets } from "@/lib/data/use-dataset";
import { t } from "@/lib/i18n/az";
import { DemoLoading } from "./demo-loading";

function DatasetError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 p-8 text-center text-sm">
      <AlertTriangle className="size-6 text-warning" aria-hidden />
      <p>Məlumat dəstini yükləmək mümkün olmadı{message ? ` (${message})` : ""}.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        {t.errors.retry}
      </Button>
    </div>
  );
}

/**
 * Generic loader for CSV-backed demos: fetches one or more files together and renders
 * explicit loading / error (with retry) states before handing typed data to children.
 */
export function DatasetGate<T>({
  urls,
  parse,
  children,
}: {
  urls: string[];
  parse: (tables: CsvRow[][]) => T;
  children: (data: T) => ReactNode;
}) {
  const state = useCsvDatasets(urls);
  const tables = state.status === "ready" ? state.tables : null;
  // Pass a module-level `parse` function so it is referentially stable; data re-parses only when tables change.
  const data = useMemo(() => (tables ? parse(tables) : null), [tables, parse]);

  if (state.status === "error") return <DatasetError message={state.error} onRetry={state.retry} />;
  if (!data) return <DemoLoading />;
  return <>{children(data)}</>;
}

const parseApartments = ([rows]: CsvRow[][]) => toApartments(rows!);
const parseDigits = ([d, o]: CsvRow[][]) => ({ digits: toDigits(d!), outputs: toDigitOutputs(o!) });
export const parseDigitOutputs = ([rows]: CsvRow[][]) => toDigitOutputs(rows!);

export function ApartmentsGate({ children }: { children: (data: Apartment[]) => ReactNode }) {
  return (
    <DatasetGate urls={[APARTMENTS_URL]} parse={parseApartments}>
      {children}
    </DatasetGate>
  );
}

export function DigitsGate({ children }: { children: (data: { digits: Digit[]; outputs: DigitOutput[] }) => ReactNode }) {
  return (
    <DatasetGate urls={[DIGITS_URL, DIGIT_OUTPUTS_URL]} parse={parseDigits}>
      {children}
    </DatasetGate>
  );
}
