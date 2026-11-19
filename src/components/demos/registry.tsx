"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DemoErrorBoundary } from "./demo-error-boundary";
import { DemoLoading } from "./demo-loading";

/**
 * Demo ID → lazily loaded client component. Each demo is code-split so a
 * lesson only downloads the simulations it actually embeds.
 * IDs must match `content/demos.ts` (enforced by tests).
 */
export const demoComponents = {
  "supervision-types": dynamic(() => import("./supervision-types-demo"), { loading: DemoLoading }),
  "online-learning": dynamic(() => import("./online-learning-demo"), { loading: DemoLoading }),
  "model-vs-instance": dynamic(() => import("./model-vs-instance-demo"), { loading: DemoLoading }),
  "overfitting-polynomial": dynamic(() => import("./overfitting-demo"), { loading: DemoLoading }),
  "stratified-split": dynamic(() => import("./stratified-split-demo"), { loading: DemoLoading }),
  "correlation-explorer": dynamic(() => import("./correlation-explorer-demo"), { loading: DemoLoading }),
  "feature-scaling": dynamic(() => import("./feature-scaling-demo"), { loading: DemoLoading }),
  "grid-search": dynamic(() => import("./grid-search-demo"), { loading: DemoLoading }),
  "threshold-explorer": dynamic(() => import("./threshold-explorer-demo"), { loading: DemoLoading }),
  "roc-compare": dynamic(() => import("./roc-compare-demo"), { loading: DemoLoading }),
  "digit-draw": dynamic(() => import("./digit-draw-demo"), { loading: DemoLoading }),
  "confusion-explorer": dynamic(() => import("./confusion-explorer-demo"), { loading: DemoLoading }),
  "gradient-descent": dynamic(() => import("./gradient-descent-demo"), { loading: DemoLoading }),
  "gd-variants": dynamic(() => import("./gd-variants-demo"), { loading: DemoLoading }),
  "learning-curves": dynamic(() => import("./learning-curves-demo"), { loading: DemoLoading }),
  "regularization-paths": dynamic(() => import("./regularization-paths-demo"), { loading: DemoLoading }),
  "logistic-boundary": dynamic(() => import("./logistic-boundary-demo"), { loading: DemoLoading }),
  "tree-builder": dynamic(() => import("./tree-builder-demo"), { loading: DemoLoading }),
  "split-finder": dynamic(() => import("./split-finder-demo"), { loading: DemoLoading }),
  "tree-regularization": dynamic(() => import("./tree-regularization-demo"), { loading: DemoLoading }),
  "regression-tree": dynamic(() => import("./regression-tree-demo"), { loading: DemoLoading }),
  "tree-instability": dynamic(() => import("./tree-instability-demo"), { loading: DemoLoading }),
  "voting-wisdom": dynamic(() => import("./voting-wisdom-demo"), { loading: DemoLoading }),
  "bagging-forest": dynamic(() => import("./bagging-forest-demo"), { loading: DemoLoading }),
  "gradient-boosting": dynamic(() => import("./gradient-boosting-demo"), { loading: DemoLoading }),
  "curse-dimensionality": dynamic(() => import("./curse-dimensionality-demo"), { loading: DemoLoading }),
  "pca-projection": dynamic(() => import("./pca-projection-demo"), { loading: DemoLoading }),
  "pca-compression": dynamic(() => import("./pca-compression-demo"), { loading: DemoLoading }),
  "kmeans-steps": dynamic(() => import("./kmeans-steps-demo"), { loading: DemoLoading }),
  "kmeans-elbow": dynamic(() => import("./kmeans-elbow-demo"), { loading: DemoLoading }),
  "dbscan": dynamic(() => import("./dbscan-demo"), { loading: DemoLoading }),
  "gmm-anomaly": dynamic(() => import("./gmm-anomaly-demo"), { loading: DemoLoading }),
} satisfies Record<string, ComponentType>;

export type DemoId = keyof typeof demoComponents;
export const registeredDemoIds = Object.keys(demoComponents) as DemoId[];

export function DemoRenderer({ id }: { id: string }) {
  const Component = (demoComponents as Record<string, ComponentType | undefined>)[id];
  if (!Component) {
    throw new Error(`Demo komponenti qeydiyyatda deyil: '${id}'`);
  }
  return (
    <DemoErrorBoundary>
      <Component />
    </DemoErrorBoundary>
  );
}
