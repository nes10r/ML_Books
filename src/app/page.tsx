import { ArrowRight, BookOpen, Code2, ListChecks, Sigma, Sparkles, Library } from "lucide-react";
import Link from "next/link";
import { ChapterCard } from "@/components/course/chapter-card";
import { ContinueLearningButton } from "@/components/home/continue-learning";
import { Button } from "@/components/ui/button";
import {
  getChaptersByPart,
  getCourse,
  getCourseStats,
  getLessonSequence,
  getParts,
  lessonHref,
} from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { formatDuration } from "@/lib/utils";

const features = [
  { icon: Sparkles, title: "İnteraktiv simulyasiyalar", body: "Alqoritmləri brauzerdə real hesablamalarla addım-addım izləyin.", href: "/playground" },
  { icon: Sigma, title: "Riyazi intuisiya", body: "Düsturlar vizual izah və həll edilmiş nümunələrlə birlikdə verilir.", href: "/curriculum" },
  { icon: Code2, title: "Python laboratoriyası", body: "Scikit-Learn və PyTorch ilə yoxlanılmış, işlək kod nümunələri.", href: "/lab" },
  { icon: ListChecks, title: "Testlər və tapşırıqlar", body: "Dərhal rəy verən bilik yoxlamaları və praktiki tapşırıqlar.", href: "/exercises" },
  { icon: Library, title: "İkidilli lüğət", body: "Hər termin Azərbaycan və ingilis dillərində izahı ilə.", href: "/glossary" },
  { icon: BookOpen, title: "Strukturlaşdırılmış kurikulum", body: "19 fəsil: əsaslardan transformerlərə və gücləndirməli öyrənməyə.", href: "/curriculum" },
];

export default function HomePage() {
  const course = getCourse();
  const stats = getCourseStats();
  const sequence = getLessonSequence().map((r) => ({
    id: r.lesson.id,
    title: r.lesson.title,
    href: lessonHref(r.chapter, r.lesson),
    chapterNumber: r.chapter.number,
  }));
  const parts = getParts();

  return (
    <main id="main">
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_70%_-10%,var(--primary-soft),transparent)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              {stats.availableChapterCount} fəsil hazırdır · cəmi {stats.chapterCount} fəsil
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{course.title}</h1>
            <p className="max-w-xl text-lg text-muted-foreground text-pretty">{course.description}</p>
            <div className="flex flex-wrap gap-3">
              <ContinueLearningButton sequence={sequence} />
              <Button asChild size="lg" variant="outline">
                <Link href="/curriculum">
                  {t.nav.curriculum}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: "Hazır dərs", value: stats.lessonCount },
              { label: "İnteraktiv demo", value: stats.demoCount },
              { label: "Python nümunəsi", value: stats.codeExampleCount },
              { label: "Lüğət termini", value: stats.termCount },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-surface/80 p-5 backdrop-blur">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-serif text-3xl font-semibold tabular-nums">{s.value}</dd>
              </div>
            ))}
            <div className="col-span-2 rounded-xl border bg-surface/80 p-4 text-sm text-muted-foreground">
              Mövcud məzmunun təxmini həcmi: <b className="text-foreground">{formatDuration(stats.totalMinutes)}</b>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="features-title">
        <h2 id="features-title" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Necə öyrənirik
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hər anlayış dörd addımda öyrənilir: intuisiya, vizual eksperiment, riyazi əsas və kod. Sonda bilik yoxlanılır.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title}>
              <Link href={f.href} className="group flex h-full gap-4 rounded-xl border bg-surface p-5 transition-colors hover:border-primary/40">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                  <f.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary">{f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {parts.map((part) => (
        <section key={part.id} className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby={`${part.id}-title`}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-primary">
                {t.curriculum.part} {part.number}
              </p>
              <h2 id={`${part.id}-title`} className="font-serif text-2xl font-semibold tracking-tight">
                {part.title}
              </h2>
            </div>
            <Link href="/curriculum" className="text-sm font-medium text-primary hover:underline">
              Bütün kurikulum →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {getChaptersByPart(part.id)
              .slice(0, 4)
              .map((c) => (
                <li key={c.id}>
                  <ChapterCard chapter={c} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
