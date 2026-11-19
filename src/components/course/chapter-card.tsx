import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { chapterHref, getVisibleLessons, isAvailable } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import type { Chapter } from "@/lib/schemas";
import { cn, pad2 } from "@/lib/utils";
import { DifficultyBadge, DurationBadge, StatusBadge } from "./badges";
import { ChapterProgress } from "./chapter-progress";

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  const available = isAvailable(chapter.status);
  const lessons = getVisibleLessons(chapter);
  return (
    <Link
      href={chapterHref(chapter)}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-xl border bg-surface p-5 transition-all",
        available ? "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md" : "opacity-80 hover:opacity-100",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            available ? "text-primary" : "text-muted-foreground",
          )}
        >
          {pad2(chapter.number)}
        </span>
        <StatusBadge status={chapter.status} />
      </div>
      <div className="flex-1 space-y-1.5">
        <h3 className="font-semibold leading-snug text-balance">{chapter.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{chapter.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={chapter.difficulty} />
        <DurationBadge minutes={chapter.estimatedDuration} />
      </div>
      {available ? (
        <div className="space-y-3">
          <ChapterProgress lessonIds={lessons.map((l) => l.id)} />
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {lessons.length} {t.lesson.lessons}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          {t.status.planned}
        </span>
      )}
    </Link>
  );
}
