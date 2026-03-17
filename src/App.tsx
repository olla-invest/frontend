import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

import { useChartSocket } from "./hooks/useChartSocket";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import SocialSignUp from "./pages/signUp/SocialSignUp";

const App: React.FC = () => {
  useChartSocket();
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
        <Route path="/social-signup" element={<SocialSignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
