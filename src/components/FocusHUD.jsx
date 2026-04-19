import React from "react";
import { useFocus } from "../context/FocusContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X, CheckSquare } from "lucide-react";

export default function FocusHUD() {
  const { session, pause, resume, cancel, complete } = useFocus();

  const remainingSec = session?.remainingSec ?? 0;
  
  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");
  const mmss = `${mm}:${ss}`;

  return (
    <AnimatePresence>
      {session && (
        <motion.div 
          className="focus-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "var(--text)" }}>{session.title}</h2>
              <span className="badge" style={{ fontSize: "14px", padding: "6px 16px" }}>
                {session.subject || "Deep Work"}
              </span>
            </div>

            <div className={`focus-ring ${!session.running ? "paused" : ""}`}>
              <div style={{ position: "relative", zIndex: 10, textAlign: "center", textShadow: "0 0 30px rgba(0,0,0,0.5)" }}>
                <div style={{ fontSize: "80px", fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1, color: "var(--text)" }}>
                  {mmss}
                </div>
                {!session.running && <div style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "14px", marginTop: "8px" }}>PAUSED</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "60px" }}>
              {session.running ? (
                <button className="btn focus" onClick={pause} style={{ padding: "16px", borderRadius: "50%" }}>
                  <Pause size={24} />
                </button>
              ) : (
                <button className="btn primary" onClick={resume} style={{ padding: "16px", borderRadius: "50%" }}>
                  <Play size={24} color="#022c22" />
                </button>
              )}
              
              <button className="btn danger" onClick={cancel} style={{ padding: "16px", borderRadius: "50%" }}>
                <X size={24} />
              </button>

              <button className="btn" onClick={() => complete(true)} style={{ padding: "16px 24px", borderRadius: "30px", background: "var(--secondary)", color: "white", border: "none", boxShadow: "0 0 20px var(--secondary-glow)" }}>
                <CheckSquare size={20} style={{ marginRight: "8px" }} /> Mark Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
