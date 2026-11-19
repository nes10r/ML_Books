import type { LessonLoader } from "@/content/types";

/** Lesson ID → MDX body. Kept separate from metadata so only lesson pages pull MDX into the bundle. */
export const chapter01LessonLoaders: Record<string, LessonLoader> = {
  "ch01.what-is-ml": () => import("./what-is-machine-learning.mdx"),
  "ch01.applications": () => import("./applications-of-ml.mdx"),
  "ch01.training-supervision": () => import("./training-supervision.mdx"),
  "ch01.batch-online": () => import("./batch-vs-online-learning.mdx"),
  "ch01.instance-model": () => import("./instance-vs-model-based.mdx"),
  "ch01.challenges": () => import("./main-challenges.mdx"),
  "ch01.testing-validating": () => import("./testing-and-validating.mdx"),
};
