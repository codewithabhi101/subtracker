'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = 'https://subtracker-backend123.vercel.app';
const COLORS = ['#3b3ddb', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const monthlyData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1900 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 2100 },
  { month: 'May', amount: 1800 },
  { month: 'Jun', amount: 2400 },
];

const catColors: any = {
  streaming: '#3b3ddb',
  music: '#6366f1',
  software: '#818cf8',
  gaming: '#a5b4fc',
  other: '#c7d2fe'
};

const popularServices = [
  { name: 'Netflix', icon: '🎬', color: '#e50914' },
  { name: 'Spotify', icon: '🎵', color: '#1db954' },
  { name: 'Disney+', icon: '✨', color: '#0063e5' },
  { name: 'Amazon Prime', icon: '📦', color: '#ff9900' },
  { name: 'YouTube', icon: '▶️', color: '#ff0000' },
  { name: 'GitHub', icon: '🐙', color: '#333' },
  { name: 'Notion', icon: '📝', color: '#fff' },
  { name: 'ChatGPT', icon: '🤖', color: '#10a37f' },
  { name: 'Adobe CC', icon: '🎨', color: '#ff0000' },
  { name: 'Hotstar', icon: '⭐', color: '#1f80e0' },
  { name: 'Canva', icon: '🖼️', color: '#00c4cc' },
  { name: 'Figma', icon: '🎯', color: '#f24e1e' },
];

export default function Dashboard() {
  const router = useRouter();
  const [subs, setSubs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [quickService, setQuickService] = useState('');
  const [form, setForm] = useState({
    name: '', amount: '', billingCycle: 'monthly',
    category: 'streaming', nextBillingDate: ''
  });

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
    } catch (err) {
      router.push('/login');
    }
    setLoading(false);
  };

  const addSub = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/subscriptions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setShowModal(false);
      setQuickService('');
      setForm({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: '' });
      fetchSubs(token!);
    } catch (err) { console.error(err); }
  };

  const deleteSub = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubs(token!);
    } catch (err) { console.error(err); }
  };

  const openQuickAdd = (name: string) => {
    setForm({ ...form, name });
    setQuickService(name);
    setShowModal(true);
  };

  const totalMonthly = subs
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);

  const activeSubs = subs.filter(s => s.status === 'active');
  const nextPayment = subs.filter(s => s.status === 'active').sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())[0];

  const pieData = ['streaming', 'music', 'software', 'gaming', 'other'].map(cat => ({
    name: cat,
    value: subs.filter(s => s.category === cat && s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0)
  })).filter(d => d.value > 0);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ color: '#e2e8f0', fontSize: 16 }}>Loading...</div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'subscriptions', icon: '💳', label: 'Subscriptions' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d1117', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: '#161b22', borderRight: '1px solid rgba(99,102,241,0.1)', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#e2e8f0' }}>SubTracker</span>
        </div>

        {/* User */}
        <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: 12, padding: '12px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, margin: '0 auto 8px' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.5)', marginTop: 2 }}>{user?.email}</div>
        </div>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s', background: activePage === item.id ? 'rgba(59,61,219,0.2)' : 'transparent', color: activePage === item.id ? '#818cf8' : 'rgba(226,232,240,0.6)', borderLeft: activePage === item.id ? '2px solid #3b3ddb' : '2px solid transparent' }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        <button onClick={() => { localStorage.clear(); router.push('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, color: '#f87171', background: 'transparent', marginTop: 'auto', borderLeft: '2px solid transparent' }}>
          🚪 Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ background: '#161b22', borderBottom: '1px solid rgba(99,102,241,0.1)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
              {activePage === 'dashboard' && `${greeting}, ${user?.name?.split(' ')[0]}!`}
              {activePage === 'subscriptions' && 'Your Subscriptions'}
              {activePage === 'analytics' && 'Analytics'}
              {activePage === 'settings' && 'Settings'}
            </h1>
            {activePage === 'dashboard' && (
              <p style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', marginTop: 1 }}>
                {activeSubs.length} active subscriptions · ₹{Math.round(totalMonthly).toLocaleString('en-IN')}/mo
              </p>
            )}
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(59,61,219,0.3)' }}>
            + Add Subscription
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* DASHBOARD */}
          {activePage === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {[
                  { label: 'MONTHLY SPENDING', value: `₹${Math.round(totalMonthly).toLocaleString('en-IN')}`, sub: 'This month', icon: '💰' },
                  { label: 'YEARLY TOTAL', value: `₹${Math.round(totalMonthly * 12).toLocaleString('en-IN')}`, sub: 'Projected annual', icon: '📅' },
                  { label: 'ACTIVE SUBSCRIPTIONS', value: activeSubs.length, sub: 'Currently tracked', icon: '✅' },
                  { label: 'NEXT PAYMENT', value: nextPayment ? `₹${nextPayment.amount.toLocaleString('en-IN')}` : '—', sub: nextPayment?.name || 'No upcoming', icon: '📆' },
                ].map((card, i) => (
                  <div key={i} style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)', letterSpacing: 1, marginBottom: 8 }}>{card.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{card.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(226,232,240,0.7)' }}>Monthly Spend Trend</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b3ddb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b3ddb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
                      <Area type="monotone" dataKey="amount" stroke="#3b3ddb" fill="url(#grad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(226,232,240,0.7)' }}>By Category</div>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#161b22', border: 'none', borderRadius: 8, color: '#e2e8f0' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      {pieData.map((d, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(226,232,240,0.6)', marginTop: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
                          {d.name} — ₹{Math.round(d.value)}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ color: 'rgba(226,232,240,0.3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>Add subscriptions to see chart</div>
                  )}
                </div>
              </div>

              {/* Subscriptions List */}
              <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(226,232,240,0.7)' }}>
                  {subs.length === 0 ? 'Let\'s track your subscriptions' : 'Your Subscriptions'}
                </div>
                {subs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>💳</div>
                    <p style={{ color: 'rgba(226,232,240,0.4)', marginBottom: 20 }}>Add your first subscription to see spending insights</p>
                    <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add Subscription</button>
                  </div>
                ) : (
                  subs.map((s: any) => (
                    <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColors[s.category]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: catColors[s.category] }}>
                        {s.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>{s.category} · Due {new Date(s.nextBillingDate).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>₹{s.amount.toLocaleString('en-IN')}<span style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', fontWeight: 400 }}>/{s.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                      <button onClick={() => deleteSub(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.2)', fontSize: 16, padding: '4px 8px' }}>✕</button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add */}
              <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(226,232,240,0.7)' }}>Quick Add Popular Services</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                  {popularServices.map((s, i) => (
                    <button key={i} onClick={() => openQuickAdd(s.name)}
                      style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12, padding: '16px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,61,219,0.15)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.3)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.05)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.1)'; }}>
                      <span style={{ fontSize: 24 }}>{s.icon}</span>
                      <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.6)', fontWeight: 500 }}>{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS */}
          {activePage === 'subscriptions' && (
            <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>All Subscriptions ({subs.length})</div>
                <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add New</button>
              </div>
              {subs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(226,232,240,0.3)' }}>No subscriptions yet!</div>
              ) : (
                subs.map((s: any) => (
                  <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${catColors[s.category]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: catColors[s.category] }}>{s.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>{s.category} · renews {new Date(s.nextBillingDate).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>₹{s.amount.toLocaleString('en-IN')}/{s.billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                    <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: s.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.status === 'active' ? '#4ade80' : '#f87171' }}>{s.status}</div>
                    <button onClick={() => deleteSub(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(226,232,240,0.2)', fontSize: 16 }}>✕</button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {activePage === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'rgba(226,232,240,0.7)' }}>Spend Over Time</div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b3ddb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b3ddb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#e2e8f0' }} />
                    <Area type="monotone" dataKey="amount" stroke="#3b3ddb" fill="url(#grad2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {['streaming', 'music', 'software', 'gaming', 'other'].map(cat => {
                  const total = subs.filter(s => s.category === cat && s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                  return (
                    <div key={cat} style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20 }}>
                      <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', marginBottom: 8, textTransform: 'capitalize' }}>{cat}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: catColors[cat] }}>₹{Math.round(total).toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', marginTop: 4 }}>per month</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activePage === 'settings' && (
            <div style={{ background: '#161b22', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 32, maxWidth: 480 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 24 }}>Account Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input defaultValue={user?.name} style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 6, display: 'block' }}>Email</label>
                  <input defaultValue={user?.email} style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button style={{ background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#161b22', borderRadius: 16, padding: 28, width: 400, border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              {quickService ? `Add ${quickService}` : 'Add Subscription'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 4, display: 'block' }}>Service Name</label>
                <input placeholder="e.g. Netflix" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 4, display: 'block' }}>Amount (₹)</label>
                  <input type="number" placeholder="649" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 4, display: 'block' }}>Billing</label>
                  <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 4, display: 'block' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="software">Software</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', marginBottom: 4, display: 'block' }}>Next Billing</label>
                  <input type="date" value={form.nextBillingDate} onChange={e => setForm({ ...form, nextBillingDate: e.target.value })}
                    style={{ width: '100%', background: '#0d1117', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={() => { setShowModal(false); setQuickService(''); }}
                  style={{ flex: 1, background: 'rgba(99,102,241,0.1)', color: '#e2e8f0', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '11px', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button onClick={addSub}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#3b3ddb,#6366f1)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,61,219,0.3)' }}>Add Subscription</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}