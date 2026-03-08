// src/app/dashboard/login/page.tsx
// No auth check here — middleware handles protection of /dashboard
// Logged-in users who visit /login will just see the login page (harmless)
import { LoginClient } from "./LoginClient";

export default function LoginPage() {
  return <LoginClient />;
}
