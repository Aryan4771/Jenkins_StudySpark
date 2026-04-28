// src/components/TaskForm.jsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // reads plan from Auth
// no need to read from TasksContext here

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskForm({ onAdd, subjects }) {
  const { plan } = useAuth(); // get current plan (free/pro)

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueAt, setDueAt] = useState(""); // due date state

  const canSubmit = title.trim() && subject.trim();
  const subjectList = useMemo(() => subjects || [], [subjects]);
  const titleInputId = "task-form-title";
  const subjectInputId = "task-form-subject";
  const priorityInputId = "task-form-priority";
  const dueDateInputId = "task-form-due-date";

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = { title, subject, priority };
    // include due date for Pro users
    if (plan === "pro" && dueAt) payload.dueAt = dueAt;

    onAdd(payload);

    // reset
    setTitle("");
    setSubject("");
    setPriority("Medium");
    setDueAt("");
  }

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="field" style={{ flex: "2 1 240px" }}>
        <label htmlFor={titleInputId}>Title</label>
        <input
          id={titleInputId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Full Stacks"
        />
      </div>

      <div className="field" style={{ flex: "1 1 180px" }}>
        <label htmlFor={subjectInputId}>Subject</label>
        <input
          id={subjectInputId}
          list="subjects"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. SIT313"
        />
        <datalist id="subjects">
          {subjectList.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="field" style={{ flex: "1 1 160px" }}>
        <label htmlFor={priorityInputId}>Priority</label>
        <select id={priorityInputId} value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* show Due Date picker only for Pro */}
      {plan === "pro" && (
        <div className="field" style={{ flex: "1 1 180px" }}>
          <label htmlFor={dueDateInputId}>Due Date (Pro)</label>
          <input
            id={dueDateInputId}
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
          />
        </div>
      )}

      <div className="field" style={{ flex: "1 1 160px" }}>
        <label>&nbsp;</label>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", height: "45px" }}
          disabled={!canSubmit}
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
