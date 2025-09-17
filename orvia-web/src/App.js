import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import HomeView from "./pages/HomeView";
import CalendarView from "./pages/CalendarView";
import PatientsView from "./pages/PatientsView";
import Navbar from "./components/Card";
import AuthCard from "./components/Card";
import ProtectedRoute from "./components/ProtectedRoutes";
import SplashScreen from "./components/Splash";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login"].includes(location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      {!hideNavbar && <Navbar />}
      <Routes>
        
        <Route path="/login" element={<AuthCard />} />

        
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
