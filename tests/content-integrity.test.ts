import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { registeredDemoIds } from "@/components/demos/registry";
import { lessonLoaders } from "@/content/lesson-loaders";
import { rawContent } from "@/content/registry";
import { parseContent } from "@/lib/content/parse";
import * as repo from "@/lib/content/repository";
import { validateContentGraph } from "@/lib/content/validate";

const ROOT = process.cwd();
const { graph, issues } = parseContent(rawContent);

/** Locates a lesson's MDX file through its loader's import path in the chapter's lessons/index.ts. */
function mdxSourceFor(chapterSlug: string, chapterNumber: number, lessonSlug: string) {
  const dir = path.join(ROOT, "src/content/chapters", `${String(chapterNumber).padStart(2, "0")}-${chapterSlug}`, "lessons");
  return readFileSync(path.join(dir, `${lessonSlug}.mdx`), "utf8");
}

describe("content graph", () => {
  it("passes Zod schemas", () => {
    expect(issues).toEqual([]);
  });

  it("has no dangling references or duplicates", () => {
    expect(validateContentGraph(graph)).toEqual([]);
  });

  it("covers all 19 book chapters, numbered 1..19, split across two parts", () => {
    expect(graph.chapters.map((c) => c.number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
    expect(new Set(graph.chapters.map((c) => c.partId))).toEqual(new Set(["part-1", "part-2"]));
  });

  it("authored chapters are published with lessons; the rest are planned placeholders", () => {
    const authored = new Set(rawContent.chapterModules.filter((m) => (m.chapter.lessons ?? []).length > 0).map((m) => m.chapter.id));
    expect(authored.has("ch01") && authored.has("ch02")).toBe(true);
    for (const c of graph.chapters) {
      if (authored.has(c.id)) expect(c.status, c.id).not.toBe("planned");
      else expect(c.status === "planned" && c.lessons.length === 0, c.id).toBe(true);
    }
  });

  it("repository loads without throwing and exposes a lesson sequence", () => {
    const seq = repo.getLessonSequence();
    expect(seq.length).toBeGreaterThan(0);
    expect(repo.getAdjacentLessons(seq[0]!.lesson.id).previous).toBeUndefined();
    expect(repo.getAdjacentLessons(seq[1]!.lesson.id).previous?.lesson.id).toBe(seq[0]!.lesson.id);
  });
});

describe("lessons ↔ MDX", () => {
  const lessons = graph.chapters.flatMap((c) => c.lessons.map((l) => ({ c, l })));

  it.each(lessons.map(({ c, l }) => [l.id, c, l] as const))("%s has an MDX loader", (_id, _c, l) => {
    expect(lessonLoaders[l.id]).toBeTypeOf("function");
  });

  it.each(lessons.map(({ c, l }) => [l.id, c, l] as const))(
    "%s: MDX <Section> ids match metadata (same order)",
    (_id, c, l) => {
      const src = mdxSourceFor(c.slug, c.number, l.slug);
      const ids = [...src.matchAll(/<Section id="([^"]+)">/g)].map((m) => m[1]);
      expect(ids).toEqual(l.sections.map((s) => s.id));
    },
  );

  it.each(lessons.map(({ c, l }) => [l.id, c, l] as const))("%s: MDX embeds reference registered ids", (_id, c, l) => {
    const src = mdxSourceFor(c.slug, c.number, l.slug);
    for (const [, id] of src.matchAll(/<Demo id="([^"]+)"/g)) expect(repo.getDemo(id!), `demo ${id}`).toBeDefined();
    for (const [, id] of src.matchAll(/<PythonExample id="([^"]+)"/g)) expect(repo.getCodeExample(id!), `code ${id}`).toBeDefined();
    for (const [, id] of src.matchAll(/<Media id="([^"]+)"/g)) expect(repo.getMedia(id!), `media ${id}`).toBeDefined();
    for (const [, id] of src.matchAll(/<Term id="([^"]+)"/g)) expect(repo.getTerm(id!), `term ${id}`).toBeDefined();
    for (const [, id] of src.matchAll(/<Dataset id="([^"]+)"/g)) expect(repo.getDataset(id!), `dataset ${id}`).toBeDefined();
  });

  it("every lesson demo/code reference is actually embedded in its MDX", () => {
    for (const { c, l } of lessons) {
      const src = mdxSourceFor(c.slug, c.number, l.slug);
      for (const d of l.interactiveDemoReferences) expect(src, `${l.id} → ${d}`).toContain(`<Demo id="${d}"`);
      for (const code of l.codeExampleIds) expect(src, `${l.id} → ${code}`).toContain(`<PythonExample id="${code}"`);
    }
  });
});

describe("assets", () => {
  it("dataset files match their declared columns and row count", () => {
    for (const d of graph.datasets) {
      const text = readFileSync(path.join(ROOT, "public", d.file), "utf8");
      const lines = text.trim().split(/\r?\n/);
      expect(lines[0]!.split(","), d.id).toEqual(d.columns.map((c) => c.name));
      expect(lines.length - 1, d.id).toBe(d.rows);
    }
  });

  it("every content demo has a client component and vice versa", () => {
    expect(new Set(graph.demos.map((d) => d.id))).toEqual(new Set(registeredDemoIds));
  });

  it("code example files exist", () => {
    for (const c of graph.codeExamples) expect(existsSync(path.join(ROOT, "src/content", c.file)), c.file).toBe(true);
  });

  it("local media files exist in public/", () => {
    for (const m of graph.media) {
      if ((m.type === "image" || m.type === "video") && m.src.startsWith("/")) {
        expect(existsSync(path.join(ROOT, "public", m.src)), m.src).toBe(true);
      }
    }
  });
});
