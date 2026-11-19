import Link from "next/link";
import { PageContainer } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";

export default function NotFound() {
  return (
    <PageContainer className="flex flex-col items-center py-24 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">{t.errors.notFoundTitle}</h1>
      <p className="mt-2 text-muted-foreground">{t.errors.notFoundBody}</p>
      <Button asChild className="mt-6">
        <Link href="/">{t.errors.goHome}</Link>
      </Button>
    </PageContainer>
  );
}
