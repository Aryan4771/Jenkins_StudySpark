// src/context/FocusContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useTasks } from "./TasksContext.jsx";

const FocusContext = createContext();
export function useFocus(){ return useContext(FocusContext); }

export default function FocusProvider({ children }){
  // keep toggleDone around if you call it elsewhere (we now update docs directly here)
  const { user } = useAuth();
  const { addTask, updateTask } = useTasks();

  const [setupOpen, setSetupOpen] = useState(false);
  const [preset, setPreset] = useState(null); // { taskId, title, subject }
  const [session, setSession] = useState(null);
  // session = { taskId, title, subject, difficulty, totalSec, remainingSec, running, startedAt }

  const tickRef = useRef(null);

  // --- timer loop
  useEffect(() => {
    if(!session?.running) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    tickRef.current = setInterval(() => {
      setSession(s => {
        if(!s) return s;
        const next = s.remainingSec - 1;
        if(next <= 0){
          clearInterval(tickRef.current);
          const stopped = { ...s, remainingSec: 0, running: false };
          // auto-complete when timer ends
          setTimeout(() => { complete(true); }, 0);
          return stopped;
        }
        return { ...s, remainingSec: next };
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [session?.running]); // eslint-disable-line react-hooks/exhaustive-deps

  // open/close setup
  function openSetup(presetData){ setPreset(presetData || null); setSetupOpen(true); }
  function closeSetup(){ setSetupOpen(false); setPreset(null); }

  // start a session
  function startSession({ taskId=null, title, subject, difficulty, minutes }){
    const totalSec = Math.max(1, parseInt(minutes||0,10)) * 60;
    setSession({
      taskId, title, subject, difficulty,
      totalSec,
      remainingSec: totalSec,
      running: true,
      startedAt: Date.now()
    });
    setSetupOpen(false);
  }

  // controls
  function pause(){ if(session) setSession(s => ({ ...s, running: false })); }
  function resume(){ if(session) setSession(s => ({ ...s, running: true })); }
  function cancel(){ setSession(null); }

  // difficulty -> priority 
  function priorityFromDifficulty(diff){
    const map = { Easy: "Low", Medium: "Medium", Hard: "High" };
    return map[diff] || "Medium";
  }

  // complete session: update existing task OR create a new done task
  async function complete(markDone=true){
    if(!session || !user) { setSession(null); return; }

    try {
      if(session.taskId && markDone){
        // update existing task: mark done + persist difficulty & priority from difficulty
        await updateTask(session.taskId, {
          done: true,
          ...(session.difficulty ? {
            difficulty: session.difficulty,
            priority: priorityFromDifficulty(session.difficulty)
          } : {}),
          focusDurationSec: session.totalSec || 0,
          focusedAt: Date.now()
        });
      } else if (!session.taskId) {
        // create a brand new DONE task from the focus session
        await addTask({
          title: session.title || "Focused Task",
          subject: (session.subject || "").trim(),
          priority: priorityFromDifficulty(session.difficulty),
          difficulty: session.difficulty || "Medium",
          done: true,
          focusedAt: Date.now(),
          focusDurationSec: session.totalSec || 0,
          createdAt: Date.now()
        });
      }
    } catch(e) {
    } finally {
      setSession(null);
    }
  }

  const value = {
    setupOpen, preset, session,
    openSetup, closeSetup, startSession,
    pause, resume, cancel, complete
  };
  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}
