import { Database, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDataset } from "@/lib/content/repository";
import { contentBlockSchema, type DatasetColumn } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const typeLabel: Record<DatasetColumn["type"], string> = {
  id: "ID",
  numeric: "ədəd",
  integer: "tam ədəd",
  categorical: "kateqoriya",
  binary: "0/1",
  target: "hədəf",
};

/** Dataset summary with column dictionary and a real download link (file served from /public/data). */
export function DatasetCard({ id, className, compact = false }: { id: string; className?: string; compact?: boolean }) {
  contentBlockSchema.parse({ type: "dataset", datasetId: id });
  const ds = getDataset(id);
  if (!ds) throw new Error(`Naməlum məlumat dəsti: '${id}'`);
  const filename = ds.file.split("/").pop()!;
  return (
    <div className={cn("not-prose my-6 overflow-hidden rounded-xl border bg-surface", className)}>
      <div className="flex flex-wrap items-start gap-3 border-b px-5 py-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground">
          <Database className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{ds.title}</p>
          <p className="text-sm text-muted-foreground">{ds.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="muted">{ds.rows.toLocaleString("az")} sətir</Badge>
            <Badge variant="muted">{ds.columns.length} sütun</Badge>
            <Badge variant="outline">{ds.license}</Badge>
          </div>
        </div>
        <a
          href={ds.file}
          download={filename}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="size-3.5" aria-hidden />
          {filename}
        </a>
      </div>
      {!compact && (
        <details className="text-sm">
          <summary className="cursor-pointer px-5 py-2.5 font-medium text-muted-foreground">Sütunların təsviri</summary>
          <div className="overflow-x-auto border-t">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted">
                <tr>
                  <th className="px-4 py-2 font-semibold">Sütun</th>
                  <th className="px-4 py-2 font-semibold">Tip</th>
                  <th className="px-4 py-2 font-semibold">Təsvir</th>
                </tr>
              </thead>
              <tbody>
                {ds.columns.map((c) => (
                  <tr key={c.name} className="border-t">
                    <td className="px-4 py-2 font-mono text-xs">{c.name}</td>
                    <td className="px-4 py-2">
                      <Badge variant={c.type === "target" ? "default" : "outline"}>{typeLabel[c.type]}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {c.description}
                      {c.unit && <span className="ml-1 font-mono text-xs">[{c.unit}]</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t px-5 py-3 text-xs text-muted-foreground">{ds.provenance}</p>
        </details>
      )}
    </div>
  );
}
