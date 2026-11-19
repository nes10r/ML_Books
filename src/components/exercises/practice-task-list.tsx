import { Clock, Lightbulb } from "lucide-react";
import { DifficultyBadge } from "@/components/course/badges";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/az";
import type { Exercise } from "@/lib/schemas";
import { formatDuration } from "@/lib/utils";

/** Practice tasks with progressive disclosure (native <details>: works without JS, accessible). */
export function PracticeTaskList({ exercises }: { exercises: Exercise[] }) {
  return (
    <ol className="space-y-4">
      {exercises.map((ex, i) => (
        <li key={ex.id} className="rounded-xl border bg-surface p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
            <h3 className="font-semibold">{ex.title}</h3>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="muted">{t.exercises.kind[ex.kind]}</Badge>
            <DifficultyBadge difficulty={ex.difficulty} />
            <Badge variant="outline">
              <Clock aria-hidden />
              {formatDuration(ex.estimatedDuration)}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">{ex.prompt}</p>
          {ex.hints.length > 0 && (
            <details className="group mt-3 rounded-lg bg-surface-muted/60 px-4 py-2 text-sm">
              <summary className="cursor-pointer py-1 font-medium">
                <Lightbulb className="mr-1.5 inline size-4 text-warning" aria-hidden />
                {t.exercises.hints} ({ex.hints.length})
              </summary>
              <ul className="list-disc space-y-1 py-2 pl-5">
                {ex.hints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </details>
          )}
          {ex.solution && (
            <details className="mt-2 rounded-lg border border-dashed px-4 py-2 text-sm">
              <summary className="cursor-pointer py-1 font-medium text-primary">{t.exercises.showSolution}</summary>
              <p className="py-2 leading-relaxed">{ex.solution}</p>
            </details>
          )}
        </li>
      ))}
    </ol>
  );
}
