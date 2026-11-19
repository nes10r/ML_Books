import type { LessonLoader } from "@/content/types";

export const chapter07LessonLoaders: Record<string, LessonLoader> = {
  "ch07.curse": () => import("./curse-of-dimensionality.mdx"),
  "ch07.pca": () => import("./pca.mdx"),
  "ch07.pca-practice": () => import("./pca-in-practice.mdx"),
  "ch07.random-projection": () => import("./random-projection.mdx"),
  "ch07.manifold": () => import("./manifold-learning.mdx"),
};
