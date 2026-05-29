"use client";

import { useState } from "react";

type PageProps = {
  onNavigate: (p: string) => void;
};

export default function LoginPage({ onNavigate }: PageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo-wrap">
          <div
            className="auth-logo-icon"
            onClick={() => onNavigate("landing")}
            style={{ cursor: "pointer" }}
          >
            ◆
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">
            Sign in to continue to SubTracker
          </p>
        </div>

        <button className="btn-ghost full">
          Continue with Google
        </button>

        <div className="auth-divider">
          <div className="divider-line" />
          <span className="divider-text">
            OR CONTINUE WITH EMAIL
          </span>
          <div className="divider-line" />
        </div>

        <div className="field">
          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
          />
        </div>

        <div
          className="field"
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label style={{ margin: 0 }}>
              Password
            </label>

            <span
              style={{
                fontSize: 13,
                color: "var(--violet2)",
                cursor: "pointer",
              }}
            >
              Forgot password?
            </span>
          </div>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </div>

        <button className="btn-primary full">
          Sign In
        </button>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => onNavigate("register")}
          >
            Sign up
          </span>
        </p>

        <p
          className="back-link"
          onClick={() => onNavigate("landing")}
        >
          ← Back to home
        </p>
      </div>
    </div>
  );
}