import Link from "next/link";
import type * as React from "react";
import { getTerm } from "@/lib/content/repository";
import { contentBlockSchema } from "@/lib/schemas";

/**
 * Glossary-linked term. Use `full` on first mention to show the bilingual
 * form required by the style guide: "Nəzarətli öyrənmə (Supervised Learning)".
 */
export function Term({ id, full = false, children }: { id: string; full?: boolean; children?: React.ReactNode }) {
  contentBlockSchema.parse({ type: "term", termId: id });
  const term = getTerm(id);
  if (!term) throw new Error(`Naməlum termin: '${id}'`);
  return (
    <Link
      href={`/glossary#${term.id}`}
      title={term.definition}
      className="font-medium text-foreground no-underline decoration-primary/50 decoration-dotted underline-offset-4 hover:text-primary hover:underline"
    >
      {children ?? term.az}
      {full && <span className="font-normal text-muted-foreground"> ({term.en})</span>}
    </Link>
  );
}
