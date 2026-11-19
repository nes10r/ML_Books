import type * as React from "react";
import { highlight } from "@/lib/highlight/shiki";
import { cn } from "@/lib/utils";
import { CopyButton, DownloadButton } from "./code-actions";

/** Server-rendered, syntax-highlighted code block with copy (and optional download) actions. */
export async function CodeBlock({
  code,
  lang,
  title,
  filename,
  meta,
  className,
}: {
  code: string;
  lang?: string;
  title?: string;
  filename?: string;
  meta?: React.ReactNode;
  className?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <figure className={cn("not-prose my-6 overflow-hidden rounded-xl border bg-surface-muted/50", className)}>
      <figcaption className="flex flex-wrap items-center gap-2 border-b bg-surface px-3 py-1.5">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{title ?? filename ?? lang}</span>
        {meta}
        <CopyButton code={code} />
        {filename && <DownloadButton code={code} filename={filename} />}
      </figcaption>
      <div
        className="overflow-x-auto p-4 font-mono text-[13px] leading-6 [&_pre]:!m-0 [&_pre]:!p-0"
        // Shiki output is generated at build time from repository-owned source files.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
