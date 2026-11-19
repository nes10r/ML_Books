import { ExternalLink } from "lucide-react";
import { getResource } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export function RelatedResources({ resourceIds }: { resourceIds: string[] }) {
  const items = resourceIds.map(getResource).filter((x) => x !== undefined);
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{t.lesson.relatedResources}</p>
      <ul className="space-y-2 text-sm">
        {items.map((r) => (
          <li key={r.id}>
            <a href={r.url} target="_blank" rel="noreferrer" className="group flex items-start gap-1.5 text-muted-foreground hover:text-foreground">
              <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {r.title}
                <span className="sr-only"> ({t.resources.external})</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
