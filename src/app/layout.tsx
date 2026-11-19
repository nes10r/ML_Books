import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { ProgressProvider } from "@/components/layout/progress-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { t } from "@/lib/i18n/az";
import "./globals.css";

// latin-ext is required for Azerbaijani letters (ə, ğ, ı, ş, ç, ö, ü).
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--font-serif-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono-code", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${t.siteName} — ${t.siteTagline}`, template: `%s · ${t.siteName}` },
  description:
    "Azərbaycan dilində interaktiv maşın öyrənməsi kursu: vizual simulyasiyalar, riyazi intuisiya, Python laboratoriyaları və praktiki tapşırıqlar.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfdff" },
    { media: "(prefers-color-scheme: dark)", color: "#16161f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" suppressHydrationWarning className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          {t.nav.skipToContent}
        </a>
        <ThemeProvider>
          <ProgressProvider>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
