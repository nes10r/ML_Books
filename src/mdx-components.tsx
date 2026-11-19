import type { MDXComponents } from "mdx/types";
import { baseMdxComponents } from "@/components/mdx/base-components";

/** Required by @next/mdx (App Router). Lesson-specific components are passed per page. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...baseMdxComponents, ...components };
}
