import { BookOpen, FlaskConical, Library, ListChecks, Sparkles, Terminal } from "lucide-react";
import { t } from "@/lib/i18n/az";

export const mainNav = [
  { href: "/curriculum", label: t.nav.curriculum, icon: BookOpen },
  { href: "/playground", label: t.nav.playground, icon: Sparkles },
  { href: "/lab", label: t.nav.lab, icon: Terminal },
  { href: "/exercises", label: t.nav.exercises, icon: ListChecks },
  { href: "/glossary", label: t.nav.glossary, icon: Library },
  { href: "/resources", label: t.nav.resources, icon: FlaskConical },
] as const;
