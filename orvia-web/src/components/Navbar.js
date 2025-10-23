import { FaHome, FaCalendarAlt, FaFolderOpen, FaSignOutAlt, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AppointmentModal from "./Appointment";
import "../styles/NavbarStyle.css";
import { useState } from 'react';

export default function Navbar() {
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");

  };

  return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <Link to="/" className="menu-item">
            <FaHome className="icon" /> <p className="fontAdaptativeTitle">INICIO</p>
          </Link>
        </li>
        <li>
          <Link to="/calendar" className="menu-item">
            <FaCalendarAlt className="icon" /> <p className="fontAdaptativeTitle">CALENDARIO</p>
          </Link>
        </li>
        <li>
          <Link to="/patients" className="menu-item">
            <FaFolderOpen className="icon" /> <p className="fontAdaptativeTitle">PACIENTES</p>
          </Link>
        </li>
      </ul>

      <div className="actions">
        <button className="action-btn" onClick={() => setOpen(true)}>
          <FaPlusCircle className="icon-button" /> <p className="fontAdaptative"> Agendar Cita</p>
        </button>
        <button className="action-btn">
          <FaClipboardList className="icon-button" /> <p className="fontAdaptative">Crear registro</p>
        </button>
      </div>

      <div className="logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon-button" /> <p className="fontAdaptative">Cerrar Sesión</p>
        </button>
      </div>

      <AppointmentModal open={open} setOpen={setOpen}/>
    </div>
  );
}
