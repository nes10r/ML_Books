"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" role="alert" className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">{t.errors.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.errors.body}</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">#{error.digest}</p>}
      <Button className="mt-6" onClick={reset}>
        {t.errors.retry}
      </Button>
    </main>
  );
}
