import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getResources } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import type { Resource } from "@/lib/schemas";

export const metadata: Metadata = { title: t.resources.title };

const ORDER: Resource["kind"][] = ["book", "documentation", "tutorial", "tool", "dataset", "paper"];

export default function ResourcesPage() {
  const resources = getResources();
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t.resources.title} description={t.resources.intro} />
      <div className="space-y-10">
        {ORDER.filter((k) => resources.some((r) => r.kind === k)).map((kind) => (
          <section key={kind} aria-labelledby={`res-${kind}`}>
            <h2 id={`res-${kind}`} className="mb-3 text-lg font-semibold">
              {t.resources.kind[kind]}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {resources
                .filter((r) => r.kind === kind)
                .map((r) => (
                  <li key={r.id}>
                    <a href={r.url} target="_blank" rel="noreferrer" className="group flex h-full flex-col gap-2 rounded-xl border bg-surface p-5 hover:border-primary/40">
                      <span className="flex items-start justify-between gap-2 font-medium group-hover:text-primary">
                        {r.title}
                        <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label={t.resources.external} />
                      </span>
                      <span className="text-sm text-muted-foreground">{r.description}</span>
                      <span className="mt-auto pt-1">
                        <Badge variant="muted" className="uppercase">{r.language}</Badge>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
