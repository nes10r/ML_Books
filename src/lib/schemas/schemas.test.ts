import { describe, expect, it } from "vitest";
import { chapterSchema, lessonSchema, mediaAssetSchema, questionSchema, slugSchema } from "@/lib/schemas";

describe("schemas", () => {
  it("slugs must be kebab-case", () => {
    expect(slugSchema.safeParse("what-is-ml").success).toBe(true);
    expect(slugSchema.safeParse("What_is ML").success).toBe(false);
  });

  it("rejects a question whose correct answer is not among options", () => {
    const r = questionSchema.safeParse({
      id: "q1",
      type: "single-choice",
      prompt: "Hansı?",
      explanation: "Çünki belədir.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionId: "z",
    });
    expect(r.success).toBe(false);
  });

  it("applies defaults for optional metadata arrays", () => {
    const lesson = lessonSchema.parse({
      id: "ch01.x",
      slug: "x",
      title: "Test dərsi",
      description: "Qısa təsvir mətni.",
      type: "theory",
      estimatedDuration: 5,
      difficulty: "beginner",
      status: "draft",
    });
    expect(lesson.sections).toEqual([]);
    expect(lesson.tags).toEqual([]);
    expect(lesson.githubReferences).toEqual([]);
  });

  it("github references must point to github.com", () => {
    const base = {
      id: "ch99",
      slug: "x",
      number: 99,
      partId: "part-1",
      title: "Fəsil",
      description: "Qısa təsvir mətni.",
      estimatedDuration: 10,
      difficulty: "beginner",
      status: "planned",
      bookReference: { chapter: 99, originalTitle: "Example" },
    };
    expect(chapterSchema.safeParse({ ...base, githubReferences: [{ label: "Repo", url: "https://example.com/x" }] }).success).toBe(false);
    expect(chapterSchema.safeParse({ ...base, githubReferences: [{ label: "Repo", url: "https://github.com/x/y" }] }).success).toBe(true);
  });

  it("media sources must be local /media/ paths or https", () => {
    const img = { id: "m1", type: "image", title: "Şəkil", alt: "Alternativ mətn", width: 10, height: 10 };
    expect(mediaAssetSchema.safeParse({ ...img, src: "/media/a.svg" }).success).toBe(true);
    expect(mediaAssetSchema.safeParse({ ...img, src: "http://insecure.com/a.png" }).success).toBe(false);
  });
});
