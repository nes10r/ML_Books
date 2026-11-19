"use client";

import { Menu, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { t } from "@/lib/i18n/az";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { mainNav } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`) || (href === "/curriculum" && pathname.startsWith("/chapters"));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Əsas naviqasiya" className="ml-4 hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "bg-surface-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/progress" aria-current={pathname === "/progress" ? "page" : undefined}>
              <TrendingUp />
              {t.nav.progress}
            </Link>
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label={t.nav.openMenu}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" title={t.siteName}>
              <nav aria-label="Mobil naviqasiya" className="flex flex-col gap-1 p-3">
                {[...mainNav, { href: "/progress", label: t.nav.progress, icon: TrendingUp }].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                      isActive(pathname, item.href) ? "bg-primary-soft text-primary-soft-foreground font-medium" : "hover:bg-surface-muted",
                    )}
                  >
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
