import { z } from "zod";
import { idSchema } from "./primitives";

export const PROGRESS_SCHEMA_VERSION = 1 as const;

const isoDate = z.iso.datetime();

export const lessonProgressSchema = z.object({
  status: z.enum(["in-progress", "completed"]),
  firstVisitedAt: isoDate,
  lastVisitedAt: isoDate,
  completedAt: isoDate.optional(),
});
export type LessonProgress = z.infer<typeof lessonProgressSchema>;

export const quizProgressSchema = z.object({
  attempts: z.number().int().nonnegative(),
  bestScore: z.number().min(0).max(1),
  lastScore: z.number().min(0).max(1),
  lastAttemptAt: isoDate,
});
export type QuizProgress = z.infer<typeof quizProgressSchema>;

/**
 * Learner progress document. Kept intentionally flat and keyed by stable IDs
 * so the same shape can be synced to a server later (see ProgressRepository).
 */
export const learningProgressSchema = z.object({
  version: z.literal(PROGRESS_SCHEMA_VERSION),
  lessons: z.record(idSchema, lessonProgressSchema),
  quizzes: z.record(idSchema, quizProgressSchema),
  updatedAt: isoDate,
});
export type LearningProgress = z.infer<typeof learningProgressSchema>;

export function createEmptyProgress(now: Date = new Date()): LearningProgress {
  return {
    version: PROGRESS_SCHEMA_VERSION,
    lessons: {},
    quizzes: {},
    updatedAt: now.toISOString(),
  };
}
