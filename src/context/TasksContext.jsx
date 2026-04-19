// src/context/TasksContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const TasksContext = createContext();
export function useTasks(){ return useContext(TasksContext); }

function tasksStorageKey(uid) {
  return uid ? `studyspark:tasks:${uid}` : null;
}

function readStoredTasks(uid) {
  if (!uid) return [];

  try {
    const raw = window.localStorage.getItem(tasksStorageKey(uid));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredTasks(uid, tasks) {
  if (!uid) return;

  try {
    window.localStorage.setItem(tasksStorageKey(uid), JSON.stringify(tasks));
  } catch {
    // Ignore storage failures; the in-memory state still works.
  }
}

export function TasksProvider({ children }){
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ subject: "All", priority: "All", query: "" });

  // Load tasks for the signed-in user from localStorage.
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    setTasks(readStoredTasks(user.uid));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    writeStoredTasks(user.uid, tasks);
  }, [tasks, user]);

  // subjects derived from tasks
  const subjects = useMemo(() => {  
    const s = new Set();
    tasks.forEach(t => t.subject && s.add(t.subject));
    return Array.from(s).sort();
  }, [tasks]);

  // create a task 
  async function addTask({ title, subject, priority, dueAt, done = false, ...extraFields }){
    if(!user) return;

    const task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      subject: subject.trim(),
      priority,
      done,
      ...(dueAt ? { dueAt } : {}),
      createdAt: Date.now(),
      ...extraFields,
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    return task;
  }

  // toggle done
  async function toggleDone(id, done){
    if(!user) return;
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, done: !done } : task))
    );
  }

  // delete
  async function removeTask(id){
    if(!user) return;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  async function updateTask(id, updates) {
    if (!user) return;
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  const value = {
    tasks,
    filters, setFilters,
    addTask, toggleDone, removeTask, updateTask,
    subjects
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
