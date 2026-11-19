"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";

export function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };
  return (
    <Button variant="ghost" size="sm" onClick={onCopy} aria-live="polite">
      {state === "copied" ? <Check className="text-success" /> : <Copy />}
      {state === "copied" ? t.lab.copied : state === "error" ? t.lab.copyFailed : t.lab.copy}
    </Button>
  );
}

export function DownloadButton({ code, filename }: { code: string; filename: string }) {
  const onDownload = () => {
    const url = URL.createObjectURL(new Blob([code + "\n"], { type: "text/x-python;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <Button variant="ghost" size="sm" onClick={onDownload}>
      <Download />
      {t.lab.download}
    </Button>
  );
}
