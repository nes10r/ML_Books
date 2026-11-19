import type { LessonLoader } from "@/content/types";

export const chapter04LessonLoaders: Record<string, LessonLoader> = {
  "ch04.linear-regression": () => import("./linear-regression.mdx"),
  "ch04.normal-equation": () => import("./normal-equation.mdx"),
  "ch04.gradient-descent": () => import("./gradient-descent.mdx"),
  "ch04.sgd": () => import("./stochastic-and-mini-batch.mdx"),
  "ch04.polynomial": () => import("./polynomial-regression-and-learning-curves.mdx"),
  "ch04.regularization": () => import("./regularized-linear-models.mdx"),
  "ch04.logistic": () => import("./logistic-regression.mdx"),
  "ch04.softmax": () => import("./softmax-regression.mdx"),
};
