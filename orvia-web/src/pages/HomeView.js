import { FaBell, FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import { Empty, List, Spin, notification, Card  } from 'antd';
import { useEffect, useState } from "react";
import "../styles/HomeStyle.css"

export default function HomeView(){
 const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/appointments");
        if (!res.ok) throw new Error("Error al obtener las citas");

        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const upcoming = sorted.slice(0, 5);

        setAppointments(upcoming);

        notification.success({
          message: "Citas cargadas",
          description: "Se obtuvieron correctamente las próximas citas",
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

    return(
    <section className="home">
      <header className="home-header">
        <h1>¡HOLA, BIENVENIDO A ORVIA!</h1>

        <section className="header-icons">
          <FaQuestionCircle className="icon" />
          <FaBell className="icon" />
          <FaUserCircle className="icon profile" />
        </section>

      </header>

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
              <p><b>Fecha:</b> {item.date}</p>
              <p><b>Hora:</b> {item.time}</p>
              <p><b>Motivo:</b> {item.reason}</p>
            </Card>
          )}
        />
      )}
    </div>
    </section>
    );
}