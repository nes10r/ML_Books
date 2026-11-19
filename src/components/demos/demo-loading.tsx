import { Skeleton } from "@/components/ui/skeleton";
import { t } from "@/lib/i18n/az";

export function DemoLoading() {
  return (
    <div role="status" className="space-y-3 p-5">
      <span className="sr-only">{t.playground.loading}</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="aspect-[16/9] w-full" />
    </div>
  );
}
