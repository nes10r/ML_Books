import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { getChapterById, getDemos } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { formatDuration } from "@/lib/utils";

export const metadata: Metadata = { title: t.playground.title };

export default function PlaygroundPage() {
  const demos = getDemos();
  return (
    <PageContainer>
      <PageHeader title={t.playground.title} description={t.playground.intro} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {demos.map((d) => {
          const chapter = getChapterById(d.chapterId);
          return (
            <li key={d.id}>
              <Link href={`/playground/${d.id}`} className="group flex h-full flex-col gap-3 rounded-2xl border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                    <Sparkles className="size-4" aria-hidden />
                  </div>
                  {chapter && <Badge variant="muted">{t.lesson.chapter} {chapter.number}</Badge>}
                  <Badge variant="outline">
                    <Clock aria-hidden />
                    {formatDuration(d.estimatedDuration)}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold group-hover:text-primary">{d.title}</h2>
                <p className="flex-1 text-sm text-muted-foreground">{d.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t.playground.open}
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
