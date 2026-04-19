import React, { useMemo } from "react";
import { useTasks } from "../context/TasksContext.jsx";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, CheckCircle, Target } from "lucide-react";

export default function Dashboard() {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    let focusTicks = 0;
    let completed = 0;
    const subjectsCount = {};
    const weeklyData = [
      { name: "Mon", tasks: 0 }, { name: "Tue", tasks: 0 }, { name: "Wed", tasks: 0 },
      { name: "Thu", tasks: 0 }, { name: "Fri", tasks: 0 }, { name: "Sat", tasks: 0 }, { name: "Sun", tasks: 0 }
    ];

    tasks.forEach(t => {
      if (t.done) {
        completed++;
        // Rough weekly assignment based on create date
        if (t.createdAt) {
          const day = new Date(t.createdAt).getDay();
          const dayIndex = day === 0 ? 6 : day - 1; 
          weeklyData[dayIndex].tasks++;
        }
      }
      if (t.focusDurationSec) focusTicks += t.focusDurationSec;
      
      if (t.subject) {
        if (!subjectsCount[t.subject]) subjectsCount[t.subject] = { name: t.subject, value: 0 };
        subjectsCount[t.subject].value++;
      }
    });

    const hours = Math.floor(focusTicks / 3600);
    const minutes = Math.floor((focusTicks % 3600) / 60);

    const pieData = Object.values(subjectsCount).sort((a,b)=>b.value-a.value).slice(0, 4);
    if (pieData.length === 0) pieData.push({ name: "Unassigned", value: 1 });

    return { completed, hours, minutes, pieData, weeklyData };
  }, [tasks]);

  const COLORS = ['#2dd4bf', '#a855f7', '#3b82f6', '#f43f5e', '#f59e0b'];

  return (
    <main className="container">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", color: "var(--accent)", textShadow: "0 0 15px var(--accent-glow)" }}>
          <Target /> Command Center
        </h2>
        
        {/* Top KPI Cards */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          
          <motion.div whileHover={{ y: -5 }} className="panel" style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px", background: "linear-gradient(145deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.9) 100%)", borderTop: "2px solid var(--accent)", marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 600, marginBottom: "16px" }}>
               <CheckCircle size={18} /> Tasks Completed
            </div>
            <div style={{ fontSize: "56px", fontWeight: 800, color: "var(--text)", textShadow: "0 0 20px var(--accent-glow)", lineHeight: 1 }}>
              {stats.completed}
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="panel" style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px", background: "linear-gradient(145deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.9) 100%)", borderTop: "2px solid var(--secondary)", marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontWeight: 600, marginBottom: "16px" }}>
               <Clock size={18} /> Total Focus Time
            </div>
            <div style={{ fontSize: "56px", fontWeight: 800, color: "var(--text)", textShadow: "0 0 20px var(--secondary-glow)", lineHeight: 1 }}>
              {stats.hours}<span style={{fontSize: "20px", color: "var(--muted)", fontWeight: 500}}>h</span> {stats.minutes}<span style={{fontSize: "20px", color: "var(--muted)", fontWeight: 500}}>m</span>
            </div>
          </motion.div>

        </div>

        {/* Charts Row */}
        <div className="row" style={{ alignItems: "stretch" }}>
          <motion.div className="panel" style={{ flex: "2 1 400px", marginBottom: 0 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h3 style={{ marginTop: 0 }}>Weekly Productivity</h3>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="tasks" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="panel" style={{ flex: "1 1 300px", marginBottom: 0, display: "flex", flexDirection: "column", alignItems: "center" }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
             <h3 style={{ marginTop: 0, alignSelf: "flex-start" }}>Subject Focus</h3>
             <div style={{ width: "100%", height: "250px" }}>
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                   <Pie
                     data={stats.pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {stats.pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "-10px" }}>
               {stats.pieData.map((s, i) => (
                 <span key={s.name} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                   <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length] }}></div>
                   {s.name}
                 </span>
               ))}
             </div>
          </motion.div>
        </div>

      </motion.div>
    </main>
  );
}
