"use client";
// src/components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image'

export function Navbar() {
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#contact", label: t("contact") },
  ];

  const toggleLang = async () => {
    const current = document.documentElement.lang;
    const next = current === "de" ? "en" : "de";
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="#"
          className="font-display font-bold text-lg tracking-tight hover:text-accent-500 transition-colors"
        >
          <Image src="/madebyluke_logo.svg" alt="madebyluke Logo" width={32} height={32} className=" inline-flex gap-5 mr-2"/>
          <span className="text-accent-500">made</span>
          <span>by</span>
          <span className="text-accent-500">luke</span>
          <span className="text-[var(--text-muted)]">.dev</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-[var(--text-muted)]">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="hidden md:flex items-center text-xs font-mono font-bold tracking-widest
                       px-3 py-1.5 rounded border border-[var(--border)] 
                       hover:border-accent-500 hover:text-accent-500 transition-all duration-200"
          >
            {t("toggleLang")}
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("toggleTheme")}
              className="w-9 h-9 flex items-center justify-center rounded-lg
                         border border-[var(--border)] hover:border-accent-500
                         hover:text-accent-500 transition-all duration-200"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--text-muted)] hover:text-accent-500 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={toggleLang}
                className="text-left text-xs font-mono font-bold tracking-widest
                           text-[var(--text-muted)] hover:text-accent-500 transition-colors"
              >
                {t("toggleLang")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
