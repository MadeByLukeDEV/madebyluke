"use client";
// src/components/sections/ContactSection.tsx
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Send, Mail, Github, Globe } from "lucide-react";
import Link from "next/link";

export function ContactSection() {
  const t = useTranslations("contact");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.message.trim() || form.message.length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[var(--bg-surface)]" ref={ref}>
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

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-[var(--text-muted)] leading-relaxed">
              {t("description")}
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "business@madebyluke.dev",
                  href: "mailto:business@madebyluke.dev",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  value: "Madebyluke",
                  href: "https://github.com/MadeByLukeDEV",
                },
                {
                  icon: Globe,
                  label: "Website",
                  value: "madebyluke.dev",
                  href: "https://madebyluke.dev",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center
                                  group-hover:border-accent-500 group-hover:text-accent-500 transition-all">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                    <p className="text-sm font-medium group-hover:text-accent-500 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="surface-card p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder={t("emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={254}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                  {t("message")}
                </label>
                <textarea
                  className="input-field min-h-[140px] resize-y max-h-[613px]"
                  placeholder={t("messagePlaceholder")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={2000}
                />
                <div className="flex justify-between">
                  {errors.message ? (
                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-[var(--text-muted)] text-right mt-1">
                    {form.message.length}/2000
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={status === "sending" || status === "success"}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t("send")}
                  </>
                )}
              </button>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent-500 text-sm text-center"
                >
                  ✓ {t("success")}
                </motion.p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center">{t("error")}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
