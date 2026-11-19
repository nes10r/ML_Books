import { describe, expect, it } from "vitest";
import { rawContent } from "@/content/registry";
import { parseContent, type ContentGraph } from "@/lib/content/parse";
import { validateContentGraph } from "@/lib/content/validate";

const clone = (): ContentGraph => structuredClone(parseContent(rawContent).graph);

describe("validateContentGraph", () => {
  it("flags unknown glossary terms and prerequisite lessons", () => {
    const g = clone();
    const lesson = g.chapters[0]!.lessons[0]!;
    lesson.keyConcepts.push("no-such-term");
    lesson.prerequisites.push({ kind: "lesson", lessonId: "ch99.missing" });
    const issues = validateContentGraph(g);
    expect(issues.some((i) => i.includes("no-such-term"))).toBe(true);
    expect(issues.some((i) => i.includes("ch99.missing"))).toBe(true);
  });

  it("flags duplicate IDs across entity kinds", () => {
    const g = clone();
    g.exercises[0]!.id = g.quizzes[0]!.id;
    expect(validateContentGraph(g).some((i) => i.includes("Təkrarlanan ID"))).toBe(true);
  });

  it("flags planned chapters that contain lessons", () => {
    const g = clone();
    const planned = g.chapters.find((c) => c.status === "planned")!;
    planned.lessons.push({ ...g.chapters[0]!.lessons[0]!, id: `${planned.id}.x`, slug: "x" });
    expect(validateContentGraph(g).some((i) => i.includes("'planned'"))).toBe(true);
  });

  it("flags lesson ids without their chapter prefix", () => {
    const g = clone();
    g.chapters[0]!.lessons[0]!.id = "wrong.prefix";
    expect(validateContentGraph(g).some((i) => i.includes("prefiksi"))).toBe(true);
  });
});
