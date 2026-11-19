import type { ChapterModule } from "@/content/types";
import { chapter02CodeExamples, chapter02Media } from "./assets";
import { chapter02 } from "./chapter";
import { chapter02Exercises } from "./exercises";
import { chapter02Quizzes } from "./quizzes";

export const chapter02Module: ChapterModule = {
  chapter: chapter02,
  quizzes: chapter02Quizzes,
  exercises: chapter02Exercises,
  codeExamples: chapter02CodeExamples,
  media: chapter02Media,
};
