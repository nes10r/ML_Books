"use client";

import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/az";
import { useQuizProgress } from "@/lib/progress/hooks";
import { formatPercent } from "@/lib/utils";

export function QuizScoreBadge({ quizId, passingScore }: { quizId: string; passingScore: number }) {
  const { hydrated, quiz } = useQuizProgress(quizId);
  if (!hydrated || !quiz) return null;
  return (
    <Badge variant={quiz.bestScore >= passingScore ? "success" : "warning"}>
      {t.quiz.best}: {formatPercent(quiz.bestScore)}
    </Badge>
  );
}
