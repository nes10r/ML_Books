/**
 * Read-only content repository. All pages query content through these
 * functions — never by importing content files directly — so the storage
 * (TS modules today, a CMS or database tomorrow) can change in one place.
 */
import { rawContent } from "@/content/registry";
import type {
  Chapter,
  CodeExample,
  ContentStatus,
  Dataset,
  Exercise,
  GlossaryTerm,
  InteractiveDemo,
  Lesson,
  MediaAsset,
  Part,
  Quiz,
  Resource,
} from "@/lib/schemas";
import { ContentValidationError, parseContent, type ContentGraph } from "./parse";
import { validateContentGraph } from "./validate";

function buildGraph(): ContentGraph {
  const { graph, issues } = parseContent(rawContent);
  const all = [...issues, ...(issues.length === 0 ? validateContentGraph(graph) : [])];
  if (all.length > 0) throw new ContentValidationError(all);
  return graph;
}

// Parsed and validated once per server process / build.
const graph = buildGraph();

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((i) => [i.id, i]));
const chapterById = byId(graph.chapters);
const quizById = byId(graph.quizzes);
const exerciseById = byId(graph.exercises);
const codeById = byId(graph.codeExamples);
const mediaById = byId(graph.media);
const demoById = byId(graph.demos);
const termById = byId(graph.glossary);
const resourceById = byId(graph.resources);
const datasetById = byId(graph.datasets);

/** Drafts are visible while authoring (`next dev`) but never in production builds. */
export function isVisible(status: ContentStatus): boolean {
  if (status === "draft") return process.env.NODE_ENV !== "production";
  return true;
}

/** True when the unit has real content that can be opened. */
export function isAvailable(status: ContentStatus): boolean {
  return status === "published" || (status === "draft" && isVisible(status));
}

export interface LessonRef {
  chapter: Chapter;
  lesson: Lesson;
}

/* --------------------------------- Course -------------------------------- */

export const getCourse = () => graph.course;
export const getParts = (): Part[] => [...graph.course.parts].sort((a, b) => a.number - b.number);

/* -------------------------------- Chapters ------------------------------- */

export const getChapters = (): Chapter[] => graph.chapters.filter((c) => isVisible(c.status));
export const getChaptersByPart = (partId: string) => getChapters().filter((c) => c.partId === partId);
export const getChapterById = (id: string) => chapterById.get(id);
export const getChapterBySlug = (slug: string) => getChapters().find((c) => c.slug === slug);

export function getVisibleLessons(chapter: Chapter): Lesson[] {
  return chapter.lessons.filter((l) => isVisible(l.status));
}

/* --------------------------------- Lessons ------------------------------- */

/** All openable lessons in course order (chapter number, then declaration order). */
export function getLessonSequence(): LessonRef[] {
  return getChapters()
    .filter((c) => isAvailable(c.status))
    .flatMap((chapter) =>
      getVisibleLessons(chapter)
        .filter((l) => isAvailable(l.status))
        .map((lesson) => ({ chapter, lesson })),
    );
}

export function getLesson(chapterSlug: string, lessonSlug: string): LessonRef | undefined {
  return getLessonSequence().find((r) => r.chapter.slug === chapterSlug && r.lesson.slug === lessonSlug);
}

export function getLessonById(id: string): LessonRef | undefined {
  for (const chapter of graph.chapters) {
    const lesson = chapter.lessons.find((l) => l.id === id);
    if (lesson) return { chapter, lesson };
  }
  return undefined;
}

export function getAdjacentLessons(lessonId: string): { previous?: LessonRef; next?: LessonRef } {
  const seq = getLessonSequence();
  const i = seq.findIndex((r) => r.lesson.id === lessonId);
  if (i === -1) return {};
  return { previous: seq[i - 1], next: seq[i + 1] };
}

export const lessonHref = (chapter: Pick<Chapter, "slug">, lesson: Pick<Lesson, "slug">) =>
  `/chapters/${chapter.slug}/${lesson.slug}`;
export const chapterHref = (chapter: Pick<Chapter, "slug">) => `/chapters/${chapter.slug}`;

/* --------------------------------- Assets -------------------------------- */

export const getQuiz = (id: string): Quiz | undefined => quizById.get(id);
export const getQuizzes = (): Quiz[] => graph.quizzes;
export const getExercise = (id: string): Exercise | undefined => exerciseById.get(id);
export const getExercises = (filter?: { chapterId?: string; lessonId?: string }): Exercise[] =>
  graph.exercises.filter(
    (e) => (!filter?.chapterId || e.chapterId === filter.chapterId) && (!filter?.lessonId || e.lessonId === filter.lessonId),
  );
export const getCodeExample = (id: string): CodeExample | undefined => codeById.get(id);
export const getCodeExamples = (): CodeExample[] => graph.codeExamples;
export const getMedia = (id: string): MediaAsset | undefined => mediaById.get(id);
export const getMediaAssets = (): MediaAsset[] => graph.media;
export const getDemo = (id: string): InteractiveDemo | undefined => demoById.get(id);
export const getDemos = (): InteractiveDemo[] => graph.demos.filter((d) => isVisible(d.status));
export const getDataset = (id: string): Dataset | undefined => datasetById.get(id);
export const getDatasets = (): Dataset[] => graph.datasets;
export const getTerm = (id: string): GlossaryTerm | undefined => termById.get(id);
export const getGlossary = (): GlossaryTerm[] =>
  [...graph.glossary].sort((a, b) => a.az.localeCompare(b.az, "az"));
export const getResource = (id: string): Resource | undefined => resourceById.get(id);
export const getResources = (filter?: { chapterId?: string }): Resource[] =>
  graph.resources.filter((r) => !filter?.chapterId || r.chapterIds.length === 0 || r.chapterIds.includes(filter.chapterId));

/* ------------------------------ Aggregates ------------------------------- */

export function getCourseStats() {
  const chapters = getChapters();
  const lessons = getLessonSequence();
  return {
    chapterCount: chapters.length,
    availableChapterCount: chapters.filter((c) => isAvailable(c.status)).length,
    lessonCount: lessons.length,
    demoCount: getDemos().length,
    codeExampleCount: graph.codeExamples.length,
    termCount: graph.glossary.length,
    totalMinutes: lessons.reduce((s, r) => s + r.lesson.estimatedDuration, 0),
  };
}

/* ------------------------------ Navigation ------------------------------- */

/** Serializable navigation tree passed from server to client components. */
export interface NavLesson {
  id: string;
  slug: string;
  title: string;
  href: string;
  estimatedDuration: number;
}
export interface NavChapter {
  id: string;
  slug: string;
  number: number;
  title: string;
  href: string;
  available: boolean;
  lessons: NavLesson[];
}
export interface NavPart {
  id: string;
  number: number;
  title: string;
  chapters: NavChapter[];
}

export function getCourseNavigation(): NavPart[] {
  return getParts().map((part) => ({
    id: part.id,
    number: part.number,
    title: part.title,
    chapters: getChaptersByPart(part.id).map((c) => ({
      id: c.id,
      slug: c.slug,
      number: c.number,
      title: c.title,
      href: chapterHref(c),
      available: isAvailable(c.status),
      lessons: getVisibleLessons(c)
        .filter((l) => isAvailable(l.status))
        .map((l) => ({ id: l.id, slug: l.slug, title: l.title, href: lessonHref(c, l), estimatedDuration: l.estimatedDuration })),
    })),
  }));
}
