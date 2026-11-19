"use client";

import { Check, Circle, CircleDot } from "lucide-react";
import { useLessonStatus } from "@/lib/progress/hooks";
import { cn } from "@/lib/utils";

/** Small status glyph for a lesson: not started / in progress / completed. */
export function LessonStatusIcon({ lessonId, className }: { lessonId: string; className?: string }) {
  const { hydrated, status } = useLessonStatus(lessonId);
  if (!hydrated || status === "not-started") {
    return <Circle aria-hidden className={cn("size-4 text-border", className)} />;
  }
  if (status === "completed") {
    return (
      <span className={cn("grid size-4 place-items-center rounded-full bg-success text-white", className)}>
        <Check aria-hidden className="size-3" strokeWidth={3} />
        <span className="sr-only">Tamamlandı</span>
      </span>
    );
  }
  return (
    <>
      <CircleDot aria-hidden className={cn("size-4 text-primary", className)} />
      <span className="sr-only">Davam edir</span>
    </>
  );
}
