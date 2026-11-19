import { AlertTriangle, Info, Lightbulb, Sparkles } from "lucide-react";
import type * as React from "react";
import { contentBlockSchema, type CalloutVariant } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const styles: Record<CalloutVariant, { icon: typeof Info; className: string; label: string }> = {
  info: { icon: Info, className: "border-primary/25 bg-primary-soft/50", label: "Qeyd" },
  tip: { icon: Lightbulb, className: "border-success/30 bg-success-soft/50", label: "Məsləhət" },
  warning: { icon: AlertTriangle, className: "border-warning/40 bg-warning-soft/60", label: "Diqqət" },
  insight: { icon: Sparkles, className: "border-chart-1/30 bg-surface-muted", label: "Əsas fikir" },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  contentBlockSchema.parse({ type: "callout", variant });
  const s = styles[variant];
  const Icon = s.icon;
  return (
    <aside className={cn("not-prose my-6 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed", s.className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 space-y-1.5 [&_p]:m-0 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-surface/70 [&_code]:px-1">
        <p className="font-semibold">{title ?? s.label}</p>
        {children}
      </div>
    </aside>
  );
}
