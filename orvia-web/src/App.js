import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import HomeView from "./pages/HomeView";
import CalendarView from "./pages/CalendarView";
import PatientsView from "./pages/PatientsView";
import Navbar from "./components/Navbar";
import AuthCard from "./components/Card";
import ProtectedRoute from "./components/ProtectedRoutes";
import ForgotPasswordView from "./auth/ForgotPassword";
import SplashScreen from "./components/Splash";
import ResetPasswordView from "./auth/ResetPassword";
import '@ant-design/v5-patch-for-react-19';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/forgot-password", "/reset-password"].includes(location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {!hideNavbar && <Navbar />}
      <Routes>
        
        <Route path="/login" element={<AuthCard />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/reset-password" element={<ResetPasswordView />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientsView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export const API_URL = process.env.REACT_APP_API_URL;
