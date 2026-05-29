'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="authPage">
      <div className="authCard">
        <h1>Create Account 🚀</h1>
        <p>Start tracking your subscriptions today</p>

        <form className="authForm">
          <input type="text" placeholder="Full name" />
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />

          <button type="submit">Create Account</button>
        </form>

        <div className="authBottom">
          Already have an account?
          <Link href="/login"> Login</Link>
        </div>
      </div>
    </div>
  );
}