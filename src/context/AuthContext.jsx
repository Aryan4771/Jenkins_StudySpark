// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
  sendPasswordResetEmail,          
} from "firebase/auth";

const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext); }

function planStorageKey(uid) {
  return uid ? `studyspark:plan:${uid}` : null;
}

function readStoredPlan(uid) {
  if (!uid) return "free";

  try {
    const storedPlan = window.localStorage.getItem(planStorageKey(uid));
    return storedPlan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

function writeStoredPlan(uid, plan) {
  if (!uid) return;

  try {
    window.localStorage.setItem(planStorageKey(uid), plan === "pro" ? "pro" : "free");
  } catch {
    // Ignore storage failures; the in-memory state still works.
  }
}

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};

    setPersistence(auth, browserLocalPersistence)
      .catch(() => {})
      .finally(() => {
        unsub = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setPlan(u ? readStoredPlan(u.uid) : null);
          setLoading(false);
        });
      });

    return () => unsub();
  }, []);

  async function signup(email, password){
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    writeStoredPlan(cred.user.uid, "free");
    setPlan("free");
    return cred.user;
  }

  async function login(email, password){
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async function loginWithGoogle(){
    const result = await signInWithPopup(auth, googleProvider);
    const gUser = result.user;
    const storedPlan = readStoredPlan(gUser.uid);
    writeStoredPlan(gUser.uid, storedPlan);
    setPlan(storedPlan);
    return gUser;
  }

  // Password reset
  async function resetPassword(email){
    return sendPasswordResetEmail(auth, email);
  }

  function logout(){
    return signOut(auth);
  }

  async function setUserPlan(newPlan){
    if(!user) return;
    const normalizedPlan = newPlan === "pro" ? "pro" : "free";
    writeStoredPlan(user.uid, normalizedPlan);
    setPlan(normalizedPlan);
  }

  // ResetPassword in context value
  const value = { user, plan, signup, login, loginWithGoogle, resetPassword, logout, setUserPlan };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
