import type { ChapterModule } from "@/content/types";
import { chapter05CodeExamples, chapter05Media } from "./assets";
import { chapter05 } from "./chapter";
import { chapter05Exercises } from "./exercises";
import { chapter05Quizzes } from "./quizzes";

export const chapter05Module: ChapterModule = {
  chapter: chapter05,
  quizzes: chapter05Quizzes,
  exercises: chapter05Exercises,
  codeExamples: chapter05CodeExamples,
  media: chapter05Media,
};
