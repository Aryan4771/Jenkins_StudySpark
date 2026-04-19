import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TasksContext.jsx";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, User, Shield, Zap, Award } from "lucide-react";

export default function Profile() {
  const { user, logout, plan } = useAuth();
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    let focusMinutes = 0;
    let completedTasks = 0;
    const dates = new Set();
    
    tasks.forEach(t => {
      if (t.done) {
        completedTasks++;
        if (t.focusedAt) {
          const d = new Date(t.focusedAt);
          dates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
        }
      }
      if (t.focusDurationSec) focusMinutes += Math.floor(t.focusDurationSec / 60);
    });

    const xp = (completedTasks * 50) + (focusMinutes * 10);
    const level = Math.floor(Math.pow(xp, 0.4)) || 1;
    const currentLevelXP = Math.pow(level, 2.5);
    const nextLevelXP = Math.pow(level + 1, 2.5);
    const progress = Math.min(100, Math.max(0, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)) || 0;

    // Badges calculation
    const badges = [];
    if (completedTasks >= 1) badges.push({ name: "First Steps", icon: <Target className="text-blue-400" />, desc: "Complete 1 task" });
    if (completedTasks >= 20) badges.push({ name: "Task Master", icon: <Shield className="text-emerald-400" />, desc: "Complete 20 tasks" });
    if (focusMinutes >= 60) badges.push({ name: "Deep Diver", icon: <Zap className="text-purple-400" />, desc: "1 Hour of Focus" });
    if (dates.size >= 3) badges.push({ name: "Consistent", icon: <Flame className="text-orange-400" />, desc: "3 Day Streak" });

    return { streak: dates.size, xp, level, progress, badges, completedTasks, focusMinutes };
  }, [tasks]);

  if (!user) {
    return (
      <main className="container">
        <section className="panel" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Not Logged In</h2>
          <p className="meta">Please login or sign up to view your profile.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Profile Header */}
        <section className="panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, var(--accent-glow), transparent 70%)", filter: "blur(50px)" }}></div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(15, 23, 42, 0.8)", border: "3px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", marginBottom: "16px", color: "var(--accent)", boxShadow: "0 0 20px var(--accent-glow)" }}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            
            {/* Level Badge placed overlapping avatar */}
            <div style={{ position: "absolute", bottom: "10px", right: "-10px", background: "var(--secondary)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 0 15px var(--secondary-glow)" }}>
              Lv. {stats.level}
            </div>
          </div>

          <h2 style={{ margin: "10px 0 4px 0" }}>{user.displayName || "Scholar"}</h2>
          <span className="meta">{user.email}</span>

          <div style={{ width: "100%", maxWidth: "400px", marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
               <span>XP Progress</span>
               <span style={{ color: "var(--accent)" }}>{Math.floor(stats.xp)} XP</span>
            </div>
            <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
               <motion.div initial={{ width: 0 }} animate={{ width: `${stats.progress}%` }} transition={{ duration: 1, delay: 0.5 }} style={{ height: "100%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent-glow)" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <span className="badge" style={{ padding: "8px 16px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={16} /> {plan === 'pro' ? 'Pro Member' : 'Free Plan'}
            </span>
            <span className="badge high" style={{ padding: "8px 16px", fontSize: "14px", background: "rgba(245, 158, 11, 0.1)", color: "#fcd34d", borderColor: "rgba(245, 158, 11, 0.4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Flame size={16} /> {stats.streak} Day Streak
            </span>
          </div>
        </section>

        {/* Badges Section */}
        <section className="panel">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Trophy color="var(--secondary)" />
            <h2 style={{ margin: 0 }}>Achievements</h2>
          </div>
          
          <div className="row" style={{ gap: "20px" }}>
            {stats.badges.length === 0 ? (
              <p className="meta">Keep studying to earn badges!</p>
            ) : (
              stats.badges.map((b, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.1 + 0.3 }}
                  key={b.name} 
                  style={{ flex: "1 1 140px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}
                >
                  <div style={{ padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "50%", boxShadow: "inset 0 0 10px rgba(255,255,255,0.05)" }}>
                    {b.icon || <Award />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>{b.name}</div>
                    <div className="meta" style={{ fontSize: "12px", marginTop: "4px" }}>{b.desc}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <h3>Account Settings</h3>
          <p className="meta">Manage your account preferences and data.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px" }}>
            <button className="btn danger" onClick={logout} style={{ flex: "1 1 200px" }}>
              Logout securely
            </button>
          </div>
        </section>

      </motion.div>
    </main>
  );
}
