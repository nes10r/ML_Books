import type { ChapterModule } from "@/content/types";
import { chapter04CodeExamples, chapter04Media } from "./assets";
import { chapter04 } from "./chapter";
import { chapter04Exercises } from "./exercises";
import { chapter04Quizzes } from "./quizzes";

export const chapter04Module: ChapterModule = {
  chapter: chapter04,
  quizzes: chapter04Quizzes,
  exercises: chapter04Exercises,
  codeExamples: chapter04CodeExamples,
  media: chapter04Media,
};
