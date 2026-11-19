import type { ChapterModule } from "@/content/types";
import { chapter03CodeExamples, chapter03Media } from "./assets";
import { chapter03 } from "./chapter";
import { chapter03Exercises } from "./exercises";
import { chapter03Quizzes } from "./quizzes";

export const chapter03Module: ChapterModule = {
  chapter: chapter03,
  quizzes: chapter03Quizzes,
  exercises: chapter03Exercises,
  codeExamples: chapter03CodeExamples,
  media: chapter03Media,
};
