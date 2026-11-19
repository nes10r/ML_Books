import { z } from "zod";
import type { RawContent } from "@/content/registry";
import {
  chapterSchema,
  codeExampleSchema,
  courseSchema,
  datasetSchema,
  exerciseSchema,
  glossaryTermSchema,
  interactiveDemoSchema,
  mediaAssetSchema,
  quizSchema,
  resourceSchema,
  type Chapter,
  type CodeExample,
  type Course,
  type Dataset,
  type Exercise,
  type GlossaryTerm,
  type InteractiveDemo,
  type MediaAsset,
  type Quiz,
  type Resource,
} from "@/lib/schemas";

export interface ContentGraph {
  course: Course;
  chapters: Chapter[];
  quizzes: Quiz[];
  exercises: Exercise[];
  codeExamples: CodeExample[];
  media: MediaAsset[];
  demos: InteractiveDemo[];
  datasets: Dataset[];
  glossary: GlossaryTerm[];
  resources: Resource[];
}

export class ContentValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Məzmun validasiyası uğursuz oldu:\n- ${issues.join("\n- ")}`);
    this.name = "ContentValidationError";
  }
}

function parseWith<T>(schema: z.ZodType<T>, value: unknown, label: string, issues: string[]): T | null {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    issues.push(`${label} → ${issue.path.join(".") || "(kök)"}: ${issue.message}`);
  }
  return null;
}

function parseAll<T>(schema: z.ZodType<T>, values: unknown[], label: (v: unknown, i: number) => string, issues: string[]): T[] {
  return values
    .map((v, i) => parseWith(schema, v, label(v, i), issues))
    .filter((v): v is T => v !== null);
}

const idOf = (v: unknown, i: number) =>
  typeof v === "object" && v !== null && "id" in v ? String((v as { id: unknown }).id) : `#${i}`;

/** Parses raw content with Zod. Schema errors are collected (not thrown one-by-one). */
export function parseContent(raw: RawContent): { graph: ContentGraph; issues: string[] } {
  const issues: string[] = [];
  const course = parseWith(courseSchema, raw.course, "course", issues);
  const modules = raw.chapterModules;

  const graph: ContentGraph = {
    course: course ?? (raw.course as unknown as Course),
    chapters: parseAll(chapterSchema, modules.map((m) => m.chapter), (v, i) => `chapter ${idOf(v, i)}`, issues),
    quizzes: parseAll(quizSchema, modules.flatMap((m) => m.quizzes ?? []), (v, i) => `quiz ${idOf(v, i)}`, issues),
    exercises: parseAll(exerciseSchema, modules.flatMap((m) => m.exercises ?? []), (v, i) => `exercise ${idOf(v, i)}`, issues),
    codeExamples: parseAll(codeExampleSchema, modules.flatMap((m) => m.codeExamples ?? []), (v, i) => `code ${idOf(v, i)}`, issues),
    media: parseAll(mediaAssetSchema, modules.flatMap((m) => m.media ?? []), (v, i) => `media ${idOf(v, i)}`, issues),
    demos: parseAll(interactiveDemoSchema, raw.demos, (v, i) => `demo ${idOf(v, i)}`, issues),
    datasets: parseAll(datasetSchema, raw.datasets, (v, i) => `dataset ${idOf(v, i)}`, issues),
    glossary: parseAll(glossaryTermSchema, raw.glossary, (v, i) => `term ${idOf(v, i)}`, issues),
    resources: parseAll(resourceSchema, raw.resources, (v, i) => `resource ${idOf(v, i)}`, issues),
  };
  graph.chapters.sort((a, b) => a.number - b.number);
  return { graph, issues };
}
