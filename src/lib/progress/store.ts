"use client";

import { create } from "zustand";
import { createEmptyProgress, type LearningProgress } from "@/lib/schemas";
import * as R from "./reducers";
import { LocalStorageProgressRepository, type ProgressRepository } from "./repository";

interface ProgressState {
  progress: LearningProgress;
  /** False until browser storage has been read — UI shows neutral state meanwhile (no hydration mismatch). */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  visitLesson: (lessonId: string) => void;
  setLessonCompleted: (lessonId: string, completed: boolean) => void;
  recordQuizAttempt: (quizId: string, score: number) => void;
  reset: () => Promise<void>;
}

export function createProgressStore(repository: ProgressRepository, clock: () => Date = () => new Date()) {
  return create<ProgressState>()((set, get) => {
    const commit = (next: LearningProgress) => {
      set({ progress: next });
      void repository.save(next);
    };
    return {
      progress: createEmptyProgress(new Date(0)),
      hydrated: false,
      hydrate: async () => {
        if (get().hydrated) return;
        const stored = await repository.load();
        set({ progress: stored ?? createEmptyProgress(clock()), hydrated: true });
      },
      visitLesson: (id) => commit(R.markLessonVisited(get().progress, id, clock())),
      setLessonCompleted: (id, done) => commit(R.setLessonCompleted(get().progress, id, done, clock())),
      recordQuizAttempt: (id, score) => commit(R.recordQuizAttempt(get().progress, id, score, clock())),
      reset: async () => {
        await repository.clear();
        set({ progress: createEmptyProgress(clock()) });
      },
    };
  });
}

/** App-wide store backed by localStorage. Swap the repository here to enable server sync. */
export const useProgressStore = createProgressStore(new LocalStorageProgressRepository());
