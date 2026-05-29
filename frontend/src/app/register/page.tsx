"use client";
import { useState } from "react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0b0d18;
          --card: rgba(15,17,32,0.9);
          --violet: #6C5CE7;
          --violet2: #a29bfe;
          --text: #f0eeff;
          --muted: rgba(230,224,250,0.45);
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .register-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.15) 0%, var(--bg) 70%);
          padding: 20px;
        }
        .register-card {
          width: 100%;
          max-width: 440px;
          background: var(--card);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 36px;
        }
        @media (max-width: 480px) {
          .register-card { padding: 32px 20px; border-radius: 16px; }
        }
        .logo-wrap { text-align: center; margin-bottom: 28px; }
        .logo-icon {
          width: 56px; height: 56px;
          background: var(--violet);
          border-radius: 14px;
          margin: 0 auto 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .logo-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; }
        .logo-sub { color: var(--muted); font-size: 14px; margin-top: 6px; }
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { color: var(--muted); font-size: 12px; letter-spacing: 1px; white-space: nowrap; }
        .field { margin-bottom: 14px; }
        .field label {
          display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;
        }
        input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          color: var(--text);
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus { border-color: var(--violet); }
        input::placeholder { color: var(--muted); }
        .btn-primary {
          width: 100%;
          background: var(--violet);
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 20px;
        }
        .btn-primary:hover {
          background: #7c6cf8;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(108,92,231,0.4);
        }
        .btn-ghost {
          width: 100%;
          background: rgba(255,255,255,0.06);
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 20px;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .signin-text {
          text-align: center; margin-top: 20px;
          font-size: 14px; color: var(--muted);
        }
        .signin-text a { color: var(--violet2); cursor: pointer; text-decoration: none; }
        .back-link {
          text-align: center; margin-top: 16px;
          font-size: 13px; color: var(--muted); cursor: pointer;
        }
        .back-link:hover { color: var(--text); }
        .terms {
          text-align: center; font-size: 12px; color: var(--muted);
          margin-top: 16px; line-height: 1.6;
        }
        .terms a { color: var(--violet2); text-decoration: none; }
      `}</style>

      <div className="register-wrapper">
        <div className="register-card">
          <div className="logo-wrap">
            <div className="logo-icon">◆</div>
            <h1 className="logo-title">Create account</h1>
            <p className="logo-sub">Start tracking for free</p>
          </div>

          <button className="btn-ghost">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">OR CONTINUE WITH EMAIL</span>
            <div className="divider-line" />
          </div>

          <div className="field">
            <label>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Johnson"
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <div className="field" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              type="password"
            />
          </div>

          <button className="btn-primary">Create Account →</button>

          <p className="signin-text">
            Already have an account?{" "}
            <a href="/login">Sign in</a>
          </p>

          <p className="terms">
            By signing up you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <p className="back-link">← Back to home</p>
        </div>
      </div>
    </>
  );
}
