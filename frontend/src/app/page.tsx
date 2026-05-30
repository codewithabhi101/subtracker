'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─── Hooks ──────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / 72;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(decimals)));
      }
    }, 14);
    return () => clearInterval(timer);
  }, [visible, target, decimals]);
  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Component ──────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.replace('/dashboard');
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMobileMenu(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const features = [
    { icon: '₹', title: 'Spending overview', desc: 'See your total monthly and yearly cost at a glance — updated as you add or remove subs.' },
    { icon: '🔔', title: 'Payment reminders', desc: 'Get notified before charges hit so you can cancel or pause in time.' },
    { icon: '📊', title: 'Category breakdown', desc: "Find out if you're spending more on streaming than you thought." },
    { icon: '📈', title: 'Trend tracking', desc: 'Month-over-month charts show whether your bill is creeping up.' },
    { icon: '🔒', title: 'Private by default', desc: "Your data stays encrypted. We don't sell it, share it, or look at it." },
    { icon: '⚡', title: 'Fast to set up', desc: 'Add a subscription in a few taps. No spreadsheet migration required.' },
    { icon: '✨', title: 'AI suggestions', desc: "Spots duplicates, cheaper plans, and subscriptions you haven't used in months." },
    { icon: '📧', title: 'Smart insights', desc: 'Get weekly spending reports and personalized saving recommendations.' },
  ];

  return (
    <div style={{
      background: 'var(--bg)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden',
    }}>

      {/* ── NAV ────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: scrolled ? 'rgba(8,12,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.35s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 60px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, color: '#fff',
            boxShadow: '0 4px 14px rgba(79,70,229,0.5)',
          }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>SubTracker</span>
        </div>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <a href="#features" className="btn-ghost">Features</a>
          <a href="#pricing" className="btn-ghost">Pricing</a>
          <Link href="/login" className="btn-ghost">Sign In</Link>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
          <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
            Get Started →
          </Link>
        </div>

        <button
          className="show-mobile"
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{
            background: mobileMenu ? 'rgba(99,102,241,0.12)' : 'none',
            border: '1px solid ' + (mobileMenu ? 'var(--border-hover)' : 'transparent'),
            borderRadius: 8, color: 'var(--text)', fontSize: 20, cursor: 'pointer',
            padding: '6px 10px', transition: 'all 0.2s',
          }}
        >
          {mobileMenu ? '✕' : '☰'}
        </button>
      </nav>

      {mobileMenu && (
        <div className="mobile-menu" style={{ zIndex: 99 }}>
          <a href="#features" onClick={() => setMobileMenu(false)}>Features</a>
          <a href="#pricing" onClick={() => setMobileMenu(false)}>Pricing</a>
          <Link href="/login" onClick={() => setMobileMenu(false)}>Sign In</Link>
          <div style={{ marginTop: 8 }}>
            <Link href="/register" className="btn-primary" style={{ width: '100%', padding: '13px' }}
              onClick={() => setMobileMenu(false)}>
              Get Started Free →
            </Link>
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px,14vw,140px) clamp(16px,4vw,60px) 60px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="mesh-bg" aria-hidden>
          <div className="mesh-blob" style={{ width: 700, height: 700, background: '#4f46e5', top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />
          <div className="mesh-blob" style={{ width: 400, height: 400, background: '#818cf8', top: '40%', left: '10%' }} />
          <div className="mesh-blob" style={{ width: 350, height: 350, background: '#c4b5fd', top: '20%', right: '5%' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 860, animation: 'fadeUp 0.8s ease forwards' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(79,70,229,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100, padding: '5px 14px',
            marginBottom: 28, fontSize: 13,
            color: 'rgba(232,237,245,0.8)',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: 7, height: 7, background: '#6366f1', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
            Trusted by&nbsp;<strong style={{ color: '#a5b4fc' }}>2,000+</strong>&nbsp;users tracking their subscriptions
          </div>

          <h1 style={{
            fontSize: 'clamp(34px,6.5vw,72px)',
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: 24,
            letterSpacing: '-0.03em',
          }}>
            Know exactly where your<br />
            <span className="text-gradient" style={{ fontStyle: 'italic' }}>money goes, every month</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px,2vw,19px)',
            color: 'var(--text2)',
            maxWidth: 560,
            margin: '0 auto 36px',
            lineHeight: 1.75,
          }}>
            SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
              Get Started Free →
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 15, padding: '14px 28px' }}>
              👁 Try Live Demo
            </Link>
          </div>
          <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 14, letterSpacing: '0.02em' }}>
            No credit card required · Free forever plan
          </p>
        </div>

        <div style={{
          marginTop: 64, width: '100%', maxWidth: 880,
          animation: 'fadeUp 1s ease 0.35s both',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: -2,
            background: 'linear-gradient(135deg,rgba(79,70,229,0.5),rgba(129,140,248,0.15))',
            borderRadius: 20, filter: 'blur(2px)', opacity: 0.5,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'relative',
            background: 'var(--bg2)',
            borderRadius: 18,
            border: '1px solid rgba(99,102,241,0.18)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              background: 'var(--bg3)',
              padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              borderBottom: '1px solid var(--border)',
            }}>
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
                <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: '50%', cursor: 'pointer' }} />
              ))}
              <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 10, fontFamily: 'var(--font-mono)' }}>
                SubTracker — Dashboard
              </span>
            </div>
            <div style={{ padding: 'clamp(14px,3vw,24px)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 10, marginBottom: 14,
              }}>
                {[
                  { label: 'MONTHLY', val: '₹2,201', sub: 'This month' },
                  { label: 'YEARLY', val: '₹26,406', sub: 'Projected' },
                  { label: 'ACTIVE SUBS', val: '4', sub: 'Tracked' },
                  { label: 'NEXT PAYMENT', val: '₹649', sub: 'Netflix · Jun 5' },
                ].map((c,i) => (
                  <div key={i} style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 8, color: 'var(--text3)', letterSpacing: 1.2, marginBottom: 6, fontWeight: 700 }}>{c.label}</div>
                    <div style={{ fontSize: 'clamp(15px,2vw,20px)', fontWeight: 800, letterSpacing: '-0.02em' }}>{c.val}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{
                background: 'var(--bg3)', borderRadius: 10,
                padding: '12px 14px', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>SUBSCRIPTIONS</div>
                {[
                  { name: 'Netflix', cat: 'Entertainment', amt: '₹649', color: '#ef4444' },
                  { name: 'Spotify', cat: 'Music & Audio', amt: '₹199', color: '#22c55e' },
                  { name: 'GitHub Pro', cat: 'Productivity', amt: '₹1,000', color: '#6366f1' },
                ].map((s,i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28,
                      background: s.color + '22',
                      borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: s.color,
                    }}>{s.name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{s.cat}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {s.amt}<span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text3)' }}>/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section style={{
        padding: '60px clamp(16px,4vw,60px)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg,var(--bg2),var(--bg))',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32, textAlign: 'center',
        }}>
          {[
            { target: 2000, suffix: '+', label: 'Active Users' },
            { target: 8, prefix: '4.', suffix: '/5', label: 'User Rating' },
            { target: 20000, prefix: '₹', suffix: '', label: 'Avg. Saved/Year' },
            { target: 9, prefix: '99.', suffix: '%', label: 'Uptime' },
          ].map((s,i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="stat-number">
                {s.prefix || ''}<AnimatedCounter target={s.target} />{s.suffix}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ padding: 'clamp(64px,9vw,110px) clamp(16px,4vw,60px)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-tag">Features</div>
            <h2 style={{
              fontSize: 'clamp(26px,4vw,44px)',
              fontWeight: 900, marginBottom: 14,
              letterSpacing: '-0.03em',
            }}>Built for people who lose track</h2>
            <p style={{ color: 'var(--text2)', fontSize: 'clamp(15px,2vw,18px)', maxWidth: 500, margin: '0 auto' }}>
              Everything you need to take control of your subscriptions
            </p>
          </div>
        </Reveal>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {features.map((f,i) => (
            <Reveal key={i} delay={i * 55}>
              <div className="card" style={{ padding: 24, cursor: 'default' }}>
                <div className="feature-icon">{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, marginTop: 14, letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section style={{
        padding: 'clamp(64px,9vw,110px) clamp(16px,4vw,60px)',
        background: 'rgba(79,70,229,0.04)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-tag">How it works</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.03em' }}>
              Set up in under 2 minutes
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 'clamp(15px,2vw,18px)' }}>
              No lengthy onboarding — just sign up and start adding.
            </p>
          </div>
        </Reveal>
        <div style={{
          maxWidth: 800, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, textAlign: 'center',
        }}>
          {[
            { n: 1, icon: '👤', title: 'Sign up free', desc: 'Create an account in seconds. No credit card, no commitment.' },
            { n: 2, icon: '📱', title: 'Add your subs', desc: 'Type them in or pick from popular services instantly.' },
            { n: 3, icon: '✨', title: 'See the full picture', desc: 'Get your dashboard, analytics, and savings tips instantly.' },
          ].map((s,i) => (
            <Reveal key={i} delay={i * 120}>
              <div>
                <div className="step-circle float-anim" style={{ animationDelay: `${i * 0.4}s` }}>
                  {s.icon}
                  <span className="step-num">{s.n}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, letterSpacing: '-0.01em' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75 }}>{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: 'clamp(64px,9vw,110px) clamp(16px,4vw,60px)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag">Pricing</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, marginBottom: 14, letterSpacing: '-0.03em' }}>
              Free to start, cheap to scale
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 'clamp(15px,2vw,18px)', marginBottom: 28 }}>
              Track up to 5 subscriptions forever. Go Pro when you outgrow it.
            </p>
            <div className="billing-toggle">
              {(['monthly','annual'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  style={{
                    background: billing === b ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'transparent',
                    color: billing === b ? '#fff' : 'var(--text2)',
                    boxShadow: billing === b ? '0 2px 10px rgba(79,70,229,0.4)' : 'none',
                  }}
                >
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  {b === 'annual' && (
                    <span style={{
                      background: 'rgba(16,185,129,0.2)', color: '#34d399',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: 6, padding: '1px 7px', fontSize: 10,
                      marginLeft: 6, fontWeight: 700,
                    }}>-29%</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {[
            {
              name: 'Free', price: '₹0', sub: 'Forever free', popular: false,
              features: ['Up to 5 subscriptions', 'Manual import', 'Basic analytics', 'Currency conversion', 'Payment reminders'],
              cta: 'Get Started',
            },
            {
              name: 'Pro ✨',
              price: billing === 'monthly' ? '₹499' : '₹349',
              sub: billing === 'monthly' ? 'per month' : 'per month, billed yearly',
              popular: true,
              features: ['Unlimited subscriptions', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Multi-device sync', 'Export reports'],
              cta: 'Upgrade to Pro',
            },
          ].map((p,i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                background: p.popular ? 'linear-gradient(160deg,rgba(79,70,229,0.18),rgba(99,102,241,0.06))' : 'var(--bg2)',
                border: p.popular ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)',
                borderRadius: 20, padding: 28, position: 'relative',
                boxShadow: p.popular ? '0 0 50px rgba(79,70,229,0.18)' : 'none',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = p.popular ? '0 16px 60px rgba(79,70,229,0.3)' : '0 8px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = p.popular ? '0 0 50px rgba(79,70,229,0.18)' : 'none';
              }}
              >
                {p.popular && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
                    borderRadius: 100, padding: '4px 14px',
                    fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', color: '#fff',
                    boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                  }}>⭐ Most Popular</div>
                )}
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.01em' }}>{p.name}</div>
                <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.03em' }}>{p.price}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>{p.sub}</div>
                {p.features.map((f,j) => (
                  <div key={j} style={{
                    display: 'flex', gap: 9, marginBottom: 11,
                    fontSize: 14, color: 'rgba(232,237,245,0.8)', alignItems: 'flex-start',
                  }}>
                    <span style={{ color: p.popular ? '#818cf8' : 'var(--accent2)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </div>
                ))}
                <Link href="/register" className={p.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ marginTop: 20, width: '100%', padding: '13px' }}>
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <Reveal>
        <section style={{
          padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,60px)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div className="mesh-bg" aria-hidden>
            <div className="mesh-blob" style={{ width: 500, height: 500, background: '#4f46e5', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          </div>
          <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
            <div className="section-tag" style={{ margin: '0 auto 18px' }}>Start today</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,54px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: '-0.03em' }}>
              Your subscriptions aren't<br />going to track themselves
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: 36, fontSize: 'clamp(14px,2vw,17px)', lineHeight: 1.7 }}>
              Takes 2 minutes to set up. Free plan available. You'll wonder why you didn't start sooner.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: '14px 30px' }}>
                Get Started Free →
              </Link>
              <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 15, padding: '14px 30px' }}>
                👁 Try Demo
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(20px,3vw,28px) clamp(16px,4vw,60px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13,
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>SubTracker</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          © 2026 SubTracker. Built with Next.js + Node.js + MongoDB
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy','Contact'].map(l => (
            <a key={l} href="#" className="nav-link" style={{ fontSize: 13 }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}