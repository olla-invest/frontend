import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import SocialSignUp from "./pages/signUp/SocialSignUp";
import ChangePw from "./pages/login/ChangePw";
import PlanChange from "./pages/plan";

import Privacy from "./pages/policies/Privacy";
import Marketing from "./pages/policies/Marketing";
import Terms from "./pages/policies/Terms";
import InvestmentNotice from "./pages/policies/InvestmentNotice";

import MainLayout from "./layouts/MainLayout";
import SubLayout from "./layouts/SubLayout";

import { useChartSocket } from "./hooks/useChartSocket";

import { initAuth } from "./store/initAuth";
import { useAuthStore } from "./store/useAuthStore";

interface RouteProps {
  children: React.ReactNode;
}

/**
 * 로그인된 사용자는 접근 불가
 * (/login, /signup 등)
 */
const PublicRoute = ({ children }: RouteProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/**
 * 로그인 안된 사용자는 접근 불가
 * (필요한 페이지에만 적용)
 */
const PrivateRoute = ({ children }: RouteProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  useChartSocket();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route
            path="/home"
            element={
              // <PrivateRoute>
              <Home />
              // </PrivateRoute>
            }
          />

          <Route
            path="/plan"
            element={
              <PrivateRoute>
                <PlanChange />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Public Pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route path="/change-pw" element={<ChangePw />} />

        <Route
          path="/social-signup"
          element={
            <PublicRoute>
              <SocialSignUp />
            </PublicRoute>
          }
        />

        {/* Policy Pages */}
        <Route element={<SubLayout />}>
          <Route path="/policies/privacy" element={<Privacy />} />
          <Route path="/policies/terms" element={<Terms />} />
          <Route path="/policies/investmentNotice" element={<InvestmentNotice />} />
          <Route path="/policies/marketing" element={<Marketing />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
