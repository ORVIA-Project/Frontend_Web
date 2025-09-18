import { FaHome, FaCalendarAlt, FaFolderOpen, FaSignOutAlt, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavbarStyle.css";

export default function Navbar() {
  
  const navigate = useNavigate();

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
            <FaHome className="icon" /> INICIO
          </Link>
        </li>
        <li>
          <Link to="/calendar" className="menu-item">
            <FaCalendarAlt className="icon" /> CALENDARIO
          </Link>
        </li>
        <li>
          <Link to="/patients" className="menu-item">
            <FaFolderOpen className="icon" /> PACIENTES
          </Link>
        </li>
      </ul>

      <div className="actions">
        <button className="action-btn">
          <FaPlusCircle className="icon" /> Agendar Cita
        </button>
        <button className="action-btn">
          <FaClipboardList className="icon" /> Crear registro
        </button>
      </div>

      <div className="logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
