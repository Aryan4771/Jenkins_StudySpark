import React, { useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trash2 } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, index }) {
  const { id, title, subject, priority, done, dueAt } = task;

  const handleToggle = useCallback((e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Get coordinates of the checkbox
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#2dd4bf', '#a855f7', '#fcd34d']
      });
    }
    onToggle(id, !done);
  }, [id, done, onToggle]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index ? Math.min(index * 0.05, 0.5) : 0 }}
      className="task"
    >
      {/* col 1: checkbox */}
      <input
        className="check"
        type="checkbox"
        checked={!!done}
        onChange={handleToggle}
        aria-label="Mark complete"
      />

      {/* col 2: content */}
      <div className="task-content">
        <div className={`task-title ${done ? "done" : ""}`}>{title}</div>
        <div className="task-meta">
          <span className="badge" style={{ background: "transparent", padding: 0, border: "none" }}>{subject || "General"}</span>
          <span className={`badge ${String(priority || "Medium").toLowerCase()}`}>
            {priority || "Medium"}
          </span>
          {dueAt && <span className="badge">Due: {dueAt}</span>}
        </div>
      </div>

      {/* col 3: actions */}
      <div className="task-actions">
        <button className="btn danger" onClick={() => onDelete(id)} style={{ padding: "8px", borderRadius: "8px" }}>
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
