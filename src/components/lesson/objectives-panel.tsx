import { CheckCircle2, Link2 } from "lucide-react";
import Link from "next/link";
import { getChapterById, getLessonById, lessonHref, chapterHref } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import type { Lesson } from "@/lib/schemas";

/** Generated "objectives + prerequisites" block, rendered from lesson metadata. */
export function ObjectivesPanel({ lesson }: { lesson: Lesson }) {
  if (lesson.learningObjectives.length === 0 && lesson.prerequisites.length === 0) return null;
  return (
    <section id="objectives" aria-labelledby="objectives-title" className="scroll-mt-24 grid gap-4 md:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border bg-surface p-5">
        <h2 id="objectives-title" className="mb-3 text-sm font-semibold">
          {t.blockKind.objectives}
        </h2>
        <ul className="space-y-2.5">
          {lesson.learningObjectives.map((o) => (
            <li key={o.id} className="flex gap-2.5 text-sm leading-relaxed">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {o.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border bg-surface-muted/60 p-5">
        <h2 className="mb-3 text-sm font-semibold">{t.blockKind.prerequisites}</h2>
        {lesson.prerequisites.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.lesson.noPrerequisites}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {lesson.prerequisites.map((p, i) => {
              if (p.kind === "lesson") {
                const ref = getLessonById(p.lessonId);
                if (!ref) return null;
                return (
                  <li key={i} className="flex gap-2">
                    <Link2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <Link href={lessonHref(ref.chapter, ref.lesson)} className="text-primary hover:underline">
                      {t.lesson.prerequisiteLesson}: {ref.lesson.title}
                    </Link>
                  </li>
                );
              }
              if (p.kind === "chapter") {
                const c = getChapterById(p.chapterId);
                if (!c) return null;
                return (
                  <li key={i} className="flex gap-2">
                    <Link2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <Link href={chapterHref(c)} className="text-primary hover:underline">
                      {t.lesson.prerequisiteChapter} {c.number}: {c.title}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {p.label}
                      </a>
                    ) : (
                      p.label
                    )}
                    {p.description && <span className="block text-xs text-muted-foreground">{p.description}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
