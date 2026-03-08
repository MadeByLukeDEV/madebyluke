"use client";
// src/components/layout/Footer.tsx
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-[var(--border)] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
          <span>{t("made")}</span>
          <Heart size={14} className="text-accent-500 fill-accent-500" />
          <span>{t("by")}</span>
        </div>

        <p className="font-mono text-xs text-[var(--text-muted)]">
          madebyluke.dev · {new Date().getFullYear()} · {t("rights")}
        </p>

        <a
          href="/dashboard"
          className="text-xs text-[var(--text-muted)] hover:text-accent-500 transition-colors font-mono"
        >
          admin ↗
        </a>
      </div>
    </footer>
  );
}
