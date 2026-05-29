'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const subs = [
  {
    name: 'Netflix',
    color: '#E50914',
    amount: '₹649',
    due: 'Mar 05',
  },
  {
    name: 'Spotify',
    color: '#1DB954',
    amount: '₹119',
    due: 'Mar 12',
  },
  {
    name: 'Notion',
    color: '#8B5CF6',
    amount: '₹799',
    due: 'Mar 18',
  },
  {
    name: 'iCloud',
    color: '#3B82F6',
    amount: '₹75',
    due: 'Mar 24',
  },
];

export default function HomePage() {
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hero = useInView();
  const features = useInView();
  const pricing = useInView();
  const analytics = useInView();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="page">
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'navbarScrolled' : ''}`}>
        <div className="logoWrap">
          <div className="logoBox">S</div>
          <span className="logoText">SubTracker</span>
        </div>

        <div className="navLinks">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="navBtns">
          <Link href="/login" className="loginBtn">
            Login
          </Link>

          <Link href="/register" className="primaryBtn">
            Get Started →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="heroSection" ref={hero.ref}>
        <div className="heroGlow" />

        <div className={`heroBadge ${hero.inView ? 'show' : ''}`}>
          🔥 Trusted by 2,000+ users
        </div>

        <h1 className={`heroTitle ${hero.inView ? 'show' : ''}`}>
          Track all your
          <span> subscriptions </span>
          in one place
        </h1>

        <p className={`heroDesc ${hero.inView ? 'show' : ''}`}>
          Manage Netflix, Spotify, Notion, iCloud and every recurring payment
          with a beautiful dashboard.
        </p>

        <div className={`heroButtons ${hero.inView ? 'show' : ''}`}>
          <Link href="/register" className="primaryBtn bigBtn">
            Start Free →
          </Link>

          <Link href="/login" className="secondaryBtn bigBtn">
            Live Demo
          </Link>
        </div>

        {/* DASHBOARD */}
        <div className={`dashboard ${hero.inView ? 'show' : ''}`}>
          <div className="dashboardTop">
            <div className="dots">
              <span />
              <span />
              <span />
            </div>

            <div className="browserBar">
              subtracker.online/dashboard
            </div>
          </div>

          <div className="dashboardBody">
            <div className="statsGrid">
              <div className="card">
                <p>Monthly Spending</p>
                <h3>₹8,491</h3>
              </div>

              <div className="card">
                <p>Yearly Total</p>
                <h3>₹1,01,892</h3>
              </div>

              <div className="card">
                <p>Subscriptions</p>
                <h3>8 Active</h3>
              </div>

              <div className="card">
                <p>Next Payment</p>
                <h3>Netflix</h3>
              </div>
            </div>

            <div className="dashboardBottom">
              <div className="subsCard">
                <div className="cardTitle">Subscriptions</div>

                {subs.map((sub, index) => (
                  <div className="subRow" key={index}>
                    <div className="subLeft">
                      <div
                        className="subIcon"
                        style={{ background: sub.color }}
                      >
                        {sub.name.charAt(0)}
                      </div>

                      <div>
                        <h4>{sub.name}</h4>
                        <p>Due {sub.due}</p>
                      </div>
                    </div>

                    <div className="subPrice">{sub.amount}</div>
                  </div>
                ))}
              </div>

              <div className="chartCard">
                <div className="cardTitle">Spending Analytics</div>

                <div className="fakeChart">
                  <div className="line" />
                </div>

                <div className="chartInfo">
                  <div>
                    <span className="dot red" />
                    Entertainment
                  </div>

                  <div>
                    <span className="dot purple" />
                    Productivity
                  </div>

                  <div>
                    <span className="dot green" />
                    Music
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="featuresSection"
        ref={features.ref}
      >
        <div className={`sectionHeader ${features.inView ? 'show' : ''}`}>
          <h2>Everything you need</h2>

          <p>
            Built to help you stop wasting money on subscriptions you forgot.
          </p>
        </div>

        <div className="featuresGrid">
          {[
            'Payment reminders',
            'Analytics dashboard',
            'AI insights',
            'Monthly reports',
            'Budget tracking',
            'Unlimited subscriptions',
          ].map((feature, index) => (
            <div
              className={`featureCard ${features.inView ? 'show' : ''}`}
              key={index}
            >
              <div className="featureIcon">✨</div>

              <h3>{feature}</h3>

              <p>
                Beautiful modern UI with advanced analytics and smart tracking.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="analyticsSection" ref={analytics.ref}>
        <div className={`analyticsLeft ${analytics.inView ? 'show' : ''}`}>
          <span className="smallTitle">ANALYTICS</span>

          <h2>
            See where your
            <span> money goes</span>
          </h2>

          <p>
            Detailed charts and reports help you understand your recurring
            expenses and save money every month.
          </p>

          <div className="analyticsList">
            <div>✔ Monthly comparisons</div>
            <div>✔ Spending categories</div>
            <div>✔ Smart AI insights</div>
          </div>
        </div>

        <div className={`analyticsCard ${analytics.inView ? 'show' : ''}`}>
          <div className="analyticsChart">
            <div className="chartLine" />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricingSection" ref={pricing.ref}>
        <div className={`sectionHeader ${pricing.inView ? 'show' : ''}`}>
          <h2>Simple pricing</h2>

          <p>Start free and upgrade anytime.</p>
        </div>

        <div className="pricingToggle">
          <button
            className={!annual ? 'activeToggle' : ''}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>

          <button
            className={annual ? 'activeToggle' : ''}
            onClick={() => setAnnual(true)}
          >
            Annual
          </button>
        </div>

        <div className="pricingGrid">
          <div className={`priceCard ${pricing.inView ? 'show' : ''}`}>
            <h3>Free</h3>

            <h1>₹0</h1>

            <p>Perfect to get started</p>

            <ul>
              <li>✔ Up to 5 subscriptions</li>
              <li>✔ Analytics dashboard</li>
              <li>✔ Payment reminders</li>
            </ul>

            <Link href="/register" className="secondaryBtn priceBtn">
              Get Started
            </Link>
          </div>

          <div
            className={`priceCard proCard ${
              pricing.inView ? 'show' : ''
            }`}
          >
            <div className="popularTag">MOST POPULAR</div>

            <h3>Pro</h3>

            <h1>{annual ? '₹349' : '₹499'}</h1>

            <p>Advanced tracking & AI features</p>

            <ul>
              <li>✔ Unlimited subscriptions</li>
              <li>✔ AI recommendations</li>
              <li>✔ Advanced analytics</li>
              <li>✔ Priority support</li>
            </ul>

            <Link href="/register" className="primaryBtn priceBtn">
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaSection">
        <div className="ctaGlow" />

        <h2>Stop losing money every month</h2>

        <p>
          Join thousands of users already tracking their subscriptions.
        </p>

        <Link href="/register" className="primaryBtn bigBtn">
          Start Tracking Free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="logoWrap">
          <div className="logoBox">S</div>
          <span className="logoText">SubTracker</span>
        </div>

        <p>© 2026 SubTracker. All rights reserved.</p>
      </footer>
    </main>
  );
}