'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: any) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>{children}</div>
  );
}

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
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
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60,
        background: scrolled ? 'rgba(13,17,23,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.12)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,60px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>SubTracker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hide-mobile">
          <a href="#features" style={{ color: 'rgba(226,232,240,0.65)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
          <a href="#pricing" style={{ color: 'rgba(226,232,240,0.65)', fontSize: 14, textDecoration: 'none' }}>Pricing</a>
          <Link href="/login" style={{ color: 'rgba(226,232,240,0.65)', fontSize: 14, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Get Started →</Link>
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', color: '#e2e8f0', fontSize: 22, cursor: 'pointer' }} className="show-mobile">☰</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(80px,12vw,120px) clamp(16px,4vw,60px) 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(79,70,229,0.15) 0%,transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <div style={{ animation: 'fadeUp 0.8s ease forwards', position: 'relative', maxWidth: 860 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 28, fontSize: 13, color: 'rgba(226,232,240,0.8)' }}>
            <span style={{ width: 7, height: 7, background: '#6366f1', borderRadius: '50%', display: 'inline-block' }} />
            Trusted by <strong style={{ color: '#a5b4fc' }}>&nbsp;2,000+&nbsp;</strong> users tracking their subscriptions
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6.5vw,72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 22, letterSpacing: '-0.02em' }}>
            Know exactly where your<br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>money goes, every month</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,19px)', color: 'rgba(226,232,240,0.6)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '13px 28px' }}>Get Started Free →</Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: '13px 28px' }}>👁 Try Live Demo</Link>
          </div>
          <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: 12, marginTop: 14 }}>No credit card required · Free forever plan</p>
        </div>

        {/* Dashboard Preview */}
        <div style={{ marginTop: 64, width: '100%', maxWidth: 860, animation: 'fadeUp 1s ease 0.3s both', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -1, background: 'linear-gradient(135deg,rgba(79,70,229,0.4),rgba(99,102,241,0.1))', borderRadius: 18, filter: 'blur(1px)', opacity: 0.5 }} />
          <div style={{ position: 'relative', background: '#161b22', borderRadius: 16, border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden' }}>
            <div style={{ background: '#1c2128', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
              {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: '50%' }} />)}
              <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 11, marginLeft: 8 }}>SubTracker — Dashboard</span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'MONTHLY SPENDING', val: '₹2,201', sub: 'This month' },
                  { label: 'YEARLY TOTAL', val: '₹26,406', sub: 'Projected' },
                  { label: 'ACTIVE SUBS', val: '4', sub: 'Tracked' },
                  { label: 'NEXT PAYMENT', val: '₹649', sub: 'Netflix · Jun 5' },
                ].map((c,i) => (
                  <div key={i} style={{ background: '#1c2128', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 8, color: 'rgba(226,232,240,0.4)', letterSpacing: 1, marginBottom: 6 }}>{c.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{c.val}</div>
                    <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.35)', marginTop: 2 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1c2128', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)', marginBottom: 10 }}>SUBSCRIPTIONS</div>
                {[
                  { name: 'Netflix', cat: 'Entertainment', amt: '₹649', color: '#ef4444' },
                  { name: 'Spotify', cat: 'Music & Audio', amt: '₹199', color: '#22c55e' },
                  { name: 'GitHub Pro', cat: 'Productivity', amt: '₹1,000', color: '#6366f1' },
                ].map((s,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(99,102,241,0.08)' : 'none' }}>
                    <div style={{ width: 28, height: 28, background: s.color + '22', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: s.color }}>{s.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)' }}>{s.cat}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.amt}<span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(226,232,240,0.4)' }}>/mo</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px clamp(16px,4vw,60px)', borderTop: '1px solid rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { val: 2000, suffix: '+', label: 'Active Users' },
            { val: 48, prefix: '4.', suffix: '/5', label: 'User Rating' },
            { val: 20000, prefix: '₹', suffix: '', label: 'Avg. Saved/Year' },
            { val: 99, suffix: '.9%', label: 'Uptime' },
          ].map((s,i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#a5b4fc' }}>
                {s.prefix || ''}<AnimatedCounter target={s.val} />{s.suffix}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.45)', marginTop: 6 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,60px)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>FEATURES</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>Built for people who lose track</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 17 }}>Everything you need to take control of your subscriptions</p>
          </div>
        </Reveal>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18 }}>
          {features.map((f,i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="card" style={{ padding: 24, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(79,70,229,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,60px)', background: 'rgba(79,70,229,0.04)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>Set up in under 2 minutes</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 17 }}>No lengthy onboarding — just sign up and start adding your subscriptions.</p>
          </div>
        </Reveal>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { n: 1, icon: '👤', title: 'Sign up free', desc: 'Create an account in seconds. No credit card, no commitment.' },
            { n: 2, icon: '📱', title: 'Add your subs', desc: 'Type them in or pick from popular services instantly.' },
            { n: 3, icon: '✨', title: 'See the full picture', desc: 'Get your dashboard, analytics, and savings tips instantly.' },
          ].map((s,i) => (
            <Reveal key={i} delay={i * 120}>
              <div>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
                  <div style={{ width: 64, height: 64, background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{s.icon}</div>
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{s.n}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.5)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,60px)' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>Free to start, cheap to scale</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 17, marginBottom: 28 }}>Track up to 5 subscriptions forever. Go Pro when you outgrow it.</p>
            <div style={{ display: 'inline-flex', background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: 4 }}>
              {(['monthly','annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: '7px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: billing === b ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'transparent', color: billing === b ? '#fff' : 'rgba(226,232,240,0.5)', transition: 'all 0.2s' }}>
                  {b.charAt(0).toUpperCase() + b.slice(1)} {b === 'annual' && <span style={{ background: '#22c55e', color: '#fff', borderRadius: 6, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>-29%</span>}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {[
            { name: 'Free', price: '₹0', sub: 'Forever free', popular: false, features: ['Up to 5 subscriptions', 'Manual import', 'Basic analytics', 'Currency conversion', 'Payment reminders'], cta: 'Get Started' },
            { name: 'Pro ✨', price: billing === 'monthly' ? '₹499' : '₹349', sub: billing === 'monthly' ? 'per month' : 'per month, billed yearly', popular: true, features: ['Unlimited subscriptions', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Multi-device sync', 'Export reports'], cta: 'Upgrade to Pro' },
          ].map((p,i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: p.popular ? 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(99,102,241,0.08))' : '#161b22', border: p.popular ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.12)', borderRadius: 18, padding: 28, position: 'relative', boxShadow: p.popular ? '0 0 40px rgba(79,70,229,0.2)' : 'none' }}>
                {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>⭐ Most Popular</div>}
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.45)', marginBottom: 22 }}>{p.sub}</div>
                {p.features.map((f,j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 14, color: 'rgba(226,232,240,0.8)', alignItems: 'center' }}>
                    <span style={{ color: '#6366f1', flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
                <Link href="/register" className={p.popular ? 'btn-primary' : 'btn-secondary'} style={{ marginTop: 20, width: '100%', justifyContent: 'center', padding: '12px' }}>{p.cta}</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,60px)', textAlign: 'center' }}>
          <div style={{ maxWidth: 580, margin: '0 auto' }}>
            <div style={{ fontSize: 13, color: '#6366f1', marginBottom: 16 }}>$ Average user saves ₹20,000/year</div>
            <h2 style={{ fontSize: 'clamp(26px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 18, letterSpacing: '-0.02em' }}>
              Your subscriptions aren't<br />going to track themselves
            </h2>
            <p style={{ color: 'rgba(226,232,240,0.5)', marginBottom: 36, fontSize: 16 }}>Takes 2 minutes to set up. Free plan available. You'll wonder why you didn't start sooner.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Get Started Free →</Link>
              <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }}>👁 Try Demo</Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(99,102,241,0.1)', padding: '28px clamp(16px,4vw,60px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>S</div>
          <span style={{ fontWeight: 700 }}>SubTracker</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.3)' }}>© 2026 SubTracker. Built with Next.js + Node.js + MongoDB</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(226,232,240,0.35)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}