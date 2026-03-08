// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return <DashboardClient initialProjects={projects} messages={messages} />;
}
