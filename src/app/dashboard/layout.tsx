// src/app/dashboard/layout.tsx
// NOTE: This layout only wraps /dashboard (not /dashboard/login)
// The login page lives at src/app/dashboard/login/ which has its OWN route segment
// and is NOT a child of this layout because Next.js route groups handle it via middleware.
// Auth is enforced in middleware.ts — this layout is just a passthrough wrapper.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
