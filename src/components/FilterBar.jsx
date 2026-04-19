import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function FilterBar({ subjects = ["All"], value, onChange }) {
  const { plan } = useAuth();
  const isPro = String(plan || "").toLowerCase() === "pro";

  const filters = value || {};
  const subject = filters.subject ?? "All";
  const priority = filters.priority ?? "All";
  const query = filters.query ?? "";
  const dueFrom = filters.dueFrom ?? "";
  const dueTo = filters.dueTo ?? "";

  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "space-between",
      }}
    >
      {/* Subject */}
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="meta">Subject</span>
        <select
          value={subject}
          onChange={(e) => set({ subject: e.target.value })}
          style={{ padding: 8, minWidth: 160 }}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      {/* Priority */}
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="meta">Priority</span>
        <select
          value={priority}
          onChange={(e) => set({ priority: e.target.value })}
          style={{ padding: 8, minWidth: 140 }}
        >
          {["All", "Low", "Medium", "High"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      {/* Search */}
      <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <span className="meta">Search</span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={query}
          onChange={(e) => set({ query: e.target.value })}
          style={{ padding: 8, minWidth: 200 }}
        />
      </label>

      {/* Pro-only: Due Date range */}
      {isPro && (
        <>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="meta">Due from</span>
            <input
              type="date"
              value={dueFrom}
              onChange={(e) => set({ dueFrom: e.target.value })}
              style={{ padding: 8 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="meta">Due to</span>
            <input
              type="date"
              value={dueTo}
              onChange={(e) => set({ dueTo: e.target.value })}
              style={{ padding: 8 }}
            />
          </label>
        </>
      )}

      {/* Clear button — full width and centered */}
      <div
        style={{
          flexBasis: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <button
          className="btn clear"
          onClick={() =>
            set({
              subject: "All",
              priority: "All",
              query: "",
              ...(isPro ? { dueFrom: "", dueTo: "" } : {}),
            })
          }
          style={{
            width: "100%",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
