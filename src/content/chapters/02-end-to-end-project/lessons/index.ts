import type { LessonLoader } from "@/content/types";

export const chapter02LessonLoaders: Record<string, LessonLoader> = {
  "ch02.big-picture": () => import("./look-at-the-big-picture.mdx"),
  "ch02.get-data": () => import("./get-the-data.mdx"),
  "ch02.test-set": () => import("./create-a-test-set.mdx"),
  "ch02.explore": () => import("./explore-the-data.mdx"),
  "ch02.prepare": () => import("./prepare-the-data.mdx"),
  "ch02.pipelines": () => import("./transformation-pipelines.mdx"),
  "ch02.train-model": () => import("./select-and-train-a-model.mdx"),
  "ch02.fine-tune": () => import("./fine-tune-your-model.mdx"),
  "ch02.launch": () => import("./launch-monitor-maintain.mdx"),
};
