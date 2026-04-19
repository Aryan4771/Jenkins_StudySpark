import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";
import { doc, collection, onSnapshot, addDoc, updateDoc, serverTimestamp, query, orderBy, arrayUnion } from "firebase/firestore";

export default function GroupRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (!user || !id) return;

    const groupRef = doc(db, "groups", id);
    const unsubGroup = onSnapshot(groupRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.members.includes(user.email)) {
          navigate("/groups");
          return;
        }
        setGroup({ id: docSnap.id, ...data });
      } else {
        navigate("/groups");
      }
    });

    const tasksRef = collection(db, "groups", id, "groupTasks");
    const qTasks = query(tasksRef, orderBy("createdAt", "desc"));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      const t = [];
      snap.forEach(d => t.push({ id: d.id, ...d.data() }));
      setTasks(t);
      setLoading(false);
    });

    return () => {
      unsubGroup();
      unsubTasks();
    };
  }, [id, user, navigate]);

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim() || !user) return;
    
    try {
      const tasksRef = collection(db, "groups", id, "groupTasks");
      await addDoc(tasksRef, {
        title: title.trim(),
        priority,
        createdBy: user.email,
        createdAt: serverTimestamp(),
        completions: []
      });
      setTitle("");
      setPriority("Medium");
    } catch (err) {
      console.error(err);
      alert("Failed to add task.");
    }
  }

  async function handleMarkFinish(taskId) {
    if (!user) return;
    try {
      const tRef = doc(db, "groups", id, "groupTasks", taskId);
      await updateDoc(tRef, {
        completions: arrayUnion({
          email: user.email,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    const email = prompt("Enter peer's email to invite:");
    if (email && email.trim() !== "") {
      try {
        const gRef = doc(db, "groups", id);
        await updateDoc(gRef, {
          members: arrayUnion(email.trim())
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (!user || loading) return <main className="container"><p>Loading Room...</p></main>;

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ margin: 0, textShadow: "0 0 10px var(--accent-glow)" }}>{group?.name}</h2>
        <button className="btn" onClick={handleInvite}>+ Invite Peer</button>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {group?.members.map(m => <span key={m} className="badge" style={{ borderColor: m === user.email ? "var(--accent)" : "var(--panel-border)" }}>{m}</span>)}
      </div>

      <section className="panel">
        <h3 style={{ marginTop: 0 }}>Add Group Task</h3>
        <form className="row" onSubmit={handleAddTask}>
          <div className="field" style={{ flex: "2 1 240px" }}>
            <label>Task Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Read Chapter 4" />
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="field" style={{ flex: "0 0 160px" }}>
            <label>&nbsp;</label>
            <button className="btn primary" style={{ width: "100%", height: "45px" }} disabled={!title.trim()}>Add</button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h3 style={{ marginTop: 0 }}>Shared Tasks</h3>
        {tasks.length === 0 ? (
          <p className="meta">No tasks here yet. Start adding some to race your peers!</p>
        ) : (
          <div className="task-list">
            {tasks.map(t => {
               const myCompletion = t.completions?.find(c => c.email === user.email);
               // Sort completions by timestamp to rank them
               const rankings = [...(t.completions || [])].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

               return (
                <div key={t.id} className="task" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div className="task-content">
                    <div className={`task-title ${myCompletion ? "done" : ""}`}>{t.title}</div>
                    <div className="task-meta">
                      <span className={`badge ${t.priority?.toLowerCase() || 'medium'}`}>{t.priority}</span>
                      <span className="meta">Added by {t.createdBy}</span>
                    </div>

                    {rankings.length > 0 && (
                      <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexDirection: "column" }}>
                        {rankings.map((r, i) => {
                          const medals = ["🥇", "🥈", "🥉"];
                          const medal = medals[i] || "⭐️";
                          const isMe = r.email === user.email;
                          return (
                            <div key={r.email} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", padding: "6px 10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: isMe ? "1px solid var(--accent-glow)" : "1px solid transparent" }}>
                              <span>{medal}</span>
                              <span style={{ fontWeight: isMe ? 600 : 400, color: isMe ? "var(--accent)" : "var(--text)" }}>{r.email.split('@')[0]}</span>
                              <span className="meta" style={{marginLeft: "auto"}}>{new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="task-actions" style={{ alignSelf: "start" }}>
                    {!myCompletion ? (
                      <button className="btn primary" onClick={() => handleMarkFinish(t.id)}>Finish!</button>
                    ) : (
                      <span className="badge" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>✓ Done</span>
                    )}
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
