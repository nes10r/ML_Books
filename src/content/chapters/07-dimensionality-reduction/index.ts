import type { ChapterModule } from "@/content/types";
import { chapter07CodeExamples, chapter07Media } from "./assets";
import { chapter07 } from "./chapter";
import { chapter07Exercises } from "./exercises";
import { chapter07Quizzes } from "./quizzes";

export const chapter07Module: ChapterModule = {
  chapter: chapter07,
  quizzes: chapter07Quizzes,
  exercises: chapter07Exercises,
  codeExamples: chapter07CodeExamples,
  media: chapter07Media,
};
