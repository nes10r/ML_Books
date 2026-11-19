import type { LessonLoader } from "@/content/types";

export const chapter06LessonLoaders: Record<string, LessonLoader> = {
  "ch06.voting": () => import("./voting-classifiers.mdx"),
  "ch06.bagging": () => import("./bagging-and-pasting.mdx"),
  "ch06.random-forests": () => import("./random-forests.mdx"),
  "ch06.boosting": () => import("./boosting.mdx"),
  "ch06.stacking": () => import("./stacking.mdx"),
};
