import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Users, Mail, Plus } from "lucide-react";

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Listen to groups where user.email is in members array
    const q = query(collection(db, "groups"), where("members", "array-contains", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const g = [];
      snapshot.forEach((doc) => g.push({ id: doc.id, ...doc.data() }));
      setGroups(g);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newGroupName.trim() || !user) return;

    try {
      // Create group with user and invitees if provided
      const members = [user.email];
      if (inviteEmail.trim() && inviteEmail.trim() !== user.email) {
        members.push(inviteEmail.trim());
      }

      const docRef = await addDoc(collection(db, "groups"), {
        name: newGroupName.trim(),
        members,
        createdBy: user.email,
        createdAt: serverTimestamp()
      });
      
      setNewGroupName("");
      setInviteEmail("");
      navigate(`/group/${docRef.id}`);
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group. Are Firestore rules configured?");
    }
  }

  if (!user) {
    return (
       <main className="container">
          <section className="panel" style={{ textAlign: "center" }}>
            <h2>Collaborative Group Studies</h2>
            <p className="meta">Please login to join or create study groups.</p>
          </section>
       </main>
    )
  }

  return (
    <main className="container">
      <motion.section className="panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}><Plus /> Create a Group</h2>
        <form className="row" onSubmit={handleCreate}>
          <div className="field">
            <label>Group Name</label>
            <input 
              value={newGroupName} 
              onChange={e => setNewGroupName(e.target.value)} 
              placeholder="e.g. History Finals Grp" 
              required
            />
          </div>
          <div className="field">
            <label>Invite Peer (Email)</label>
            <input 
              type="email"
              value={inviteEmail} 
              onChange={e => setInviteEmail(e.target.value)} 
              placeholder="peer@example.com"
            />
          </div>
          <div className="field" style={{ flex: "0 0 160px" }}>
            <label>&nbsp;</label>
            <button className="btn primary" style={{ width: "100%", height: "45px" }} disabled={!newGroupName.trim()}>Create</button>
          </div>
        </form>
      </motion.section>

      <motion.section className="panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Users /> Your Study Groups</h2>
        {loading ? (
          <p className="meta">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="meta">You haven't joined any groups yet. Create one above to start collaborating!</p>
        ) : (
          <div className="task-list">
            {groups.map((g, index) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                <Link to={`/group/${g.id}`} style={{ textDecoration: 'none' }}>
                  <div className="task" style={{ gridTemplateColumns: "1fr" }}>
                    <div>
                      <h3 style={{ margin: "0 0 12px 0", color: "var(--accent)", textShadow: "0 0 10px var(--accent-glow)" }}>{g.name}</h3>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <Mail size={14} color="var(--muted)" />
                        {g.members.map(m => (
                          <span key={m} className="badge">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </main>
  );
}
