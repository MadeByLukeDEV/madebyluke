// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";

// GET - public
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(projects);
  } catch {
    // DB not ready yet (e.g. during build time) — return empty list gracefully
    return NextResponse.json([]);
  }
}

// POST - admin only
export async function POST(req: NextRequest) {
  const isAdmin = await getSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      links: parsed.data.links ?? [],
      tags: parsed.data.tags ?? [],
    },
  });

  return NextResponse.json(project, { status: 201 });
}
