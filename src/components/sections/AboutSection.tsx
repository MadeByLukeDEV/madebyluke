"use client";
// src/components/sections/AboutSection.tsx
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const skills = {
  Frontend: ["Next.js", "Vue.js", "Angular", "TailwindCSS", "SCSS/SASS", "TypeScript"],
  Backend: ["Node.js", "Express", "NestJS", "PHP", "Laravel", "REST APIs"],
  Database: ["MySQL", "MariaDB", "MongoDB", "PostgreSQL"],
  "DevOps/CI·CD": ["GitHub Actions", "Docker", "Coolify", "Caddy", "Proxmox"],
  CMS: ["WordPress"],
};

const programmingLevels = [
  { name: "HTML5", level: 4 },
  { name: "CSS / SCSS", level: 4 },
  { name: "GIT", level: 4 },
  { name: "Angular", level: 3 },
  { name: "PHP", level: 3 },
  { name: "Node.js", level: 3 },
  { name: "REST API", level: 3 },
  { name: "Next.js", level: 2 },
  { name: "Vue.js", level: 2 },
  { name: "JS / TS", level: 2 },
];

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-muted)] w-20 flex-shrink-0 font-mono">{name}</span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className={`h-1.5 flex-1 rounded-full ${
              i < level ? "bg-accent-500" : "bg-[var(--bg-surface2)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function AboutSection() {
  const t = useTranslations("about");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const strengthsList = t.raw("strengthsList") as string[];

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            <p className="text-[var(--text-muted)] leading-relaxed">{t("bio")}</p>
            <p className="text-[var(--text-muted)] leading-relaxed">{t("bio2")}</p>

            {/* Strengths */}
            <div>
              <h3 className="font-display font-semibold mb-3 text-sm uppercase tracking-widest text-[var(--text-muted)]">
                {t("strengths")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {strengthsList.map((s: string) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs rounded-full border border-accent-500/30 
                               bg-accent-500/10 text-accent-500 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-display font-semibold mb-3 text-sm uppercase tracking-widest text-[var(--text-muted)]">
                {t("languages")}
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>🇦🇹</span>
                  <span>{t("languageGer")}</span>
                  <span className="text-accent-500 text-xs font-mono">Native</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🇬🇧</span>
                  <span>{t("languageEng")}</span>
                  <span className="text-accent-500 text-xs font-mono">B2</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Skill bars */}
            <div>
              <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-widest text-[var(--text-muted)]">
                {t("skills")}
              </h3>
              <div className="space-y-2.5">
                {programmingLevels.map((skill) => (
                  <SkillBar key={skill.name} {...skill} />
                ))}
              </div>
            </div>

            {/* Tech categories */}
            <div className="space-y-3">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="surface-card p-4">
                  <span className="text-xs font-mono text-accent-500 uppercase tracking-widest block mb-2">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded bg-[var(--bg-surface2)] text-[var(--text-muted)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
