"use client";
// src/components/sections/ExperienceSection.tsx
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Briefcase, Code2, Heart, GraduationCap } from "lucide-react";

const icons = [Code2, Briefcase, Heart, Briefcase, GraduationCap];

export function ExperienceSection() {
  const t = useTranslations("experience");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const entries = t.raw("entries") as Array<{
    date: string;
    title: string;
    company: string;
    bullets: string[];
  }>;

  return (
    <section id="experience" className="py-24 px-6 bg-[var(--bg-surface)]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs text-accent-500 tracking-widest uppercase mb-2">
            {t("subtitle")}
          </p>
          <h2 className="section-title mb-12">{t("title")}</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[21px] md:left-[21.5px] top-0 bottom-0 w-px bg-[var(--border)]" />
          <div className="space-y-8">
            {entries.map((exp, i) => {
              const Icon = icons[i] ?? Briefcase;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  <div className={`relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 ${i === 0 ? "border-accent-500 bg-[var(--bg)]  text-accent-500" : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]"}`}>
                    <Icon size={16} />
                  </div>
                  <div className="surface-card p-5 flex-1 -mt-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-semibold">{exp.title}</h3>
                        <p className="text-accent-500 text-sm font-medium">{exp.company}</p>
                      </div>
                      <span className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">{exp.date}</span>
                    </div>
                    <ul className="space-y-1 mt-3">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-sm text-[var(--text-muted)] flex gap-2">
                          <span className="text-accent-500 mt-1.5 flex-shrink-0">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
