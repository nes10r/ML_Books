"use client";

import { ListTree } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { t } from "@/lib/i18n/az";
import type { TocEntry } from "./toc";

export function MobileToc({ entries }: { entries: TocEntry[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="xl:hidden">
          <ListTree />
          {t.lesson.onThisPage}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" title={t.lesson.onThisPage}>
        <ul className="space-y-1 p-3 text-sm">
          {entries.map((e) => (
            <li key={e.id}>
              <a href={`#${e.id}`} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-surface-muted">
                {e.title}
              </a>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
