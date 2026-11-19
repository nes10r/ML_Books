import { learningProgressSchema, type LearningProgress } from "@/lib/schemas";

/**
 * Persistence boundary for learner progress. v1 ships a browser-storage
 * implementation; a future `RemoteProgressRepository` (authenticated API)
 * can implement the same interface and the UI will not change.
 */
export interface ProgressRepository {
  load(): Promise<LearningProgress | null>;
  save(progress: LearningProgress): Promise<void>;
  clear(): Promise<void>;
}

export const PROGRESS_STORAGE_KEY = "ml-platform:progress:v1";

/** Browser `localStorage` implementation. Corrupt or foreign data is ignored, never thrown. */
export class LocalStorageProgressRepository implements ProgressRepository {
  constructor(
    private readonly key: string = PROGRESS_STORAGE_KEY,
    private readonly storage: () => Storage | null = defaultStorage,
  ) {}

  async load(): Promise<LearningProgress | null> {
    const store = this.storage();
    if (!store) return null;
    let raw: string | null;
    try {
      raw = store.getItem(this.key);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      const parsed = learningProgressSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  async save(progress: LearningProgress): Promise<void> {
    const store = this.storage();
    if (!store) return;
    try {
      store.setItem(this.key, JSON.stringify(progress));
    } catch {
      // Quota exceeded or storage disabled (private mode): progress stays in memory.
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage()?.removeItem(this.key);
    } catch {
      /* ignore */
    }
  }
}

function defaultStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
