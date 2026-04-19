// src/components/FocusSetup.jsx
import React, { useState, useEffect } from "react";
import { useFocus } from "../context/FocusContext.jsx";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function FocusSetup() {
  const { setupOpen, closeSetup, startSession, preset } = useFocus();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [minutes, setMinutes] = useState("25");
  const [difficulty, setDifficulty] = useState("Medium");

  useEffect(() => {
    if (preset) {
      setTitle(preset.title || "");
      setSubject(preset.subject || "");
    } else {
      setTitle("");
      setSubject("");
    }
    setMinutes("25");
    setDifficulty("Medium");
  }, [preset, setupOpen]);

  if (!setupOpen) return null;

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.6)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };
  const card = {
    width: "min(550px, 92vw)",
    margin: "auto"
  };

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !minutes) return;
    startSession({
      taskId: preset?.taskId || null,
      title: title.trim(),
      subject: subject.trim(),
      difficulty,
      minutes,
    });
  }

  return (
    <div style={overlay} onClick={closeSetup}>
      <div className="panel" style={card} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Start Focus Session</h3>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button className="btn" type="button" onClick={() => { setMinutes("25"); setDifficulty("Medium"); }}>Focus Flow (25m)</button>
          <button className="btn" type="button" onClick={() => { setMinutes("50"); setDifficulty("Hard"); }}>Deep Work (50m)</button>
          <button className="btn" type="button" onClick={() => { setMinutes("5"); setDifficulty("Easy"); }}>Short Break (5m)</button>
        </div>
        <form className="row" onSubmit={submit}>
          <div className="field" style={{ flex: "2 1 240px" }}>
            <label>Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stacks"
            />
          </div>
          <div className="field" style={{ flex: "1 1 180px" }}>
            <label>Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. SIT313"
            />
          </div>
          <div className="field" style={{ flex: "0 1 140px" }}>
            <label>Minutes</label>
            <input
              type="number"
              min="1"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: "0 1 160px" }}>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: "0 0 140px" }}>
            <label>&nbsp;</label>
            <button className="btn primary" style={{ height: "45px" }}>Start</button>
          </div>
        </form>
        <div
          style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}
        >
          <button className="btn" onClick={closeSetup}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
