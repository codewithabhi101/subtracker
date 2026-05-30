'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'https://subtracker-backend123.vercel.app';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user  = params.get('user');
    if (token) {
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', decodeURIComponent(user));
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGithub = () => {
    setGithubLoading(true);
    window.location.href = `${API}/api/auth/github`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: '20px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Mesh blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
        <div style={{ position: 'absolute', width: 600, height: 600, background: '#4f46e5', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.1, top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, background: '#818cf8', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.08, bottom: '10%', left: '5%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', animation: 'fadeUp 0.55s ease forwards' }}>
        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--text3)', fontSize: 13, textDecoration: 'none',
          marginBottom: 36, fontWeight: 500, transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 54, height: 54,
            background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 24, margin: '0 auto 18px',
            boxShadow: '0 8px 30px rgba(79,70,229,0.45)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>S</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>
            Sign in to continue to SubTracker
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 'clamp(20px,4vw,28px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.22)',
              color: '#fca5a5',
              padding: '11px 14px', borderRadius: 10,
              marginBottom: 18, fontSize: 13,
              display: 'flex', alignItems: 'flex-start', gap: 8,
              animation: 'fadeIn 0.3s ease',
            }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
              {error}
            </div>
          )}

          {/* GitHub OAuth button */}
          <button
            type="button"
            onClick={handleGithub}
            disabled={githubLoading}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: githubLoading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: '12px 18px',
              color: 'var(--text)',
              fontSize: 15,
              fontWeight: 600,
              cursor: githubLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease',
              marginBottom: 18,
              opacity: githubLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (!githubLoading) {
                (e.currentTarget.style.background = 'rgba(255,255,255,0.1)');
                (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)');
                (e.currentTarget.style.transform = 'translateY(-1px)');
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.background = 'rgba(255,255,255,0.06)');
              (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)');
              (e.currentTarget.style.transform = '');
            }}
          >
            {githubLoading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            )}
            {githubLoading ? 'Redirecting…' : 'Continue with GitHub'}
          </button>

          {/* Divider */}
          <div className="divider" style={{ marginBottom: 18 }}>or continue with email</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 7, display: 'block', fontWeight: 600 }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>Password</label>
                <button type="button" style={{
                  fontSize: 12, color: 'var(--accent2)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: 600,
                  padding: 0, width: 'auto', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent3)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--accent2)')}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3)', fontSize: 16, padding: 4,
                  display: 'flex', alignItems: 'center', width: 'auto',
                }} tabIndex={-1}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ marginTop: 4, padding: '14px', fontSize: 15, opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 18 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 700 }}>
              Sign up free
            </Link>
          </p>

          <div className="divider" style={{ margin: '18px 0' }}>or</div>

          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            color: 'var(--text3)', fontSize: 13, textDecoration: 'none',
            padding: '10px', borderRadius: 9,
            border: '1px solid var(--border)',
            transition: 'all 0.2s',
            background: 'var(--bg3)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-hover)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)';
          }}
          >
            👁 Try Demo Without Signing In
          </Link>
        </div>
      </div>
    </div>
  );
}
