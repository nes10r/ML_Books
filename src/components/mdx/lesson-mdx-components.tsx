import type { MDXComponents } from "mdx/types";
import type * as React from "react";
import { PythonExample } from "@/components/code/python-example";
import { DatasetCard } from "@/components/datasets/dataset-card";
import { DemoFrame } from "@/components/demos/demo-frame";
import { LessonSectionFrame } from "@/components/lesson/lesson-section";
import { Media } from "@/components/media/media";
import type { Lesson } from "@/lib/schemas";
import { baseMdxComponents } from "./base-components";

/**
 * MDX components bound to a specific lesson. `<Section id>` resolves its
 * title and kind from the lesson metadata, so headings, the table of
 * contents and the data model can never drift apart.
 */
export function buildLessonComponents(lesson: Lesson): MDXComponents {
  const sections = new Map(lesson.sections.map((s) => [s.id, s]));

  function Section({ id, children }: { id: string; children: React.ReactNode }) {
    const meta = sections.get(id);
    if (!meta) {
      throw new Error(`Dərs ${lesson.id}: MDX-dəki <Section id="${id}"> metadata-da elan edilməyib`);
    }
    return (
      <LessonSectionFrame id={meta.id} title={meta.title} kind={meta.kind}>
        {children}
      </LessonSectionFrame>
    );
  }

  return {
    ...baseMdxComponents,
    Section,
    Demo: ({ id }: { id: string }) => <DemoFrame id={id} />,
    PythonExample,
    Media,
    Dataset: ({ id }: { id: string }) => <DatasetCard id={id} />,
  };
}
