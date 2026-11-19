import type { ChapterModule } from "@/content/types";
import { chapter08CodeExamples, chapter08Media } from "./assets";
import { chapter08 } from "./chapter";
import { chapter08Exercises } from "./exercises";
import { chapter08Quizzes } from "./quizzes";

export const chapter08Module: ChapterModule = {
  chapter: chapter08,
  quizzes: chapter08Quizzes,
  exercises: chapter08Exercises,
  codeExamples: chapter08CodeExamples,
  media: chapter08Media,
};
