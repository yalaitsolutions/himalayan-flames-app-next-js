"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import "@/styles/admin.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    // redirect:false lets us show inline errors instead of bouncing to /api/auth/error
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.error) {
      setErr("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login" onSubmit={submit}>
        <div className="admin-login-logo">🏔️</div>
        <h1>Sign <span className="gold">In</span></h1>
        <p>Himalayan Flames — Account Login</p>
        {err && <div className="admin-toast err" style={{ marginBottom: "1rem", borderRadius: 8 }}>{err}</div>}
        <div className="admin-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="admin-field" style={{ marginTop: ".75rem" }}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="admin-btn gold block" type="submit" disabled={busy} style={{ marginTop: "1.2rem" }}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Don&apos;t have an account? <Link href="/register" className="gold">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  // useSearchParams must be wrapped in Suspense.
  return (
    <Suspense fallback={<div className="admin-login-wrap"><p style={{ color: "var(--muted)" }}>Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
