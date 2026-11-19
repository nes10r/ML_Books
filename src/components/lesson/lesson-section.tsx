import type * as React from "react";
import { t } from "@/lib/i18n/az";
import type { ContentBlockKind } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { blockAccent, blockIcon } from "./section-style";

/** Uniform frame for every lesson section — MDX-authored or generated from data. */
export function LessonSectionFrame({
  id,
  title,
  kind,
  children,
}: {
  id: string;
  title: string;
  kind: ContentBlockKind;
  children: React.ReactNode;
}) {
  const Icon = blockIcon[kind];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-24", blockAccent[kind])}>
      <p className="not-prose mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
        <Icon className="size-3.5" aria-hidden />
        {t.blockKind[kind]}
      </p>
      <h2 id={`${id}-title`} className="not-prose mb-4 font-serif text-2xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <div className="prose prose-lesson dark:prose-invert prose-headings:font-semibold prose-h3:text-lg prose-p:leading-7 prose-li:my-1 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-surface-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-normal">
        {children}
      </div>
    </section>
  );
}
