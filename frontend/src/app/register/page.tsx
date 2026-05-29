'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(79,70,229,0.12) 0%,transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', animation: 'fadeUp 0.6s ease' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.4)', fontSize: 13, textDecoration: 'none', marginBottom: 36 }}>
          ← Back to home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, margin: '0 auto 18px', boxShadow: '0 8px 30px rgba(79,70,229,0.4)' }}>S</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: '#e2e8f0' }}>Create your account</h1>
          <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: 15 }}>Start tracking your subscriptions</p>
        </div>

        <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 18, padding: 28 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(226,232,240,0.6)', marginBottom: 6, display: 'block' }}>Full Name</label>
              <input type="text" placeholder="Abhi B C" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(226,232,240,0.6)', marginBottom: 6, display: 'block' }}>Email</label>
              <input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(226,232,240,0.6)', marginBottom: 6, display: 'block' }}>Password</label>
              <input type="password" placeholder="••••••••" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 6, justifyContent: 'center', padding: '13px', fontSize: 15, opacity: loading ? 0.7 : 1, width: '100%', border: 'none' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(226,232,240,0.4)', marginTop: 18 }}>
            Already have an account? <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }} />
            <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.25)', letterSpacing: 1 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.15)' }} />
          </div>

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'rgba(226,232,240,0.4)', fontSize: 13, textDecoration: 'none' }}>
            👁 Try Demo Without Signing In
          </Link>
        </div>
      </div>
    </div>
  );
}