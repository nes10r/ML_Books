import type { ChapterModule } from "@/content/types";
import { chapter01CodeExamples, chapter01Media } from "./assets";
import { chapter01 } from "./chapter";
import { chapter01Exercises } from "./exercises";
import { chapter01Quizzes } from "./quizzes";

export const chapter01Module: ChapterModule = {
  chapter: chapter01,
  quizzes: chapter01Quizzes,
  exercises: chapter01Exercises,
  codeExamples: chapter01CodeExamples,
  media: chapter01Media,
};
