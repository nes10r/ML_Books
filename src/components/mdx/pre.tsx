import { isValidElement, type ReactElement, type ReactNode } from "react";
import { CodeBlock } from "@/components/code/code-block";

/** Fenced code blocks in MDX → syntax highlighted CodeBlock. */
export async function Pre({ children }: { children?: ReactNode }) {
  if (isValidElement(children)) {
    const el = children as ReactElement<{ className?: string; children?: ReactNode }>;
    const lang = el.props.className?.replace(/^language-/, "");
    const code = typeof el.props.children === "string" ? el.props.children.replace(/\n$/, "") : "";
    if (code) return <CodeBlock code={code} lang={lang} />;
  }
  return <pre>{children}</pre>;
}
