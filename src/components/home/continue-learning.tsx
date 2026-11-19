"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";
import { lastVisitedLesson } from "@/lib/progress/reducers";
import { useProgressStore } from "@/lib/progress/store";

export interface SequenceItem {
  id: string;
  title: string;
  href: string;
  chapterNumber: number;
}

/** Resume point: last visited lesson if not completed, otherwise the first uncompleted lesson. */
export function ContinueLearningButton({ sequence }: { sequence: SequenceItem[] }) {
  const hydrated = useProgressStore((s) => s.hydrated);
  const progress = useProgressStore((s) => s.progress);
  const first = sequence[0];
  if (!first) return null;

  let target = first;
  let resumed = false;
  if (hydrated) {
    const ids = sequence.map((s) => s.id);
    const lastId = lastVisitedLesson(progress, ids);
    const last = sequence.find((s) => s.id === lastId);
    const firstOpen = sequence.find((s) => progress.lessons[s.id]?.status !== "completed");
    if (last && progress.lessons[last.id]?.status !== "completed") target = last;
    else if (firstOpen) target = firstOpen;
    resumed = Object.keys(progress.lessons).length > 0;
  }

  return (
    <Button asChild size="lg">
      <Link href={target.href}>
        {resumed ? <PlayCircle /> : <ArrowRight />}
        {resumed ? `${t.progress.continueLearning}: ${target.title}` : t.progress.startLearning}
      </Link>
    </Button>
  );
}
