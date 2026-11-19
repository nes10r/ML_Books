import type * as React from "react";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { getCourseNavigation } from "@/lib/content/repository";
import { cn } from "@/lib/utils";
import { MobileCourseNav } from "./mobile-course-nav";

/**
 * Three-column learning layout shared by chapter and lesson pages:
 * course navigation | main content | contextual sidebar (optional).
 * Pages provide content only — the shell is never duplicated.
 */
export function CourseShell({
  children,
  aside,
  toolbar,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  toolbar?: React.ReactNode;
}) {
  const nav = getCourseNavigation();
  return (
    <div className="mx-auto flex w-full max-w-[1440px]">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r px-3 py-6 lg:block">
        <CourseSidebar parts={nav} />
      </aside>
      <div className="flex min-w-0 flex-1">
        <main id="main" className={cn("min-w-0 flex-1 px-4 pt-4 pb-16 sm:px-8 lg:pt-8")}>
          <div className="mb-4 flex items-center gap-2 xl:hidden">
            <MobileCourseNav parts={nav} />
            {toolbar}
          </div>
          {children}
        </main>
        {aside && (
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 space-y-6 overflow-y-auto py-8 pr-6 xl:block">
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
