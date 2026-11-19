"use client";

import { PanelLeft } from "lucide-react";
import { useState } from "react";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { NavPart } from "@/lib/content/repository";
import { t } from "@/lib/i18n/az";

export function MobileCourseNav({ parts }: { parts: NavPart[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <PanelLeft />
          {t.lesson.lessonsMenu}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" title={t.nav.courseNav}>
        <div className="p-3">
          <CourseSidebar parts={parts} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
