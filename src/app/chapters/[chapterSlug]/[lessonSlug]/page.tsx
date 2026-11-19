import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DifficultyBadge, DurationBadge, LessonTypeBadge, StatusBadge } from "@/components/course/badges";
import { Breadcrumbs } from "@/components/course/breadcrumbs";
import { PracticeTaskList } from "@/components/exercises/practice-task-list";
import { CourseShell } from "@/components/lesson/course-shell";
import { KeyConcepts } from "@/components/lesson/key-concepts";
import { LessonProgressCard } from "@/components/lesson/lesson-progress-card";
import { LessonPager } from "@/components/lesson/lesson-pager";
import { LessonSectionFrame } from "@/components/lesson/lesson-section";
import { LessonVisitTracker } from "@/components/lesson/lesson-visit-tracker";
import { MarkCompleteButton } from "@/components/lesson/mark-complete-button";
import { MobileToc } from "@/components/lesson/mobile-toc";
import { ObjectivesPanel } from "@/components/lesson/objectives-panel";
import { RelatedResources } from "@/components/lesson/related-resources";
import { TableOfContents } from "@/components/lesson/table-of-contents";
import { buildToc } from "@/components/lesson/toc";
import { buildLessonComponents } from "@/components/mdx/lesson-mdx-components";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { lessonLoaders } from "@/content/lesson-loaders";
import {
  chapterHref,
  getAdjacentLessons,
  getExercise,
  getLesson,
  getLessonSequence,
  getQuiz,
  getVisibleLessons,
} from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

type Params = { chapterSlug: string; lessonSlug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getLessonSequence().map(({ chapter, lesson }) => ({ chapterSlug: chapter.slug, lessonSlug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { chapterSlug, lessonSlug } = await params;
  const ref = getLesson(chapterSlug, lessonSlug);
  return ref ? { title: ref.lesson.title, description: ref.lesson.description } : {};
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { chapterSlug, lessonSlug } = await params;
  const ref = getLesson(chapterSlug, lessonSlug);
  if (!ref) notFound();
  const { chapter, lesson } = ref;

  const loader = lessonLoaders[lesson.id];
  if (!loader) throw new Error(`Dərs ${lesson.id} üçün MDX yükləyicisi qeydiyyatda deyil`);
  const { default: Content } = await loader();

  const { previous, next } = getAdjacentLessons(lesson.id);
  const quiz = lesson.quizId ? getQuiz(lesson.quizId) : undefined;
  const exercises = lesson.exerciseIds.map(getExercise).filter((e) => e !== undefined);
  const toc = buildToc(lesson, { hasNext: true });
  const chapterLessonIds = getVisibleLessons(chapter).map((l) => l.id);
  const lessonIndex = chapterLessonIds.indexOf(lesson.id);

  return (
    <CourseShell
      toolbar={<MobileToc entries={toc} />}
      aside={
        <>
          <TableOfContents entries={toc} />
          <LessonProgressCard lessonId={lesson.id} chapterLessonIds={chapterLessonIds} />
          <KeyConcepts termIds={lesson.keyConcepts} />
          <RelatedResources resourceIds={lesson.resourceIds} />
        </>
      }
    >
      <LessonVisitTracker lessonId={lesson.id} />
      <article className="mx-auto max-w-3xl space-y-12">
        <header className="space-y-4">
          <Breadcrumbs
            items={[
              { label: t.nav.curriculum, href: "/curriculum" },
              { label: `${t.lesson.chapter} ${chapter.number}`, href: chapterHref(chapter) },
              { label: `${t.lesson.lesson} ${lessonIndex + 1}` },
            ]}
          />
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground text-pretty">{lesson.description}</p>
          <div className="flex flex-wrap gap-2">
            <LessonTypeBadge type={lesson.type} />
            <DifficultyBadge difficulty={lesson.difficulty} />
            <DurationBadge minutes={lesson.estimatedDuration} />
            <StatusBadge status={lesson.status} />
          </div>
        </header>

        <ObjectivesPanel lesson={lesson} />

        <div className="space-y-12">
          <Content components={buildLessonComponents(lesson)} />
        </div>

        {quiz && (
          <LessonSectionFrame id="knowledge-check" title={quiz.title} kind="knowledge-check">
            <div className="not-prose">
              <QuizPlayer quiz={quiz} compact />
            </div>
          </LessonSectionFrame>
        )}

        {exercises.length > 0 && (
          <LessonSectionFrame id="practice" title={t.blockKind.practice} kind="practice">
            <div className="not-prose">
              <PracticeTaskList exercises={exercises} />
            </div>
          </LessonSectionFrame>
        )}

        <div className="flex justify-center border-t pt-8">
          <MarkCompleteButton lessonId={lesson.id} size="lg" />
        </div>

        <LessonPager previous={previous} next={next} />
      </article>
    </CourseShell>
  );
}
