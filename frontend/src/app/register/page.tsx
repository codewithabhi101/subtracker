"use client";

import { useState } from "react";

type PageProps = {
  onNavigate: (p: string) => void;
};

export default function RegisterPage({
  onNavigate,
}: PageProps) {
  const [name, setName] = useState("");
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

          <h1 className="auth-title">
            Create account
          </h1>

          <p className="auth-sub">
            Start tracking for free
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
          <label>Full Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
          />
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
          <label>Password</label>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            type="password"
          />
        </div>

        <button className="btn-primary full">
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span
            onClick={() => onNavigate("login")}
          >
            Sign in
          </span>
        </p>

        <p className="auth-terms">
          By signing up you agree to our Terms
          of Service and Privacy Policy.
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