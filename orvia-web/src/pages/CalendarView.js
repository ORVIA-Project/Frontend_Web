import { useEffect, useState } from "react";
import { Calendar, Badge, Spin, message } from "antd";
import dayjs from "dayjs";
import AppointmentDetails from "../components/AppointmentDetails";

export default function CalendarView() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (updated) => {
    if (!updated) return;
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.appointment_id === updated.appointment_id ? updated : appt
      )
    );
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const storedDoctorId = localStorage.getItem("doctorId");

      if (!storedDoctorId) {
        throw new Error("No se encontró el doctorId en localStorage");
      }

      const res = await fetch(
        `https://api.orviaapp.com/v1/appointments/doctor/${storedDoctorId}`
      );
      if (!res.ok) throw new Error("Error al obtener las citas del doctor");

      const response = await res.json();
      const data = response.data || [];
      setAppointments(data);
    } catch (err) {
      message.error(err.message || "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const dateCellRender = (value) => {
    const day = value.format("YYYY-MM-DD");

    const dayAppointments = appointments.filter((appt) => {
      const apptDate = dayjs(appt.start_time).format("YYYY-MM-DD");
      const isSameDay = apptDate === day;
      const notCancelled =
        appt.status?.toLowerCase() !== "cancelada" &&
        appt.appointment_reason?.toLowerCase() !== "cancelada";
      return isSameDay && notCancelled;
    });

    if (!dayAppointments.length) return null;

    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {dayAppointments.map((item) => (
          <li
            key={item.appointment_id}
            style={{ cursor: "pointer" }}
            onClick={() => openModal(item)}
          >
            <Badge
              status="processing"
              text={`${item.first_name} ${item.last_name} - ${dayjs(
                item.start_time
              ).format("HH:mm")}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section style={{ padding: "1vw" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Calendar dateCellRender={dateCellRender} />
      )}

      <AppointmentDetails
        visible={isModalOpen}
        onClose={closeModal}
        appointment={
          selectedAppointment
            ? { id: selectedAppointment.appointment_id }
            : null
        }
        onUpdate={handleUpdate}
      />
    </section>
  );
}
