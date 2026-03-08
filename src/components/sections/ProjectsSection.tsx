"use client";
// src/components/sections/ProjectsSection.tsx
import NextImage from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, Github, Star } from "lucide-react";

interface ProjectLink {
  label: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  titleDe?: string | null;
  description: string;
  descriptionDe?: string | null;
  coverUrl?: string | null;
  previewUrl?: string | null;
  links?: ProjectLink[] | null;
  tags?: string[] | null;
  featured: boolean;
}

function ProjectSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="skeleton h-48 rounded-t-[11px] rounded-b-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const links = (project.links as ProjectLink[]) ?? [];
  const tags = (project.tags as string[]) ?? [];

  // Use DE content if locale is DE and DE content exists, otherwise fall back to EN
  const title = (locale === "de" && project.titleDe) ? project.titleDe : project.title;
  const description = (locale === "de" && project.descriptionDe) ? project.descriptionDe : project.description;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group surface-card overflow-hidden hover:border-accent-500/30 transition-all duration-300 hover:shadow-lg"
    >
      {/* Cover image */}
      <div className="relative h-48 bg-[var(--bg-surface2)] overflow-hidden">
        {project.coverUrl ? (
          <NextImage src={project.coverUrl} alt={project.title} width={800} height={450} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[var(--text-muted)] opacity-30">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full
                          bg-accent-500/90 text-black text-xs font-bold">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-accent-500 transition-colors">
          {title}
        </h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-surface2)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
            {links.map((link) => {
              const isGithub = link.label.toLowerCase().includes("github") ||
                               link.url.includes("github.com");
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-500
                             hover:underline transition-colors"
                >
                  {isGithub ? <Github size={12} /> : <ExternalLink size={12} />}
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const t = useTranslations("projects");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p>{t("noProjects")}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
