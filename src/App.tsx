import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

import { useChartSocket } from "./hooks/useChartSocket";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import SocialSignUp from "./pages/signUp/SocialSignUp";
import { initAuth } from "./store/initAuth";
import ChangePw from "./pages/login/ChangePw";

const App: React.FC = () => {
  useChartSocket();
  useEffect(() => {
    initAuth();
  }, []);
  return (
    <Router>
      <Routes>
        {/* Layout Route */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/change-pw" element={<ChangePw />} />
        <Route path="/social-signup" element={<SocialSignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
