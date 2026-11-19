/**
 * Single registration point for all course content.
 *
 * To add a chapter: create `chapters/NN-slug/`, export a ChapterModule and
 * append it to `authoredChapters`. Its planned placeholder (same id) is
 * dropped automatically.
 */
import { chapter01Module } from "./chapters/01-machine-learning-landscape";
import { chapter02Module } from "./chapters/02-end-to-end-project";
import { chapter03Module } from "./chapters/03-classification";
import { chapter04Module } from "./chapters/04-training-models";
import { chapter05Module } from "./chapters/05-decision-trees";
import { chapter06Module } from "./chapters/06-ensemble-learning";
import { chapter07Module } from "./chapters/07-dimensionality-reduction";
import { chapter08Module } from "./chapters/08-unsupervised-learning";
import { plannedChapters } from "./chapters/planned";
import { course } from "./course";
import { datasets } from "./datasets";
import { demos } from "./demos";
import { glossary } from "./glossary";
import { resources } from "./resources";
import type { ChapterModule } from "./types";

const authoredChapters: ChapterModule[] = [chapter01Module, chapter02Module, chapter03Module, chapter04Module, chapter05Module, chapter06Module, chapter07Module, chapter08Module];

const authoredIds = new Set(authoredChapters.map((m) => m.chapter.id));

export const chapterModules: ChapterModule[] = [
  ...authoredChapters,
  ...plannedChapters.filter((c) => !authoredIds.has(c.id)).map((chapter) => ({ chapter })),
];

export const rawContent = {
  course,
  chapterModules,
  demos,
  datasets,
  glossary,
  resources,
};
export type RawContent = typeof rawContent;
