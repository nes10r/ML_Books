"use client";

import { useProgressHydration } from "@/lib/progress/hooks";

/** Mount once near the root: loads persisted progress after hydration. */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  useProgressHydration();
  return <>{children}</>;
}
