"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n/az";
import { cn } from "@/lib/utils";
import type { TocEntry } from "./toc";

/** "On this page" with scroll-spy (IntersectionObserver, no scroll listeners). */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | undefined>(entries[0]?.id);

  useEffect(() => {
    const elements = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav aria-label={t.lesson.onThisPage}>
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t.lesson.onThisPage}</p>
      <ul className="space-y-0.5 border-l text-sm">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              aria-current={active === e.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors",
                active === e.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {e.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
