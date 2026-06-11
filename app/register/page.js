"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "@/styles/admin.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create account.");

      // Auto sign-in after a successful registration.
      const login = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (login?.error) {
        router.push("/login");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login" onSubmit={submit}>
        <div className="admin-login-logo">🏔️</div>
        <h1>Create <span className="gold">Account</span></h1>
        <p>Himalayan Flames — Register</p>
        {err && <div className="admin-toast err" style={{ marginBottom: "1rem", borderRadius: 8 }}>{err}</div>}
        <div className="admin-field">
          <label htmlFor="name">Name</label>
          <input id="name" autoComplete="name" value={form.name} onChange={set("name")} required />
        </div>
        <div className="admin-field" style={{ marginTop: ".75rem" }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} required />
        </div>
        <div className="admin-field" style={{ marginTop: ".75rem" }}>
          <label htmlFor="password">Password <span style={{ textTransform: "none", fontSize: ".7rem" }}>(min 8 characters)</span></label>
          <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} required />
        </div>
        <button className="admin-btn gold block" type="submit" disabled={busy} style={{ marginTop: "1.2rem" }}>
          {busy ? "Creating…" : "Create account →"}
        </button>
        <p style={{ marginTop: "1.2rem", fontSize: ".85rem", color: "var(--muted)" }}>
          Already have an account? <Link href="/login" className="gold">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
