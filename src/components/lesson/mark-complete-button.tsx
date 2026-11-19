"use client";

import { Check, RotateCcw } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";
import { useLessonStatus } from "@/lib/progress/hooks";
import { useProgressStore } from "@/lib/progress/store";

export function MarkCompleteButton({
  lessonId,
  size,
  className,
}: {
  lessonId: string;
  size?: ButtonProps["size"];
  className?: string;
}) {
  const { hydrated, status } = useLessonStatus(lessonId);
  const setCompleted = useProgressStore((s) => s.setLessonCompleted);
  const done = status === "completed";

  if (!hydrated) {
    return (
      <Button size={size} variant="secondary" className={className} disabled>
        {t.lesson.loadingProgress}
      </Button>
    );
  }
  return done ? (
    <Button
      size={size}
      variant="soft"
      className={className}
      onClick={() => setCompleted(lessonId, false)}
      aria-pressed
      title={t.lesson.markIncomplete}
    >
      <Check />
      {t.lesson.completed}
      <RotateCcw className="ml-auto opacity-60" aria-hidden />
      <span className="sr-only">— {t.lesson.markIncomplete}</span>
    </Button>
  ) : (
    <Button size={size} className={className} onClick={() => setCompleted(lessonId, true)} aria-pressed={false}>
      <Check />
      {t.lesson.markComplete}
    </Button>
  );
}
