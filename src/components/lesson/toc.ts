import { t } from "@/lib/i18n/az";
import type { ContentBlockKind, Lesson } from "@/lib/schemas";

export interface TocEntry {
  id: string;
  title: string;
  kind: ContentBlockKind;
}

/** Table of contents = generated sections (from data) + MDX sections, in reading order. */
export function buildToc(lesson: Lesson, opts: { hasNext: boolean }): TocEntry[] {
  const entries: TocEntry[] = [];
  if (lesson.learningObjectives.length > 0 || lesson.prerequisites.length > 0) {
    entries.push({ id: "objectives", title: t.blockKind.objectives, kind: "objectives" });
  }
  entries.push(...lesson.sections.map((s) => ({ id: s.id, title: s.title, kind: s.kind })));
  if (lesson.quizId) entries.push({ id: "knowledge-check", title: t.blockKind["knowledge-check"], kind: "knowledge-check" });
  if (lesson.exerciseIds.length > 0) entries.push({ id: "practice", title: t.blockKind.practice, kind: "practice" });
  if (opts.hasNext) entries.push({ id: "next", title: t.blockKind.next, kind: "next" });
  return entries;
}
