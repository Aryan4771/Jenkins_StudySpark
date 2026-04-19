// src/components/Navbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useFocus } from "../context/FocusContext.jsx";
import { Home, LayoutDashboard, Calendar as CalIcon, ListTodo, Users, Crown, Zap, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, plan } = useAuth();
  const { openSetup, session, pause, resume, cancel } = useFocus();

  // Use global class .btn instead of baseBtn

  // simple timer text without hooks
  const remainingSec = session?.remainingSec ?? null;
  const timeText =
    remainingSec != null
      ? `${String(Math.floor(remainingSec / 60)).padStart(2, "0")}:${String(
          remainingSec % 60
        ).padStart(2, "0")}`
      : null;

  const location = useLocation();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "16px 24px",
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--panel-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: 24,
          cursor: "pointer",
          color: "var(--accent)",
          textShadow: "0 0 20px var(--accent-glow)",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        onClick={() => navigate("/")}
      >
        <Zap size={28} color="#2dd4bf" />
        StudySpark
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button className={`btn ${location.pathname === "/" ? "primary" : ""}`} onClick={() => navigate("/")}>
          <Home size={18} /> Home
        </button>
        <button className={`btn ${location.pathname === "/dashboard" ? "primary" : ""}`} onClick={() => navigate("/dashboard")}>
          <LayoutDashboard size={18} /> Analytics
        </button>
        {plan === "pro" && (
          <button className={`btn ${location.pathname === "/calendar" ? "primary" : ""}`} onClick={() => navigate("/calendar")}>
            <CalIcon size={18} /> Calendar
          </button>
        )}
        <button className={`btn ${location.pathname === "/tasks" ? "primary" : ""}`} onClick={() => navigate("/tasks")}>
          <ListTodo size={18} /> Tasks
        </button>
        <button className={`btn ${location.pathname === "/groups" ? "primary" : ""}`} onClick={() => navigate("/groups")}>
          <Users size={18} /> Groups
        </button>
        <button className={`btn ${location.pathname === "/plans" ? "primary" : ""}`} onClick={() => navigate("/plans")}>
          <Crown size={18} /> Plans
        </button>

        {/* Focus button */}
        <button className="btn primary" style={{boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)", background: "linear-gradient(135deg, var(--secondary) 0%, #7e22ce 100%)", color: "white" }} onClick={() => openSetup(null)}>
          <Zap size={18} /> Focus Mode
        </button>

        {/* If a session is running or paused, show a tiny HUD in navbar */}
        {session && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="badge" style={{ borderColor: "#374151" }}>
              {session.title || "Focus"} • {timeText}
            </span>
            {session.running ? (
              <button className="btn" onClick={pause} title="Pause">
                Pause
              </button>
            ) : (
              <button className="btn" onClick={resume} title="Resume">
                Resume
              </button>
            )}
            <button className="btn danger" onClick={cancel} title="Cancel">
              ×
            </button>
          </div>
        )}


        {user ? (
          <>
            <span className="badge" style={{ borderColor: "rgba(168, 85, 247, 0.3)", color: "var(--secondary)" }}>
              {(plan || "free").toUpperCase()}
            </span>
            <button className="btn" onClick={() => navigate("/profile")}>
              <User size={18} /> Profile
            </button>
            <button className="btn danger" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn primary" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
