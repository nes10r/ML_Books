"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/lib/progress/store";

/** Records a visit once storage is hydrated (so the visit isn't overwritten by hydration). */
export function LessonVisitTracker({ lessonId }: { lessonId: string }) {
  const hydrated = useProgressStore((s) => s.hydrated);
  const visit = useProgressStore((s) => s.visitLesson);
  useEffect(() => {
    if (hydrated) visit(lessonId);
  }, [hydrated, lessonId, visit]);
  return null;
}
