import type { ContentGraph } from "./parse";

/**
 * Cross-reference validation that Zod cannot express per-object:
 * uniqueness, dangling references and structural invariants.
 * Returns human-readable issues (empty array = valid).
 */
export function validateContentGraph(g: ContentGraph): string[] {
  const issues: string[] = [];
  const err = (msg: string) => issues.push(msg);

  const lessons = g.chapters.flatMap((c) => c.lessons.map((l) => ({ chapter: c, lesson: l })));

  // ---- Global ID uniqueness ------------------------------------------------
  const seen = new Map<string, string>();
  const claim = (id: string, kind: string) => {
    const prev = seen.get(id);
    if (prev) err(`Təkrarlanan ID '${id}' (${prev} və ${kind})`);
    else seen.set(id, kind);
  };
  g.chapters.forEach((c) => claim(c.id, "chapter"));
  lessons.forEach(({ lesson }) => claim(lesson.id, "lesson"));
  g.quizzes.forEach((q) => claim(q.id, "quiz"));
  g.exercises.forEach((e) => claim(e.id, "exercise"));
  g.codeExamples.forEach((c) => claim(c.id, "code"));
  g.media.forEach((m) => claim(m.id, "media"));
  g.resources.forEach((r) => claim(r.id, "resource"));
  // Demos and glossary terms have their own namespaces (slug ids).
  const uniqueWithin = (ids: string[], kind: string) => {
    const s = new Set<string>();
    for (const id of ids) {
      if (s.has(id)) err(`Təkrarlanan ${kind} ID '${id}'`);
      s.add(id);
    }
    return s;
  };
  const demoIds = uniqueWithin(g.demos.map((d) => d.id), "demo");
  const termIds = uniqueWithin(g.glossary.map((t) => t.id), "termin");

  const chapterIds = new Set(g.chapters.map((c) => c.id));
  const lessonIds = new Set(lessons.map(({ lesson }) => lesson.id));
  const quizIds = new Set(g.quizzes.map((q) => q.id));
  const exerciseIds = new Set(g.exercises.map((e) => e.id));
  const codeIds = new Set(g.codeExamples.map((c) => c.id));
  const mediaIds = new Set(g.media.map((m) => m.id));
  const resourceIds = new Set(g.resources.map((r) => r.id));
  const partIds = new Set(g.course.parts.map((p) => p.id));

  // ---- Chapters ------------------------------------------------------------
  uniqueWithin(g.chapters.map((c) => c.slug), "fəsil slug");
  uniqueWithin(g.chapters.map((c) => String(c.number)), "fəsil nömrəsi");

  for (const c of g.chapters) {
    const at = `Fəsil ${c.id}`;
    if (!partIds.has(c.partId)) err(`${at}: naməlum hissə '${c.partId}'`);
    if (c.status === "planned" && c.lessons.length > 0) err(`${at}: 'planned' fəslin dərsi ola bilməz`);
    if (c.status === "published" && !c.lessons.some((l) => l.status === "published")) {
      err(`${at}: dərc olunmuş fəslin ən azı bir dərc olunmuş dərsi olmalıdır`);
    }
    uniqueWithin(c.lessons.map((l) => l.slug), `${at} dərs slug`);
    c.quizIds.forEach((q) => quizIds.has(q) || err(`${at}: naməlum quiz '${q}'`));
    checkMeta(at, c);
  }

  // ---- Lessons -------------------------------------------------------------
  for (const { chapter, lesson: l } of lessons) {
    const at = `Dərs ${l.id}`;
    if (!l.id.startsWith(`${chapter.id}.`)) err(`${at}: ID '${chapter.id}.' prefiksi ilə başlamalıdır`);
    uniqueWithin(l.sections.map((s) => s.id), `${at} bölmə`);
    l.keyConcepts.forEach((t) => termIds.has(t) || err(`${at}: naməlum termin '${t}'`));
    l.codeExampleIds.forEach((id) => codeIds.has(id) || err(`${at}: naməlum kod nümunəsi '${id}'`));
    l.exerciseIds.forEach((id) => exerciseIds.has(id) || err(`${at}: naməlum tapşırıq '${id}'`));
    l.resourceIds.forEach((id) => resourceIds.has(id) || err(`${at}: naməlum resurs '${id}'`));
    if (l.quizId && !quizIds.has(l.quizId)) err(`${at}: naməlum quiz '${l.quizId}'`);
    if (l.prerequisites.some((p) => p.kind === "lesson" && p.lessonId === l.id)) err(`${at}: özü-özünə ön şərt ola bilməz`);
    checkMeta(at, l);
  }

  // ---- Assets --------------------------------------------------------------
  for (const q of g.quizzes) {
    if (!chapterIds.has(q.chapterId)) err(`Quiz ${q.id}: naməlum fəsil '${q.chapterId}'`);
    if (q.lessonId && !lessonIds.has(q.lessonId)) err(`Quiz ${q.id}: naməlum dərs '${q.lessonId}'`);
    uniqueWithin(q.questions.map((x) => x.id), `Quiz ${q.id} sual`);
  }
  for (const e of g.exercises) {
    if (!chapterIds.has(e.chapterId)) err(`Tapşırıq ${e.id}: naməlum fəsil '${e.chapterId}'`);
    if (e.lessonId && !lessonIds.has(e.lessonId)) err(`Tapşırıq ${e.id}: naməlum dərs '${e.lessonId}'`);
  }
  for (const c of g.codeExamples) {
    if (!chapterIds.has(c.chapterId)) err(`Kod ${c.id}: naməlum fəsil '${c.chapterId}'`);
    if (c.lessonId && !lessonIds.has(c.lessonId)) err(`Kod ${c.id}: naməlum dərs '${c.lessonId}'`);
  }
  for (const d of g.demos) {
    if (!chapterIds.has(d.chapterId)) err(`Demo ${d.id}: naməlum fəsil '${d.chapterId}'`);
    d.lessonIds.forEach((id) => lessonIds.has(id) || err(`Demo ${d.id}: naməlum dərs '${id}'`));
    d.concepts.forEach((t) => termIds.has(t) || err(`Demo ${d.id}: naməlum termin '${t}'`));
  }
  for (const t of g.glossary) {
    t.related.forEach((r) => termIds.has(r) || err(`Termin ${t.id}: naməlum əlaqəli termin '${r}'`));
    t.chapterIds.forEach((c) => chapterIds.has(c) || err(`Termin ${t.id}: naməlum fəsil '${c}'`));
  }
  uniqueWithin(g.datasets.map((d) => d.id), "dataset");
  for (const d of g.datasets) {
    d.chapterIds.forEach((c) => chapterIds.has(c) || err(`Dataset ${d.id}: naməlum fəsil '${c}'`));
    uniqueWithin(d.columns.map((c) => c.name), `Dataset ${d.id} sütun`);
    if (d.columns.filter((c) => c.type === "target").length > 1) err(`Dataset ${d.id}: birdən çox hədəf sütunu`);
  }
  for (const r of g.resources) {
    r.chapterIds.forEach((c) => chapterIds.has(c) || err(`Resurs ${r.id}: naməlum fəsil '${c}'`));
  }

  return issues;

  function checkMeta(
    at: string,
    m: {
      prerequisites: ContentGraph["chapters"][number]["prerequisites"];
      mediaReferences: string[];
      interactiveDemoReferences: string[];
      learningObjectives: { id: string }[];
    },
  ) {
    for (const p of m.prerequisites) {
      if (p.kind === "lesson" && !lessonIds.has(p.lessonId)) err(`${at}: naməlum ön şərt dərsi '${p.lessonId}'`);
      if (p.kind === "chapter" && !chapterIds.has(p.chapterId)) err(`${at}: naməlum ön şərt fəsli '${p.chapterId}'`);
    }
    m.mediaReferences.forEach((id) => mediaIds.has(id) || err(`${at}: naməlum media '${id}'`));
    m.interactiveDemoReferences.forEach((id) => demoIds.has(id) || err(`${at}: naməlum demo '${id}'`));
    uniqueWithin(m.learningObjectives.map((o) => o.id), `${at} məqsəd`);
  }
}
