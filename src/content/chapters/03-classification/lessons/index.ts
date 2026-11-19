import type { LessonLoader } from "@/content/types";

export const chapter03LessonLoaders: Record<string, LessonLoader> = {
  "ch03.digits": () => import("./handwritten-digits.mdx"),
  "ch03.binary": () => import("./binary-classifier.mdx"),
  "ch03.confusion": () => import("./confusion-matrix.mdx"),
  "ch03.precision-recall": () => import("./precision-recall-tradeoff.mdx"),
  "ch03.roc": () => import("./roc-curve.mdx"),
  "ch03.multiclass": () => import("./multiclass-classification.mdx"),
  "ch03.error-analysis": () => import("./error-analysis.mdx"),
  "ch03.multilabel": () => import("./multilabel-and-multioutput.mdx"),
};
