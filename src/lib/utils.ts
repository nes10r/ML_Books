import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 75 → "1 saat 15 dəq" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} dəq`;
  if (m === 0) return `${h} saat`;
  return `${h} saat ${m} dəq`;
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
