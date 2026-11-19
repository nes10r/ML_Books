"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";

interface State {
  error: Error | null;
}

/** Isolates a failing demo so the rest of the lesson keeps working. */
export class DemoErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error("[demo]", error);
  }

  override render() {
    if (this.state.error) {
      return (
        <div role="alert" className="flex flex-col items-center gap-3 p-8 text-center text-sm">
          <AlertTriangle className="size-6 text-warning" aria-hidden />
          <p>{t.playground.error}</p>
          <Button variant="outline" size="sm" onClick={() => this.setState({ error: null })}>
            {t.errors.retry}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
