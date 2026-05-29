"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !pass) {
      alert("Please fill all fields");
      return;
    }

    alert("Account Created Successfully!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "radial-gradient(circle at top, rgba(124,58,237,0.25), #050816 70%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          maxHeight: "95vh",
          overflowY: "auto",
          background: "rgba(10,12,30,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "28px 24px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          color: "white",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 22px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ◆
        </div>

        {/* TITLE */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "42px",
            fontWeight: 700,
            marginBottom: "12px",
            lineHeight: 1.1,
          }}
        >
          Create account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#8b90a7",
            marginBottom: "30px",
            fontSize: "17px",
          }}
        >
          Start tracking for free
        </p>

        {/* GOOGLE BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            background: "#1b1d36",
            color: "white",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "26px",
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <span
            style={{
              color: "#72778f",
              fontSize: "12px",
              letterSpacing: "1px",
              whiteSpace: "nowrap",
            }}
          >
            OR CONTINUE WITH EMAIL
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* FULL NAME */}
        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Full Name
          </label>

          <input
            type="text"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: "26px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Min. 8 characters"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "18px",
            marginBottom: "24px",
          }}
        >
          Create Account →
        </button>

        {/* SIGN IN */}
        <p
          style={{
            textAlign: "center",
            color: "#7f859e",
            fontSize: "16px",
          }}
        >
          Already have an account?
          <span
            style={{
              color: "#a78bfa",
              cursor: "pointer",
              marginLeft: "6px",
            }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

/* GOOGLE ICON */
function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1b1d36",
  color: "white",
  outline: "none",
  fontSize: "16px",
};
```