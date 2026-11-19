import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";
import { getCourseNavigation, getQuizzes } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export const metadata: Metadata = { title: t.progress.title };

export default function ProgressPage() {
  const chapters = getCourseNavigation()
    .flatMap((p) => p.chapters)
    .filter((c) => c.available);
  const quizzes = getQuizzes().map((q) => ({ id: q.id, title: q.title, passingScore: q.passingScore }));
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t.progress.title} description={t.progress.intro} />
      <ProgressDashboard chapters={chapters} quizzes={quizzes} />
    </PageContainer>
  );
}
