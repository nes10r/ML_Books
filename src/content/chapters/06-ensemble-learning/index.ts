import type { ChapterModule } from "@/content/types";
import { chapter06CodeExamples, chapter06Media } from "./assets";
import { chapter06 } from "./chapter";
import { chapter06Exercises } from "./exercises";
import { chapter06Quizzes } from "./quizzes";

export const chapter06Module: ChapterModule = {
  chapter: chapter06,
  quizzes: chapter06Quizzes,
  exercises: chapter06Exercises,
  codeExamples: chapter06CodeExamples,
  media: chapter06Media,
};
