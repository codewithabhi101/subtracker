'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const colors = {
  lavender: '#E6E0FA',
  plum: '#A87CA0',
  violet: '#5C2B6D',
  aubergine: '#2A0E3C',
};

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function SpendingGraph() {
  const [animated, setAnimated] = useState(false);
  const { ref, inView } = useInView();
  useEffect(() => { if (inView) setTimeout(() => setAnimated(true), 300); }, [inView]);
  const data = [90, 110, 95, 130, 115, 140, 128];
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const max = 160;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 340 + 30},${120 - (v / max) * 100}`).join(' ');

  return (
    <div ref={ref} style={{
      background: 'rgba(92,43,109,0.3)',
      border: '1px solid rgba(168,124,160,0.3)',
      borderRadius: 16,
      padding: 24,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ color: colors.lavender, fontSize: 13, fontWeight: 600 }}>MONTHLY SPENDING</span>
        <span style={{ color: '#4ade80', fontSize: 12 }}>↘ -8% vs last month</span>
      </div>
      <svg width="100%" viewBox="0 0 400 140" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.plum} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.plum} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.violet} />
            <stop offset="100%" stopColor={colors.lavender} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((v, i) => (
          <line key={i} x1="30" y1={120 - v * 100} x2="370" y2={120 - v * 100}
            stroke="rgba(168,124,160,0.15)" strokeWidth="1" />
        ))}
        <polyline points={`30,120 ${points} 370,120`} fill="url(#graphGrad)" stroke="none" />
        <polyline points={points} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: animated ? 0 : 600,
            transition: 'stroke-dashoffset 2s ease',
          }} />
        {data.map((v, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * 340 + 30} cy={120 - (v / max) * 100}
            r="4" fill={colors.plum}
            style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease ${i * 200 + 1500}ms` }} />
        ))}
        {months.map((m, i) => (
          <text key={i} x={(i / (data.length - 1)) * 340 + 30} y={138}
            textAnchor="middle" fill="rgba(230,224,250,0.5)" fontSize="10">{m}</text>
        ))}
        <text x="370" y={120 - (128 / max) * 100 - 8} textAnchor="end"
          fill={colors.lavender} fontSize="13" fontWeight="700"
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.5s ease 2s' }}>₹2,201</text>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const features = [
    { icon: '₹', title: 'Spending overview', desc: 'See your total monthly and yearly cost at a glance — updated as you add or remove subs.' },
    { icon: '🔔', title: 'Payment reminders', desc: 'Get notified before charges hit so you can cancel or pause in time.' },
    { icon: '📊', title: 'Category breakdown', desc: 'Find out if you\'re spending more on streaming than you thought.' },
    { icon: '📈', title: 'Trend tracking', desc: 'Month-over-month charts show whether your bill is creeping up.' },
    { icon: '🔒', title: 'Private by default', desc: 'Your data stays encrypted. We don\'t sell it, share it, or look at it.' },
    { icon: '⚡', title: 'Fast to set up', desc: 'Add a subscription in a few taps. No spreadsheet migration required.' },
    { icon: '✨', title: 'AI suggestions', desc: 'Spots duplicates, cheaper plans, and subscriptions you haven\'t used in months.' },
    { icon: '📧', title: 'Smart insights', desc: 'Get weekly spending reports and personalized saving recommendations.' },
  ];

  const steps = [
    { num: 1, icon: '👤', title: 'Sign up free', desc: 'Create an account in seconds. No credit card, no commitment.' },
    { num: 2, icon: '📱', title: 'Add your subs', desc: 'Type them in or pick from popular services instantly.' },
    { num: 3, icon: '✨', title: 'See the full picture', desc: 'Get your dashboard, analytics, and savings tips instantly.' },
  ];

  return (
    <div style={{ background: colors.aubergine, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(42,14,60,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(168,124,160,0.2)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: colors.lavender }}>SubTracker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: 'rgba(230,224,250,0.7)', fontSize: 14, textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'rgba(230,224,250,0.7)', fontSize: 14, textDecoration: 'none' }}>Pricing</a>
          <Link href="/login" style={{ color: 'rgba(230,224,250,0.7)', fontSize: 14, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{
            background: `linear-gradient(135deg,${colors.violet},${colors.plum})`,
            color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            boxShadow: `0 4px 20px rgba(92,43,109,0.4)`,
          }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 30%, rgba(92,43,109,0.4) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ opacity: 1, transform: 'translateY(0)', transition: 'all 1s ease', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(92,43,109,0.4)',
            border: '1px solid rgba(168,124,160,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: colors.lavender,
          }}>
            <span style={{ width: 8, height: 8, background: colors.plum, borderRadius: '50%', display: 'inline-block' }}></span>
            Trusted by <strong style={{ color: colors.lavender }}>&nbsp;2,000+&nbsp;</strong> users tracking their subscriptions
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
            Know exactly where your<br />
            <span style={{ background: `linear-gradient(135deg,${colors.plum},${colors.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              money goes, every month
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(230,224,250,0.7)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{
              background: `linear-gradient(135deg,${colors.violet},${colors.plum})`,
              color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: `0 8px 32px rgba(92,43,109,0.5)`,
              transition: 'transform 0.2s ease',
            }}>Get Started Free →</Link>
            <Link href="/dashboard" style={{
              background: 'rgba(92,43,109,0.2)', color: colors.lavender, padding: '14px 32px',
              borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none',
              border: `1px solid rgba(168,124,160,0.3)`, display: 'flex', alignItems: 'center', gap: 8,
            }}>👁 Try Live Demo</Link>
          </div>
          <p style={{ color: 'rgba(230,224,250,0.4)', fontSize: 12, marginTop: 16 }}>No credit card required · Free forever plan</p>
        </div>

        {/* Hero Graph Preview */}
        <div style={{ marginTop: 60, width: '100%', maxWidth: 800, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -1, background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: 20, filter: 'blur(1px)', opacity: 0.3 }} />
          <div style={{ position: 'relative', background: 'rgba(42,14,60,0.9)', borderRadius: 20, border: '1px solid rgba(168,124,160,0.2)', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(92,43,109,0.3)', padding: '8px 16px', display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <div key={i} style={{ width: 12, height: 12, background: c, borderRadius: '50%' }} />)}
              <span style={{ color: 'rgba(230,224,250,0.4)', fontSize: 12, marginLeft: 8 }}>SubTracker Dashboard</span>
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 8 }}>
              {[
                { label: 'MONTHLY SPENDING', value: '₹2,201', sub: 'This month' },
                { label: 'YEARLY TOTAL', value: '₹26,406', sub: 'Projected annual' },
                { label: 'ACTIVE SUBS', value: '4', sub: 'Currently tracked' },
                { label: 'NEXT PAYMENT', value: '₹649', sub: 'Netflix · Jun 5' },
              ].map((card, i) => (
                <div key={i} style={{ background: 'rgba(92,43,109,0.2)', border: '1px solid rgba(168,124,160,0.15)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, color: 'rgba(230,224,250,0.5)', marginBottom: 4, letterSpacing: 1 }}>{card.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.lavender }}>{card.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(230,224,250,0.4)', marginTop: 2 }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <AnimatedSection>
        <section style={{ padding: '40px 40px', borderTop: '1px solid rgba(168,124,160,0.1)', borderBottom: '1px solid rgba(168,124,160,0.1)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { value: '2,000+', label: 'Active Users' },
              { value: '4.8/5', label: 'User Rating' },
              { value: '₹20,000', label: 'Avg. Saved/Year' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 800, color: colors.lavender }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(230,224,250,0.5)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Analytics Section */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <AnimatedSection delay={0}>
            <div style={{ fontSize: 12, color: colors.plum, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>ANALYTICS</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>Your spending,<br />visualized</h2>
            <p style={{ color: 'rgba(230,224,250,0.6)', lineHeight: 1.8, marginBottom: 32 }}>
              See exactly how much goes to entertainment vs. productivity vs. everything else. Spot trends before they become problems.
            </p>
            {['Monthly comparisons', 'Category splits', 'Health score'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(92,43,109,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
                <span style={{ color: colors.lavender, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <SpendingGraph />
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 40px' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Built for people who lose track</h2>
            <p style={{ color: 'rgba(230,224,250,0.6)', fontSize: 18 }}>Everything you need to take control of your subscriptions</p>
          </div>
        </AnimatedSection>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div style={{
                background: 'rgba(92,43,109,0.15)', border: '1px solid rgba(168,124,160,0.15)',
                borderRadius: 16, padding: 24, height: '100%',
                transition: 'all 0.3s ease', cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(92,43,109,0.35)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,124,160,0.4)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(92,43,109,0.3)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(92,43,109,0.15)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,124,160,0.15)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}>
                <div style={{ fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: colors.lavender }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(230,224,250,0.55)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 40px', background: 'rgba(92,43,109,0.1)' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Set up in under 2 minutes</h2>
            <p style={{ color: 'rgba(230,224,250,0.6)', fontSize: 18 }}>No lengthy onboarding — just sign up and start adding your subscriptions.</p>
          </div>
        </AnimatedSection>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, textAlign: 'center' }}>
          {steps.map((s, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, background: 'rgba(92,43,109,0.3)', border: '1px solid rgba(168,124,160,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{s.icon}</div>
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 22, height: 22, background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{s.num}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: colors.lavender }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(230,224,250,0.55)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 40px' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Free to start, cheap to scale</h2>
            <p style={{ color: 'rgba(230,224,250,0.6)', fontSize: 18 }}>Track up to 5 subscriptions forever. Go Pro when you outgrow it.</p>
          </div>
        </AnimatedSection>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              name: 'Free', price: '₹0', sub: 'Forever free', popular: false,
              features: ['Up to 5 subscriptions', 'Manual import', 'Basic analytics', 'Payment reminders'],
              cta: 'Get Started',
            },
            {
              name: 'Pro ✨', price: '₹499', sub: 'per month', popular: true,
              features: ['Unlimited subscriptions', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Export reports'],
              cta: 'Upgrade to Pro',
            },
          ].map((plan, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div style={{
                background: plan.popular ? `linear-gradient(135deg,rgba(92,43,109,0.6),rgba(168,124,160,0.2))` : 'rgba(92,43,109,0.15)',
                border: plan.popular ? `1px solid ${colors.plum}` : '1px solid rgba(168,124,160,0.2)',
                borderRadius: 20, padding: 32, position: 'relative',
                boxShadow: plan.popular ? `0 0 40px rgba(92,43,109,0.4)` : 'none',
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: 100, padding: '4px 16px', fontSize: 11, fontWeight: 700 }}>⭐ Most Popular</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.lavender, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{plan.price}</div>
                <div style={{ fontSize: 13, color: 'rgba(230,224,250,0.5)', marginBottom: 24 }}>{plan.sub}</div>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 14, color: 'rgba(230,224,250,0.8)' }}>
                    <span style={{ color: colors.plum }}>✓</span> {f}
                  </div>
                ))}
                <Link href="/register" style={{
                  display: 'block', textAlign: 'center', marginTop: 24,
                  background: plan.popular ? `linear-gradient(135deg,${colors.violet},${colors.plum})` : 'rgba(92,43,109,0.3)',
                  color: '#fff', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', border: plan.popular ? 'none' : '1px solid rgba(168,124,160,0.3)',
                  boxShadow: plan.popular ? `0 4px 20px rgba(92,43,109,0.4)` : 'none',
                }}>{plan.cta}</Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <section style={{ padding: '100px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 13, color: colors.plum, marginBottom: 16 }}>$ Average user saves ₹20,000/year</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
              Your subscriptions aren't<br />going to track themselves
            </h2>
            <p style={{ color: 'rgba(230,224,250,0.6)', marginBottom: 40 }}>Takes 2 minutes to set up. Free plan available.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <Link href="/register" style={{
                background: `linear-gradient(135deg,${colors.violet},${colors.plum})`,
                color: '#fff', padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700,
                textDecoration: 'none', boxShadow: `0 8px 32px rgba(92,43,109,0.5)`,
              }}>Get Started Free →</Link>
              <Link href="/dashboard" style={{
                background: 'rgba(92,43,109,0.2)', color: colors.lavender, padding: '16px 40px',
                borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none',
                border: '1px solid rgba(168,124,160,0.3)',
              }}>👁 Try Demo</Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(168,124,160,0.1)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${colors.violet},${colors.plum})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>S</div>
          <span style={{ fontWeight: 700, color: colors.lavender }}>SubTracker</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(230,224,250,0.3)' }}>© 2026 SubTracker. Built with Next.js + Node.js + MongoDB</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(230,224,250,0.35)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}