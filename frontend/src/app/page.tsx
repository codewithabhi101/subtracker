'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text)',
      overflow: 'hidden',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,48px)',
        height: 64,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,12,18,0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#fff',
            boxShadow: '0 3px 10px rgba(79,70,229,0.5)',
          }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>SubTracker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="#features" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Features</Link>
          <Link href="#pricing" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Pricing</Link>
          <Link href="/login" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
            color: '#fff', textDecoration: 'none',
            padding: '8px 18px', borderRadius: 9,
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 3px 12px rgba(79,70,229,0.4)',
          }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(60px,10vw,120px) clamp(16px,4vw,48px) clamp(40px,6vw,80px)',
        position: 'relative',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
          <div style={{ position: 'absolute', width: 700, height: 700, background: '#4f46e5', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.07, top: '-20%', left: '50%', transform: 'translateX(-50%)' }} />
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 100, padding: '6px 14px',
          fontSize: 12, fontWeight: 600, color: '#818cf8',
          marginBottom: 28, letterSpacing: '0.04em',
        }}>
          ● Trusted by 2,000+ users tracking their subscriptions
        </div>

        <h1 style={{
          fontSize: 'clamp(36px,7vw,72px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          maxWidth: 800,
          margin: '0 auto 24px',
        }}>
          Know exactly where your{' '}
          <span style={{
            background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontStyle: 'italic',
          }}>
            money goes, every month
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px,2vw,18px)',
          color: 'var(--text2)',
          maxWidth: 520,
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
            color: '#fff', textDecoration: 'none',
            padding: '14px 32px', borderRadius: 12,
            fontSize: 16, fontWeight: 700,
            boxShadow: '0 6px 24px rgba(79,70,229,0.45)',
            transition: 'all 0.2s',
          }}>
            Get Started Free →
          </Link>
          <Link href="/dashboard" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text)', textDecoration: 'none',
            padding: '14px 32px', borderRadius: 12,
            fontSize: 16, fontWeight: 600,
            transition: 'all 0.2s',
          }}>
            👁 Try Live Demo
          </Link>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{
        padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,48px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, marginBottom: 48, letterSpacing: '-0.02em' }}>
          Everything you need to take control
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {[
            { icon: '📊', title: 'Spending Dashboard', desc: 'See all your subscriptions in one place with monthly and yearly totals.' },
            { icon: '🔔', title: 'Renewal Reminders', desc: 'Never get surprised by a charge again. Get notified before renewals.' },
            { icon: '📈', title: 'Spending Trends', desc: 'Visualize how your subscription spending changes over time.' },
            { icon: '🗂️', title: 'Category Breakdown', desc: 'See exactly how much you spend on streaming, music, software and more.' },
            { icon: '🔐', title: 'Secure Login', desc: 'Sign in with Google or GitHub. Your data is safe and private.' },
            { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive — use it on your phone, tablet, or desktop.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 22px',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)');
              (e.currentTarget.style.transform = 'translateY(-3px)');
              (e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,70,229,0.12)');
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.borderColor = 'var(--border)');
              (e.currentTarget.style.transform = '');
              (e.currentTarget.style.boxShadow = '');
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: 'center',
        padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,48px)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Start tracking today — it's free
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 16 }}>
          Join thousands of people who've taken control of their subscriptions.
        </p>
        <Link href="/register" style={{
          background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
          color: '#fff', textDecoration: 'none',
          padding: '14px 36px', borderRadius: 12,
          fontSize: 16, fontWeight: 700,
          boxShadow: '0 6px 24px rgba(79,70,229,0.45)',
        }}>
          Get Started Free →
        </Link>
      </div>
    </div>
  );
}