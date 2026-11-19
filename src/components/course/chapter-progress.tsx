"use client";

import { Progress } from "@/components/ui/progress";
import { useCompletion } from "@/lib/progress/hooks";
import { cn, formatPercent } from "@/lib/utils";

export function ChapterProgress({
  lessonIds,
  className,
  showLabel = true,
}: {
  lessonIds: string[];
  className?: string;
  showLabel?: boolean;
}) {
  const { hydrated, done, total, ratio } = useCompletion(lessonIds);
  if (total === 0) return null;
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {hydrated ? done : 0}/{total} dərs
          </span>
          <span className="tabular-nums">{hydrated ? formatPercent(ratio) : "—"}</span>
        </div>
      )}
      <Progress value={hydrated ? ratio * 100 : 0} aria-label={`Fəsil proqresi: ${done}/${total}`} />
    </div>
  );
}
