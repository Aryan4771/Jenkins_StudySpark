import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TasksContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
// minimal custom css for calendar in App.css or just style via JS
import { Calendar as CalIcon, Clock, AlertCircle } from "lucide-react";

export default function CalendarView() {
  const { plan } = useAuth();
  const { tasks } = useTasks();
  const [date, setDate] = useState(new Date());

  const tasksWithDue = tasks.filter(t => t.dueAt);
  
  // get tasks for selected date
  const selectedDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const tasksForDate = tasksWithDue.filter(t => t.dueAt === selectedDateStr);

  if (plan !== "pro") {
    return (
      <main className="container row" style={{ justifyContent: "center" }}>
        <motion.div className="panel" style={{ textAlign: "center", padding: "40px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CalIcon size={48} color="var(--secondary)" style={{ marginBottom: "16px" }} />
          <h2 style={{ marginTop: 0 }}>Pro Feature</h2>
          <p className="meta" style={{ maxWidth: "300px", margin: "0 auto" }}>
            The visual Deadline Calendar tracker is exclusive to StudySpark Pro members. Visit the Plans page to upgrade!
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container row" style={{ alignItems: "flex-start" }}>
      
      {/* Calendar Panel */}
      <motion.div className="panel" style={{ flex: "1 1 350px" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "10px", color: "var(--accent)" }}>
          <CalIcon /> Calendar Tracker
        </h2>
        
        {/* overriding react-calendar styles via simple wrapper */}
        <div className="custom-calendar-wrapper">
          <Calendar 
            onChange={setDate} 
            value={date} 
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const hasTask = tasksWithDue.some(t => t.dueAt === dStr);
                return hasTask ? <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", margin: "4px auto 0" }}></div> : null;
              }
            }}
          />
        </div>
      </motion.div>

      {/* Deadlines Panel */}
      <motion.div className="panel" style={{ flex: "1 1 350px" }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h3 style={{ marginTop: 0 }}>Deadlines for {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</h3>
        
        <div className="task-list">
          <AnimatePresence>
            {tasksForDate.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="meta">No deadlines assigned to this date.</motion.p>
            ) : (
              tasksForDate.map((t, idx) => (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="task" 
                  style={{ gridTemplateColumns: "1fr", padding: "16px" }}
                >
                  <div style={{ fontWeight: 600, fontSize: "16px", color: t.done ? "var(--muted)" : "var(--text)", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                    <span className={`badge ${t.priority.toLowerCase()}`}><AlertCircle size={12} style={{marginRight: "4px", display: "inline-block", verticalAlign: "middle"}}/>{t.priority}</span>
                    <span className="badge" style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {t.subject || "General"}</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
