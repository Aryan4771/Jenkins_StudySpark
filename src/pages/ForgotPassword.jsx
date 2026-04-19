// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      await resetPassword(email);
      setMsg("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setErr(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: 520,
        backgroundColor: "#000",
        color: "white",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #333",
      }}
    >
      <h2 style={{ color: "#22c55e", marginBottom: 6 }}>Forgot Password</h2>
      <p className="meta" style={{ marginTop: 0, color: "#9ca3af" }}>
        Enter the email you used to sign up. We’ll send a reset link.
      </p>

      {msg && <p style={{ color: "#16a34a", marginTop: 8 }}>{msg}</p>}
      {err && <p style={{ color: "#ef4444", marginTop: 8 }}>{err}</p>}

      <form
        className="row"
        onSubmit={handleSubmit}
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Email field full width */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <label
            style={{
              color: "white",
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              backgroundColor: "black",
              color: "white",
              border: "1px solid white",
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Buttons — perfectly aligned and equal width */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: 16,
            marginTop: 10,
          }}
        >
          <button
            type="submit"
            disabled={loading}
            className="btn primary"
            style={{
              flex: 1,
              borderRadius: "8px",
              padding: "12px 0",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={() => navigate("/login")}
            style={{
              flex: 1,
              backgroundColor: "black",
              color: "white",
              border: "1px solid white",
              borderRadius: "8px",
              padding: "12px 0",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Back to Login
          </button>
        </div>
      </form>

      <p className="meta" style={{ marginTop: 24, color: "#9ca3af" }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "#60a5fa" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
