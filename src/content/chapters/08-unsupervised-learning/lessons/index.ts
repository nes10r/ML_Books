import type { LessonLoader } from "@/content/types";

export const chapter08LessonLoaders: Record<string, LessonLoader> = {
  "ch08.kmeans": () => import("./k-means.mdx"),
  "ch08.choosing-k": () => import("./choosing-k.mdx"),
  "ch08.kmeans-applications": () => import("./kmeans-applications.mdx"),
  "ch08.dbscan": () => import("./dbscan.mdx"),
  "ch08.gmm": () => import("./gaussian-mixtures.mdx"),
};
