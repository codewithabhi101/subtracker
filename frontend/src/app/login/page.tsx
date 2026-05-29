'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue managing subscriptions</p>

        <form className="authForm">
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />

          <button type="submit">Login</button>
        </form>

        <div className="authBottom">
          Don't have an account?
          <Link href="/register"> Register</Link>
        </div>
      </div>
    </div>
  );
}