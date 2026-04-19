import React from "react";
import TaskItem from "./TaskItem.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="meta">No matching tasks.</motion.div>;
  }

  return (
    <motion.div layout className="task-list">
      <AnimatePresence>
        {tasks.map((t, index) => (
          <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
