import { z } from "zod";
import { contentMetaSchema } from "./meta";
import { idSchema, slugSchema, urlSchema } from "./primitives";

/**
 * Content block kinds. A lesson declares which of these sections it uses;
 * none of them is mandatory. Kinds marked "generated" are rendered from
 * structured data (not from MDX) by the lesson layout.
 */
export const contentBlockKindSchema = z.enum([
  "objectives", // generated
  "prerequisites", // generated
  "concept",
  "step-by-step",
  "visualization",
  "math",
  "worked-example",
  "python",
  "case-study",
  "common-mistakes",
  "knowledge-check", // generated (from quizId)
  "practice", // generated (from exerciseIds)
  "summary",
  "next", // generated
]);
export type ContentBlockKind = z.infer<typeof contentBlockKindSchema>;

export const GENERATED_BLOCK_KINDS = [
  "objectives",
  "prerequisites",
  "knowledge-check",
  "practice",
  "next",
] as const satisfies readonly ContentBlockKind[];

/** A titled section of a lesson whose body lives in MDX (`<Section id="…">`). */
export const lessonSectionSchema = z.object({
  id: slugSchema,
  title: z.string().min(2),
  kind: contentBlockKindSchema.exclude([...GENERATED_BLOCK_KINDS]),
});
export type LessonSection = z.infer<typeof lessonSectionSchema>;

/** Pedagogical lesson type — drives layout accents and filtering. */
export const lessonTypeSchema = z.enum([
  "theory",
  "visual-simulation",
  "code-lab",
  "math",
  "assessment",
]);
export type LessonType = z.infer<typeof lessonTypeSchema>;

export const lessonSchema = contentMetaSchema.extend({
  id: idSchema,
  slug: slugSchema,
  type: lessonTypeSchema,
  sections: z.array(lessonSectionSchema).default([]),
  keyConcepts: z.array(idSchema).default([]), // glossary term IDs
  codeExampleIds: z.array(idSchema).default([]),
  quizId: idSchema.optional(),
  exerciseIds: z.array(idSchema).default([]),
  resourceIds: z.array(idSchema).default([]),
});
export type Lesson = z.infer<typeof lessonSchema>;
export type LessonInput = z.input<typeof lessonSchema>;

export const bookReferenceSchema = z.object({
  chapter: z.number().int().positive(),
  originalTitle: z.string().min(2),
});

export const chapterSchema = contentMetaSchema.extend({
  id: idSchema,
  slug: slugSchema,
  number: z.number().int().positive(),
  partId: idSchema,
  bookReference: bookReferenceSchema,
  lessons: z.array(lessonSchema).default([]),
  quizIds: z.array(idSchema).default([]),
});
export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterInput = z.input<typeof chapterSchema>;

export const partSchema = z.object({
  id: idSchema,
  number: z.number().int().positive(),
  title: z.string().min(2),
  description: z.string().min(10),
});
export type Part = z.infer<typeof partSchema>;

export const courseSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  title: z.string().min(2),
  subtitle: z.string().min(2),
  description: z.string().min(10),
  locale: z.enum(["az"]), // extend with "en", "ru", … when multilingual content lands
  source: z.object({
    title: z.string(),
    author: z.string(),
    publisher: z.string(),
    year: z.number().int(),
    url: urlSchema,
  }),
  parts: z.array(partSchema).min(1),
});
export type Course = z.infer<typeof courseSchema>;
