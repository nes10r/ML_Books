"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { completionRatio } from "./reducers";
import { useProgressStore } from "./store";

/** Triggers one-time hydration from storage; also keeps tabs in sync via the `storage` event. */
export function useProgressHydration() {
  const hydrate = useProgressStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("ml-platform:progress")) {
        useProgressStore.setState({ hydrated: false });
        void useProgressStore.getState().hydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrate]);
}

export function useLessonStatus(lessonId: string) {
  return useProgressStore(
    useShallow((s) => ({
      hydrated: s.hydrated,
      status: s.progress.lessons[lessonId]?.status ?? ("not-started" as const),
    })),
  );
}

export function useCompletion(lessonIds: readonly string[]) {
  return useProgressStore(
    useShallow((s) => {
      const done = lessonIds.filter((id) => s.progress.lessons[id]?.status === "completed").length;
      return { hydrated: s.hydrated, done, total: lessonIds.length, ratio: completionRatio(s.progress, lessonIds) };
    }),
  );
}

export function useQuizProgress(quizId: string) {
  return useProgressStore(useShallow((s) => ({ hydrated: s.hydrated, quiz: s.progress.quizzes[quizId] })));
}
