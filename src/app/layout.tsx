// src/app/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Outfit, DM_Mono } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/ui/CursorGlow";

// Outfit: clean, modern geometric sans — sharper than Syne
const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Outfit as body too for cohesive feel
const bodyFont = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

// DM Mono: crisp monospace for code elements
const monoFont = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "madebyluke.dev — Lukas, Junior Fullstack Web Developer",
  description:
    "Junior Fullstack Web Developer based in Vienna. Building clean, fast, and modern web experiences.",
  keywords: ["web developer", "fullstack", "next.js", "vienna", "lukas graf"],
  authors: [{ name: "Lukas", url: "https://madebyluke.dev" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "madebyluke.dev",
    description: "Junior Fullstack Web Developer based in Vienna.",
    url: "https://madebyluke.dev",
    siteName: "madebyluke.dev",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <CursorGlow />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
