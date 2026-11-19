"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChapterProgress } from "@/components/course/chapter-progress";
import { LessonStatusIcon } from "@/components/course/completion-indicator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavChapter } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { useProgressStore } from "@/lib/progress/store";
import { formatPercent } from "@/lib/utils";

export function ProgressDashboard({
  chapters,
  quizzes,
}: {
  chapters: NavChapter[];
  quizzes: { id: string; title: string; passingScore: number }[];
}) {
  const hydrated = useProgressStore((s) => s.hydrated);
  const progress = useProgressStore((s) => s.progress);
  const reset = useProgressStore((s) => s.reset);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div role="status" className="space-y-3">
        <span className="sr-only">{t.lesson.loadingProgress}</span>
        <Skeleton className="h-28" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const attempted = quizzes.filter((q) => progress.quizzes[q.id]);

  return (
    <div className="space-y-10">
      <section aria-labelledby="p-lessons" className="space-y-4">
        <h2 id="p-lessons" className="text-lg font-semibold">
          {t.progress.completedLessons}
        </h2>
        {chapters.map((c) => (
          <div key={c.id} className="rounded-2xl border bg-surface p-5">
            <Link href={c.href} className="font-semibold hover:text-primary">
              {t.lesson.chapter} {c.number}: {c.title}
            </Link>
            <ChapterProgress lessonIds={c.lessons.map((l) => l.id)} className="my-3" />
            <ul className="grid gap-1 sm:grid-cols-2">
              {c.lessons.map((l) => (
                <li key={l.id}>
                  <Link href={l.href} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-muted">
                    <LessonStatusIcon lessonId={l.id} />
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="p-quizzes" className="space-y-3">
        <h2 id="p-quizzes" className="text-lg font-semibold">
          {t.progress.quizResults}
        </h2>
        {attempted.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">{t.progress.noQuizzes}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-left">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Test</th>
                  <th className="px-4 py-2.5 font-semibold">{t.quiz.best}</th>
                  <th className="px-4 py-2.5 font-semibold">{t.quiz.attempts}</th>
                </tr>
              </thead>
              <tbody>
                {attempted.map((q) => {
                  const p = progress.quizzes[q.id]!;
                  return (
                    <tr key={q.id} className="border-t">
                      <td className="px-4 py-2.5">
                        <Link href={`/exercises/${q.id}`} className="hover:text-primary">
                          {q.title}
                        </Link>
                      </td>
                      <td className={`px-4 py-2.5 font-mono tabular-nums ${p.bestScore >= q.passingScore ? "text-success" : ""}`}>
                        {formatPercent(p.bestScore)}
                      </td>
                      <td className="px-4 py-2.5 font-mono tabular-nums">{p.attempts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-danger/30 p-5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex-1 text-sm">{t.progress.resetConfirm}</p>
            <Button
              variant="outline"
              className="border-danger/50 text-danger"
              onClick={async () => {
                await reset();
                setConfirming(false);
                setMessage(t.progress.resetDone);
              }}
            >
              <Trash2 />
              {t.progress.reset}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Ləğv et
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => { setConfirming(true); setMessage(null); }}>
            <Trash2 />
            {t.progress.reset}
          </Button>
        )}
        <p aria-live="polite" className="mt-2 text-sm text-success">
          {message}
        </p>
      </section>
    </div>
  );
}
