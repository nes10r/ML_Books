import { FileCode2, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { readCodeExampleSource } from "@/lib/content/code-files";
import { getCodeExample } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";
import { contentBlockSchema } from "@/lib/schemas";
import { CodeBlock } from "./code-block";

/** Renders a registered CodeExample (source read from disk at build time). */
export async function PythonExample({ id, showDescription = true }: { id: string; showDescription?: boolean }) {
  contentBlockSchema.parse({ type: "code", codeExampleId: id });
  const example = getCodeExample(id);
  if (!example) throw new Error(`Naməlum kod nümunəsi: '${id}'`);
  const code = await readCodeExampleSource(example);
  const filename = example.file.split("/").pop() ?? "example.py";

  return (
    <div className="not-prose my-6 space-y-2">
      {showDescription && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <FileCode2 className="size-4 text-primary" aria-hidden />
          <span className="font-medium">{example.title}</span>
          {example.libraries.map((lib) => (
            <Badge key={lib} variant="muted" className="font-mono">
              {lib}
            </Badge>
          ))}
        </div>
      )}
      <CodeBlock code={code} lang={example.language} filename={filename} className="my-0" />
      {example.expectedOutput && (
        <details className="rounded-xl border bg-surface">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium">
            <Terminal className="size-4 text-muted-foreground" aria-hidden />
            {t.lab.expectedOutput}
          </summary>
          <pre className="overflow-x-auto border-t bg-surface-muted/50 px-4 py-3 font-mono text-[13px] leading-6">
            {example.expectedOutput}
          </pre>
        </details>
      )}
    </div>
  );
}
