import { useState } from "react";

/* ── Google Icon ── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── AuthCard wrapper ── */
function AuthCard({ title, subtitle, children, onBack }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.18) 0%, var(--bg) 65%)",
      padding: "20px"
    }}>
      <div className="auth-card" style={{
        width: "100%", maxWidth: 440,
        background: "rgba(15,17,32,0.92)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "40px 36px"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, background: "var(--violet)", borderRadius: 14,
            margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
          }}>◆</div>
          <h1 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700 }}>{title}</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>{subtitle}</p>
        </div>
        {children}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)", cursor: "pointer" }} onClick={onBack}>← Back to home</p>
      </div>
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ color: "var(--muted)", fontSize: 11, letterSpacing: 1 }}>OR CONTINUE WITH EMAIL</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════ */
export default function RegisterPage({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <AuthCard
      title="Create account"
      subtitle="Start tracking for free — no credit card"
      onBack={() => onNavigate("landing")}
    >
      <button
        className="bg"
        style={{ width: "100%", justifyContent: "center", padding: "13px" }}
      >
        <GoogleIcon /> Continue with Google
      </button>

      <Divider />

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
          Full Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Alex Johnson"
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
          Email
        </label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
          Password
        </label>
        <input
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Min. 8 characters"
          type="password"
        />
      </div>

      <button
        className="bp"
        style={{ width: "100%", justifyContent: "center", padding: "14px" }}
      >
        Create Account →
      </button>

      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--muted)" }}>
        Already have an account?{" "}
        <span
          style={{ color: "var(--violet2)", cursor: "pointer" }}
          onClick={() => onNavigate("login")}
        >
          Sign in
        </span>
      </p>
    </AuthCard>
  );
}