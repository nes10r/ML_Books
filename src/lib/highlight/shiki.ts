import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["python", "bash", "json", "typescript", "text"] as const;
export type HighlightLang = (typeof LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: [...LANGS] });
  return highlighterPromise;
}

export function normalizeLang(lang: string | undefined): HighlightLang {
  const l = (lang ?? "text").toLowerCase();
  if (l === "py") return "python";
  if (l === "sh" || l === "shell" || l === "console") return "bash";
  if (l === "ts") return "typescript";
  return (LANGS as readonly string[]).includes(l) ? (l as HighlightLang) : "text";
}

/** Server-side highlighting to HTML with light/dark themes (CSS switches via --shiki-dark). */
export async function highlight(code: string, lang?: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
