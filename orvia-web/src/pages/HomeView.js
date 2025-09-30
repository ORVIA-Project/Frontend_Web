import { FaBell, FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import { List, Spin, notification, Card, Drawer } from "antd";
import { useEffect, useState } from "react";
import FAQDrawer from "../components/FAQs";
import UserProfile from "../components/UserProfile";
import NotificationsDrawer from "../components/Notifications";
import "../styles/HomeStyle.css";

export default function HomeView() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

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

  useEffect(() => {
    const img = localStorage.getItem("selectedProfileImage");
    if (img) {
      setProfileImage(img);
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/appointments");
        if (!res.ok) throw new Error("Error al obtener las citas");

        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const upcoming = sorted.slice(0, 5);

        setAppointments(upcoming);

        notification.success({
          message: "Citas cargadas",
          description:
            "Se obtuvieron correctamente las próximas citas",
        });
      } catch (err) {
        notification.error({
          message: "Error",
          description: "No se pudieron cargar las citas",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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
      

      <div style={{ padding: "20px" }}>
        <h3>📅 Próximas citas</h3>
        {loading ? (
          <Spin tip="Cargando citas..." />
        ) : (
          <List
            dataSource={appointments}
            renderItem={(item) => (
              <Card
                key={item._id}
                title={item.patient}
                style={{ marginBottom: "12px" }}
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
            )}
          />
        )}
      </div>
    </section>
  );
}
