import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Signup(){
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await signup(email, password, displayName);
      navigate("/tasks");
    }catch(err){
      alert(err.message);
    }
  }

  return (
    <div className="container">
      <h2>Sign up</h2>
      <form className="row" onSubmit={handleSubmit}>
        <div className="field"><label>Name</label><input value={displayName} onChange={e=>setDisplayName(e.target.value)} /></div>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div className="field" style={{flex:"0 0 140px", alignSelf:"end"}}><button className="btn primary">Create Account</button></div>
      </form>
      <p className="meta">Already have an account? <Link to="/login" style={{color:'#22c55e'}}>Log in</Link></p>
    </div>
  );
}
