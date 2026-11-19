import Link from "next/link";
import { getTerm } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export function KeyConcepts({ termIds }: { termIds: string[] }) {
  const terms = termIds.map(getTerm).filter((x) => x !== undefined);
  if (terms.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t.lesson.keyConcepts}</p>
      <ul className="flex flex-wrap gap-1.5">
        {terms.map((term) => (
          <li key={term.id}>
            <Link
              href={`/glossary#${term.id}`}
              title={`${term.en} — ${term.definition}`}
              className="inline-block rounded-full border bg-surface px-2.5 py-1 text-xs hover:border-primary/40 hover:text-primary"
            >
              {term.az}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
