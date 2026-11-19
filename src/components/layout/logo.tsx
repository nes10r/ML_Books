import Link from "next/link";
import { t } from "@/lib/i18n/az";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <circle cx="10" cy="21" r="2.6" fill="white" />
        <circle cx="16" cy="13" r="2.6" fill="white" opacity="0.85" />
        <circle cx="23" cy="9" r="2.6" fill="white" opacity="0.7" />
        <path d="M7 24 L25 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      </svg>
      <span className="text-[15px]">{t.siteName}</span>
    </Link>
  );
}
