'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'https://subtracker-backend123.vercel.app';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
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
      const res  = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    setOauthLoading('google');
    window.location.href = `${API}/api/auth/google`;
  };

  const handleGithub = () => {
    setOauthLoading('github');
    window.location.href = `${API}/api/auth/github`;
  };

  const oauthBtnStyle = (active: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '12px 18px',
    color: 'var(--text)',
    fontSize: 15,
    fontWeight: 600,
    cursor: active ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.2s ease',
    marginBottom: 10,
    opacity: active ? 0.7 : 1,
  });

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
        <div style={{ position: 'absolute', width: 300, height: 300, background: '#818cf8', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.08, bottom: '5%', right: '5%' }} />
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
            Create your account
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>
            Start tracking your subscriptions
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

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={oauthLoading !== null}
            style={oauthBtnStyle(oauthLoading === 'google')}
            onMouseEnter={e => {
              if (!oauthLoading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.transform = '';
            }}
          >
            {oauthLoading === 'google' ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            {oauthLoading === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* GitHub OAuth button */}
          <button
            type="button"
            onClick={handleGithub}
            disabled={oauthLoading !== null}
            style={{ ...oauthBtnStyle(oauthLoading === 'github'), marginBottom: 18 }}
            onMouseEnter={e => {
              if (!oauthLoading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.transform = '';
            }}
          >
            {oauthLoading === 'github' ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            )}
            {oauthLoading === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
          </button>

          {/* Divider */}
          <div className="divider" style={{ marginBottom: 18 }}>or continue with email</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 7, display: 'block', fontWeight: 600 }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Abhi B C"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 7, display: 'block', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text3)', fontSize: 16, padding: 4,
                    display: 'flex', alignItems: 'center', width: 'auto',
                  }}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {/* Password strength bar */}
              {form.password && (
                <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                  {[1,2,3,4].map(i => {
                    const strength = Math.min(Math.floor(form.password.length / 3), 4);
                    const colors = ['#ef4444','#f59e0b','#f59e0b','#10b981'];
                    return (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 3,
                        background: i <= strength ? colors[strength - 1] : 'var(--bg3)',
                        transition: 'background 0.3s',
                      }} />
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: 4, padding: '14px', fontSize: 15, opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account →'}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 18 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 700 }}>
              Sign in
            </Link>
          </p>

          {/* Divider */}
          <div className="divider" style={{ margin: '18px 0' }}>or</div>

          {/* Demo link */}
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

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 16, lineHeight: 1.6 }}>
            🔒 Your data is encrypted and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
