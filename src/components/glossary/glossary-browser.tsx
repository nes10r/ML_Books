"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { t } from "@/lib/i18n/az";
import type { GlossaryTerm } from "@/lib/schemas";

/** Case- and diacritic-insensitive matching (ə→e, ı→i, ş→s …) so "secme" finds "Seçmə". */
export function normalizeForSearch(s: string): string {
  return s
    .toLocaleLowerCase("az")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function filterTerms(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  const q = normalizeForSearch(query.trim());
  if (!q) return terms;
  return terms.filter((term) =>
    [term.az, term.en, term.definition, ...term.aliases].some((field) => normalizeForSearch(field).includes(q)),
  );
}

export function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const results = useMemo(() => filterTerms(terms, deferred), [terms, deferred]);
  const byId = useMemo(() => new Map(terms.map((x) => [x.id, x])), [terms]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.glossary.search}
          aria-label={t.glossary.searchLabel}
          className="h-11 w-full rounded-xl border bg-surface pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {results.length} {t.glossary.count}
      </p>
      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{t.glossary.noResults}</p>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2">
          {results.map((term) => (
            <div key={term.id} id={term.id} className="scroll-mt-24 rounded-xl border bg-surface p-5 target:border-primary target:ring-2 target:ring-ring/30">
              <dt>
                <span className="font-semibold">{term.az}</span>
                <span className="ml-1.5 text-sm text-muted-foreground">({term.en})</span>
              </dt>
              <dd className="mt-2 space-y-2 text-sm leading-relaxed">
                <p>{term.definition}</p>
                {term.related.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t.glossary.related}:{" "}
                    {term.related.map((id, i) => {
                      const r = byId.get(id);
                      return r ? (
                        <span key={id}>
                          {i > 0 && ", "}
                          <a href={`#${id}`} className="text-primary hover:underline">
                            {r.az}
                          </a>
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
