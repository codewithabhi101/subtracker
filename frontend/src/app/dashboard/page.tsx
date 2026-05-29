'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const API = 'https://subtracker-backend123.vercel.app';

const popularServices = [
  { name: 'Netflix',        emoji: '🎬', color: '#e50914', bg: '#e5091415' },
  { name: 'Spotify',        emoji: '🎵', color: '#1db954', bg: '#1db95415' },
  { name: 'Disney+',        emoji: '✨', color: '#0063e5', bg: '#0063e515' },
  { name: 'Amazon Prime',   emoji: '📦', color: '#ff9900', bg: '#ff990015' },
  { name: 'YouTube Premium',emoji: '▶️', color: '#ff0000', bg: '#ff000015' },
  { name: 'Dropbox',        emoji: '📁', color: '#0061ff', bg: '#0061ff15' },
  { name: 'Notion',         emoji: '📝', color: '#a5b4fc', bg: '#a5b4fc15' },
  { name: 'GitHub',         emoji: '🐙', color: '#6e40c9', bg: '#6e40c915' },
  { name: 'Adobe CC',       emoji: '🎨', color: '#ff0000', bg: '#ff000015' },
  { name: 'ChatGPT Plus',   emoji: '🤖', color: '#10a37f', bg: '#10a37f15' },
  { name: 'Figma',          emoji: '🎯', color: '#f24e1e', bg: '#f24e1e15' },
  { name: 'Canva',          emoji: '🖼️', color: '#00c4cc', bg: '#00c4cc15' },
];

const catColors: Record<string, string> = {
  streaming: '#6366f1',
  music: '#22c55e',
  software: '#f59e0b',
  gaming: '#ef4444',
  other: '#8b5cf6',
};

const monthlyData = [
  { month: 'Oct', amount: 900  },
  { month: 'Nov', amount: 1100 },
  { month: 'Dec', amount: 950  },
  { month: 'Jan', amount: 1300 },
  { month: 'Feb', amount: 1150 },
  { month: 'Mar', amount: 1400 },
  { month: 'Apr', amount: 1280 },
];

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6'];

/* ─── Sub Avatar ────────────────────────────────────────── */
function SubAvatar({ name, category }: { name: string; category: string }) {
  const color = catColors[category] || '#6366f1';
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: color + '20',
      border: `1px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 15, color,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────── */
export default function Dashboard() {
  const router = useRouter();
  const [subs, setSubs]           = useState<any[]>([]);
  const [user, setUser]           = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [form, setForm] = useState({
    name: '', amount: '', billingCycle: 'monthly',
    category: 'streaming', nextBillingDate: '',
  });
  const [addLoading, setAddLoading] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    setUser(JSON.parse(userData || '{}'));
    fetchSubs(token);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const fetchSubs = async (token: string) => {
    try {
      const res  = await fetch(`${API}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubs(data.data || []);
    } catch {
      router.push('/login');
    }
    setLoading(false);
  };

  const addSub = async () => {
    const token = localStorage.getItem('token');
    if (!form.name || !form.amount || !form.nextBillingDate) return;
    setAddLoading(true);
    try {
      await fetch(`${API}/api/subscriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: '' });
      fetchSubs(token!);
    } catch (e) { console.error(e); }
    setAddLoading(false);
  };

  const deleteSub = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubs(token!);
    } catch (e) { console.error(e); }
  };

  /* ── Derived data ──── */
  const activeSubs    = subs.filter(s => s.status === 'active');
  const totalMonthly  = activeSubs.reduce(
    (sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0
  );
  const nextPayment   = [...activeSubs].sort(
    (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  )[0];
  const pieData       = ['streaming','music','software','gaming','other']
    .map(cat => ({
      name: cat,
      value: activeSubs
        .filter(s => s.category === cat)
        .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0),
    }))
    .filter(d => d.value > 0);

  /* ── Styles ──── */
  const s = {
    bg: 'var(--bg)', bg2: 'var(--bg2)', bg3: 'var(--bg3)',
    border: 'var(--border)', text: 'var(--text)', text2: 'var(--text2)',
    accent: 'var(--accent)', accent2: 'var(--accent2)', accent3: 'var(--accent3)',
  };

  /* ── Nav items ──── */
  const navItems = [
    { id: 'dashboard',     icon: '⊞',  label: 'Dashboard'    },
    { id: 'budget',        icon: '◉',  label: 'Budget'       },
    { id: 'analytics',     icon: '⚡', label: 'Insights'     },
    { id: 'settings',      icon: '⟳',  label: 'Integrations' },
  ];

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', flexDirection: 'column', gap: 16,
    }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      <span style={{ color: 'var(--text2)', fontSize: 14 }}>Loading your dashboard…</span>
    </div>
  );

  return (
    <div style={{ background: s.bg, minHeight: '100vh', fontFamily: 'var(--font-sans)', color: s.text }}>

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(15,21,32,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${s.border}`,
        height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(12px,3vw,24px)',
        position: 'sticky', top: 0, zIndex: 50,
        gap: 8,
      }}>
        {/* Left: Logo + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
              borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 15, color: '#fff',
              boxShadow: '0 3px 10px rgba(79,70,229,0.5)',
            }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>SubTracker</span>
          </div>

          {/* Desktop tabs */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 2 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`dash-tab ${activePage === item.id ? 'active' : ''}`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: 13 }}
          >
            <span className="hide-mobile">+ Add Subscription</span>
            <span className="show-mobile" style={{ display: 'none' }}>+</span>
          </button>
          <button
            className="hide-mobile btn-ghost"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: `1px solid ${s.border}`,
              borderRadius: 8, padding: '7px 12px',
              color: s.accent3, fontWeight: 600, fontSize: 12,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            ⭐ Upgrade
          </button>
          <button style={{ background: 'none', border: 'none', color: s.text2, fontSize: 18, cursor: 'pointer', padding: 4 }}>🔔</button>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
            <div style={{
              width: 30, height: 30, flexShrink: 0,
              background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 12,
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </span>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-sans)', padding: '4px 6px', borderRadius: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            Logout
          </button>
          {/* Mobile hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileSidebar(!mobileSidebar)}
            style={{ background: 'none', border: 'none', color: s.text2, fontSize: 20, cursor: 'pointer', padding: 4, display: 'none' }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="show-mobile" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,12,18,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${s.border}`,
        padding: '8px 4px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '6px 12px', borderRadius: 10,
                color: activePage === item.id ? s.accent3 : s.text2,
                fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: activePage === item.id ? 700 : 500,
                background2: activePage === item.id ? 'rgba(99,102,241,0.1)' : 'transparent',
              } as any}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div style={{
        padding: 'clamp(16px,3vw,28px) clamp(12px,3vw,32px)',
        maxWidth: 1240,
        margin: '0 auto',
        paddingBottom: 80, // for mobile nav
      }}>

        {/* ── DASHBOARD PAGE ─── */}
        {activePage === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
                  {greeting}, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: s.text2, fontSize: 14 }}>
                  {activeSubs.length} active subscription{activeSubs.length !== 1 ? 's' : ''} · ₹{Math.round(totalMonthly).toLocaleString('en-IN')}/mo
                </p>
              </div>
              <button onClick={() => setShowModal(true)} className="btn-primary hide-mobile" style={{ padding: '9px 18px', fontSize: 13 }}>
                + Add Subscription
              </button>
            </div>

            {/* Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
            }}>
              {[
                { label: 'MONTHLY SPEND', val: `₹${Math.round(totalMonthly).toLocaleString('en-IN')}`, sub: 'This month', icon: '💰', color: '#6366f1' },
                { label: 'YEARLY TOTAL', val: `₹${Math.round(totalMonthly * 12).toLocaleString('en-IN')}`, sub: 'Projected annual', icon: '📅', color: '#10b981' },
                { label: 'ACTIVE SUBS', val: String(activeSubs.length), sub: 'Currently tracked', icon: '✅', color: '#f59e0b' },
                {
                  label: 'NEXT PAYMENT',
                  val: nextPayment ? `₹${nextPayment.amount.toLocaleString('en-IN')}` : '—',
                  sub: nextPayment ? `${nextPayment.name} · ${new Date(nextPayment.nextBillingDate).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}` : 'No upcoming',
                  icon: '📆', color: '#ef4444',
                },
              ].map((c, i) => (
                <div key={i} style={{
                  background: s.bg2, border: `1px solid ${s.border}`,
                  borderRadius: 14, padding: '16px 18px',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = c.color + '50';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = `0 8px 30px ${c.color}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = '';
                  el.style.boxShadow = '';
                }}
                >
                  <div style={{ fontSize: 9, color: s.text2, letterSpacing: 1.4, marginBottom: 10, fontWeight: 700 }}>{c.label}</div>
                  <div style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, marginBottom: 5, letterSpacing: '-0.02em' }}>{c.val}</div>
                  <div style={{ fontSize: 11, color: s.text2, lineHeight: 1.5 }}>{c.sub}</div>
                  {/* Colored dot accent */}
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 28, height: 28, borderRadius: 8,
                    background: c.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>{c.icon}</div>
                </div>
              ))}
            </div>

            {/* Main content */}
            {subs.length === 0 ? (
              /* Empty state */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  background: s.bg2, border: `1px solid ${s.border}`,
                  borderRadius: 16, padding: 'clamp(40px,8vw,64px) 20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>💳</div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
                    Let's track your subscriptions
                  </h2>
                  <p style={{ color: s.text2, marginBottom: 24, fontSize: 15, maxWidth: 400, margin: '0 auto 24px' }}>
                    Add your first subscription to see spending insights, reminders, and more.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: 15 }}
                  >
                    + Add Your First Subscription
                  </button>
                </div>

                <QuickAdd
                  services={popularServices}
                  onPick={(name) => { setForm(f => ({ ...f, name })); setShowModal(true); }}
                  bg2={s.bg2} border={s.border} text2={s.text2}
                />
              </div>
            ) : (
              /* Data layout */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(260px,320px)',
                gap: 16,
              }}
              className="dash-main-grid"
              >
                {/* Left col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                  {/* Subscriptions list */}
                  <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em', color: s.text2 }}>SUBSCRIPTIONS</div>
                      <button
                        onClick={() => setActivePage('subscriptions')}
                        style={{ fontSize: 12, color: s.accent2, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-sans)' }}
                      >
                        View all →
                      </button>
                    </div>
                    {subs.slice(0, 6).map((sub: any) => (
                      <div key={sub._id} className="sub-row">
                        <SubAvatar name={sub.name} category={sub.category} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</div>
                          <div style={{ fontSize: 11, color: s.text2, marginTop: 2 }}>
                            Due {new Date(sub.nextBillingDate).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>₹{sub.amount.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 10, color: s.text2 }}>/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                        </div>
                        <button
                          onClick={() => deleteSub(sub._id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(232,237,245,0.18)', fontSize: 14, padding: '6px',
                            borderRadius: 6, transition: 'all 0.15s', flexShrink: 0,
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget.style.color = '#f87171');
                            (e.currentTarget.style.background = 'rgba(239,68,68,0.08)');
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget.style.color = 'rgba(232,237,245,0.18)');
                            (e.currentTarget.style.background = 'none');
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em', color: s.text2 }}>SPENDING TREND</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" />
                        <XAxis dataKey="month" tick={{ fill: 'rgba(232,237,245,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'rgba(232,237,245,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: 10, color: 'var(--text)', fontSize: 12,
                          }}
                          formatter={(v: any) => [`₹${v}`, 'Spent']}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" fill="url(#grad1)" strokeWidth={2.5}
                          dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
                          activeDot={{ r: 5, fill: '#818cf8' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right col: category breakdown */}
                <div style={{
                  background: s.bg2, border: `1px solid ${s.border}`,
                  borderRadius: 14, padding: 20, height: 'fit-content',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em', color: s.text2 }}>BY CATEGORY</div>
                  {pieData.length > 0 && (
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: 'var(--bg2)', border: 'none', borderRadius: 10, color: 'var(--text)', fontSize: 12 }}
                          formatter={(v: any) => [`₹${Math.round(v)}/mo`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div style={{ marginTop: 8 }}>
                    {['streaming','music','software','gaming','other'].map(cat => {
                      const total = activeSubs
                        .filter(s => s.category === cat)
                        .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                      if (total === 0) return null;
                      const pct = Math.round((total / totalMonthly) * 100);
                      return (
                        <div key={cat} style={{ marginBottom: 13 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                            <span style={{ fontSize: 11, color: s.text2, fontFamily: 'var(--font-mono)' }}>{pct}% · ₹{Math.round(total)}</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%`, background: catColors[cat] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>₹{Math.round(totalMonthly).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick add (when subs exist) */}
            {subs.length > 0 && (
              <QuickAdd
                services={popularServices}
                onPick={(name) => { setForm(f => ({ ...f, name })); setShowModal(true); }}
                bg2={s.bg2} border={s.border} text2={s.text2}
              />
            )}
          </div>
        )}

        {/* ── SUBSCRIPTIONS PAGE ─── */}
        {activePage === 'subscriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Your Subscriptions</h1>
              <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
                + Add New
              </button>
            </div>
            <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, overflow: 'hidden' }}>
              {subs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'clamp(40px,8vw,64px) 20px', color: s.text2 }}>
                  No subscriptions yet. Add your first one!
                </div>
              ) : subs.map((sub: any, i) => (
                <div key={sub._id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 'clamp(12px,2vw,16px) 20px',
                  borderBottom: i < subs.length - 1 ? `1px solid ${s.border}` : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <SubAvatar name={sub.name} category={sub.category} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: s.text2, marginTop: 2 }}>
                      {sub.category} · renews {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                    ₹{sub.amount.toLocaleString('en-IN')}
                    <span style={{ fontSize: 11, color: s.text2, fontWeight: 400 }}>/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <span className={`badge ${sub.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                    {sub.status}
                  </span>
                  <button
                    onClick={() => deleteSub(sub._id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(232,237,245,0.2)', fontSize: 16, padding: '6px',
                      borderRadius: 6, transition: 'all 0.15s', flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget.style.color = '#f87171');
                      (e.currentTarget.style.background = 'rgba(239,68,68,0.1)');
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget.style.color = 'rgba(232,237,245,0.2)');
                      (e.currentTarget.style.background = 'none');
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS PAGE ─── */}
        {activePage === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Spending Insights</h1>

            <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, letterSpacing: '0.04em', color: s.text2 }}>MONTHLY SPENDING TREND</div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(232,237,245,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(232,237,245,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, color: 'var(--text)' }}
                    formatter={(v: any) => [`₹${v}`, 'Spent']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#4f46e5" fill="url(#grad2)" strokeWidth={2.5}
                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#818cf8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              {['streaming','music','software','gaming','other'].map(cat => {
                const total = activeSubs
                  .filter(s => s.category === cat)
                  .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                return (
                  <div key={cat} style={{
                    background: s.bg2, border: `1px solid ${s.border}`,
                    borderRadius: 12, padding: '18px 16px',
                  }}>
                    <div style={{ fontSize: 11, color: s.text2, textTransform: 'capitalize', marginBottom: 8, fontWeight: 600 }}>{cat}</div>
                    <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: catColors[cat] }}>
                      ₹{Math.round(total).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11, color: s.text2, marginTop: 4 }}>per month</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SETTINGS/INTEGRATIONS PAGE ─── */}
        {activePage === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Integrations & Settings</h1>
            <div style={{
              background: s.bg2, border: `1px solid ${s.border}`,
              borderRadius: 14, padding: 'clamp(20px,4vw,28px)',
              maxWidth: 520,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Account Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: s.text2, marginBottom: 7, display: 'block', fontWeight: 600 }}>Full Name</label>
                  <input defaultValue={user?.name} />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: s.text2, marginBottom: 7, display: 'block', fontWeight: 600 }}>Email</label>
                  <input defaultValue={user?.email} />
                </div>
                <button className="btn-primary" style={{ width: 'fit-content', padding: '10px 20px', fontSize: 14, marginTop: 4 }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD SUBSCRIPTION MODAL ──────────────────────────── */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 20,
            padding: 'clamp(20px,4vw,28px)',
            width: '100%', maxWidth: 420,
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            animation: 'scaleIn 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' }}>Add Subscription</div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'var(--bg3)', border: 'none', cursor: 'pointer',
                  color: 'var(--text2)', fontSize: 16, borderRadius: 8,
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(239,68,68,0.1)'); (e.currentTarget.style.color = '#f87171'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'var(--bg3)'); (e.currentTarget.style.color = 'var(--text2)'); }}
              >✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Service Name</label>
                <input
                  placeholder="e.g. Netflix"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="649"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    min="0"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Billing</label>
                  <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="software">Software</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Next Billing</label>
                  <input
                    type="date"
                    value={form.nextBillingDate}
                    onChange={e => setForm({ ...form, nextBillingDate: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={addSub}
                  disabled={addLoading || !form.name || !form.amount || !form.nextBillingDate}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', opacity: (!form.name || !form.amount || !form.nextBillingDate) ? 0.5 : 1 }}
                >
                  {addLoading ? <><span className="spinner" /> Adding…</> : 'Add Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline responsive override for dash main grid */}
      <style>{`
        @media (max-width: 840px) {
          .dash-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── QuickAdd sub-component ─────────────────────────────── */
function QuickAdd({
  services,
  onPick,
  bg2, border, text2,
}: {
  services: typeof popularServices;
  onPick: (name: string) => void;
  bg2: string; border: string; text2: string;
}) {
  return (
    <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em', color: text2 }}>
        QUICK ADD POPULAR SERVICES
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: 10,
      }}>
        {services.map((sv, i) => (
          <button
            key={i}
            onClick={() => onPick(sv.name)}
            style={{
              background: sv.bg, border: `1px solid ${border}`,
              borderRadius: 12, padding: '14px 6px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => {
              (e.currentTarget.style.borderColor = sv.color + '60');
              (e.currentTarget.style.transform = 'translateY(-2px)');
              (e.currentTarget.style.boxShadow = `0 6px 20px ${sv.color}20`);
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.borderColor = border);
              (e.currentTarget.style.transform = '');
              (e.currentTarget.style.boxShadow = '');
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{sv.emoji}</span>
            <span style={{ fontSize: 10, color: text2, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
              {sv.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
