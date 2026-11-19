import type { MDXComponents } from "mdx/types";
import type * as React from "react";
import { Callout } from "./callout";
import { Pre } from "./pre";
import { Term } from "./term";

/** Components available in every MDX file (no lesson context required). */
export const baseMdxComponents: MDXComponents = {
  pre: Pre,
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm [&_td]:border-t [&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top [&_th]:bg-surface-muted [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold" {...props} />
    </div>
  ),
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href.startsWith("http") ? <a href={href} target="_blank" rel="noreferrer" {...props} /> : <a href={href} {...props} />,
  Callout,
  Term,
};
