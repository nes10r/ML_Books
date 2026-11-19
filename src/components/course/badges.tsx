import { BarChart3, Clock, Code2, FlaskConical, GraduationCap, Sigma, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/az";
import type { ContentStatus, Difficulty, LessonType } from "@/lib/schemas";
import { formatDuration } from "@/lib/utils";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline">
      <BarChart3 aria-hidden />
      {t.difficulty[difficulty]}
    </Badge>
  );
}

export function DurationBadge({ minutes }: { minutes: number }) {
  return (
    <Badge variant="outline">
      <Clock aria-hidden />
      {formatDuration(minutes)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  if (status === "published") return null;
  return <Badge variant={status === "planned" ? "muted" : "warning"}>{t.status[status]}</Badge>;
}

const typeIcon: Record<LessonType, typeof Sparkles> = {
  theory: GraduationCap,
  "visual-simulation": Sparkles,
  "code-lab": Code2,
  math: Sigma,
  assessment: FlaskConical,
};

export function LessonTypeBadge({ type }: { type: LessonType }) {
  const Icon = typeIcon[type];
  return (
    <Badge>
      <Icon aria-hidden />
      {t.lessonType[type]}
    </Badge>
  );
}
