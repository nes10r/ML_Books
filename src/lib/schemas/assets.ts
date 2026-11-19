import { z } from "zod";
import { contentStatusSchema, difficultySchema, durationSchema, idSchema, slugSchema, urlSchema } from "./primitives";

/* ------------------------------------------------------------------ */
/* Interactive demos                                                   */
/* ------------------------------------------------------------------ */

export const interactiveDemoSchema = z.object({
  id: slugSchema, // also the key in the client component registry
  title: z.string().min(2),
  description: z.string().min(10),
  kind: z.enum(["simulation", "visualization", "calculator"]),
  chapterId: idSchema,
  lessonIds: z.array(idSchema).default([]),
  concepts: z.array(idSchema).default([]), // glossary IDs
  estimatedDuration: durationSchema,
  status: contentStatusSchema,
  instructions: z.array(z.string().min(3)).default([]),
});
export type InteractiveDemo = z.infer<typeof interactiveDemoSchema>;

/* ------------------------------------------------------------------ */
/* Code examples                                                       */
/* ------------------------------------------------------------------ */

export const codeExampleSchema = z.object({
  id: idSchema,
  title: z.string().min(2),
  description: z.string().min(10),
  language: z.enum(["python"]),
  /** Path relative to `src/content`. Read on the server at build time. */
  file: z.string().regex(/^[\w\-/.]+\.py$/),
  chapterId: idSchema,
  lessonId: idSchema.optional(),
  libraries: z.array(z.string()).default([]),
  /** Where the example can run today. Only `local` is supported in v1. */
  runtime: z.enum(["local"]).default("local"),
  expectedOutput: z.string().optional(),
});
export type CodeExample = z.infer<typeof codeExampleSchema>;

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

const optionSchema = z.object({ id: z.string().min(1), text: z.string().min(1) });

const questionBase = {
  id: idSchema,
  prompt: z.string().min(5),
  explanation: z.string().min(5),
};

export const questionSchema = z
  .discriminatedUnion("type", [
    z.object({
      ...questionBase,
      type: z.literal("single-choice"),
      options: z.array(optionSchema).min(2),
      correctOptionId: z.string(),
    }),
    z.object({
      ...questionBase,
      type: z.literal("multiple-choice"),
      options: z.array(optionSchema).min(2),
      correctOptionIds: z.array(z.string()).min(1),
    }),
    z.object({
      ...questionBase,
      type: z.literal("true-false"),
      answer: z.boolean(),
    }),
  ])
  .superRefine((q, ctx) => {
    if (q.type === "true-false") return;
    const ids = new Set(q.options.map((o) => o.id));
    if (ids.size !== q.options.length) {
      ctx.addIssue({ code: "custom", message: `Sual ${q.id}: variant ID-ləri təkrarlanır` });
    }
    const correct = q.type === "single-choice" ? [q.correctOptionId] : q.correctOptionIds;
    for (const c of correct) {
      if (!ids.has(c)) {
        ctx.addIssue({ code: "custom", message: `Sual ${q.id}: düzgün cavab '${c}' variantlarda yoxdur` });
      }
    }
  });
export type Question = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  id: idSchema,
  title: z.string().min(2),
  description: z.string().min(5),
  chapterId: idSchema,
  lessonId: idSchema.optional(),
  /** Fraction in [0, 1] required to pass. */
  passingScore: z.number().min(0).max(1).default(0.7),
  questions: z.array(questionSchema).min(1),
});
export type Quiz = z.infer<typeof quizSchema>;

/* ------------------------------------------------------------------ */
/* Practice exercises                                                  */
/* ------------------------------------------------------------------ */

export const exerciseSchema = z.object({
  id: idSchema,
  title: z.string().min(2),
  prompt: z.string().min(10),
  kind: z.enum(["conceptual", "coding", "research"]),
  difficulty: difficultySchema,
  estimatedDuration: durationSchema,
  chapterId: idSchema,
  lessonId: idSchema.optional(),
  hints: z.array(z.string()).default([]),
  /** Optional model answer, hidden behind a disclosure in the UI. */
  solution: z.string().optional(),
});
export type Exercise = z.infer<typeof exerciseSchema>;

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

const mediaBase = {
  id: idSchema,
  title: z.string().min(2),
  caption: z.string().optional(),
  credit: z.string().optional(),
  license: z.string().optional(),
  chapterId: idSchema.optional(),
};

/** Local paths must live under /media/ in `public/`; remote URLs must be https. */
const mediaSrcSchema = z
  .string()
  .refine((s) => s.startsWith("/media/") || s.startsWith("https://"), {
    message: "Media mənbəyi '/media/...' və ya 'https://...' olmalıdır",
  });

export const mediaAssetSchema = z.discriminatedUnion("type", [
  z.object({
    ...mediaBase,
    type: z.literal("image"),
    src: mediaSrcSchema,
    alt: z.string().min(5),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  z.object({
    ...mediaBase,
    type: z.literal("video"),
    src: mediaSrcSchema,
    poster: mediaSrcSchema.optional(),
    durationSeconds: z.number().int().positive().optional(),
    captions: z
      .array(z.object({ src: mediaSrcSchema, srclang: z.string().length(2), label: z.string() }))
      .default([]),
  }),
  z.object({
    ...mediaBase,
    type: z.literal("embed"),
    provider: z.enum(["youtube", "vimeo"]),
    /** Provider video ID — the embed URL is constructed in the component. */
    videoId: z.string().regex(/^[\w-]+$/),
    aspectRatio: z.enum(["16/9", "4/3"]).default("16/9"),
  }),
]);
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type MediaAssetType = MediaAsset["type"];

/* ------------------------------------------------------------------ */
/* Glossary & resources                                                */
/* ------------------------------------------------------------------ */

export const glossaryTermSchema = z.object({
  id: slugSchema,
  az: z.string().min(2),
  en: z.string().min(2),
  definition: z.string().min(10),
  chapterIds: z.array(idSchema).default([]),
  related: z.array(slugSchema).default([]),
  aliases: z.array(z.string()).default([]),
});
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;

export const resourceSchema = z.object({
  id: idSchema,
  title: z.string().min(2),
  url: urlSchema,
  kind: z.enum(["book", "documentation", "tool", "dataset", "tutorial", "paper"]),
  description: z.string().min(10),
  language: z.enum(["az", "en", "ru"]).default("en"),
  chapterIds: z.array(idSchema).default([]),
});
export type Resource = z.infer<typeof resourceSchema>;

/* ------------------------------------------------------------------ */
/* Datasets                                                            */
/* ------------------------------------------------------------------ */

export const datasetColumnSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9_]*$/),
  type: z.enum(["id", "numeric", "integer", "categorical", "binary", "target"]),
  description: z.string().min(3),
  unit: z.string().optional(),
});
export type DatasetColumn = z.infer<typeof datasetColumnSchema>;

/**
 * A downloadable dataset shared by demos (fetched in the browser) and
 * Python examples. Course-level (not chapter-bound) so later chapters can reuse it.
 */
export const datasetSchema = z.object({
  id: slugSchema,
  title: z.string().min(2),
  description: z.string().min(10),
  /** Public path under /data/ */
  file: z.string().regex(/^\/data\/[\w\-.]+\.csv$/),
  format: z.literal("csv"),
  rows: z.number().int().positive(),
  columns: z.array(datasetColumnSchema).min(1),
  license: z.string(),
  provenance: z.string().min(10),
  generator: z.string().optional(),
  chapterIds: z.array(idSchema).default([]),
});
export type Dataset = z.infer<typeof datasetSchema>;
