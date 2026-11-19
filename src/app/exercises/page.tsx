import { ArrowRight, ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PracticeTaskList } from "@/components/exercises/practice-task-list";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { QuizScoreBadge } from "@/components/quiz/quiz-score";
import { getChapters, getExercises, getLessonById, getQuizzes } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export const metadata: Metadata = { title: t.exercises.title };

export default function ExercisesPage() {
  const quizzes = getQuizzes();
  const chapters = getChapters().filter((c) => quizzes.some((q) => q.chapterId === c.id) || getExercises({ chapterId: c.id }).length > 0);
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t.exercises.title} description={t.exercises.intro} />
      {chapters.map((chapter) => {
        const chapterQuizzes = quizzes
          .filter((q) => q.chapterId === chapter.id)
          .sort((a, b) => Number(Boolean(a.lessonId)) - Number(Boolean(b.lessonId)));
        const exercises = getExercises({ chapterId: chapter.id });
        return (
          <section key={chapter.id} className="space-y-8" aria-labelledby={`ex-${chapter.id}`}>
            <h2 id={`ex-${chapter.id}`} className="font-serif text-2xl font-semibold">
              {t.lesson.chapter} {chapter.number}: {chapter.title}
            </h2>
            <div>
              <h3 className="mb-3 font-semibold">{t.exercises.quizzes}</h3>
              <ul className="divide-y overflow-hidden rounded-2xl border bg-surface">
                {chapterQuizzes.map((q) => {
                  const lesson = q.lessonId ? getLessonById(q.lessonId)?.lesson : undefined;
                  return (
                    <li key={q.id}>
                      <Link href={`/exercises/${q.id}`} className="group flex items-center gap-4 p-4 hover:bg-surface-muted/60">
                        <ListChecks className="size-5 shrink-0 text-primary" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium group-hover:text-primary">{q.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {q.questions.length} {t.exercises.questions}
                            {lesson && ` · ${lesson.title}`}
                          </p>
                        </div>
                        <QuizScoreBadge quizId={q.id} passingScore={q.passingScore} />
                        <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {exercises.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">{t.exercises.practice}</h3>
                <PracticeTaskList exercises={exercises} />
              </div>
            )}
          </section>
        );
      })}
    </PageContainer>
  );
}
