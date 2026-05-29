'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://subtracker-backend123.vercel.app/api/auth/register', {
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
          marginBottom: 36, fontWeight: 500,
          transition: 'color 0.2s',
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
          {/* Error message */}
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
                    display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
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
              {loading ? (
                <><span className="spinner" /> Creating account…</>
              ) : (
                'Create Account →'
              )}
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

          {/* Trust note */}
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 16, lineHeight: 1.6 }}>
            🔒 Your data is encrypted and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
