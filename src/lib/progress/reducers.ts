import type { LearningProgress } from "@/lib/schemas";

/**
 * Pure state transitions for learner progress. Kept free of React/Zustand so
 * the same logic can run on a server when progress sync is introduced.
 */

export function markLessonVisited(p: LearningProgress, lessonId: string, now: Date): LearningProgress {
  const ts = now.toISOString();
  const existing = p.lessons[lessonId];
  return {
    ...p,
    updatedAt: ts,
    lessons: {
      ...p.lessons,
      [lessonId]: existing
        ? { ...existing, lastVisitedAt: ts }
        : { status: "in-progress", firstVisitedAt: ts, lastVisitedAt: ts },
    },
  };
}

export function setLessonCompleted(
  p: LearningProgress,
  lessonId: string,
  completed: boolean,
  now: Date,
): LearningProgress {
  const ts = now.toISOString();
  const existing = p.lessons[lessonId] ?? { status: "in-progress" as const, firstVisitedAt: ts, lastVisitedAt: ts };
  return {
    ...p,
    updatedAt: ts,
    lessons: {
      ...p.lessons,
      [lessonId]: completed
        ? { ...existing, status: "completed", completedAt: ts, lastVisitedAt: ts }
        : { status: "in-progress", firstVisitedAt: existing.firstVisitedAt, lastVisitedAt: ts },
    },
  };
}

export function recordQuizAttempt(p: LearningProgress, quizId: string, score: number, now: Date): LearningProgress {
  const ts = now.toISOString();
  const clamped = Math.min(1, Math.max(0, score));
  const prev = p.quizzes[quizId];
  return {
    ...p,
    updatedAt: ts,
    quizzes: {
      ...p.quizzes,
      [quizId]: {
        attempts: (prev?.attempts ?? 0) + 1,
        bestScore: Math.max(prev?.bestScore ?? 0, clamped),
        lastScore: clamped,
        lastAttemptAt: ts,
      },
    },
  };
}

export function completionRatio(p: LearningProgress, lessonIds: readonly string[]): number {
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => p.lessons[id]?.status === "completed").length;
  return done / lessonIds.length;
}

/** Most recently visited lesson among the given IDs, if any. */
export function lastVisitedLesson(p: LearningProgress, lessonIds: readonly string[]): string | undefined {
  let best: { id: string; at: string } | undefined;
  for (const id of lessonIds) {
    const l = p.lessons[id];
    if (l && (!best || l.lastVisitedAt > best.at)) best = { id, at: l.lastVisitedAt };
  }
  return best?.id;
}
