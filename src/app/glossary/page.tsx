import type { Metadata } from "next";
import { GlossaryBrowser } from "@/components/glossary/glossary-browser";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getGlossary } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export const metadata: Metadata = { title: t.glossary.title };

export default function GlossaryPage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t.glossary.title} description={t.glossary.intro} />
      <GlossaryBrowser terms={getGlossary()} />
    </PageContainer>
  );
}
