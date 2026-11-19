import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/course/breadcrumbs";
import { DemoFrame } from "@/components/demos/demo-frame";
import { PageContainer } from "@/components/layout/page-header";
import { getDemo, getDemos, getLessonById, getTerm, lessonHref } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

type Params = { demoId: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getDemos().map((d) => ({ demoId: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const demo = getDemo((await params).demoId);
  return demo ? { title: demo.title, description: demo.description } : {};
}

export default async function DemoPage({ params }: { params: Promise<Params> }) {
  const demo = getDemo((await params).demoId);
  if (!demo) notFound();
  const lessons = demo.lessonIds.map(getLessonById).filter((r) => r !== undefined);
  const terms = demo.concepts.map(getTerm).filter((x) => x !== undefined);
  return (
    <PageContainer className="max-w-7xl">
      <Breadcrumbs items={[{ label: t.nav.playground, href: "/playground" }, { label: demo.title }]} />
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">{demo.title}</h1>
      <DemoFrame id={demo.id} showLink={false} />
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.length > 0 && (
          <section className="rounded-2xl border bg-surface p-5">
            <h2 className="mb-2 font-semibold">{t.playground.relatedLessons}</h2>
            <ul className="space-y-1 text-sm">
              {lessons.map((r) => (
                <li key={r.lesson.id}>
                  <Link href={lessonHref(r.chapter, r.lesson)} className="text-primary hover:underline">
                    {t.lesson.chapter} {r.chapter.number}: {r.lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {terms.length > 0 && (
          <section className="rounded-2xl border bg-surface p-5">
            <h2 className="mb-2 font-semibold">{t.lesson.keyConcepts}</h2>
            <ul className="flex flex-wrap gap-1.5">
              {terms.map((term) => (
                <li key={term.id}>
                  <Link href={`/glossary#${term.id}`} className="inline-block rounded-full border px-2.5 py-1 text-xs hover:text-primary">
                    {term.az} <span className="text-muted-foreground">({term.en})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
