import { describe, expect, it } from "vitest";
import { createEmptyProgress } from "@/lib/schemas";
import { completionRatio, lastVisitedLesson, markLessonVisited, recordQuizAttempt, setLessonCompleted } from "./reducers";
import { LocalStorageProgressRepository, PROGRESS_STORAGE_KEY } from "./repository";
import { createProgressStore } from "./store";

const t0 = new Date("2026-01-01T10:00:00.000Z");
const t1 = new Date("2026-01-01T11:00:00.000Z");

describe("progress reducers", () => {
  it("visit → complete → incomplete keeps firstVisitedAt", () => {
    let p = markLessonVisited(createEmptyProgress(t0), "ch01.a", t0);
    expect(p.lessons["ch01.a"]?.status).toBe("in-progress");
    p = setLessonCompleted(p, "ch01.a", true, t1);
    expect(p.lessons["ch01.a"]).toMatchObject({ status: "completed", completedAt: t1.toISOString(), firstVisitedAt: t0.toISOString() });
    p = setLessonCompleted(p, "ch01.a", false, t1);
    expect(p.lessons["ch01.a"]?.status).toBe("in-progress");
    expect(p.lessons["ch01.a"]?.completedAt).toBeUndefined();
  });

  it("quiz attempts keep the best score", () => {
    let p = recordQuizAttempt(createEmptyProgress(t0), "q", 0.9, t0);
    p = recordQuizAttempt(p, "q", 0.4, t1);
    expect(p.quizzes.q).toMatchObject({ attempts: 2, bestScore: 0.9, lastScore: 0.4 });
  });

  it("completion ratio and last visited", () => {
    let p = setLessonCompleted(createEmptyProgress(t0), "a", true, t0);
    p = markLessonVisited(p, "b", t1);
    expect(completionRatio(p, ["a", "b", "c", "d"])).toBe(0.25);
    expect(lastVisitedLesson(p, ["a", "b"])).toBe("b");
  });
});

describe("LocalStorageProgressRepository", () => {
  it("round-trips valid progress", async () => {
    const repo = new LocalStorageProgressRepository();
    const p = setLessonCompleted(createEmptyProgress(t0), "ch01.a", true, t0);
    await repo.save(p);
    expect(await repo.load()).toEqual(p);
  });

  it("ignores corrupt or foreign data instead of throwing", async () => {
    const repo = new LocalStorageProgressRepository();
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "{not json");
    expect(await repo.load()).toBeNull();
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 999 }));
    expect(await repo.load()).toBeNull();
  });

  it("works when storage is unavailable", async () => {
    const repo = new LocalStorageProgressRepository("k", () => null);
    await expect(repo.save(createEmptyProgress())).resolves.toBeUndefined();
    expect(await repo.load()).toBeNull();
  });
});

describe("progress store", () => {
  it("hydrates from the repository and persists changes", async () => {
    const repo = new LocalStorageProgressRepository("test-key");
    await repo.save(setLessonCompleted(createEmptyProgress(t0), "x", true, t0));
    const store = createProgressStore(repo, () => t1);
    expect(store.getState().hydrated).toBe(false);
    await store.getState().hydrate();
    expect(store.getState().progress.lessons.x?.status).toBe("completed");
    store.getState().recordQuizAttempt("q", 1);
    expect((await repo.load())?.quizzes.q?.bestScore).toBe(1);
    await store.getState().reset();
    expect(await repo.load()).toBeNull();
  });
});
