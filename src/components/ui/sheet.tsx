"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { t } from "@/lib/i18n/az";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  side = "left",
  title,
  className,
  children,
}: {
  side?: "left" | "right";
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
      <Dialog.Content
        aria-describedby={undefined}
        className={cn(
          "fixed inset-y-0 z-50 flex w-[86vw] max-w-sm flex-col bg-background shadow-xl outline-none",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          className,
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
          <Dialog.Close
            className="rounded-md p-2 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            aria-label={t.nav.closeMenu}
          >
            <X className="size-4" />
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
