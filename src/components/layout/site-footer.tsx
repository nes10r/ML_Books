import Link from "next/link";
import { getCourse } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { mainNav } from "./nav-items";

export function SiteFooter() {
  const course = getCourse();
  return (
    <footer className="border-t bg-surface-muted/40">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          <p className="font-semibold">{t.siteName}</p>
          <p className="max-w-xl text-sm text-muted-foreground">{t.footer.attribution}</p>
          <p className="text-xs text-muted-foreground">
            {course.source.author} · <i>{course.source.title}</i> · {course.source.publisher}
          </p>
        </div>
        <nav aria-label="Alt naviqasiya" className="grid grid-cols-2 gap-2 text-sm">
          {mainNav.map((i) => (
            <Link key={i.href} href={i.href} className="text-muted-foreground hover:text-foreground">
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
