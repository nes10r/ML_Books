"use client";

import { useEffect, useState } from "react";
import { parseCsv, type CsvRow } from "./csv";

export type DatasetState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; columns: string[]; rows: CsvRow[] };

// One fetch per URL per page session, shared by all demos on the page.
const cache = new Map<string, Promise<{ columns: string[]; rows: CsvRow[] }>>();

/** Test helper: forget cached datasets. */
export function clearCsvCache() {
  cache.clear();
}

export function loadCsv(url: string) {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(parseCsv);
    p.catch(() => cache.delete(url)); // allow retry after failure
    cache.set(url, p);
  }
  return p;
}

/** Fetches and parses a CSV dataset with explicit loading/error states and retry. */
export function useCsvDataset(url: string): DatasetState & { retry: () => void } {
  const [state, setState] = useState<DatasetState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    loadCsv(url).then(
      (d) => alive && setState({ status: "ready", ...d }),
      (e: unknown) => alive && setState({ status: "error", error: e instanceof Error ? e.message : String(e) }),
    );
    return () => {
      alive = false;
    };
  }, [url, attempt]);
  return {
    ...state,
    retry: () => {
      setState({ status: "loading" });
      setAttempt((a) => a + 1);
    },
  };
}

export type DatasetsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; tables: CsvRow[][] };

/** Loads several CSV files together; ready only when all succeed. */
export function useCsvDatasets(urls: readonly string[]): DatasetsState & { retry: () => void } {
  const key = urls.join("|");
  const [state, setState] = useState<DatasetsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    Promise.all(key.split("|").map(loadCsv)).then(
      (all) => alive && setState({ status: "ready", tables: all.map((d) => d.rows) }),
      (e: unknown) => alive && setState({ status: "error", error: e instanceof Error ? e.message : String(e) }),
    );
    return () => {
      alive = false;
    };
  }, [key, attempt]);
  return {
    ...state,
    retry: () => {
      setState({ status: "loading" });
      setAttempt((a) => a + 1);
    },
  };
}
