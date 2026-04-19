// src/pages/TasksOnly.jsx
import React, { useMemo } from "react";
import { useTasks } from "../context/TasksContext.jsx";
import TaskList from "../components/TaskList.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function TasksOnly() {
  const { tasks, filters, setFilters, toggleDone, removeTask, subjects } =
    useTasks();

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const bySubject =
        filters.subject === "All" || t.subject === filters.subject;
      const byPriority =
        filters.priority === "All" || t.priority === filters.priority;
      const byQuery =
        !filters.query ||
        (t.title &&
          t.title.toLowerCase().includes(filters.query.toLowerCase()));
      return bySubject && byPriority && byQuery;
    });
  }, [tasks, filters]);

  return (
    <main className="container">
      <section className="panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Filter Your Tasks</h2>
          <span className="meta">
            {filtered.length} shown · {tasks.length} total
          </span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <FilterBar
            subjects={["All", ...subjects]}
            value={filters}
            onChange={setFilters}
          />
        </div>

        <TaskList
          tasks={filtered}
          onToggle={toggleDone}
          onDelete={removeTask}
        />

        {tasks.length === 0 && (
          <p className="meta" style={{ textAlign: "center" }}>
            No tasks yet. Go to Home to add your first one.
          </p>
        )}
      </section>
    </main>
  );
}
