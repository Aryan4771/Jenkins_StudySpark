import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import FocusProvider from "./context/FocusContext.jsx";           
import FocusSetup from "./components/FocusSetup.jsx";             
import FocusHUD from "./components/FocusHUD.jsx";                 

import Home from "./pages/Home.jsx";
import Plans from "./pages/Plans.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TasksOnly from "./pages/TasksOnly.jsx";
import NotFound from "./pages/NotFound.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CalendarView from "./pages/CalendarView.jsx";
import Profile from "./pages/Profile.jsx";
import Groups from "./pages/Groups.jsx";
import GroupRoom from "./pages/GroupRoom.jsx";
import "./App.css";

export default function App(){
  return (
    <AuthProvider>
      <TasksProvider>
        <FocusProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TasksOnly /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/group/:id" element={<ProtectedRoute><GroupRoom /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global focus UI */}
          <FocusSetup />
          <FocusHUD />
        </FocusProvider>
      </TasksProvider>
    </AuthProvider>
  );
}
