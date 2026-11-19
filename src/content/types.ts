import type { MDXContent } from "mdx/types";
import type { z } from "zod";
import type {
  ChapterInput,
  codeExampleSchema,
  exerciseSchema,
  mediaAssetSchema,
  quizSchema,
} from "@/lib/schemas";

/**
 * Everything a chapter contributes to the platform. A chapter folder exports
 * one `ChapterModule`; registering it in `content/registry.ts` is the only
 * wiring needed for routing, navigation, search and validation to pick it up.
 */
export interface ChapterModule {
  chapter: ChapterInput;
  quizzes?: z.input<typeof quizSchema>[];
  exercises?: z.input<typeof exerciseSchema>[];
  codeExamples?: z.input<typeof codeExampleSchema>[];
  media?: z.input<typeof mediaAssetSchema>[];
}

/** Lazily loads the compiled MDX body of a lesson. */
export type LessonLoader = () => Promise<{ default: MDXContent }>;
