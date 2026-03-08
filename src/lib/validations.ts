// src/lib/validations.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email too long")
    .toLowerCase(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message too long"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  titleDe: z.string().max(200).optional().or(z.literal("")),
  description: z.string().min(1, "Description is required").max(5000),
  descriptionDe: z.string().max(5000).optional().or(z.literal("")),
  coverUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  previewUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  links: z
    .array(
      z.object({
        label: z.string().min(1).max(50),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional()
    .default([]),
  tags: z.array(z.string().max(30)).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
