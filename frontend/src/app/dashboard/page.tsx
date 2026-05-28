'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, CreditCard, BarChart2,
  Settings, Bell, LogOut, Plus, Trash2
} from 'lucide-react';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e'];

const monthlyData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1900 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 2100 },
  { month: 'May', amount: 1800 },
  { month: 'Jun', amount: 2400 },
];

export default function Dashboard() {
  const router = useRouter();
  const [subs, setSubs] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', amount: '', billingCycle: 'monthly',
    category: 'streaming', nextBillingDate: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    setUser(JSON.parse(userData || '{}'));
    fetchSubs(token);
  }, []);

  const fetchSubs = async (token: string) => {
    try {
      const res = await axios.get('https://subtracker-backend.vercel.app/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubs(res.data.data);
    } catch (err) {
      router.push('/login');
    }
    setLoading(false);
  };

  const addSub = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://subtracker-backend.vercel.app/api/subscriptions', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setForm({ name: '', amount: '', billingCycle: 'monthly', category: 'streaming', nextBillingDate: '' });
      fetchSubs(token!);
    } catch (err) { console.error(err); }
  };

  const deleteSub = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://subtracker-backend.vercel.app/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubs(token!);
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const totalMonthly = subs
    .filter((s: any) => s.status === 'active')
    .reduce((sum: number, s: any) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);

  const activeSubs = subs.filter((s: any) => s.status === 'active');

  const pieData = ['streaming', 'music', 'software', 'gaming', 'other'].map(cat => ({
    name: cat,
    value: subs.filter((s: any) => s.category === cat && s.status === 'active')
      .reduce((sum: number, s: any) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0)
  })).filter(d => d.value > 0);

  const catColors: any = {
    streaming: '#6366f1', music: '#22d3ee',
    software: '#f59e0b', gaming: '#10b981', other: '#f43f5e'
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0f1729] text-white overflow-hidden">

      {/* Sidebar */}
      <div className="w-56 bg-[#1a2236] flex flex-col py-6 px-4 gap-2 border-r border-white/5">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-sm">S</div>
          <span className="font-bold text-lg">SubTracker</span>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 p-3 bg-[#0f1729] rounded-xl">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-lg font-bold mb-2">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-sm font-medium">{user?.name || 'Abhi'}</div>
          <div className="text-xs text-gray-400">{user?.email || ''}</div>
        </div>

        {[
          { id: 'dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
          { id: 'subscriptions', icon: <CreditCard size={16} />, label: 'Subscriptions' },
          { id: 'analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
          { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
        ].map(item => (
          <button key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              activePage === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}>
            {item.icon} {item.label}
          </button>
        ))}

        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 mt-auto transition-all">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#1a2236]">
          <div>
            <h1 className="text-lg font-bold">
              {activePage === 'dashboard' && '📊 Dashboard'}
              {activePage === 'subscriptions' && '💳 Subscriptions'}
              {activePage === 'analytics' && '📈 Analytics'}
              {activePage === 'settings' && '⚙️ Settings'}
            </h1>
            <p className="text-xs text-gray-400">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10">
              <Bell size={15} />
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-all">
              <Plus size={15} /> Add Subscription
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 gap-6 flex flex-col">

          {/* DASHBOARD PAGE */}
          {activePage === 'dashboard' && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Monthly Spend', value: `₹${Math.round(totalMonthly).toLocaleString('en-IN')}`, color: 'from-indigo-600 to-indigo-400', icon: '💰' },
                  { label: 'Active Subs', value: activeSubs.length, color: 'from-cyan-600 to-cyan-400', icon: '✅' },
                  { label: 'Yearly Total', value: `₹${Math.round(totalMonthly * 12).toLocaleString('en-IN')}`, color: 'from-amber-600 to-amber-400', icon: '📅' },
                  { label: 'Total Subs', value: subs.length, color: 'from-rose-600 to-rose-400', icon: '📋' },
                ].map((card, i) => (
                  <div key={i} className={`bg-gradient-to-br ${card.color} p-4 rounded-2xl`}>
                    <div className="text-2xl mb-1">{card.icon}</div>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-xs opacity-80 mt-1">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-4">
                {/* Area Chart */}
                <div className="col-span-2 bg-[#1a2236] rounded-2xl p-4">
                  <div className="text-sm font-medium mb-4 text-gray-300">Monthly Spend Trend</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#1a2236', border: 'none', borderRadius: 8, color: '#fff' }} />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#colorAmt)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#1a2236] rounded-2xl p-4">
                  <div className="text-sm font-medium mb-4 text-gray-300">By Category</div>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1a2236', border: 'none', borderRadius: 8, color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-1 mt-2">
                        {pieData.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }}></div>
                            {d.name} — ₹{Math.round(d.value)}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm text-center mt-8">Add subscriptions to see chart</div>
                  )}
                </div>
              </div>

              {/* Recent Subs */}
              <div className="bg-[#1a2236] rounded-2xl p-4">
                <div className="text-sm font-medium mb-4 text-gray-300">Recent Subscriptions</div>
                {subs.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-6">No subscriptions yet. Click + Add Subscription!</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {subs.slice(0, 5).map((s: any) => (
                      <div key={s._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ background: catColors[s.category] + '33', color: catColors[s.category] }}>
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-xs text-gray-400">{s.category} · {s.billingCycle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">₹{s.amount.toLocaleString('en-IN')}</div>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            s.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            s.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'}`}>
                            {s.status}
                          </div>
                        </div>
                        <button onClick={() => deleteSub(s._id)}
                          className="ml-2 text-gray-600 hover:text-red-400 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* SUBSCRIPTIONS PAGE */}
          {activePage === 'subscriptions' && (
            <div className="bg-[#1a2236] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-300">All Subscriptions ({subs.length})</div>
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                  <Plus size={13} /> Add New
                </button>
              </div>
              {subs.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-12">No subscriptions yet!</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {subs.map((s: any) => (
                    <div key={s._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: catColors[s.category] + '33', color: catColors[s.category] }}>
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.category} · renews {new Date(s.nextBillingDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm font-bold">₹{s.amount.toLocaleString('en-IN')}/{s.billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        s.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        s.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'}`}>
                        {s.status}
                      </div>
                      <button onClick={() => deleteSub(s._id)}
                        className="text-gray-600 hover:text-red-400 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS PAGE */}
          {activePage === 'analytics' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#1a2236] rounded-2xl p-4">
                <div className="text-sm font-medium mb-4 text-gray-300">Spend Over Time</div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorAmt2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#1a2236', border: 'none', borderRadius: 8, color: '#fff' }} />
                    <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#colorAmt2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['streaming', 'music', 'software', 'gaming', 'other'].map(cat => {
                  const total = subs.filter((s: any) => s.category === cat && s.status === 'active')
                    .reduce((sum: number, s: any) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
                  return (
                    <div key={cat} className="bg-[#1a2236] rounded-2xl p-4">
                      <div className="text-xs text-gray-400 mb-1 capitalize">{cat}</div>
                      <div className="text-xl font-bold" style={{ color: catColors[cat] }}>₹{Math.round(total).toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS PAGE */}
          {activePage === 'settings' && (
            <div className="bg-[#1a2236] rounded-2xl p-6">
              <div className="text-sm font-medium mb-6 text-gray-300">Account Settings</div>
              <div className="flex flex-col gap-4 max-w-md">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                  <input defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-fit">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a2236] rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h2 className="text-lg font-bold mb-4">Add Subscription</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Service Name</label>
                <input placeholder="e.g. Netflix"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Amount (₹)</label>
                  <input type="number" placeholder="649"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Billing Cycle</label>
                  <select className="w-full bg-[#0f1729] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select className="w-full bg-[#0f1729] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="software">Software</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Next Billing Date</label>
                  <input type="date"
                    className="w-full bg-[#0f1729] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.nextBillingDate} onChange={e => setForm({ ...form, nextBillingDate: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg text-sm transition-all">
                  Cancel
                </button>
                <button onClick={addSub}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
                  Add Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}