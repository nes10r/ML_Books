import {
  AlertTriangle,
  BookOpenCheck,
  Briefcase,
  Calculator,
  Code2,
  Footprints,
  Lightbulb,
  ListChecks,
  ScrollText,
  Sparkles,
  Target,
  type LucideIcon,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import type { ContentBlockKind } from "@/lib/schemas";

export const blockIcon: Record<ContentBlockKind, LucideIcon> = {
  objectives: Target,
  prerequisites: ClipboardList,
  concept: Lightbulb,
  "step-by-step": Footprints,
  visualization: Sparkles,
  math: Calculator,
  "worked-example": BookOpenCheck,
  python: Code2,
  "case-study": Briefcase,
  "common-mistakes": AlertTriangle,
  "knowledge-check": ListChecks,
  practice: ListChecks,
  summary: ScrollText,
  next: ArrowRight,
};

/** Visual accent per block kind — keeps lesson pages scannable. */
export const blockAccent: Partial<Record<ContentBlockKind, string>> = {
  "common-mistakes": "rounded-xl border border-warning/40 bg-warning-soft/40 p-5 sm:p-6",
  summary: "rounded-xl border border-primary/20 bg-primary-soft/40 p-5 sm:p-6",
  "worked-example": "rounded-xl border bg-surface p-5 sm:p-6",
};
