'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 40%), #080d1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              margin: '0 auto 20px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg,#4f46e5,#818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
            }}
          >
            S
          </div>

          <h1
            style={{
              fontSize: '34px',
              fontWeight: '800',
              marginBottom: '10px',
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '15px',
            }}
          >
            Login to your SubTracker account
          </p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)',
                padding: '0 16px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0 16px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <input type="checkbox" />
              Remember me
            </label>

            <a
              href="#"
              style={{
                color: '#818cf8',
                textDecoration: 'none',
              }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              height: '54px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 10px 40px rgba(99,102,241,0.35)',
            }}
          >
            Login →
          </button>
        </form>

        <div
          style={{
            marginTop: '28px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{
              color: '#818cf8',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Create Account
          </Link>
        </div>

        <div
          style={{
            marginTop: '28px',
            textAlign: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}