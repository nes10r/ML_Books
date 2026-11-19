import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CodeExample } from "@/lib/schemas";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

/** Reads a code example's source from disk. Server-only (build time for SSG). */
export async function readCodeExampleSource(example: CodeExample): Promise<string> {
  const resolved = path.resolve(CONTENT_ROOT, example.file);
  if (!resolved.startsWith(CONTENT_ROOT + path.sep)) {
    throw new Error(`Kod faylı məzmun qovluğundan kənardadır: ${example.file}`);
  }
  const source = await readFile(resolved, "utf8");
  return source.replace(/\r\n/g, "\n").trimEnd();
}
