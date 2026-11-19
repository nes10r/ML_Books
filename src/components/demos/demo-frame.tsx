import { Info, Sparkles } from "lucide-react";
import Link from "next/link";
import { getDemo } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { contentBlockSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { DemoRenderer } from "./registry";

/** Server wrapper: metadata (title, instructions) from the registry + the client simulation. */
export function DemoFrame({ id, className, showLink = true }: { id: string; className?: string; showLink?: boolean }) {
  contentBlockSchema.parse({ type: "demo", demoId: id });
  const demo = getDemo(id);
  if (!demo) throw new Error(`Naməlum demo: '${id}'`);
  return (
    <div className={cn("not-prose my-8 overflow-hidden rounded-2xl border bg-surface shadow-sm", className)}>
      <div className="flex flex-wrap items-start gap-3 border-b bg-gradient-to-r from-primary-soft/60 to-transparent px-5 py-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{demo.title}</p>
          <p className="text-sm text-muted-foreground">{demo.description}</p>
        </div>
        {showLink && (
          <Link href={`/playground/${demo.id}`} className="text-xs font-medium text-primary hover:underline">
            Tam ekranda aç
          </Link>
        )}
      </div>
      {demo.instructions.length > 0 && (
        <details className="border-b px-5 py-2 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 py-1 font-medium text-muted-foreground">
            <Info className="size-4" aria-hidden />
            {t.playground.instructions}
          </summary>
          <ol className="list-decimal space-y-1 py-2 pl-6 text-muted-foreground">
            {demo.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </details>
      )}
      <DemoRenderer id={demo.id} />
    </div>
  );
}
