// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    try{
      setErr("");
      await login(email, password);
      navigate("/tasks");
    }catch(error){
      setErr(error.message || "Login failed");
    }
  }

  async function handleGoogle(){
    try{
      setErr("");
      await loginWithGoogle();
      navigate("/tasks");
    }catch(error){
      setErr(error.message || "Google sign-in failed");
    }
  }

  return (
    <div className="container" style={{maxWidth: 480}}>
      <h2>Log in</h2>

      {err && <p className="error" role="alert" style={{color:'#ef4444'}}>{err}</p>}

      <form className="row" onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>

        <div className="field" style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%"}}>
          <button className="btn primary" type="submit">Log in</button>

          {/* ✅ Forgot password link */}
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="link"
            style={{ background:"transparent", border:"none", color:"#2563eb", cursor:"pointer" }}
          >
            Forgot password?
          </button>
        </div>
      </form>

      <div style={{display:'flex', alignItems:'center', gap:12, margin:'16px 0'}}>
        <div style={{flex:1, height:1, background:'#e5e7eb'}} />
        <span style={{fontSize:12, color:'#6b7280'}}>or</span>
        <div style={{flex:1, height:1, background:'#e5e7eb'}} />
      </div>

      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogle}
        className="btn primary"
        style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}
      >
        <span aria-hidden>🔎</span>
        Continue with Google
      </button>

      <p className="meta" style={{marginTop:12}}>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
