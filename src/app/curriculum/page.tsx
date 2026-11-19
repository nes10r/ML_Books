import type { Metadata } from "next";
import { ChapterCard } from "@/components/course/chapter-card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getChaptersByPart, getParts } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export const metadata: Metadata = { title: t.curriculum.title };

export default function CurriculumPage() {
  return (
    <PageContainer>
      <PageHeader title={t.curriculum.title} description={t.curriculum.intro} />
      <div className="space-y-14">
        {getParts().map((part) => (
          <section key={part.id} aria-labelledby={`${part.id}-h`}>
            <div className="mb-5 max-w-3xl">
              <p className="text-sm font-medium text-primary">
                {t.curriculum.part} {part.number}
              </p>
              <h2 id={`${part.id}-h`} className="font-serif text-2xl font-semibold tracking-tight">
                {part.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{part.description}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getChaptersByPart(part.id).map((c) => (
                <li key={c.id}>
                  <ChapterCard chapter={c} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
