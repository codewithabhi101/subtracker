'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NAV_LINKS = ['Features', 'Pricing'];

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
  { name: 'Entertainment', color: '#e50914', width: '72%', amount: '₹3,847' },
  { name: 'Productivity', color: '#8b5cf6', width: '52%', amount: '₹2,112' },
  { name: 'Music', color: '#1db954', width: '38%', amount: '₹1,264' },
  { name: 'Cloud', color: '#22d3ee', width: '28%', amount: '₹845' },
  { name: 'Gaming', color: '#f59e0b', width: '18%', amount: '₹423' },
];

const STATS = [
  { value: '2,000+', label: 'Active Users' },
  { value: '4.8/5', label: 'User Rating' },
  { value: '₹20K', label: 'Avg. Saved/Year' },
  { value: 'Featured', label: 'Product Hunt' },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

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
          transition: all 0.2s; box-shadow: 0 0 30px rgba(99,102,241,0.4);
          font-family: inherit;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(99,102,241,0.6); }
        .btn-ghost {
          background: rgba(255,255,255,0.07); color: #fff; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px; padding: 14px 28px; font-size: 15px; font-weight: 500;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.2s; font-family: inherit;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); }
        .card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px; transition: all 0.3s;
        }
        .card:hover { background: rgba(255,255,255,0.07); border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }
        .fade-in { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .stat-bar { height: 6px; border-radius: 100px; transition: width 1.5s ease; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%; animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .glow-text { background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
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
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, fontFamily: 'Syne, sans-serif',
          }}>S</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>SubTracker</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Sign In</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14, textDecoration: 'none' }}>
            Get Started →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 60px', position: 'relative' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div className="fade-in" style={{ animationDelay: '0.1s', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            <span style={{ width: 7, height: 7, background: '#6366f1', borderRadius: '50%', display: 'inline-block' }} className="pulse" />
            Trusted by <strong style={{ color: '#fff' }}>2,000+</strong> users tracking their subscriptions
          </div>
        </div>

        <h1 className="fade-in" style={{ animationDelay: '0.2s', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1.1, maxWidth: 800, marginBottom: 24 }}>
          Know exactly where your money goes,{' '}
          <span className="glow-text">every month</span>
        </h1>

        <p className="fade-in" style={{ animationDelay: '0.3s', fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
          SubTracker pulls together all your recurring charges, shows you what you're actually spending, and spots the ones you forgot about.
        </p>

        <div className="fade-in" style={{ animationDelay: '0.4s', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '16px 32px' }}>
            Get Started Free →
          </Link>
          <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 16, padding: '16px 32px' }}>
            👁 Try Live Demo
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>○ No credit card required · Free forever plan</p>

        {/* Dashboard Preview */}
        <div className="fade-in" style={{ animationDelay: '0.6s', marginTop: 64, width: '100%', maxWidth: 900, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          {/* Browser chrome */}
          <div style={{ background: '#1a2236', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                🔒 subtracker-murex.vercel.app/dashboard
              </div>
            </div>
          </div>
          {/* Dashboard content */}
          <div style={{ background: '#0f1729', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Good morning, Alex</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>8 active subscriptions · ₹8,491/mo</div>
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔔</div>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'MONTHLY SPENDING', value: '₹8,491', sub: 'This month -8%', icon: '💵' },
                { label: 'YEARLY TOTAL', value: '₹1,01,892', sub: 'Projected annual +2%', icon: '📊' },
                { label: 'ACTIVE SUBS', value: '8', sub: 'Currently tracked', icon: '💳' },
                { label: 'NEXT PAYMENT', value: '₹649', sub: 'Netflix · Mar 5', icon: '📅' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            {/* Subs + Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTIONS</div>
                {SUBS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < SUBS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.due}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.amount}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.period}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 12 }}>BY CATEGORY</div>
                {CATEGORIES.map((c, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{c.amount}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: c.width, background: c.color, borderRadius: 100 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '32px 40px', display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Set up in under 2 minutes</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 64 }}>No lengthy onboarding — just sign up and start adding your subscriptions.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { num: '1', icon: '👤', title: 'Sign up free', desc: 'Create an account in seconds. No credit card, no commitment.' },
            { num: '2', icon: '📋', title: 'Add your subs', desc: 'Type them in, connect Gmail, or upload a bank statement.' },
            { num: '3', icon: '✨', title: 'See the full picture', desc: 'Get your dashboard, analytics, and AI-powered savings tips instantly.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>{s.icon}</div>
                <div style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.num}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Built for people who lose track</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17 }}>Whether you have 3 subscriptions or 30, these tools keep everything in one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI INSIGHTS */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
              ✨ AI INSIGHTS
            </div>
            <div style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: 12, padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>3 new</div>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '18px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>POTENTIAL SAVINGS FOUND</div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>₹2,299<span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>/mo</span></div>
          </div>
          {[
            { icon: '⚠️', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.2)', title: 'Potential Duplicate Detected', save: 'Save ₹729/mo', desc: 'Spotify and YouTube Music serve a similar purpose. Cancel one to save ₹729/mo.', tags: ['Spotify', 'YouTube Music'] },
            { icon: '💡', color: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', title: 'Switch to Annual Billing', save: 'Save ₹1,570/yr', desc: 'Switching Notion to annual billing would save you ₹1,570/yr.', tags: [] },
            { icon: '✅', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', title: 'Great Spending Habits', save: '', desc: 'Your entertainment spending is 12% below the average user. Keep it up!', tags: [] },
          ].map((item, i) => (
            <div key={i} style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
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
          <div style={{ fontSize: 13, color: '#818cf8', fontWeight: 600, letterSpacing: 1, marginBottom: 16 }}>AI INSIGHTS</div>
          <h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 20, lineHeight: 1.1 }}>It catches what you miss</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            Paying for Spotify and YouTube Music? Still on a monthly plan when annual is cheaper? SubTracker flags it automatically.
          </p>
          {[
            { icon: '🔁', title: 'Duplicate detection', desc: 'Flags services that overlap so you can drop the one you use less.' },
            { icon: '📧', title: 'Email scanning', desc: 'Connects to Gmail to find subscription receipts you forgot about.' },
            { icon: '📄', title: 'Statement import', desc: 'Upload a bank or card statement — we\'ll pull out every recurring charge.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
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
      <section id="pricing" style={{ padding: '100px 40px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>Simple pricing</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 36 }}>Track up to 5 subscriptions forever. Go Pro when you outgrow it.</p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: 4, marginBottom: 48, gap: 4 }}>
          {['Monthly', 'Annual'].map(t => (
            <button key={t} onClick={() => setAnnual(t === 'Annual')} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, transition: 'all 0.2s', background: (annual ? t === 'Annual' : t === 'Monthly') ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'transparent', color: (annual ? t === 'Annual' : t === 'Monthly') ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              {t} {t === 'Annual' && <span style={{ background: 'rgba(16,185,129,0.3)', color: '#10b981', padding: '2px 6px', borderRadius: 100, fontSize: 11, marginLeft: 4 }}>-29%</span>}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Free */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Free</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Get started with basic tracking</div>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>₹0</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>Forever free</div>
            {['Up to 5 subscriptions', 'Manual import (CSV/PDF)', 'Basic analytics', 'Currency conversion', 'Payment reminders'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: '#6366f1' }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register" style={{ display: 'block', textAlign: 'center', marginTop: 32, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.1)' }}>
              Get Started
            </Link>
          </div>
          {/* Pro */}
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '2px solid rgba(99,102,241,0.4)', borderRadius: 20, padding: 32, textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#4f46e5,#818cf8)', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
              👑 Most Popular
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Pro ✨</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>For people serious about their finances</div>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#818cf8', marginBottom: 4 }}>
              {annual ? '₹349' : '₹499'}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
              {annual ? 'per month · ₹4,188/yr (save 29%)' : 'per month'}
            </div>
            {['Unlimited subscriptions', 'AI-powered insights', 'Advanced analytics', 'Priority support', 'Multi-device sync', 'Export reports'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: '#10b981' }}>✓</span> {f}
              </div>
            ))}
            <Link href="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 32, padding: '14px', borderRadius: 12, textDecoration: 'none', fontSize: 15 }}>
              Upgrade to Pro
            </Link>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Join 500+ Pro users</div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
          💰 Average user saves <strong style={{ color: '#818cf8' }}>₹20,000/year</strong>
        </div>
        <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 20, lineHeight: 1.1 }}>
          Your subscriptions aren't<br />going to track themselves
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Takes 2 minutes to set up. Free plan available. You'll wonder why you didn't start sooner.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '16px 32px' }}>
            Get Started Free →
          </Link>
          <Link href="/login" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 16, padding: '16px 32px' }}>
            👁 Try Demo
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 16 }}>○ No credit card required · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>S</div>
          <span style={{ fontWeight: 700 }}>SubTracker</span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>© 2026 SubTracker. Built with Next.js + Node.js + MongoDB</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
