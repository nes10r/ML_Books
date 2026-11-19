import { z } from "zod";

/** kebab-case URL segment, e.g. `machine-learning-landscape`. Never changes once published. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug kebab-case olmalıdır (a-z, 0-9, '-')");

/**
 * Stable, globally unique identifier. Dots namespace entities by chapter,
 * e.g. `ch01`, `ch01.what-is-ml`, `ch01.quiz.final`.
 */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, "ID yalnız a-z, 0-9, '.', '-' simvollarından ibarət olmalıdır");

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof difficultySchema>;

/**
 * - `published`: visible and complete
 * - `draft`: exists in the repo but hidden from navigation in production
 * - `planned`: structural placeholder (title/description only); never rendered as complete
 */
export const contentStatusSchema = z.enum(["published", "draft", "planned"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

/** Estimated duration in whole minutes. */
export const durationSchema = z.number().int().positive().max(60 * 20);

export const tagSchema = z.string().min(1).max(40);

export const urlSchema = z.url();
