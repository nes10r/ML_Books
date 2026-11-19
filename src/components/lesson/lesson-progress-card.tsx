"use client";

import { ChapterProgress } from "@/components/course/chapter-progress";
import { t } from "@/lib/i18n/az";
import { MarkCompleteButton } from "./mark-complete-button";

export function LessonProgressCard({ lessonId, chapterLessonIds }: { lessonId: string; chapterLessonIds: string[] }) {
  return (
    <div className="space-y-3 rounded-xl border bg-surface p-4">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t.lesson.yourProgress}</p>
      <ChapterProgress lessonIds={chapterLessonIds} />
      <MarkCompleteButton lessonId={lessonId} size="sm" className="w-full" />
    </div>
  );
}
