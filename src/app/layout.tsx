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
  title: {
    default: "madebyluke.dev — Lukas, Fullstack Web Developer",
    template: "%s | madebyluke.dev",
  },
  description:
    "Fullstack Web Developer based in Vienna. Building fast, modern and scalable web apps with Next.js.",
  keywords: [
    "Lukas Graf",
    "Fullstack Developer",
    "Next.js Developer",
    "Web Developer Vienna",
    "React Developer",
    "madebyluke",
    "AboutSelphy",
  ],
  authors: [{ name: "Lukas", url: "https://madebyluke.dev" }],
  creator: "Lukas",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "https://madebyluke.dev"),

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "madebyluke.dev",
    description: "Fullstack Web Developer based in Vienna.",
    url: "https://madebyluke.dev",
    siteName: "madebyluke.dev",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // 👈 create this!
        width: 1200,
        height: 630,
        alt: "madebyluke.dev preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "madebyluke.dev",
    description: "Fullstack Web Developer based in Vienna.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
