import type * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 pb-8", className)}>
      {eyebrow && <div className="text-sm font-medium text-primary">{eyebrow}</div>}
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">{description}</p>}
      {children}
    </div>
  );
}

/** Standard page container; renders the page's <main> landmark (skip-link target). */
export function PageContainer({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <main id="main" className={cn("mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14", className)} {...props} />;
}
