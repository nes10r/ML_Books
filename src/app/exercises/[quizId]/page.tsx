import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/course/breadcrumbs";
import { PageContainer } from "@/components/layout/page-header";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { getLessonById, getQuiz, getQuizzes, lessonHref } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

type Params = { quizId: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getQuizzes().map((q) => ({ quizId: q.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const quiz = getQuiz((await params).quizId);
  return quiz ? { title: quiz.title } : {};
}

export default async function QuizPage({ params }: { params: Promise<Params> }) {
  const quiz = getQuiz((await params).quizId);
  if (!quiz) notFound();
  const ref = quiz.lessonId ? getLessonById(quiz.lessonId) : undefined;
  return (
    <PageContainer className="max-w-2xl">
      <Breadcrumbs items={[{ label: t.nav.exercises, href: "/exercises" }, { label: quiz.title }]} />
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">{quiz.title}</h1>
      <p className="mt-2 mb-6 text-muted-foreground">{quiz.description}</p>
      <QuizPlayer quiz={quiz} />
      {ref && (
        <p className="mt-6 text-sm text-muted-foreground">
          {t.lesson.lesson}:{" "}
          <Link href={lessonHref(ref.chapter, ref.lesson)} className="text-primary hover:underline">
            {ref.lesson.title}
          </Link>
        </p>
      )}
    </PageContainer>
  );
}
