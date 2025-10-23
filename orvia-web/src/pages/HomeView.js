import { FaBell, FaQuestionCircle, FaUserCircle, FaSync } from "react-icons/fa";
import { Spin, notification, Card, Drawer } from "antd";
import { useEffect, useState } from "react";
import FAQDrawer from "../components/FAQs";
import UserProfile from "../components/UserProfile";
import NotificationsDrawer from "../components/Notifications";
import AppointmentDetails from "../components/AppointmentDetails";
import "../styles/HomeStyle.css";

export default function HomeView() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoRefreshing, setAutoRefreshing] = useState(false);

  const showFAQ = () => setIsFAQOpen(true);
  const closeFAQ = () => setIsFAQOpen(false);

  const showProfile = () => setIsProfileOpen(true);
  const closeProfile = () => {
    setIsProfileOpen(false);
    const img = localStorage.getItem("selectedProfileImage");
    if (img) setProfileImage(img);
  };

  const showNotifications = () => setIsNotiOpen(true);
  const closeNotifications = () => setIsNotiOpen(false);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`https://api.orviaapp.com/v1/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar la cita");

      notification.success({
        message: "Cita eliminada",
        description: "La cita ha sido eliminada correctamente.",
      });

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      closeModal();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) throw new Error("No se encontró el ID del doctor logueado");

      const res = await fetch(`https://api.orviaapp.com/v1/appointments/doctor/${doctorId}`);
      if (!res.ok) throw new Error("Error al obtener las citas del doctor");

      const response = await res.json();
      const list = response.data || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const todayAppointments = list
        .filter(appt => {
          const start = new Date(appt.start_time);
          const sameDay =
            start.getFullYear() === today.getFullYear() &&
            start.getMonth() === today.getMonth() &&
            start.getDate() === today.getDate();

          return appt.status === "Agendada" && sameDay && start > now;
        })
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .map(appt => ({
          id: appt.appointment_id,
          patient: `${appt.first_name} ${appt.last_name}`,
          date: new Date(appt.start_time).toLocaleDateString(),
          time: new Date(appt.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          reason:
            appt.appointment_type ||
            appt.appointment_reason ||
            "Sin motivo",
        }));

      setAppointments(todayAppointments);
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "No se pudieron cargar las citas",
      });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const img = localStorage.getItem("selectedProfileImage");
    if (img) {
      setProfileImage(img);
    }
  }, []);

  
  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(async () => {
      setAutoRefreshing(true);
      await fetchAppointments();
      setTimeout(() => setAutoRefreshing(false), 800);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="home">
      <header className="home-header">
        <h1>¡HOLA, BIENVENIDO A ORVIA!</h1>

        <section className="header-icons">
          <FaQuestionCircle className="icon" onClick={showFAQ} />
          <FaBell className="icon" onClick={showNotifications} />

          {profileImage ? (
            <img
              src={profileImage}
              alt="Perfil"
              className="icon profile-image-icon"
              onClick={showProfile}
            />
          ) : (
            <FaUserCircle className="icon profile" onClick={showProfile} />
          )}
        </section>
      </header>

      <FAQDrawer open={isFAQOpen} onClose={closeFAQ} />
      <NotificationsDrawer open={isNotiOpen} onClose={closeNotifications} />

      <Drawer
        title="Perfil de Usuario"
        placement="right"
        onClose={closeProfile}
        open={isProfileOpen}
        width={380}
      >
        <UserProfile />
      </Drawer>

      <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1vw"}}>
        📅 Citas de hoy
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1vw",
          overflowY: "scroll",
          maxHeight: "70%",
        }}
      >
        {appointments.length > 0 ? (
          appointments.map((item) => (
            <Card
              key={item.id}
              title={item.patient}
              onClick={() => openModal(item)}
              hoverable
              style={{
                backgroundColor: "#E1E5F2",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "0.9vw",
                cursor: "pointer",
              }}
            >
              <p>
                <b>Fecha:</b> {item.date}
              </p>
              <p>
                <b>Hora:</b> {item.time}
              </p>
              <p>
                <b>Motivo:</b> {item.reason}
              </p>
            </Card>
          ))
        ) : (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              marginTop: "2rem",
              color: "GrayText",
              fontSize: "0.9vw"
            }}
          >
            Hoy no hay citas programadas.
          </p>
        )}
      </div>

      <AppointmentDetails
        visible={isModalOpen}
        appointment={selectedAppointment}
        onClose={closeModal}
        onUpdate={(updated) => {
          if (!updated) return;
          const newId = updated.id || updated.appointment_id;
          if (!newId) return;
          setAppointments((prev) =>
            prev.map((a) => (a.id === newId ? { ...a, ...updated } : a))
          );
        }}
        onDelete={deleteAppointment}
      />
    </section>
  );
}
