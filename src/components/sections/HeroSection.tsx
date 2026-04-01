"use client";
// src/components/sections/HeroSection.tsx
import { motion } from "motion/react";
import { ArrowDown, Github, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const techStack = ["Next.js", "Node.js", "TypeScript", "TailwindCSS", "PHP", "MariaDB"];

export function HeroSection() {

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />

      {/* Top-right circular badge — replaces the person photo */}
      <motion.div
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-24 right-8 md:right-16 lg:right-24 hidden md:flex items-center justify-center"
      >
        {/* Spinning text ring */}
        <div className="relative w-36 h-36">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 144 144"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <path
                id="circle"
                d="M 72,72 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
              />
            </defs>
            <text className="fill-[var(--text-muted)]" fontSize="11.5" letterSpacing="3.5">
              <textPath href="#circle">
                FULLSTACK DEVELOPER · VIENNA · OPEN TO WORK ·
              </textPath>
            </text>
          </motion.svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center
                         bg-[var(--bg-surface)]"
            >
              <Image src="/madebyluke_logo.svg" alt="madebyluke Logo" width={32} height={32} className=" inline-flex"/>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 w-full">

        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full
                     border border-[var(--border)] bg-[var(--bg-surface)]
                     text-xs font-mono text-[var(--text-muted)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
          Available for Projects
        </motion.div>

        {/* Heading — massive, editorial */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black leading-[0.92] tracking-tighter
                       text-[clamp(3.5rem,10vw,7.5rem)] text-[var(--text)]"
          >
            Meet the<br />
            <span className="text-accent-500">Junior</span> Fullstack<br />
            Developer.
          </motion.h1>
        </div>

        {/* Bottom row: stack + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-10"
        >
          {/* Tech stack pills */}
          <div>
            <p className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase mb-3">
              My Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                             border border-[var(--border)] bg-[var(--bg-surface)]
                             text-[var(--text-muted)] hover:border-accent-500/50 hover:text-accent-500
                             transition-all duration-200 cursor-default"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-500/60" />
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                         bg-accent-500 text-black hover:bg-accent-400
                         transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Explore Work
              <ArrowRight size={15} />
            </Link>
            <Link
              href="https://github.com/MadeByLukeDEV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-sm
                         border border-[var(--border)] bg-[var(--bg-surface)]
                         hover:border-accent-500/50 transition-all duration-200 hover:scale-[1.03]
                         text-[var(--text-muted)] hover:text-accent-500"
            >
              <Github size={16} />
            </Link>
            <Link
              href="https://aboutselphy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-sm
                         border border-[var(--border)] bg-[var(--bg-surface)]
                         hover:border-accent-500/50 transition-all duration-200 hover:scale-[1.03]
                         text-[var(--text-muted)] hover:text-accent-500"
            >
              <ExternalLink size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Divider + scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-4 mt-16 pt-8 border-t border-[var(--border)]"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} className="text-accent-500" />
          </motion.div>
          <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Vienna, AT · {new Date().getFullYear()}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
