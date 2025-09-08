import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeView from "./pages/HomeView";
import CalendarView from "./pages/CalendarView";
import PatientsView from "./pages/PatientsView.js";
import Navbar from "./components/Navbar.js";
import Card from "./components/Card";
import { useLocation } from "react-router-dom";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/login" element={<Card />} />
          <Route path="/" element={<HomeView />} style={{ flex: 1, overflowY: "auto", padding: "20px" }}/>
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/patients" element={<PatientsView />} />
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
