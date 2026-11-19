import { z } from "zod";
import {
  contentStatusSchema,
  difficultySchema,
  durationSchema,
  idSchema,
  tagSchema,
  urlSchema,
} from "./primitives";

/** Bloom taxonomy level — lets future analytics group objectives by depth. */
export const bloomLevelSchema = z.enum([
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
]);

export const learningObjectiveSchema = z.object({
  id: idSchema,
  text: z.string().min(5),
  level: bloomLevelSchema.optional(),
});
export type LearningObjective = z.infer<typeof learningObjectiveSchema>;

export const prerequisiteSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lesson"), lessonId: idSchema }),
  z.object({ kind: z.literal("chapter"), chapterId: idSchema }),
  z.object({
    kind: z.literal("skill"),
    label: z.string().min(2),
    description: z.string().optional(),
    url: urlSchema.optional(),
  }),
]);
export type Prerequisite = z.infer<typeof prerequisiteSchema>;

export const githubReferenceSchema = z.object({
  label: z.string().min(2),
  url: urlSchema.refine((u) => new URL(u).hostname.endsWith("github.com"), {
    message: "GitHub istinadı github.com ünvanı olmalıdır",
  }),
  kind: z.enum(["repository", "notebook", "file", "issue"]).default("repository"),
});
export type GithubReference = z.infer<typeof githubReferenceSchema>;

/**
 * Metadata shared by every navigable unit (chapter, lesson).
 * Reference arrays contain registry IDs that are cross-validated in
 * `lib/content/validate.ts`.
 */
export const contentMetaSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  estimatedDuration: durationSchema,
  difficulty: difficultySchema,
  status: contentStatusSchema,
  prerequisites: z.array(prerequisiteSchema).default([]),
  learningObjectives: z.array(learningObjectiveSchema).default([]),
  tags: z.array(tagSchema).default([]),
  mediaReferences: z.array(idSchema).default([]),
  interactiveDemoReferences: z.array(idSchema).default([]),
  githubReferences: z.array(githubReferenceSchema).default([]),
});
export type ContentMeta = z.infer<typeof contentMetaSchema>;
