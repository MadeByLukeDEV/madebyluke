"use client";
// src/app/dashboard/login/LoginClient.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { motion } from "motion/react";
import { Fingerprint, ArrowLeft, Shield } from "lucide-react";

type Mode = "login" | "setup";
type Status = "idle" | "loading" | "success" | "error";

export function LoginClient() {
  const [mode, setMode] = useState<Mode>("login");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [registrationLocked, setRegistrationLocked] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if registration is still open by probing the endpoint
    fetch("/api/auth/register-options", { method: "POST" })
      .then((r) => setRegistrationLocked(r.status === 403))
      .catch(() => setRegistrationLocked(false));
  }, []);

  const handleLogin = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const optRes = await fetch("/api/auth/login-options", { method: "POST" });
      if (!optRes.ok) throw new Error("Failed to get options");
      const optionsJSON = await optRes.json();

      const credential = await startAuthentication(optionsJSON);

      const verifyRes = await fetch("/api/auth/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      if (verifyRes.ok) {
        setStatus("success");
        setMessage("Authenticated! Redirecting...");
        setTimeout(() => { window.location.href = "/dashboard"; }, 800);
      } else {
        const data = await verifyRes.json();
        throw new Error(data.error ?? "Authentication failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setMessage("Authentication was cancelled.");
      } else {
        setMessage(err instanceof Error ? `${err.name}: ${err.message}` : "Authentication failed");
      }
      setStatus("error");
    }
  };

  const handleSetup = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const optRes = await fetch("/api/auth/register-options", { method: "POST" });
      if (!optRes.ok) {
        const data = await optRes.json();
        throw new Error(data.error ?? "Failed to get options");
      }
      const optionsJSON = await optRes.json();

      const credential = await startRegistration(optionsJSON);
      console.log("Credential created:", credential);

      const verifyRes = await fetch("/api/auth/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      if (verifyRes.ok) {
        setStatus("success");
        setMessage("Passkey registered! You can now log in.");
        setRegistrationLocked(true);
        setTimeout(() => { setMode("login"); setStatus("idle"); setMessage(""); }, 2000);
      } else {
        const data = await verifyRes.json();
        throw new Error(data.error ?? "Registration failed");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setMessage("Registration was cancelled or not allowed.");
      } else if (err instanceof Error && err.name === "InvalidStateError") {
        setMessage("This device already has a passkey registered.");
      } else {
        setMessage(err instanceof Error ? `${err.name}: ${err.message}` : "Registration failed");
      }
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen grid-bg noise flex items-center justify-center px-6">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div
          className="w-96 h-96 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(0,255,168,0.04), transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 surface-card p-8 w-full max-w-sm"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-accent-500 transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          Back to site
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
            <Shield size={18} className="text-accent-500" />
          </div>
          <div>
            <h1 className="font-display font-bold">Admin Access</h1>
            <p className="text-xs text-[var(--text-muted)]">madebyluke.dev</p>
          </div>
        </div>

        {mode === "login" ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Authenticate with your passkey to access the dashboard.
            </p>

            <button
              onClick={handleLogin}
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Fingerprint size={18} />
              )}
              {status === "loading" ? "Waiting..." : "Sign in with Passkey"}
            </button>

            {message && (
              <p className={`text-sm text-center ${status === "success" ? "text-accent-500" : "text-red-400"}`}>
                {message}
              </p>
            )}

            {/* Only show register link if no passkey registered yet */}
            {registrationLocked === false && (
              <button
                onClick={() => { setMode("setup"); setStatus("idle"); setMessage(""); }}
                className="w-full text-xs text-center text-[var(--text-muted)] hover:text-accent-500 transition-colors mt-2"
              >
                Register a new passkey
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Register a passkey for this device. Use your biometrics or device PIN.
            </p>

            <button
              onClick={handleSetup}
              disabled={status === "loading"}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Fingerprint size={18} />
              )}
              {status === "loading" ? "Registering..." : "Register Passkey"}
            </button>

            {message && (
              <p className={`text-sm text-center ${status === "success" ? "text-accent-500" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <button
              onClick={() => { setMode("login"); setStatus("idle"); setMessage(""); }}
              className="w-full text-xs text-center text-[var(--text-muted)] hover:text-accent-500 transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
