import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PythonExample } from "@/components/code/python-example";
import { DatasetCard } from "@/components/datasets/dataset-card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getChapters, getCodeExamples, getDatasets, getLessonById, lessonHref } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export const metadata: Metadata = { title: t.lab.title };

export default function LabPage() {
  const examples = getCodeExamples();
  const chapters = getChapters().filter((c) => examples.some((e) => e.chapterId === c.id));
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t.lab.title} description={t.lab.intro} />
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-surface p-5 text-sm">
          <p className="mb-2 font-semibold">{t.lab.howToRun}</p>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            {t.lab.howToRunSteps.map((s) => (
              <li key={s}>
                <code className="font-mono text-xs">{s}</code>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex gap-3 rounded-2xl border border-dashed bg-surface-muted/40 p-5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{t.lab.browserNote}</p>
        </div>
      </div>
      {getDatasets().length > 0 && (
        <section className="mb-12" aria-labelledby="lab-datasets">
          <h2 id="lab-datasets" className="font-serif text-2xl font-semibold">
            Məlumat dəstləri
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kod nümunələri bu faylları skriptin işlədiyi qovluqda gözləyir. Faylı endirib skriptlərin yanına qoyun.
          </p>
          {getDatasets().map((d) => (
            <DatasetCard key={d.id} id={d.id} />
          ))}
        </section>
      )}
      {chapters.map((chapter) => (
        <section key={chapter.id} className="mb-14 space-y-10" aria-labelledby={`lab-${chapter.id}`}>
          <h2 id={`lab-${chapter.id}`} className="font-serif text-2xl font-semibold">
            {t.lesson.chapter} {chapter.number}: {chapter.title}
          </h2>
          {examples
            .filter((e) => e.chapterId === chapter.id)
            .map((e) => {
              const ref = e.lessonId ? getLessonById(e.lessonId) : undefined;
              return (
                <article key={e.id} id={e.id} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {e.description}
                    {ref && (
                      <>
                        {" "}
                        <Link href={lessonHref(ref.chapter, ref.lesson)} className="text-primary hover:underline">
                          {t.lab.openLesson}: {ref.lesson.title} →
                        </Link>
                      </>
                    )}
                  </p>
                  <PythonExample id={e.id} />
                </article>
              );
            })}
        </section>
      ))}
    </PageContainer>
  );
}
