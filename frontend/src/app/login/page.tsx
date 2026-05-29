'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = {
  lavender: '#E6E0FA',
  plum: '#A87CA0',
  violet: '#5C2B6D',
  aubergine: '#2A0E3C',
};

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://subtracker-backend123.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
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

  return (
    <div style={{
      minHeight: '100vh', background: colors.aubergine,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', padding: '20px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 30%, rgba(92,43,109,0.5) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(230,224,250,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 32 }}>
          ← Back to home
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, marginBottom: 16, boxShadow: `0 8px 32px rgba(92,43,109,0.5)` }}>S</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'rgba(230,224,250,0.5)', fontSize: 15 }}>Sign in to continue to SubTracker</p>
        </div>

        <div style={{ background: 'rgba(92,43,109,0.15)', border: '1px solid rgba(168,124,160,0.2)', borderRadius: 20, padding: 32, backdropFilter: 'blur(20px)' }}>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 16px', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(230,224,250,0.7)', marginBottom: 6, display: 'block' }}>Email</label>
              <input
                type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', background: 'rgba(42,14,60,0.6)', border: '1px solid rgba(168,124,160,0.2)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, color: 'rgba(230,224,250,0.7)' }}>Password</label>
                <span style={{ fontSize: 13, color: colors.plum, cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <input
                type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', background: 'rgba(42,14,60,0.6)', border: '1px solid rgba(168,124,160,0.2)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 8, boxShadow: `0 4px 20px rgba(92,43,109,0.4)`, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(230,224,250,0.5)' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: colors.plum, textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(168,124,160,0.2)' }} />
            <span style={{ fontSize: 11, color: 'rgba(230,224,250,0.3)', letterSpacing: 1 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(168,124,160,0.2)' }} />
          </div>

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(230,224,250,0.5)', fontSize: 13, textDecoration: 'none' }}>
            👁 Try Demo Without Signing In
          </Link>
        </div>
      </div>
    </div>
  );
}