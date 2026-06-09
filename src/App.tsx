import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "./assets/style/mobile.css";

import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import SocialSignUp from "./pages/signUp/SocialSignUp";
import ChangePw from "./pages/login/ChangePw";
import PlanChange from "./pages/plan";
import AuthCallback from "./pages/AuthCallback";

import Privacy from "./pages/policies/Privacy";
import Marketing from "./pages/policies/Marketing";
import Terms from "./pages/policies/Terms";
import InvestmentNotice from "./pages/policies/InvestmentNotice";
import LiveChartDetailPage from "./pages/home/components/liveChart/LiveChartDetailPage";

import MainLayout from "./layouts/MainLayout";
import SubLayout from "./layouts/SubLayout";

import { useChartSocket } from "./hooks/useChartSocket";

import { useAuthStore } from "./store/useAuthStore";
import IssueDetailPage from "./pages/home/components/issueTheme/IssueDetailPage";
import { ScrollToTop } from "./utils/ScrollTop";

interface RouteProps {
  children: React.ReactNode;
}

/**
 * 로그인된 사용자는 접근 불가
 * (/login, /signup 등)
 */
const PublicRoute = ({ children }: RouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * 로그인 안된 사용자는 접근 불가
 * (필요한 페이지에만 적용)
 */
const PrivateRoute = ({ children }: RouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  useChartSocket();

  // PrintScreen 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows/Linux: PrintScreen
      const isPrintScreen = e.key === "PrintScreen";

      if (isPrintScreen) {
        navigator.clipboard.writeText("").catch(() => {});
        document.body.style.visibility = "hidden";
        setTimeout(() => {
          document.body.style.visibility = "visible";
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={useAuthStore.getState().isLoggedIn ? "/home" : "/login"} replace />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
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
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/social-signup" element={<SocialSignUp />} />

        <Route element={<SubLayout />}>
          <Route path="/detail/:stockCode" element={<LiveChartDetailPage />} />
          <Route path="/themeDetail/:themeCode" element={<IssueDetailPage />} />
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
