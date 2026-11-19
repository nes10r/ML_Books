import { ArrowRight, BookMarked, CheckCircle2, Clock, Hourglass, ListChecks, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DifficultyBadge, DurationBadge, LessonTypeBadge, StatusBadge } from "@/components/course/badges";
import { Breadcrumbs } from "@/components/course/breadcrumbs";
import { ChapterProgress } from "@/components/course/chapter-progress";
import { LessonStatusIcon } from "@/components/course/completion-indicator";
import { CourseShell } from "@/components/lesson/course-shell";
import { Button } from "@/components/ui/button";
import {
  getChapterBySlug,
  getChapters,
  getDemo,
  getQuiz,
  getVisibleLessons,
  isAvailable,
  lessonHref,
} from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { formatDuration, pad2 } from "@/lib/utils";

type Params = { chapterSlug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getChapters().map((c) => ({ chapterSlug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const chapter = getChapterBySlug((await params).chapterSlug);
  return chapter ? { title: `${t.lesson.chapter} ${chapter.number}: ${chapter.title}`, description: chapter.description } : {};
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const chapter = getChapterBySlug((await params).chapterSlug);
  if (!chapter) notFound();
  const available = isAvailable(chapter.status);
  const lessons = getVisibleLessons(chapter).filter((l) => isAvailable(l.status));
  const demos = chapter.interactiveDemoReferences.map(getDemo).filter((d) => d !== undefined);
  const quizzes = chapter.quizIds.map(getQuiz).filter((q) => q !== undefined);

  return (
    <CourseShell>
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-4">
          <Breadcrumbs items={[{ label: t.nav.curriculum, href: "/curriculum" }, { label: `${t.lesson.chapter} ${chapter.number}` }]} />
          <p className="font-mono text-sm font-semibold text-primary">{t.lesson.chapter} {pad2(chapter.number)}</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{chapter.title}</h1>
          <p className="text-lg text-muted-foreground text-pretty">{chapter.description}</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={chapter.status} />
            <DifficultyBadge difficulty={chapter.difficulty} />
            <DurationBadge minutes={chapter.estimatedDuration} />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookMarked className="size-3.5" aria-hidden />
            {t.chapter.bookRef}: Chapter {chapter.bookReference.chapter} — <i>{chapter.bookReference.originalTitle}</i>
          </p>
        </header>

        {!available ? (
          <section className="rounded-2xl border border-dashed bg-surface-muted/40 p-6">
            <Hourglass className="mb-3 size-6 text-muted-foreground" aria-hidden />
            <h2 className="font-semibold">{t.chapter.plannedTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.chapter.plannedBody}</p>
            {chapter.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {chapter.tags.map((tag) => (
                  <li key={tag} className="rounded-full border bg-surface px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            {lessons[0] && (
              <div className="flex flex-col gap-4 rounded-2xl border bg-surface p-5 sm:flex-row sm:items-center">
                <ChapterProgress lessonIds={lessons.map((l) => l.id)} className="flex-1" />
                <Button asChild>
                  <Link href={lessonHref(chapter, lessons[0])}>
                    {t.lesson.startLesson}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}

            {chapter.learningObjectives.length > 0 && (
              <section aria-labelledby="ch-objectives">
                <h2 id="ch-objectives" className="mb-3 text-lg font-semibold">
                  {t.chapter.objectives}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {chapter.learningObjectives.map((o) => (
                    <li key={o.id} className="flex gap-2.5 rounded-xl border bg-surface p-4 text-sm leading-relaxed">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {o.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="ch-lessons">
              <h2 id="ch-lessons" className="mb-3 text-lg font-semibold">
                {t.chapter.lessonsTitle}
              </h2>
              <ol className="divide-y overflow-hidden rounded-2xl border bg-surface">
                {lessons.map((l, i) => (
                  <li key={l.id}>
                    <Link href={lessonHref(chapter, l)} className="group flex gap-4 p-4 transition-colors hover:bg-surface-muted/60 sm:p-5">
                      <div className="flex flex-col items-center gap-2 pt-0.5">
                        <span className="font-mono text-xs text-muted-foreground">{pad2(i + 1)}</span>
                        <LessonStatusIcon lessonId={l.id} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="font-semibold group-hover:text-primary">{l.title}</p>
                        <p className="text-sm text-muted-foreground">{l.description}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <LessonTypeBadge type={l.type} />
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" aria-hidden />
                            {formatDuration(l.estimatedDuration)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            {(demos.length > 0 || quizzes.length > 0) && (
              <section className="grid gap-4 sm:grid-cols-2">
                {demos.length > 0 && (
                  <div className="rounded-2xl border bg-surface p-5">
                    <h2 className="mb-3 flex items-center gap-2 font-semibold">
                      <Sparkles className="size-4 text-primary" aria-hidden />
                      {t.chapter.demos}
                    </h2>
                    <ul className="space-y-1.5 text-sm">
                      {demos.map((d) => (
                        <li key={d.id}>
                          <Link href={`/playground/${d.id}`} className="text-primary hover:underline">
                            {d.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {quizzes.length > 0 && (
                  <div className="rounded-2xl border bg-surface p-5">
                    <h2 className="mb-3 flex items-center gap-2 font-semibold">
                      <ListChecks className="size-4 text-primary" aria-hidden />
                      {t.chapter.quiz}
                    </h2>
                    <ul className="space-y-1.5 text-sm">
                      {quizzes.map((q) => (
                        <li key={q.id}>
                          <Link href={`/exercises/${q.id}`} className="text-primary hover:underline">
                            {q.title}
                          </Link>
                          <span className="text-muted-foreground"> · {q.questions.length} {t.exercises.questions}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </CourseShell>
  );
}
