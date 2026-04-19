import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Zap, X, ShieldCheck } from "lucide-react";

export default function Plans(){
  const { plan, setUserPlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);

  const handleProUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowRazorpayMock(true);
    }, 800);
  };

  const handleMockSuccess = () => {
    setShowRazorpayMock(false);
    setUserPlan("pro");
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2dd4bf', '#a855f7']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2dd4bf', '#a855f7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const card = {
    background: "rgba(15,23,42,0.6)",
    border: "1px solid var(--panel-border)",
    borderRadius: 14,
    padding: "32px",
    flex: "1 1 300px",
    backdropFilter: "blur(20px)",
    position: "relative",
    overflow: "hidden"
  };

  const pill = {
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid var(--panel-border)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    fontWeight: "bold",
    color: "var(--accent)",
    background: "rgba(255,255,255,0.05)"
  };

  return (
    <main className="container">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "36px", margin: "0 0 16px" }}>Choose Your Plan</h2>
          <p className="meta" style={{ fontSize: "16px" }}>
            Current plan: <span style={pill}>{plan.toUpperCase()}</span>
          </p>
        </div>

        <div className="row" style={{ alignItems: "stretch", justifyContent: "center" }}>
          
          {/* FREE PLAN */}
          <section style={card}>
            <h3 style={{ margin: "0 0 8px", fontSize: "24px" }}>Free Builder</h3>
            <p className="meta" style={{ margin: "0 0 24px" }}>Perfect for organizing simple tasks.</p>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>$0<span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "normal" }}>/mo</span></div>
            
            <ul className="meta" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--success)"/> Unlimited Tasks</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--success)"/> Basic Pomodoro Hooks</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--panel-border)" }}><CheckCircle2 size={16} /> Due Date Calendar Tracking</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--panel-border)" }}><CheckCircle2 size={16} /> Advanced Gamification</li>
            </ul>

            <button
              className="btn"
              style={{ width: "100%", height: "45px" }}
              disabled={plan === "free"}
              onClick={() => setUserPlan("free")}
            >
              {plan === "free" ? "Active" : "Downgrade"}
            </button>
          </section>

          {/* PRO PLAN */}
          <section style={{...card, border: "2px solid var(--accent)", boxShadow: "0 0 40px rgba(45, 212, 191, 0.1)"}}>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "6px 12px", background: "var(--accent)", color: "#022c22", fontWeight: "bold", fontSize: "12px", borderBottomLeftRadius: "12px" }}>RECOMMENDED</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "24px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", textShadow: "0 0 10px var(--accent-glow)" }}>
              <Zap fill="var(--accent)"/> Pro Scholar
            </h3>
            <p className="meta" style={{ margin: "0 0 24px" }}>Unlock complete study dominance.</p>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>₹499<span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "normal" }}>/life</span></div>
            
            <ul className="meta" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", color: "var(--text)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--accent)"/> Everything in Free</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--accent)"/> Due Dates & Deadlines List</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--accent)"/> Full Calendar Visualizer</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={16} color="var(--accent)"/> Exclusive Profile Badges</li>
            </ul>

            <button
              className="btn primary"
              style={{ width: "100%", height: "45px" }}
              disabled={plan === "pro" || loading}
              onClick={handleProUpgrade}
            >
              {loading ? "Loading Gateway..." : plan === "pro" ? "Pro Activated" : "Pay with Razorpay"}
            </button>
          </section>

        </div>
      </motion.div>

      {/* Razorpay Mock UI */}
      <AnimatePresence>
        {showRazorpayMock && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowRazorpayMock(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", width: "90%", maxWidth: "400px", borderRadius: "8px", overflow: "hidden", color: "#333", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            >
              <div style={{ background: "#2dd4bf", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#000", fontWeight: "bold" }}>
                  <ShieldCheck size={20} />
                  StudySpark Razorpay Prototype
                </div>
                <X size={20} color="#000" cursor="pointer" onClick={() => setShowRazorpayMock(false)} />
              </div>
              
              <div style={{ padding: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "14px", color: "#666" }}>Total Payable Amount</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold", color: "#000" }}>₹ 499.00</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Transaction ID: order_test_{Math.floor(Math.random() * 1000000)}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={handleMockSuccess} style={{ background: "#111", color: "#fff", padding: "14px", borderRadius: "4px", border: "none", fontWeight: "bold", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                    Mock Successful Payment
                  </button>
                  <button onClick={() => setShowRazorpayMock(false)} style={{ background: "transparent", color: "#666", padding: "14px", borderRadius: "4px", border: "1px solid #ddd", fontWeight: "bold", cursor: "pointer" }}>
                    Simulate Failure / Cancel
                  </button>
                </div>
                
                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#999", display: "flex", justifyContent: "center", gap: "4px", alignItems: "center" }}>
                  Secured by <b>Razorpay Test Mode</b>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
