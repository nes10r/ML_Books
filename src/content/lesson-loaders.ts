import { chapter01LessonLoaders } from "./chapters/01-machine-learning-landscape/lessons";
import { chapter02LessonLoaders } from "./chapters/02-end-to-end-project/lessons";
import { chapter03LessonLoaders } from "./chapters/03-classification/lessons";
import { chapter04LessonLoaders } from "./chapters/04-training-models/lessons";
import { chapter05LessonLoaders } from "./chapters/05-decision-trees/lessons";
import { chapter06LessonLoaders } from "./chapters/06-ensemble-learning/lessons";
import { chapter07LessonLoaders } from "./chapters/07-dimensionality-reduction/lessons";
import { chapter08LessonLoaders } from "./chapters/08-unsupervised-learning/lessons";
import type { LessonLoader } from "./types";

export const lessonLoaders: Record<string, LessonLoader> = {
  ...chapter01LessonLoaders,
  ...chapter02LessonLoaders,
  ...chapter03LessonLoaders,
  ...chapter04LessonLoaders,
  ...chapter05LessonLoaders,
  ...chapter06LessonLoaders,
  ...chapter07LessonLoaders,
  ...chapter08LessonLoaders,
};
