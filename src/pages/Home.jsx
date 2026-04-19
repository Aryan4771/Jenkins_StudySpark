import React from "react";
import { useTasks } from "../context/TasksContext.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Home(){
  const { tasks, addTask, toggleDone, removeTask } = useTasks();

  return (
    <main className="container">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Add Task</h2>
        <TaskForm onAdd={addTask} />
      </section>

      <section className="panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ marginTop: 0 }}>Tasks</h2>
          <span className="meta">{tasks.length} total</span>
        </div>

        <TaskList tasks={tasks} onToggle={toggleDone} onDelete={removeTask} />

        {tasks.length === 0 && (
          <p className="meta" style={{ textAlign: "center" }}>
            No tasks yet — add your first above! 📝
          </p>
        )}
      </section>

      <footer className="footer">StudySpark • Simple React · LocalStorage · Filters</footer>
    </main>
  );
}
