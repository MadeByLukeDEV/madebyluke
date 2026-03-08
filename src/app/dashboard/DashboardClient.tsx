"use client";
// src/app/dashboard/DashboardClient.tsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Trash2, Edit2, LogOut, Eye, EyeOff, Star, 
  Mail, ExternalLink, X, Check, ArrowLeft, Github
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectLink { label: string; url: string; }

interface Project {
  id: string;
  title: string;
  titleDe?: string | null;
  description: string;
  descriptionDe?: string | null;
  coverUrl?: string | null;
  previewUrl?: string | null;
  links?: unknown;
  tags?: unknown;
  featured: boolean;
  published: boolean;
  order: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const emptyForm = {
  title: "",
  titleDe: "",
  description: "",
  descriptionDe: "",
  coverUrl: "",
  previewUrl: "",
  links: [] as ProjectLink[],
  tags: [] as string[],
  featured: false,
  published: true,
  order: 0,
};

export function DashboardClient({
  initialProjects,
  messages,
}: {
  initialProjects: Project[];
  messages: Message[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tab, setTab] = useState<"projects" | "messages">("projects");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [formLang, setFormLang] = useState<"en" | "de">("en");

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (project: Project) => {
    setForm({
      title: project.title,
      titleDe: project.titleDe ?? "",
      description: project.description,
      descriptionDe: project.descriptionDe ?? "",
      coverUrl: project.coverUrl ?? "",
      previewUrl: project.previewUrl ?? "",
      links: (project.links as ProjectLink[]) ?? [],
      tags: (project.tags as string[]) ?? [],
      featured: project.featured,
      published: project.published,
      order: project.order,
    });
    setEditing(project.id);
    setShowForm(true);
    setError("");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      ...form,
      coverUrl: form.coverUrl || undefined,
      previewUrl: form.previewUrl || undefined,
    };

    const res = editing
      ? await fetch(`/api/projects/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (res.ok) {
      const saved = await res.json();
      if (editing) {
        setProjects((prev) => prev.map((p) => (p.id === editing ? saved : p)));
      } else {
        setProjects((prev) => [saved, ...prev]);
      }
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const addLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setForm({ ...form, links: [...form.links, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }] });
      setNewLinkLabel("");
      setNewLinkUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-accent-500 transition-colors text-sm">
            <ArrowLeft size={14} />
            Back to site
          </Link>
          <span className="text-[var(--border)]">|</span>
          <h1 className="font-display font-bold text-lg">
            <span className="text-accent-500">made</span>byluke
            <span className="text-[var(--text-muted)]">.dev</span>
            <span className="text-xs ml-2 text-[var(--text-muted)] font-mono">admin</span>
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 surface-card p-1 w-fit rounded-lg">
          {(["projects", "messages"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
                tab === t
                  ? "bg-accent-500 text-black"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {t}
              {t === "messages" && messages.filter((m) => !m.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold">Projects ({projects.length})</h2>
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} />
                New Project
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="surface-card p-4 group">
                  {project.coverUrl && (
                    <Image
                      src={project.coverUrl}
                      alt={project.title}
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{project.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {project.featured && <Star size={12} className="text-accent-500 fill-accent-500" />}
                      {project.published ? (
                        <Eye size={12} className="text-green-500" />
                      ) : (
                        <EyeOff size={12} className="text-[var(--text-muted)]" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                    <button
                      onClick={() => openEdit(project)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                                 border border-[var(--border)] hover:border-accent-500 hover:text-accent-500 transition-all"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex items-center justify-center px-3 py-1.5 rounded
                                 border border-[var(--border)] hover:border-red-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="col-span-3 text-center py-16 text-[var(--text-muted)]">
                  No projects yet. Click "New Project" to add one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages tab */}
        {tab === "messages" && (
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">
              Messages ({messages.length})
            </h2>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "surface-card p-5",
                    !msg.read && "border-accent-500/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="font-medium">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="ml-2 text-sm text-accent-500 hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-mono whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-16 text-[var(--text-muted)]">
                  <Mail size={24} className="mx-auto mb-2 opacity-30" />
                  No messages yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="surface-card w-full max-w-2xl p-6 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">
                  {editing ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-surface2)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Language tabs */}
                <div className="flex gap-1 surface-card p-1 w-fit rounded-lg">
                  {(["en", "de"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setFormLang(l)}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-widest transition-all",
                        formLang === l
                          ? "bg-accent-500 text-black"
                          : "text-[var(--text-muted)] hover:text-[var(--text)]"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Title {formLang === "en" ? <span className="text-accent-500">*</span> : <span className="text-[var(--text-muted)] font-normal">(optional)</span>}
                  </label>
                  {formLang === "en" ? (
                    <input
                      type="text"
                      className="input-field"
                      placeholder="My Awesome Project"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      maxLength={200}
                    />
                  ) : (
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Mein tolles Projekt"
                      value={form.titleDe}
                      onChange={(e) => setForm({ ...form, titleDe: e.target.value })}
                      maxLength={200}
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Description {formLang === "en" ? <span className="text-accent-500">*</span> : <span className="text-[var(--text-muted)] font-normal">(optional)</span>}
                  </label>
                  {formLang === "en" ? (
                    <textarea
                      className="input-field min-h-[100px] resize-y"
                      placeholder="What does this project do?"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      maxLength={5000}
                    />
                  ) : (
                    <textarea
                      className="input-field min-h-[100px] resize-y"
                      placeholder="Was macht dieses Projekt?"
                      value={form.descriptionDe}
                      onChange={(e) => setForm({ ...form, descriptionDe: e.target.value })}
                      maxLength={5000}
                    />
                  )}
                  {!form.titleDe && !form.descriptionDe && formLang === "de" && (
                    <p className="text-xs text-[var(--text-muted)] mt-1.5">
                      If left empty, the English version will be shown to German visitors.
                    </p>
                  )}
                </div>

                {/* Cover URL */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://..."
                    value={form.coverUrl}
                    onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  />
                </div>

                {/* Preview URL */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Live Preview URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://..."
                    value={form.previewUrl}
                    onChange={(e) => setForm({ ...form, previewUrl: e.target.value })}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full
                                   bg-accent-500/10 text-accent-500 border border-accent-500/20"
                      >
                        {tag}
                        <button
                          onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      maxLength={30}
                    />
                    <button onClick={addTag} className="btn-secondary px-3">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    GitHub URL <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                      <Github size={14} />
                    </div>
                    <input
                      type="url"
                      className="input-field pl-9"
                      placeholder="https://github.com/you/repo"
                      value={form.links.find(l => l.label === "GitHub")?.url ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const others = form.links.filter(l => l.label !== "GitHub");
                        setForm({
                          ...form,
                          links: val.trim() ? [...others, { label: "GitHub", url: val }] : others,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Links */}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 font-medium">
                    Links
                  </label>
                  <div className="space-y-2 mb-2">
                    {form.links.map((link, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <ExternalLink size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                        <span className="font-medium">{link.label}</span>
                        <span className="text-[var(--text-muted)] truncate flex-1">{link.url}</span>
                        <button
                          onClick={() =>
                            setForm({ ...form, links: form.links.filter((_, j) => j !== i) })
                          }
                          className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input-field w-28"
                      placeholder="Label"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                    />
                    <input
                      type="url"
                      className="input-field flex-1"
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                    />
                    <button onClick={addLink} className="btn-secondary px-3">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-4">
                  {[
                    { key: "featured" as const, label: "Featured", icon: Star },
                    { key: "published" as const, label: "Published", icon: Eye },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setForm({ ...form, [key]: !form[key] })}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all",
                        form[key]
                          ? "border-accent-500 bg-accent-500/10 text-accent-500"
                          : "border-[var(--border)] text-[var(--text-muted)]"
                      )}
                    >
                      <Icon size={14} />
                      {label}
                      {form[key] && <Check size={12} />}
                    </button>
                  ))}
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex-1 justify-center"
                  >
                    {saving ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    {editing ? "Save Changes" : "Create Project"}
                  </button>
                  <button onClick={() => setShowForm(false)} className="btn-secondary px-6">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
