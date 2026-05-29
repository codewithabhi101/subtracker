"use client";
import { useState, useEffect, useRef } from "react";

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

// ─── Google Icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Service Icons ────────────────────────────────────────────────────────────
const SERVICES = [
  { name: "Netflix", color: "#E50914", letter: "N" },
  { name: "Spotify", color: "#1DB954", letter: "S" },
  { name: "Disney+", color: "#0F4FA8", letter: "D+" },
  { name: "Amazon Prime", color: "#FF9900", letter: "A" },
  { name: "YouTube Premium", color: "#FF0000", letter: "▶" },
  { name: "Dropbox", color: "#0061FE", letter: "⬡" },
  { name: "Notion", color: "#333", letter: "N" },
  { name: "GitHub", color: "#24292F", letter: "G" },
  { name: "Adobe CC", color: "#FF0000", letter: "Ai" },
  { name: "ChatGPT Plus", color: "#10A37F", letter: "G" },
];

// ─── Section with reveal ──────────────────────────────────────────────────────
function Section({ children, style = {}, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── RevealCard ───────────────────────────────────────────────────────────────
function RevealCard({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`reveal card-hover ${visible ? "visible" : ""}`}
      style={{
        transitionDelay: `${delay}s`,
        background: "var(--card)",
        border: "1px solid var(--card-border)",
        borderRadius: 16,
        padding: "28px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── DEMO DASHBOARD ───────────────────────────────────────────────────────────
function DemoDashboard({ onNavigate }: { onNavigate: (p: string) => void }) {
  const subs = [
    { name: "Netflix", cat: "Entertainment", price: 15.99, date: "Feb 18", color: "#E50914", letter: "N", status: "Expired" },
    { name: "Spotify", cat: "Music & Audio", price: 10.99, date: "Feb 22", color: "#1DB954", letter: "S", status: "Expired" },
    { name: "Adobe Creative Cloud", cat: "Productivity", price: 54.99, date: "Feb 28", color: "#FF0000", letter: "Ai", status: "Expired" },
    { name: "iCloud+", cat: "Cloud Storage", price: 2.99, date: "Mar 2", color: "#555", letter: "i", status: "Expired" },
    { name: "Notion", cat: "Productivity", price: 10.00, date: "Mar 18", color: "#333", letter: "N", status: "Active" },
    { name: "ChatGPT Plus", cat: "Productivity", price: 20.00, date: "Mar 5", color: "#10A37F", letter: "G", status: "Active" },
    { name: "GitHub", cat: "Productivity", price: 4.00, date: "Mar 12", color: "#24292F", letter: "G", status: "Active" },
    { name: "iCloud+", cat: "Cloud", price: 2.99, date: "Mar 20", color: "#555", letter: "i", status: "Active" },
  ];
  const categories = [
    { name: "Productivity", pct: 52, amount: 62.99, color: "#6C5CE7" },
    { name: "Entertainment", pct: 20, amount: 23.98, color: "#E50914" },
    { name: "Gaming", pct: 12, amount: 14.99, color: "#fdcb6e" },
    { name: "Music & Audio", pct: 9, amount: 10.99, color: "#1DB954" },
    { name: "Health & Fitness", pct: 5, amount: 5.83, color: "#00b894" },
    { name: "Cloud Storage", pct: 2, amount: 2.99, color: "#0984e3" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Demo Banner */}
      <div className="demo-banner">
        <span>👁 Demo Mode — Explore freely! Changes won&apos;t be saved.</span>
        <button className="btn-primary sm" onClick={() => onNavigate("register")}>→ Sign Up Free</button>
      </div>

      {/* Nav */}
      <nav className="dash-nav">
        <div className="nav-logo">
          <div className="logo-icon-sm">◆</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18 }}>SubTracker</span>
        </div>
        <div className="nav-links">
          {["Dashboard", "Budget", "Insights", "Integrations"].map(t => (
            <span key={t} className={`nav-link ${t === "Dashboard" ? "active" : ""}`}>{t}</span>
          ))}
        </div>
        <div className="nav-right">
          <div className="badge-pro">PRO</div>
          <div className="avatar">DE</div>
        </div>
      </nav>

      {/* Content */}
      <div className="dash-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          {[
            { label: "MONTHLY SPENDING", value: "$121.77", sub: "This month" },
            { label: "YEARLY TOTAL", value: "$1,461.27", sub: "Projected annual" },
            { label: "ACTIVE SUBSCRIPTIONS", value: "8", sub: "Currently tracked" },
            { label: "NEXT PAYMENT", value: "$96.00", sub: "Notion" },
          ].map((s, i) => (
            <RevealCard key={i} delay={i * 0.08} style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.sub}</div>
            </RevealCard>
          ))}
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Subscriptions */}
          <Section>
            <div className="subs-card">
              <div className="subs-header">
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700 }}>Your Subscriptions</h2>
                <button className="btn-primary sm">+ Add Subscription</button>
              </div>
              {subs.map((s, i) => (
                <div key={i} className="sub-row">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                    {s.letter}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      {s.status === "Expired" && (
                        <span style={{ fontSize: 11, background: "rgba(231,76,60,0.2)", color: "#e74c3c", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Expired</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>📅 {s.date} · {s.cat}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 16, flexShrink: 0 }}>${s.price.toFixed(2)}<span style={{ fontSize: 12, color: "var(--muted)" }}>/mo</span></div>
                </div>
              ))}
            </div>
          </Section>

          {/* Categories */}
          <Section>
            <div style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Spending by Category</h3>
              {categories.map((c, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span>{c.name}</span>
                    <span style={{ color: "var(--muted)" }}>{c.pct}% <strong style={{ color: "var(--text)" }}>${c.amount}/mo</strong></span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "flex-end", fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700 }}>
                $121.77
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [billingToggle, setBillingToggle] = useState<"monthly" | "annual">("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroRef, heroVisible] = useReveal(0.05);

  const features = [
    { icon: "$", title: "Spending overview", desc: "See your total monthly and yearly cost at a glance — updated as you add or remove subs." },
    { icon: "🔔", title: "Payment reminders", desc: "Get notified before charges hit so you can cancel or pause in time." },
    { icon: "⏱", title: "Category breakdown", desc: "Find out if you're spending more on streaming than you thought." },
    { icon: "↗", title: "Trend tracking", desc: "Month-over-month charts show whether your bill is creeping up." },
    { icon: "🛡", title: "Private by default", desc: "Your data stays encrypted. We don't sell it, share it, or look at it." },
    { icon: "⚡", title: "Fast to set up", desc: "Add a subscription in a few taps. No spreadsheet migration required." },
    { icon: "✦", title: "AI suggestions", desc: "Spots duplicates, cheaper plans, and subscriptions you haven't used in months." },
    { icon: "✉", title: "Email & bank import", desc: "Connect Gmail or upload a statement — we'll find the recurring charges for you." },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <div className="logo-icon-sm">◆</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--violet2)" }}>SubTracker</span>
        </div>
        <div className="desktop-nav-links">
          <a className="nav-link">Features</a>
          <a className="nav-link">Pricing</a>
        </div>
        <div className="desktop-nav-actions">
          <button className="btn-ghost" style={{ padding: "9px 20px" }} onClick={() => onNavigate("login")}>Sign In</button>
          <button className="btn-primary" style={{ padding: "9px 20px" }} onClick={() => onNavigate("register")}>Get Started →</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a className="mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a className="mobile-link" onClick={() => setMenuOpen(false)}>Pricing</a>
          <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", marginBottom: 12 }} onClick={() => { onNavigate("login"); setMenuOpen(false); }}>Sign In</button>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onNavigate("register"); setMenuOpen(false); }}>Get Started →</button>
        </div>
      )}

      {/* HERO */}
      <section className="hero-section">
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star" style={{
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }} />
          ))}
        </div>

        <div ref={heroRef} className={`reveal ${heroVisible ? "visible" : ""} hero-inner`}>
          <div className="hero-badge">
            <span style={{ width: 7, height: 7, background: "var(--violet2)", borderRadius: "50%", display: "inline-block" }} />
            Trusted by <strong>2,000+</strong> users tracking their subscriptions
          </div>
          <h1 className="hero-title">
            Know exactly where your money goes,{" "}
            <span className="gradient-text">every month</span>
          </h1>
          <p className="hero-sub">
            SubTracker pulls together all your recurring charges, shows you what you&apos;re actually spending, and spots the ones you forgot about.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary lg" onClick={() => onNavigate("register")}>Get Started Free →</button>
            <button className="btn-ghost lg" onClick={() => onNavigate("demo")}>👁 Try Live Demo</button>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>⊙ No credit card required · Free forever plan</p>
        </div>

        {/* Dashboard Preview */}
        <Section style={{ maxWidth: 860, margin: "60px auto 0", padding: "0 16px", position: "relative" }}>
          <div className="preview-frame">
            <div className="preview-bar">
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              <div className="preview-url">🌐 subtracker.online/dashboard</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700 }}>Good morning, Alex</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>8 active subscriptions · $127.94/mo</div>
                </div>
              </div>
              <div className="preview-stats">
                {[{ label: "MONTHLY", v: "$127.94" }, { label: "YEARLY", v: "$1,535.28" }, { label: "ACTIVE", v: "8" }, { label: "NEXT", v: "$10.99" }].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 0.8 }}>{s.label}</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginTop: 4 }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="preview-bottom">
                <div style={{ flex: 1 }}>
                  {[
                    { n: "Netflix", c: "#E50914", l: "N", p: "$15.99", d: "Due Mar 5" },
                    { n: "Spotify", c: "#1DB954", l: "S", p: "$9.99", d: "Due Mar 12" },
                    { n: "Notion", c: "#333", l: "N", p: "$10.00", d: "Due Mar 18" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: s.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{s.l}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{s.n}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.d}</div>
                      </div>
                      <div style={{ fontWeight: 600 }}>{s.p}</div>
                    </div>
                  ))}
                </div>
                <div className="preview-cats">
                  {[
                    { label: "Entertainment", amount: "$57.57", color: "#E50914", pct: 45 },
                    { label: "Productivity", amount: "$31.99", color: "#6C5CE7", pct: 35 },
                    { label: "Music", amount: "$19.18", color: "#1DB954", pct: 15 },
                  ].map((c, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: c.color }}>● {c.label}</span>
                        <span>{c.amount}</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                        <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* STATS BAR */}
      <Section>
        <div className="stats-bar">
          {[
            { icon: "👥", v: "2,000+", l: "Active Users" },
            { icon: "⭐", v: "4.8/5", l: "User Rating" },
            { icon: "💸", v: "$240", l: "Avg. Saved/Year" },
            { icon: "🏆", v: "Featured", l: "Product Hunt" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ANALYTICS SECTION */}
      <section className="two-col-section">
        <Section>
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--violet2)", fontWeight: 600, marginBottom: 16 }}>ANALYTICS</div>
          <h2 className="section-title">Your spending, visualized</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: 32 }}>
            See exactly how much goes to entertainment vs. productivity vs. everything else. Spot trends before they become problems.
          </p>
          {[
            { icon: "📊", title: "Monthly comparisons", desc: "Track how your total bill changes month over month — no spreadsheets needed." },
            { icon: "⏱", title: "Category splits", desc: "Instantly see which categories eat the most of your budget." },
            { icon: "❤", title: "Health score", desc: "One number that tells you if your subscriptions are under control." },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 20, marginTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </Section>
        <Section style={{ transitionDelay: "0.15s" }}>
          <div style={{ background: "rgba(15,17,32,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>MONTHLY SPENDING</div>
            <svg viewBox="0 0 300 120" style={{ width: "100%", height: 120, marginBottom: 16 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,90 C30,85 60,75 90,70 C120,65 150,55 180,45 C210,35 240,30 270,20 L300,15" fill="none" stroke="#6C5CE7" strokeWidth="2.5" />
              <path d="M0,90 C30,85 60,75 90,70 C120,65 150,55 180,45 C210,35 240,30 270,20 L300,15 L300,120 L0,120Z" fill="url(#chartGrad)" />
              {[0, 60, 120, 180, 240, 300].map((x, i) => (
                <text key={i} x={x} y={115} fontSize="9" fill="rgba(230,224,250,0.4)" textAnchor="middle">
                  {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                </text>
              ))}
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>CATEGORIES</div>
                <div style={{ width: 60, height: 60, borderRadius: "50%", margin: "0 auto", background: "conic-gradient(#E50914 0% 35%, #6C5CE7 35% 65%, #1DB954 65% 80%, rgba(255,255,255,0.1) 80%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(15,17,32,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14 }}>8</div>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>HEALTH SCORE</div>
                <div style={{ width: 60, height: 60, borderRadius: "50%", margin: "0 auto", background: "conic-gradient(#1DB954 0% 82%, rgba(255,255,255,0.1) 82%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(15,17,32,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14 }}>82</div>
                </div>
                <div style={{ textAlign: "center", marginTop: 6, fontSize: 12 }}>
                  <span style={{ background: "rgba(0,184,148,0.2)", color: "#00b894", padding: "2px 8px", borderRadius: 999, fontSize: 11 }}>✓ Good</span>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* AI INSIGHTS */}
      <section className="two-col-section" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(108,92,231,0.08) 0%, transparent 60%)", padding: "80px 48px" }}>
        <Section style={{ transitionDelay: "0.1s" }}>
          <div style={{ background: "rgba(15,17,32,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", letterSpacing: 1 }}>AI INSIGHTS</span>
              <span style={{ fontSize: 12, background: "rgba(108,92,231,0.2)", color: "var(--violet2)", padding: "2px 8px", borderRadius: 6 }}>3 new</span>
            </div>
            <div style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>POTENTIAL SAVINGS FOUND</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 700 }}>$34.87<span style={{ fontSize: 14, fontWeight: 400 }}>/mo</span></div>
            </div>
            {[
              { icon: "⚠", title: "Potential Duplicate Detected", save: "Save $10.99/mo", color: "#fdcb6e", bg: "253,203,110", desc: "Spotify and YouTube Music serve a similar purpose. Cancel one to save $10.99/mo." },
              { icon: "💡", title: "Switch to Annual Billing", save: "Save $23.88/yr", color: "#6C5CE7", bg: "108,92,231", desc: "Switching Notion to annual billing would save you $23.88/yr." },
              { icon: "✓", title: "Great Spending Habits", save: "", color: "#00b894", bg: "0,184,148", desc: "Your entertainment spending is 12% below the average user. Keep it up!" },
            ].map((item, i) => (
              <div key={i} style={{ background: `rgba(${item.bg},0.07)`, border: `1px solid rgba(${item.bg},0.2)`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.icon} {item.title}</span>
                  {item.save && <span style={{ fontSize: 12, color: "#00b894", fontWeight: 600 }}>{item.save}</span>}
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section>
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--violet2)", fontWeight: 600, marginBottom: 16 }}>AI INSIGHTS</div>
          <h2 className="section-title">It catches what you miss</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: 32 }}>
            Paying for Spotify and YouTube Music? Still on a monthly plan when annual is cheaper? SubTracker flags it automatically.
          </p>
          {[
            { icon: "✦", title: "Duplicate detection", desc: "Flags services that overlap so you can drop the one you use less." },
            { icon: "✉", title: "Email scanning", desc: "Connects to Gmail to find subscription receipts you forgot about." },
            { icon: "📄", title: "Statement import", desc: "Upload a bank or card statement — we'll pull out every recurring charge." },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ color: "var(--violet2)", fontSize: 18, marginTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </Section>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 48px", textAlign: "center" }}>
        <Section>
          <h2 className="section-title centered">Set up in under 2 minutes</h2>
          <p style={{ color: "var(--muted)", marginBottom: 60 }}>No lengthy onboarding — just sign up and start adding your subscriptions.</p>
          <div className="three-col-grid">
            {[
              { n: 1, icon: "👤", title: "Sign up free", desc: "Create an account in seconds. No credit card, no commitment." },
              { n: 2, icon: "📋", title: "Add your subs", desc: "Type them in, connect Gmail, or upload a bank statement." },
              { n: 3, icon: "✦", title: "See the full picture", desc: "Get your dashboard, analytics, and AI-powered savings tips instantly." },
            ].map((s, i) => (
              <RevealCard key={i} delay={i * 0.12} style={{ textAlign: "center", padding: "36px 28px" }}>
                <div style={{ width: 40, height: 40, background: "var(--violet)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, margin: "0 auto 16px" }}>{s.n}</div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</div>
              </RevealCard>
            ))}
          </div>
        </Section>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: "40px 48px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="features-grid">
          {features.map((f, i) => (
            <RevealCard key={i} delay={(i % 4) * 0.07}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{f.desc}</div>
            </RevealCard>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "80px 48px 100px", textAlign: "center", background: "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.08) 0%, transparent 60%)" }}>
        <Section>
          <h2 className="section-title centered">Free to start, cheap to scale</h2>
          <p style={{ color: "var(--muted)", marginBottom: 36 }}>Track up to 5 subscriptions forever. Go Pro when you outgrow it.</p>
          <div className="billing-toggle">
            {(["monthly", "annual"] as const).map(t => (
              <button key={t} className={`toggle-btn ${billingToggle === t ? "active" : ""}`} onClick={() => setBillingToggle(t)}>
                {t === "annual" ? "Annual -29%" : "Monthly"}
              </button>
            ))}
          </div>
          <div className="pricing-grid">
            <RevealCard delay={0.05} style={{ maxWidth: 320, width: "100%", textAlign: "left" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Free</div>
              <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Get started with basic tracking</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 44, fontWeight: 800, marginBottom: 4 }}>$0</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>Forever free</div>
              {["Up to 5 subscriptions", "Manual import (CSV/PDF)", "Basic analytics", "Currency conversion", "Payment reminders"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: "var(--violet2)" }}>✓</span> {f}
                </div>
              ))}
              <button className="btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 24 }} onClick={() => onNavigate("register")}>
                Get Started Free
              </button>
            </RevealCard>

            <RevealCard delay={0.1} style={{ maxWidth: 340, width: "100%", textAlign: "left", border: "1px solid rgba(108,92,231,0.4)", background: "rgba(108,92,231,0.1)", position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--violet)", borderRadius: 999, padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>🏆 Most Popular</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Pro ✦</div>
              <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>For people serious about their finances</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 44, fontWeight: 800, marginBottom: 4, color: "var(--violet2)" }}>
                {billingToggle === "annual" ? "$4.99" : "$6.99"}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
                {billingToggle === "annual" ? "per month · $59.88/yr (save 29%)" : "per month · or $59.88/yr (save 29%)"}
              </div>
              {["Unlimited subscriptions", "AI-powered insights", "Advanced analytics", "Priority support", "Multi-device sync", "Export reports"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: "#00b894" }}>✓</span> {f}
                </div>
              ))}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 24 }} onClick={() => onNavigate("register")}>
                Go Pro →
              </button>
            </RevealCard>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <Section>
        <div className="cta-section">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.2)", borderRadius: 999, padding: "8px 18px", fontSize: 14, marginBottom: 32 }}>
            💰 Average user saves <strong style={{ color: "#00b894" }}>$240/year</strong>
          </div>
          <h2 className="section-title centered">Your subscriptions aren&apos;t<br />going to track themselves</h2>
          <p style={{ color: "var(--muted)", fontSize: 16, marginBottom: 40 }}>Takes 2 minutes to set up. Free plan available. You&apos;ll wonder why you didn&apos;t start sooner.</p>
          <div className="hero-ctas">
            <button className="btn-primary lg" onClick={() => onNavigate("register")}>Get Started Free →</button>
            <button className="btn-ghost lg" onClick={() => onNavigate("demo")}>👁 Try Demo</button>
          </div>
        </div>
      </Section>

      {/* QUICK ADD */}
      <Section>
        <div style={{ padding: "0 48px 80px", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "32px" }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Quick Add Popular Services</h3>
            <div className="services-grid">
              {SERVICES.map((s, i) => (
                <div key={i} className="service-tile">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>{s.letter}</div>
                  <span style={{ fontSize: 12, textAlign: "center", color: "var(--muted)" }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "var(--violet)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>◆</div>
          <span style={{ fontWeight: 700, color: "var(--violet2)" }}>SubTracker</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(230,224,250,0.3)", textAlign: "center" }}>© 2026 SubTracker. Built with Next.js + Node.js + MongoDB</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Contact"].map(l => (
            <a key={l} style={{ fontSize: 13, color: "rgba(230,224,250,0.35)", textDecoration: "none", cursor: "pointer" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0b0d18; --bg2: #0f1120;
          --card: rgba(255,255,255,0.04);
          --card-border: rgba(255,255,255,0.07);
          --violet: #6C5CE7; --violet2: #a29bfe; --plum: #9b59b6;
          --text: #f0eeff; --muted: rgba(230,224,250,0.45);
        }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(108,92,231,0.18); border-color: rgba(108,92,231,0.35) !important; }
        .btn-primary {
          background: var(--violet); color: #fff; border: none; padding: 12px 24px;
          border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { background: #7c6cf8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(108,92,231,0.4); }
        .btn-primary.sm { padding: 8px 16px; font-size: 13px; }
        .btn-primary.lg { padding: 14px 28px; font-size: 16px; }
        .btn-ghost {
          background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .btn-ghost.lg { padding: 14px 28px; font-size: 16px; }
        .nav-link { color: var(--muted); font-size: 15px; font-weight: 500; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover, .nav-link.active { color: var(--text); }
        input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 12px 16px; color: var(--text); font-size: 15px;
          font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
        }
        input:focus { border-color: var(--violet); }
        input::placeholder { color: var(--muted); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.4); border-radius: 3px; }
        @keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
        .star {
          position: absolute; background: rgba(162,155,254,0.4); border-radius: 50%;
          animation: twinkle var(--dur, 3s) infinite var(--delay, 0s);
        }

        /* ── Landing nav ── */
        .landing-nav {
          position: sticky; top: 0; z-index: 100; padding: 16px 48px;
          display: flex; align-items: center; gap: 32;
          background: rgba(11,13,24,0.85); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-brand { display: flex; align-items: center; gap: 10; margin-right: auto; }
        .desktop-nav-links { display: flex; gap: 32; margin-right: 40; }
        .desktop-nav-actions { display: flex; gap: 12; }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger span { width: 22px; height: 2px; background: var(--text); border-radius: 2px; display: block; }
        .mobile-menu { display: none; }
        @media (max-width: 768px) {
          .landing-nav { padding: 14px 20px; }
          .desktop-nav-links, .desktop-nav-actions { display: none; }
          .hamburger { display: flex; }
          .mobile-menu {
            display: flex; flex-direction: column; gap: 8px;
            background: rgba(11,13,24,0.98); border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 16px 20px;
          }
          .mobile-link { color: var(--text); font-size: 16px; padding: 10px 0; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }

        /* ── Logo icon sm ── */
        .logo-icon-sm {
          width: 36px; height: 36px; background: var(--violet); border-radius: 10px;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }

        /* ── Hero ── */
        .hero-section {
          padding: 100px 48px 80px;
          background: radial-gradient(ellipse at 50% -10%, rgba(108,92,231,0.2) 0%, transparent 60%);
          text-align: center; position: relative; overflow: hidden;
        }
        .hero-inner { max-width: 760px; margin: 0 auto; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(108,92,231,0.12); border: 1px solid rgba(108,92,231,0.25);
          border-radius: 999px; padding: 8px 18px; font-size: 14px; margin-bottom: 36px;
        }
        .hero-title {
          font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 68px); font-weight: 800;
          line-height: 1.1; margin-bottom: 24px;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--violet), var(--violet2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub { font-size: 18px; color: var(--muted); line-height: 1.7; margin-bottom: 40px; max-width: 560px; margin-left: auto; margin-right: auto; }
        .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
        @media (max-width: 600px) {
          .hero-section { padding: 72px 20px 60px; }
          .hero-sub { font-size: 15px; }
          .hero-badge { font-size: 13px; }
          .hero-ctas .btn-primary.lg, .hero-ctas .btn-ghost.lg { width: 100%; justify-content: center; }
        }

        /* ── Section titles ── */
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(26px, 3vw, 44px); font-weight: 800; margin-bottom: 20px; line-height: 1.2; }
        .section-title.centered { text-align: center; }

        /* ── Stats bar ── */
        .stats-bar {
          padding: 48px; display: flex; justify-content: center; gap: 80px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 600px) { .stats-bar { gap: 32px; padding: 36px 20px; } }

        /* ── Two col section ── */
        .two-col-section {
          padding: 100px 48px; display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; max-width: 1100px; margin: 0 auto; align-items: center;
        }
        @media (max-width: 900px) {
          .two-col-section { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; }
        }

        /* ── Three col grid ── */
        .three-col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 900px; margin: 0 auto; }
        @media (max-width: 768px) { .three-col-grid { grid-template-columns: 1fr; gap: 20px; } }

        /* ── Features grid ── */
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .features-grid { grid-template-columns: 1fr; } }

        /* ── Pricing grid ── */
        .pricing-grid { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-top: 0; }

        /* ── Billing toggle ── */
        .billing-toggle {
          display: inline-flex; background: rgba(255,255,255,0.05); border-radius: 10px;
          padding: 4px; margin-bottom: 48px;
        }
        .toggle-btn {
          padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer;
          background: transparent; color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; transition: all 0.2s;
        }
        .toggle-btn.active { background: var(--violet); color: #fff; }

        /* ── CTA section ── */
        .cta-section {
          padding: 100px 48px; text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(108,92,231,0.15) 0%, transparent 70%);
        }
        @media (max-width: 600px) { .cta-section { padding: 60px 20px; } }

        /* ── Services grid ── */
        .services-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        @media (max-width: 600px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        .service-tile {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 16px 8px; border-radius: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s;
        }
        .service-tile:hover { background: rgba(108,92,231,0.1); border-color: rgba(108,92,231,0.3); transform: translateY(-3px); }

        /* ── Footer ── */
        .site-footer {
          border-top: 1px solid rgba(168,124,160,0.1); padding: 32px 48px;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        @media (max-width: 600px) {
          .site-footer { padding: 24px 20px; flex-direction: column; text-align: center; }
        }

        /* ── Dashboard nav ── */
        .dash-nav {
          padding: 16px 32px; display: flex; align-items: center; gap: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap;
        }
        .nav-logo { display: flex; align-items: center; gap: 10; margin-right: auto; }
        .nav-links { display: flex; gap: 24; }
        .nav-right { display: flex; align-items: center; gap: 16; margin-left: auto; }
        .badge-pro { background: var(--violet); border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 600; }
        .avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--violet); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
        @media (max-width: 768px) {
          .dash-nav { padding: 12px 16px; gap: 12px; }
          .nav-links { display: none; }
        }

        /* ── Demo banner ── */
        .demo-banner {
          background: rgba(108,92,231,0.15); border-bottom: 1px solid rgba(108,92,231,0.2);
          padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12; flex-wrap: wrap;
        }
        .demo-banner span { font-size: 14px; color: var(--muted); }

        /* ── Dash content ── */
        .dash-content { padding: 32px; }
        @media (max-width: 768px) { .dash-content { padding: 16px; } }

        /* ── Stats grid ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; } }

        /* ── Main grid ── */
        .main-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

        /* ── Subs card ── */
        .subs-card { background: var(--card); border: 1px solid var(--card-border); border-radius: 16px; overflow: hidden; }
        .subs-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 12; }
        .sub-row {
          padding: 16px 24px; display: flex; align-items: center; gap: 16;
          border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.2s;
        }
        .sub-row:hover { background: rgba(255,255,255,0.03); }
        @media (max-width: 480px) { .sub-row { padding: 12px 16px; gap: 12; } }

        /* ── Preview frame ── */
        .preview-frame {
          background: rgba(15,17,32,0.95); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }
        .preview-bar {
          padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 8px;
        }
        .preview-url {
          flex: 1; background: rgba(255,255,255,0.05); border-radius: 6px;
          padding: 4px 12px; font-size: 12px; color: var(--muted); text-align: center;
        }
        .preview-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
        @media (max-width: 600px) { .preview-stats { grid-template-columns: repeat(2, 1fr); } }
        .preview-bottom { display: grid; grid-template-columns: 1fr 200px; gap: 16px; }
        .preview-cats { min-width: 0; }
        @media (max-width: 600px) { .preview-bottom { grid-template-columns: 1fr; } .preview-cats { display: none; } }

        /* ── Section padding adjustments ── */
        @media (max-width: 768px) {
          .two-col-section { padding: 60px 20px; }
          section[style*="padding: 100px 48px"] { padding: 60px 20px !important; }
          section[style*="padding: 80px 48px"] { padding: 60px 20px !important; }
          section[style*="padding: 40px 48px"] { padding: 40px 20px !important; }
          .site-footer { padding: 24px 20px; }
        }
      `}</style>

      {page === "landing" && <LandingPage onNavigate={setPage} />}
      {page === "demo" && <DemoDashboard onNavigate={setPage} />}
    </>
  );
}
