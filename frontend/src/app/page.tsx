'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Hook for scroll-triggered animations
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// Animated counter
function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// Animated line chart SVG
function SpendChart({ inView }: { inView: boolean }) {
  const points = [
    { x: 60, y: 200 }, { x: 160, y: 160 }, { x: 250, y: 150 },
    { x: 340, y: 130 }, { x: 430, y: 120 }, { x: 520, y: 90 }, { x: 600, y: 60 },
  ];
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `C${points[i-1].x+40},${points[i-1].y} ${p.x-40},${p.y} ${p.x},${p.y}`)).join(' ');
  const areaD = pathD + ` L${points[points.length-1].x},260 L${points[0].x},260 Z`;
  return (
    <svg viewBox="0 0 660 280" style={{ width: '100%', height: 200 }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="chartClip">
          <rect x="0" y="0" width="660" height="280"
            style={{ transition: inView ? 'width 2s ease' : 'none' }}
          />
        </clipPath>
      </defs>
      {/* Grid lines */}
      {[60,110,160,210].map(y => (
        <line key={y} x1="40" y1={y} x2="640" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      {/* Area fill */}
      <path d={areaD} fill="url(#lineGrad)" style={{
        clipPath: 'url(#chartClip)',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.5s ease 1s',
      }}/>
      {/* Line */}
      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"
        style={{
          strokeDasharray: 1200,
          strokeDashoffset: inView ? 0 : 1200,
          transition: inView ? 'stroke-dashoffset 2s ease' : 'none',
        }}
      />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#fff" strokeWidth="2"
          style={{ opacity: inView ? 1 : 0, transition: `opacity 0.3s ease ${0.3 * i + 1.5}s` }}
        />
      ))}
      {/* Price label */}
      <rect x="520" y="40" width="90" height="28" rx="6" fill="#1a2236" stroke="rgba(255,255,255,0.1)"/>
      <text x="565" y="59" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle"
        style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.3s ease 2.2s' }}>₹8,491</text>
      {/* X axis labels */}
      {['Oct','Nov','Dec','Jan','Feb','Mar'].map((m, i) => (
        <text key={m} x={80 + i * 108} y="275" fill="rgba(255,255,255,0.3)" fontSize="11" textAnchor="middle">{m}</text>
      ))}
    </svg>
  );
}

// Donut chart
function DonutChart({ inView }: { inView: boolean }) {
  const segments = [
    { color: '#e50914', pct: 45 }, { color: '#8b5cf6', pct: 25 },
    { color: '#1db954', pct: 15 }, { color: '#22d3ee', pct: 10 }, { color: '#f59e0b', pct: 5 },
  ];
  const r = 50, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  let cumulative = 0;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18"/>
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const offset = circ - cumulative * circ / 100;
        cumulative += s.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="18"
            strokeDasharray={`${inView ? dash : 0} ${circ}`}
            strokeDashoffset={offset}
            style={{ transition: inView ? `stroke-dasharray 1s ease ${i * 0.15 + 0.3}s` : 'none', transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      <text x={cx} y={cy-6} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">8</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">subs</text>
    </svg>
  );
}

// Health score ring
function HealthRing({ inView }: { inView: boolean }) {
  const r = 50, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  const score = 82;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22d3ee" strokeWidth="18"
        strokeDasharray={`${inView ? (score/100)*circ : 0} ${circ}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: inView ? 'stroke-dasharray 1.5s ease 0.3s' : 'none', transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
      />
      <text x={cx} y={cy-6} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">{inView ? score : 0}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">/ 100</text>
    </svg>
  );
}

const FEATURES = [
  { icon: '💰', title: 'Spending overview', desc: 'See your total monthly and yearly cost at a glance — updated as you add or remove subs.' },
  { icon: '🔔', title: 'Payment reminders', desc: 'Get notified before charges hit so you can cancel or pause in time.' },
  { icon: '🥧', title: 'Category breakdown', desc: 'Find out if you\'re spending more on streaming than you thought.' },
  { icon: '📈', title: 'Trend tracking', desc: 'Month-over-month charts show whether your bill is creeping up.' },
  { icon: '🔒', title: 'Private by default', desc: 'Your data stays encrypted. We don\'t sell it, share it, or look at it.' },
  { icon: '⚡', title: 'Fast to set up', desc: 'Add a subscription in a few taps. No spreadsheet migration required.' },
  { icon: '✨', title: 'AI suggestions', desc: 'Spots duplicates, cheaper plans, and subscriptions you haven\'t used in months.' },
  { icon: '📧', title: 'Email & bank import', desc: 'Connect Gmail or upload a statement — we\'ll find the recurring charges for you.' },
];

const SUBS = [
  { name: 'Netflix', color: '#e50914', due: 'Due Mar 5', amount: '₹649', period: '/mo' },
  { name: 'Spotify', color: '#1db954', due: 'Due Mar 12', amount: '₹119', period: '/mo' },
  { name: 'Notion', color: '#6b7280', due: 'Due Mar 18', amount: '₹800', period: '/mo' },
  { name: 'iCloud+', color: '#3b82f6', due: 'Due Mar 20', amount: '₹75', period: '/mo' },
];

const CATEGORIES = [
  { name: 'Entertainment', color: '#e50914', width: 72, amount: '₹3,847' },
  { name: 'Productivity', color: '#8b5cf6', width: 52, amount: '₹2,112' },
  { name: 'Music', color: '#1db954', width: 38, amount: '₹1,264' },
  { name: 'Cloud', color: '#22d3ee', width: 28, amount: '₹845' },
  { name: 'Gaming', color: '#f59e0b', width: 18, amount: '₹423' },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll sections
  const heroSection = useInView(0.1);
  const dashSection = useInView(0.1);
  const statsSection = useInView(0.2);
  const stepsSection = useInView(0.15);
  const featSection = useInView(0.1);
  const analyticsSection = useInView(0.2);
  const aiSection = useInView(0.15);
  const pricingSection = useInView(0.15);
  const ctaSection = useInView(0.2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#080d1a', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #fff; border: none; border-radius: 100px;
          padding: 14px 28px; font-size: 15px; font-weight: 600;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.25s; box-shadow: 0 0 30px rgba(99,102,241,0.4);
          font-family: inherit; text-decoration: none;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 0 50px rgba(99,102,241,0.65); }

        .btn-ghost {
          background: rgba(255,255,255,0.07); color: #fff;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 100px;
          padding: 14px 28px; font-size: 15px; font-weight: 500;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.25s; font-family: inherit; text-decoration: none;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.13); }

        .feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
          cursor: default;
        }
        .feature-card:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.35);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15);
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px;
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }

        .glow-text {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .slide-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .slide-up.visible { opacity: 1; transform: translateY(0); }

        .slide-up-delay-1 { transition-delay: 0.1s; }
        .slide-up-delay-2 { transition-delay: 0.2s; }
        .slide-up-delay-3 { transition-delay: 0.3s; }
        .slide-up-delay-4 { transition-delay: 0.4s; }
        .slide-up-delay-5 { transition-delay: 0.5s; }
        .slide-up-delay-6 { transition-delay: 0.6s; }
        .slide-up-delay-7 { transition-delay: 0.7s; }
        .slide-up-delay-8 { transition-delay: 0.8s; }

        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }

        .divider {
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.2); font-size: 12px;
          letter-spacing: 1px; font-weight: 600;
        }
        .divider::before,.divider::after {
          content:''; flex:1; height:1px; background:rgba(255,255,255,0.08);
        }

        .bar-fill { width: 0; transition: width 1.2s cubic-bezier(0.23,1,0.32,1); }

        section { scroll-margin-top: 80px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,13,26,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>S</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>SubTracker</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Features','Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.55)')}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Sign In</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Get Started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ marginBottom: 24, opacity: 0, animation: 'fadeUp 0.7s ease 0.1s forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ width: 7, height: 7, background: '#6366f1', borderRadius: '50%', display: 'inline-block' }} className="pulse" />
            Trusted by <strong style={{ color: '#fff' }}>2,000+</strong> users tracking their subscriptions
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(40px,7vw,78px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1.1, maxWidth: 800, marginBottom: 24, opacity: 0, animation: 'fadeUp 0.7s ease 0.2s forwards' }}>
          Know exactly where your<br />money goes,{' '}
          <span className="glow-text">every month</span>
        </h1>

        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.75, marginBottom: 40, opacity: 0, animation: 'fadeUp 0.7s ease 0.3s forwards' }}>
          SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16, opacity: 0, animation: 'fadeUp 0.7s ease 0.4s forwards' }}>
          <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>Get Started Free →</Link>
          <Link href="/login" className="btn-ghost" style={{ fontSize: 16, padding: '16px 32px' }}>👁 Try Live Demo</Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, opacity: 0, animation: 'fadeUp 0.7s ease 0.5s forwards' }}>○ No credit card required · Free forever plan</p>

        {/* Dashboard preview */}
        <div ref={dashSection.ref} style={{ marginTop: 64, width: '100%', maxWidth: 900, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', opacity: dashSection.inView ? 1 : 0, transform: dashSection.inView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)', transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1) 0.3s' }}>
          <div style={{ background: '#1a2236', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>🔒 subtracker-murex.vercel.app/dashboard</div>
            </div>
          </div>
          <div style={{ background: '#0f1729', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Good morning, Alex</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>8 active subscriptions · ₹8,491/mo</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'MONTHLY SPENDING', value: '₹8,491', sub: 'This month -8%' },
                { label: 'YEARLY TOTAL', value: '₹1,01,892', sub: 'Projected annual +2%' },
                { label: 'ACTIVE SUBS', value: '8', sub: 'Currently tracked' },
                { label: 'NEXT PAYMENT', value: '₹649', sub: 'Netflix · Mar 5' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTIONS</div>
                {SUBS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < SUBS.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{s.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.due}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.amount}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.period}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12 }}>BY CATEGORY</div>
                {CATEGORIES.map((c, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{c.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{c.amount}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${c.width}%`, background: c.color, borderRadius: 100 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }`}</style>

      {/* STATS */}
      <div ref={statsSection.ref} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px', display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)' }}>
        {[
          { value: 2000, suffix: '+', label: 'Active Users' },
          { value: 48, prefix: '', suffix: '/5', label: 'User Rating', display: '4.8/5' },
          { value: 20000, prefix: '₹', suffix: '', label: 'Avg. Saved/Year' },
        ].map((s, i) => (
          <div key={i} className={`slide-up slide-up-delay-${i+1} ${statsSection.inView ? 'visible' : ''}`} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>
              {s.display || <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* STEPS */}
      <section id="features" ref={stepsSection.ref} style={{ padding: '100px 40px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 className={`slide-up ${stepsSection.inView ? 'visible' : ''}`} style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Set up in under 2 minutes</h2>
        <p className={`slide-up slide-up-delay-1 ${stepsSection.inView ? 'visible' : ''}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 64 }}>No lengthy onboarding — just sign up and start adding your subscriptions.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {[
            { num: '1', icon: '👤', title: 'Sign up free', desc: 'Create an account in seconds. No credit card, no commitment.' },
            { num: '2', icon: '📋', title: 'Add your subs', desc: 'Type them in, connect Gmail, or upload a bank statement.' },
            { num: '3', icon: '✨', title: 'See the full picture', desc: 'Get your dashboard, analytics, and AI-powered savings tips instantly.' },
          ].map((s, i) => (
            <div key={i} className={`slide-up slide-up-delay-${i+2} ${stepsSection.inView ? 'visible' : ''}`} style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>{s.icon}</div>
                <div style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#818cf8)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.num}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featSection.ref} style={{ padding: '60px 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className={`slide-up ${featSection.inView ? 'visible' : ''}`} style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Built for people who lose track</h2>
          <p className={`slide-up slide-up-delay-1 ${featSection.inView ? 'visible' : ''}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17 }}>Whether you have 3 subscriptions or 30, these tools keep everything in one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className={`feature-card slide-up slide-up-delay-${(i%4)+1} ${featSection.inView ? 'visible' : ''}`}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <section ref={analyticsSection.ref} style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div className={`slide-up ${analyticsSection.inView ? 'visible' : ''}`} style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>Analytics</div>
          <h2 className={`slide-up slide-up-delay-1 ${analyticsSection.inView ? 'visible' : ''}`} style={{ fontSize: 38, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 20, lineHeight: 1.15 }}>Your spending,<br/>visualized</h2>
          <p className={`slide-up slide-up-delay-2 ${analyticsSection.inView ? 'visible' : ''}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
            See exactly how much goes to entertainment vs. productivity vs. everything else. Spot trends before they become problems.
          </p>
          {[
            { icon: '📊', title: 'Monthly comparisons', desc: 'Track how your total bill changes month over month — no spreadsheets needed.' },
            { icon: '🥧', title: 'Category splits', desc: 'Instantly see which categories eat the most of your budget.' },
            { icon: '❤️', title: 'Health score', desc: 'One number that tells you if your subscriptions are under control.' },
          ].map((item, i) => (
            <div key={i} className={`slide-up slide-up-delay-${i+3} ${analyticsSection.inView ? 'visible' : ''}`} style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
              <div style={{ fontSize: 20, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart panel */}
        <div className={`slide-up slide-up-delay-2 ${analyticsSection.inView ? 'visible' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          {/* Line chart */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>MONTHLY SPENDING</div>
              <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>↘ -8% vs last month</div>
            </div>
            <SpendChart inView={analyticsSection.inView} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
            {/* Donut */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12 }}>CATEGORIES</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DonutChart inView={analyticsSection.inView} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                {[{c:'#e50914',l:'Entertainment'},{c:'#8b5cf6',l:'Productivity'},{c:'#1db954',l:'Music'}].map(x=>(
                  <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: x.c }} />{x.l}
                  </div>
                ))}
              </div>
            </div>
            {/* Health */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 12 }}>HEALTH SCORE</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HealthRing inView={analyticsSection.inView} />
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#10b981', marginTop: 10 }}>
                ✓ Good
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI INSIGHTS */}
      <section ref={aiSection.ref} style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div className={`slide-up ${aiSection.inView ? 'visible' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>✨ AI INSIGHTS</div>
            <div style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: 12, padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>3 new</div>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '18px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>POTENTIAL SAVINGS FOUND</div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>₹2,299<span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mo</span></div>
          </div>
          {[
            { icon: '⚠️', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', title: 'Potential Duplicate Detected', save: 'Save ₹729/mo', desc: 'Spotify and YouTube Music serve a similar purpose.', tags: ['Spotify','YouTube Music'] },
            { icon: '💡', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', title: 'Switch to Annual Billing', save: 'Save ₹1,570/yr', desc: 'Switching Notion to annual billing would save you ₹1,570/yr.', tags: [] },
            { icon: '✅', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', title: 'Great Spending Habits', save: '', desc: 'Your entertainment spending is 12% below average. Keep it up!', tags: [] },
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.icon} {item.title}</div>
                {item.save && <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>{item.save}</div>}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: item.tags.length ? 8 : 0 }}>{item.desc}</div>
              {item.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {item.tags.map(t => <span key={t} style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 100 }}>{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className={`slide-up ${aiSection.inView ? 'visible' : ''}`} style={{ fontSize: 13, color: '#818cf8', fontWeight: 600, letterSpacing: 1, marginBottom: 16 }}>AI INSIGHTS</div>
          <h2 className={`slide-up slide-up-delay-1 ${aiSection.inView ? 'visible' : ''}`} style={{ fontSize: 40, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 20, lineHeight: 1.1 }}>It catches what you miss</h2>
          <p className={`slide-up slide-up-delay-2 ${aiSection.inView ? 'visible' : ''}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            Paying for Spotify and YouTube Music? Still on a monthly plan when annual is cheaper? SubTracker flags it automatically.
          </p>
          {[
            { icon: '🔁', title: 'Duplicate detection', desc: 'Flags services that overlap so you can drop the one you use less.' },
            { icon: '📧', title: 'Email scanning', desc: 'Connects to Gmail to find subscription receipts you forgot about.' },
            { icon: '📄', title: 'Statement import', desc: 'Upload a bank or card statement — we\'ll pull out every recurring charge.' },
          ].map((item, i) => (
            <div key={i} className={`slide-up slide-up-delay-${i+3} ${aiSection.inView ? 'visible' : ''}`} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" ref={pricingSection.ref} style={{ padding: '100px 40px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 className={`slide-up ${pricingSection.inView ? 'visible' : ''}`} style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>Simple pricing</h2>
        <p className={`slide-up slide-up-delay-1 ${pricingSection.inView ? 'visible' : ''}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 36 }}>Track up to 5 subscriptions forever. Go Pro when you outgrow it.</p>
        <div className={`slide-up slide-up-delay-2 ${pricingSection.inView ? 'visible' : ''}`} style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: 4, marginBottom: 48, gap: 4 }}>
          {['Monthly','Annual'].map(t => (
            <button key={t} onClick={() => setAnnual(t==='Annual')} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, transition: 'all 0.2s', background: (annual?t==='Annual':t==='Monthly') ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'transparent', color: (annual?t==='Annual':t==='Monthly') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              {t}{t==='Annual'&&<span style={{ background:'rgba(16,185,129,0.3)',color:'#10b981',padding:'2px 6px',borderRadius:100,fontSize:11,marginLeft:4 }}>-29%</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className={`slide-up slide-up-delay-3 ${pricingSection.inView ? 'visible' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Free</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Get started with basic tracking</div>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Forever free</div>
            {['Up to 5 subscriptions','Manual import (CSV/PDF)','Basic analytics','Currency conversion','Payment reminders'].map(f=>(
              <div key={f} style={{ display:'flex',gap:10,marginBottom:12,fontSize:14,color:'rgba(255,255,255,0.6)' }}><span style={{color:'#6366f1'}}>✓</span>{f}</div>
            ))}
            <Link href="/register" style={{ display:'block',textAlign:'center',marginTop:32,padding:'14px',borderRadius:12,background:'rgba(255,255,255,0.06)',color:'#fff',textDecoration:'none',fontWeight:600,fontSize:15,border:'1px solid rgba(255,255,255,0.1)' }}>Get Started</Link>
          </div>
          <div className={`slide-up slide-up-delay-4 ${pricingSection.inView ? 'visible' : ''}`} style={{ background:'rgba(99,102,241,0.08)',border:'2px solid rgba(99,102,241,0.4)',borderRadius:20,padding:32,textAlign:'left',position:'relative' }}>
            <div style={{ position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#4f46e5,#818cf8)',padding:'6px 16px',borderRadius:100,fontSize:13,fontWeight:700,whiteSpace:'nowrap' }}>👑 Most Popular</div>
            <div style={{ fontSize:22,fontWeight:800,marginBottom:8 }}>Pro ✨</div>
            <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:24 }}>For people serious about their finances</div>
            <div style={{ fontSize:52,fontWeight:800,fontFamily:'Syne, sans-serif',color:'#818cf8',marginBottom:4,transition:'all 0.3s' }}>{annual?'₹349':'₹499'}</div>
            <div style={{ fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:32 }}>{annual?'per month · ₹4,188/yr (save 29%)':'per month'}</div>
            {['Unlimited subscriptions','AI-powered insights','Advanced analytics','Priority support','Multi-device sync','Export reports'].map(f=>(
              <div key={f} style={{ display:'flex',gap:10,marginBottom:12,fontSize:14 }}><span style={{color:'#10b981'}}>✓</span>{f}</div>
            ))}
            <Link href="/register" className="btn-primary" style={{ display:'block',textAlign:'center',marginTop:32,padding:'14px',borderRadius:12,textDecoration:'none',fontSize:15 }}>Upgrade to Pro</Link>
            <div style={{ textAlign:'center',marginTop:12,fontSize:12,color:'rgba(255,255,255,0.3)' }}>Join 500+ Pro users</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaSection.ref} style={{ padding:'100px 40px',textAlign:'center',position:'relative' }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:500,height:300,background:'radial-gradient(ellipse,rgba(99,102,241,0.12) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div className={`slide-up ${ctaSection.inView ? 'visible' : ''}`} style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:100,padding:'8px 16px',fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:24 }}>
          💰 Average user saves <strong style={{color:'#818cf8'}}>₹20,000/year</strong>
        </div>
        <h2 className={`slide-up slide-up-delay-1 ${ctaSection.inView ? 'visible' : ''}`} style={{ fontSize:'clamp(32px,5vw,56px)',fontWeight:800,fontFamily:'Syne, sans-serif',marginBottom:20,lineHeight:1.1 }}>
          Your subscriptions aren't<br/>going to track themselves
        </h2>
        <p className={`slide-up slide-up-delay-2 ${ctaSection.inView ? 'visible' : ''}`} style={{ color:'rgba(255,255,255,0.5)',fontSize:17,marginBottom:40,maxWidth:480,margin:'0 auto 40px' }}>
          Takes 2 minutes to set up. Free plan available. You'll wonder why you didn't start sooner.
        </p>
        <div className={`slide-up slide-up-delay-3 ${ctaSection.inView ? 'visible' : ''}`} style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ textDecoration:'none',fontSize:16,padding:'16px 32px' }}>Get Started Free →</Link>
          <Link href="/login" className="btn-ghost" style={{ textDecoration:'none',fontSize:16,padding:'16px 32px' }}>👁 Try Demo</Link>
        </div>
        <p className={`slide-up slide-up-delay-4 ${ctaSection.inView ? 'visible' : ''}`} style={{ color:'rgba(255,255,255,0.3)',fontSize:13,marginTop:16 }}>○ No credit card required · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)',padding:'32px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800 }}>S</div>
          <span style={{ fontWeight:700 }}>SubTracker</span>
        </div>
        <div style={{ fontSize:13,color:'rgba(255,255,255,0.3)' }}>© 2026 SubTracker. Built with Next.js + Node.js + MongoDB</div>
        <div style={{ display:'flex',gap:24 }}>
          {['Privacy','Terms','Contact'].map(l=>(
            <a key={l} href="#" style={{ fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
