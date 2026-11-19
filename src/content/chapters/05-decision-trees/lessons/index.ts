import type { LessonLoader } from "@/content/types";

export const chapter05LessonLoaders: Record<string, LessonLoader> = {
  "ch05.train": () => import("./train-and-visualize.mdx"),
  "ch05.cart": () => import("./cart-algorithm.mdx"),
  "ch05.regularization": () => import("./regularization-hyperparameters.mdx"),
  "ch05.regression": () => import("./regression-trees.mdx"),
  "ch05.limitations": () => import("./limitations.mdx"),
};
