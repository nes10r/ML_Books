import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LessonRef } from "@/lib/content/repository";
import { lessonHref } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export function LessonPager({ previous, next }: { previous?: LessonRef; next?: LessonRef }) {
  return (
    <section id="next" aria-label={t.blockKind.next} className="scroll-mt-24 space-y-4">
      {!next && <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{t.lesson.endOfCourse}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link href={lessonHref(previous.chapter, previous.lesson)} className="group rounded-xl border bg-surface p-4 hover:border-primary/40">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5" aria-hidden /> {t.lesson.previous}
            </span>
            <span className="mt-1 block font-medium group-hover:text-primary">{previous.lesson.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link
            href={lessonHref(next.chapter, next.lesson)}
            className="group rounded-xl border bg-surface p-4 text-right hover:border-primary/40 sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              {t.lesson.next} <ArrowRight className="size-3.5" aria-hidden />
            </span>
            <span className="mt-1 block font-medium group-hover:text-primary">{next.lesson.title}</span>
            {next.chapter.id !== previous?.chapter.id && next.chapter.number > (previous?.chapter.number ?? 0) && (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {t.lesson.chapter} {next.chapter.number}
              </span>
            )}
          </Link>
        )}
      </div>
    </section>
  );
}
