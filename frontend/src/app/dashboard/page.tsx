'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = 'https://subtracker-backend123.vercel.app';

const popularServices = [
  { name: 'Netflix', emoji: '🎬', color: '#e50914', bg: '#e5091422' },
  { name: 'Spotify', emoji: '🎵', color: '#1db954', bg: '#1db95422' },
  { name: 'Disney+', emoji: '✨', color: '#0063e5', bg: '#0063e522' },
  { name: 'Amazon Prime', emoji: '📦', color: '#ff9900', bg: '#ff990022' },
  { name: 'YouTube Premium', emoji: '▶️', color: '#ff0000', bg: '#ff000022' },
  { name: 'Dropbox', emoji: '📁', color: '#0061ff', bg: '#0061ff22' },
  { name: 'Notion', emoji: '📝', color: '#ffffff', bg: '#ffffff22' },
  { name: 'GitHub', emoji: '🐙', color: '#6e40c9', bg: '#6e40c922' },
  { name: 'Adobe CC', emoji: '🎨', color: '#ff0000', bg: '#ff000022' },
  { name: 'ChatGPT Plus', emoji: '🤖', color: '#10a37f', bg: '#10a37f22' },
  { name: 'Figma', emoji: '🎯', color: '#f24e1e', bg: '#f24e1e22' },
  { name: 'Canva', emoji: '🖼️', color: '#00c4cc', bg: '#00c4cc22' },
];

const catColors: any = {
  streaming: '#6366f1', music: '#22c55e',
  software: '#f59e0b', gaming: '#ef4444', other: '#8b5cf6'
};

const monthlyData = [
  { month: 'Oct', amount: 900 },
  { month: 'Nov', amount: 1100 },
  { month: 'Dec', amount: 950 },
  { month: 'Jan', amount: 1300 },
  { month: 'Feb', amount: 1150 },
  { month: 'Mar', amount: 1400 },
  { month: 'Apr', amount: 1280 },
];

export default function Dashboard() {
  const router = useRouter();
  const [subs, setSubs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: '' });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    setUser(JSON.parse(userData || '{}'));
    fetchSubs(token);
  }, []);

  const fetchSubs = async (token: string) => {
    try {
      const res = await fetch(`${API}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSubs(data.data || []);
    } catch { router.push('/login'); }
    setLoading(false);
  };

  const addSub = async () => {
    const token = localStorage.getItem('token');
    if (!form.name || !form.amount || !form.nextBillingDate) return;
    try {
      await fetch(`${API}/api/subscriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setShowModal(false);
      setForm({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: '' });
      fetchSubs(token!);
    } catch (e) { console.error(e); }
  };

  const deleteSub = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/subscriptions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchSubs(token!);
    } catch (e) { console.error(e); }
  };

  const totalMonthly = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
  const activeSubs = subs.filter(s => s.status === 'active');
  const nextPayment = [...subs].filter(s => s.status === 'active').sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())[0];
  const pieData = ['streaming','music','software','gaming','other'].map(cat => ({ name: cat, value: subs.filter(s => s.category === cat && s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0) })).filter(d => d.value > 0);
  const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6'];

  if (loading) return <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0', fontFamily: 'Inter,sans-serif' }}>Loading...</div>;

  const s = { bg: '#0d1117', bg2: '#161b22', bg3: '#1c2128', border: 'rgba(99,102,241,0.12)', text: '#e2e8f0', text2: 'rgba(226,232,240,0.5)', accent: '#4f46e5', accent2: '#6366f1' };

  return (
    <div style={{ background: s.bg, minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: s.text }}>

      {/* TOP NAV */}
      <div style={{ background: s.bg2, borderBottom: `1px solid ${s.border}`, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>SubTracker</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: s.bg3, border: `1px solid ${s.border}`, borderRadius: 8, padding: '4px 8px', fontSize: 13, color: s.text2, cursor: 'pointer' }}>
            My Workspace <span style={{ marginLeft: 4 }}>▾</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
              { id: 'budget', icon: '◎', label: 'Budget' },
              { id: 'analytics', icon: '⚡', label: 'Insights' },
              { id: 'settings', icon: '⟳', label: 'Integrations' },
            ].map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, background: activePage === item.id ? 'rgba(99,102,241,0.15)' : 'transparent', color: activePage === item.id ? '#818cf8' : s.text2, fontWeight: activePage === item.id ? 600 : 400 }}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            + Add Subscription
          </button>
          <button style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: `1px solid ${s.border}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ⭐ Upgrade to Pro
          </button>
          <span style={{ fontSize: 18, cursor: 'pointer', color: s.text2 }}>🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</span>
            <span style={{ color: s.text2, fontSize: 11 }}>▾</span>
          </div>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px clamp(16px,3vw,40px)', maxWidth: 1200, margin: '0 auto' }}>

        {/* DASHBOARD */}
        {activePage === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Header */}
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{greeting}, {user?.name?.split(' ')[0]}</h1>
              <p style={{ color: s.text2, fontSize: 14 }}>{activeSubs.length} active subscriptions · ₹{Math.round(totalMonthly).toLocaleString('en-IN')}/mo</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { label: 'MONTHLY SPENDING', val: `₹${Math.round(totalMonthly).toLocaleString('en-IN')}`, sub: 'This month', icon: '💰' },
                { label: 'YEARLY TOTAL', val: `₹${Math.round(totalMonthly * 12).toLocaleString('en-IN')}`, sub: 'Projected annual', icon: '📅' },
                { label: 'ACTIVE SUBSCRIPTIONS', val: String(activeSubs.length), sub: 'Currently tracked', icon: '✅' },
                { label: 'NEXT PAYMENT', val: nextPayment ? `₹${nextPayment.amount.toLocaleString('en-IN')}` : '—', sub: nextPayment ? `${nextPayment.name} · ${new Date(nextPayment.nextBillingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : 'No upcoming', icon: '📆' },
              ].map((c, i) => (
                <div key={i} style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 12, padding: '18px 20px', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 9, color: s.text2, letterSpacing: 1.5, marginBottom: 10, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{c.val}</div>
                  <div style={{ fontSize: 11, color: s.text2 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            {subs.length === 0 ? (
              <div>
                {/* Empty State */}
                <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: '60px 20px', textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Let's track your subscriptions</h2>
                  <p style={{ color: s.text2, marginBottom: 24 }}>Add your first subscription to see spending insights, reminders, and more.</p>
                  <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}>
                    + Add Subscription
                  </button>
                </div>

                {/* Quick Add */}
                <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18, color: s.text2 }}>Quick Add Popular Services</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                    {popularServices.map((sv, i) => (
                      <button key={i} onClick={() => { setForm({ ...form, name: sv.name }); setShowModal(true); }}
                        style={{ background: sv.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '16px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 26 }}>{sv.emoji}</span>
                        <span style={{ fontSize: 11, color: s.text2, fontWeight: 500 }}>{sv.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Subs List */}
                  <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>SUBSCRIPTIONS</div>
                      <button onClick={() => setActivePage('subscriptions')} style={{ fontSize: 12, color: s.accent2, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all</button>
                    </div>
                    {subs.slice(0, 5).map((sub: any) => (
                      <div key={sub._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${s.border}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: catColors[sub.category] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: catColors[sub.category] }}>
                          {sub.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{sub.name}</div>
                          <div style={{ fontSize: 11, color: s.text2 }}>Due {new Date(sub.nextBillingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>₹{sub.amount.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 10, color: s.text2 }}>/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                        </div>
                        <button onClick={() => deleteSub(sub._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.2)', fontSize: 14, padding: '4px' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: s.text2 }}>Spending Trend</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                        <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'rgba(226,232,240,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" fill="url(#g1)" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right - Category */}
                <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20, height: 'fit-content' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>BY CATEGORY</div>
                  {pieData.length > 0 && (
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#161b22', border: 'none', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  {['streaming','music','software','gaming','other'].map((cat, i) => {
                    const total = subs.filter(s => s.category === cat && s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                    if (total === 0) return null;
                    const pct = Math.round(total / totalMonthly * 100);
                    return (
                      <div key={cat} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{cat}</span>
                          <span style={{ fontSize: 12, color: s.text2 }}>{pct}% · ₹{Math.round(total)}/mo</span>
                        </div>
                        <div style={{ height: 4, background: s.bg3, borderRadius: 4 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: catColors[cat], borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: 14, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>₹{Math.round(totalMonthly).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Add (when subs exist) */}
            {subs.length > 0 && (
              <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: s.text2 }}>Quick Add Popular Services</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
                  {popularServices.slice(0, 12).map((sv, i) => (
                    <button key={i} onClick={() => { setForm({ ...form, name: sv.name }); setShowModal(true); }}
                      style={{ background: sv.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '12px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 22 }}>{sv.emoji}</span>
                      <span style={{ fontSize: 10, color: s.text2, fontWeight: 500, textAlign: 'center' }}>{sv.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS PAGE */}
        {activePage === 'subscriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>Your Subscriptions</h1>
              <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add New</button>
            </div>
            <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, overflow: 'hidden' }}>
              {subs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: s.text2 }}>No subscriptions yet!</div>
              ) : subs.map((sub: any, i) => (
                <div key={sub._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < subs.length - 1 ? `1px solid ${s.border}` : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: catColors[sub.category] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, color: catColors[sub.category] }}>{sub.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: s.text2, marginTop: 2 }}>{sub.category} · renews {new Date(sub.nextBillingDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>₹{sub.amount.toLocaleString('en-IN')}<span style={{ fontSize: 11, color: s.text2, fontWeight: 400 }}>/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                  <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sub.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: sub.status === 'active' ? '#4ade80' : '#f87171' }}>{sub.status}</div>
                  <button onClick={() => deleteSub(sub._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.2)', fontSize: 16 }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS PAGE */}
        {activePage === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Insights</h1>
            <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: s.text2 }}>Monthly Spending Trend</div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#e2e8f0' }} />
                  <Area type="monotone" dataKey="amount" stroke="#4f46e5" fill="url(#g2)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {['streaming','music','software','gaming','other'].map(cat => {
                const total = subs.filter(s => s.category === cat && s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                return (
                  <div key={cat} style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 11, color: s.text2, textTransform: 'capitalize', marginBottom: 8 }}>{cat}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: catColors[cat] }}>₹{Math.round(total).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: s.text2, marginTop: 4 }}>per month</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activePage === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Integrations & Settings</h1>
            <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 14, padding: 28, maxWidth: 500 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Account Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input defaultValue={user?.name} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 6, display: 'block' }}>Email</label>
                  <input defaultValue={user?.email} />
                </div>
                <button style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: 'fit-content', marginTop: 6 }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: s.bg2, border: `1px solid ${s.border}`, borderRadius: 18, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 22 }}>Add Subscription</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: s.text2, marginBottom: 5, display: 'block' }}>Service Name</label>
                <input placeholder="e.g. Netflix" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 5, display: 'block' }}>Amount (₹)</label>
                  <input type="number" placeholder="649" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 5, display: 'block' }}>Billing</label>
                  <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 5, display: 'block' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="software">Software</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: s.text2, marginBottom: 5, display: 'block' }}>Next Billing</label>
                  <input type="date" value={form.nextBillingDate} onChange={e => setForm({ ...form, nextBillingDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(99,102,241,0.08)', color: s.text, border: `1px solid ${s.border}`, borderRadius: 9, padding: '11px', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button onClick={addSub} style={{ flex: 1, background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>Add Subscription</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}