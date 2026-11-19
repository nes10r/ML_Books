import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  poweredByHeader: false,
};

/**
 * MDX plugins are referenced by package name (strings) so the config stays
 * serializable — required for Turbopack, which is the default bundler.
 */
const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: ["rehype-slug", ["rehype-katex", { strict: false, throwOnError: false }]],
  },
});

export default withMDX(nextConfig);
