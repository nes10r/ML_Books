"use client";

import { useMemo } from "react";
import type { ClassNode, RegNode, TreeNode } from "@/lib/ml/tree";
import { predictClass } from "@/lib/ml/tree";
import { cn } from "@/lib/utils";
import { CLASS_COLORS } from "./plot";
import type { Scales } from "./plot";

/**
 * Accessible tree diagram rendered as nested lists (works with screen readers and
 * any depth). Nodes on the current decision path are highlighted.
 */
export function TreeDiagram({
  root,
  featureNames,
  classNames,
  pathIds,
  formatValue = (v) => v.toFixed(1),
  maxShownDepth = 4,
}: {
  root: TreeNode;
  featureNames: readonly string[];
  classNames?: readonly string[];
  pathIds?: ReadonlySet<number>;
  formatValue?: (v: number) => string;
  maxShownDepth?: number;
}) {
  const render = (node: TreeNode, edge: string | null): React.ReactNode => {
    const onPath = pathIds?.has(node.id);
    const isLeaf = !node.left || !node.right;
    const hidden = node.depth >= maxShownDepth && !isLeaf;
    return (
      <li key={node.id} className="mt-1.5">
        <div
          className={cn(
            "inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border px-2 py-1 text-[11px] leading-tight",
            onPath ? "border-primary bg-primary-soft text-primary-soft-foreground" : "bg-surface",
          )}
        >
          {edge && <span className="font-semibold text-muted-foreground">{edge}</span>}
          {isLeaf || hidden ? (
            node.kind === "class" ? (
              <span className="inline-flex items-center gap-1 font-semibold">
                <span className="inline-block size-2.5 rounded-full" style={{ background: CLASS_COLORS[(node as ClassNode).prediction] }} aria-hidden />
                {classNames?.[(node as ClassNode).prediction] ?? (node as ClassNode).prediction}
              </span>
            ) : (
              <span className="font-semibold">ŷ = {formatValue((node as RegNode).value)}</span>
            )
          ) : (
            <span className="font-mono font-semibold">
              {featureNames[node.feature!]} ≤ {formatValue(node.threshold!)}
            </span>
          )}
          <span className="text-muted-foreground">n={node.samples}</span>
          {node.kind === "class" ? (
            <span className="font-mono text-muted-foreground">[{(node as ClassNode).counts.join(", ")}]</span>
          ) : null}
          <span className="text-muted-foreground">
            {node.kind === "class" ? "G" : "MSE"}={node.impurity.toFixed(node.kind === "class" ? 3 : 2)}
          </span>
          {hidden && <span className="text-muted-foreground">… ({"alt ağac gizlədilib"})</span>}
        </div>
        {!isLeaf && !hidden && (
          <ul className="ml-3 border-l pl-3">
            {render(node.left!, "bəli →")}
            {render(node.right!, "xeyr →")}
          </ul>
        )}
      </li>
    );
  };
  return (
    <div className="max-h-[420px] overflow-auto rounded-lg border bg-surface-muted/40 p-2">
      <ul aria-label="Qərar ağacı">{render(root, null)}</ul>
    </div>
  );
}

/** Coloured decision regions of a 2-D classification tree on a grid (in data coordinates). */
export function DecisionRegions({
  tree,
  s,
  xDomain,
  yDomain,
  grid = 70,
  opacity = 0.16,
}: {
  tree: ClassNode;
  s: Scales;
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
  grid?: number;
  opacity?: number;
}) {
  // Built in grid units and positioned with one transform; only rebuilt when the tree changes.
  const cells = useMemo(() => {
    const dx = (xDomain[1] - xDomain[0]) / grid;
    const dy = (yDomain[1] - yDomain[0]) / grid;
    const out: React.ReactNode[] = [];
    for (let j = 0; j < grid; j++) {
      // merge horizontal runs of the same class to keep the DOM small
      let runStart = 0;
      let runClass = predictClass(tree, [xDomain[0] + 0.5 * dx, yDomain[0] + (j + 0.5) * dy]);
      for (let i = 1; i <= grid; i++) {
        const cls = i < grid ? predictClass(tree, [xDomain[0] + (i + 0.5) * dx, yDomain[0] + (j + 0.5) * dy]) : -1;
        if (cls !== runClass) {
          out.push(<rect key={`${j}-${runStart}`} x={runStart} y={grid - 1 - j} width={i - runStart + 0.02} height={1.02} fill={CLASS_COLORS[runClass]} />);
          runStart = i;
          runClass = cls;
        }
      }
    }
    return out;
  }, [tree, xDomain, yDomain, grid]);
  return (
    <g
      opacity={opacity}
      transform={`translate(${s.x(xDomain[0])} ${s.y(yDomain[1])}) scale(${(s.x(xDomain[1]) - s.x(xDomain[0])) / grid} ${(s.y(yDomain[0]) - s.y(yDomain[1])) / grid})`}
    >
      {cells}
    </g>
  );
}
