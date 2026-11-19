"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/az";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`${t.theme.toggle}: ${isDark ? t.theme.light : t.theme.dark}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Both icons rendered; CSS picks one so SSR and client markup match. */}
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
