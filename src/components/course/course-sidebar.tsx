"use client";

import { ChevronDown, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavPart } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { cn, pad2 } from "@/lib/utils";
import { ChapterProgress } from "./chapter-progress";
import { LessonStatusIcon } from "./completion-indicator";

/**
 * Left course navigation: parts → chapters → lessons with completion state.
 * The chapter containing the current page is expanded by default.
 */
export function CourseSidebar({ parts, onNavigate }: { parts: NavPart[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeChapterId = parts
    .flatMap((p) => p.chapters)
    .find((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))?.id;
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(activeChapterId ? [activeChapterId] : []));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <nav aria-label={t.nav.courseNav} className="space-y-6 text-sm">
      {parts.map((part) => (
        <div key={part.id} className="space-y-1">
          <p className="px-2 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {t.curriculum.part} {part.number}
          </p>
          <ul className="space-y-0.5">
            {part.chapters.map((chapter) => {
              const isOpen = expanded.has(chapter.id);
              const isActiveChapter = chapter.id === activeChapterId;
              if (!chapter.available) {
                return (
                  <li key={chapter.id}>
                    <Link
                      href={chapter.href}
                      onClick={onNavigate}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-surface-muted"
                    >
                      <span className="w-5 font-mono text-xs tabular-nums">{pad2(chapter.number)}</span>
                      <span className="flex-1 truncate">{chapter.title}</span>
                      <Lock className="size-3 shrink-0 opacity-60" aria-label={t.status.planned} />
                    </Link>
                  </li>
                );
              }
              const panelId = `nav-${chapter.id}`;
              return (
                <li key={chapter.id}>
                  <div className={cn("flex items-center rounded-md", isActiveChapter && "bg-surface-muted")}>
                    <Link
                      href={chapter.href}
                      onClick={onNavigate}
                      aria-current={pathname === chapter.href ? "page" : undefined}
                      className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 font-medium"
                    >
                      <span className="w-5 font-mono text-xs text-primary tabular-nums">{pad2(chapter.number)}</span>
                      <span className="truncate">{chapter.title}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(chapter.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${chapter.title} — ${t.lesson.lessonsMenu}`}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
                    </button>
                  </div>
                  {isOpen && (
                    <div id={panelId} className="mt-1 mb-2 ml-4 border-l pl-2">
                      <ChapterProgress lessonIds={chapter.lessons.map((l) => l.id)} showLabel={false} className="my-2 px-2" />
                      <ul className="space-y-0.5">
                        {chapter.lessons.map((lesson, i) => {
                          const active = pathname === lesson.href;
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={lesson.href}
                                onClick={onNavigate}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                  "flex items-start gap-2 rounded-md px-2 py-1.5 leading-snug",
                                  active
                                    ? "bg-primary-soft font-medium text-primary-soft-foreground"
                                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                                )}
                              >
                                <LessonStatusIcon lessonId={lesson.id} className="mt-0.5 shrink-0" />
                                <span>
                                  <span className="sr-only">
                                    {t.lesson.lesson} {i + 1}:{" "}
                                  </span>
                                  {lesson.title}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
