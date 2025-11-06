import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spin, Button, Tag, List, message } from "antd";
import { ArrowLeftOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppointmentModal from "../components/AppointmentDetails"; 

export default function PatientDetail() {
  const { id } = useParams(); // patientId
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

 
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const doctorId = localStorage.getItem("doctorId");
        if (!doctorId) {
          message.error("No se encontró el ID del doctor en localStorage");
          return;
        }

        const response = await fetch(
          `https://api.orviaapp.com/v1/users/by-doctor?doctorId=${doctorId}`,
          { headers: { accept: "application/json" } }
        );

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const result = await response.json();
        const found = result.find((p) => String(p.patient_id) === id);
        if (!found) message.warning("No se encontró información del paciente");
        setPatient(found || null);
      } catch (error) {
        console.error("Error al obtener paciente:", error);
        message.error("Error al cargar la información del paciente");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
  const fetchAppointments = async () => {
    if (!id) return;
    setLoadingAppointments(true);
    try {
      const response = await fetch(
        `https://api.orviaapp.com/v1/appointments/patient/${id}`,
        { headers: { accept: "*/*" } }
      );

      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      const data = result.data || result || [];

      const sorted = [...data].sort(
        (a, b) => new Date(b.start_time) - new Date(a.start_time)
      );

      setAppointments(sorted);
    } catch (error) {
      console.error("Error al obtener citas del paciente:", error);
      message.error("Error al cargar las citas del paciente");
    } finally {
      setLoadingAppointments(false);
    }
  };

  fetchAppointments();
}, [id]);


  if (loading)
    return <Spin size="large" style={{ margin: "20% auto", display: "block" }} />;

  if (!patient)
    return (
      <div style={{ padding: "2rem" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
          Regresar
        </Button>
        <p style={{ marginTop: "2rem" }}>No se encontró información del paciente.</p>
      </div>
    );

  return (
    <div style={{ padding: "2rem", overflow: "hidden" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
        Regresar
      </Button>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginTop: "2rem",
          height: "80vh",
        }}
      >
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Card title="Información del paciente" style={{ height: "100%" }}>
            <p>
              <UserOutlined style={{ marginRight: 8 }} />
              <strong>Nombre:</strong> {patient.first_name} {patient.last_name}
            </p>
            <p>
              <MailOutlined style={{ marginRight: 8 }} />
              <strong>Correo:</strong> {patient.email || "Sin correo"}
            </p>
            <p>
              <PhoneOutlined style={{ marginRight: 8 }} />
              <strong>Teléfono:</strong> {patient.phone || "No registrado"}
            </p>
            <p>
              <strong>ID Paciente:</strong> {patient.patient_id}
            </p>
            <p>
              <strong>Expediente médico:</strong>{" "}
              <Tag color={patient.medical_record_id ? "blue" : "volcano"}>
                {patient.medical_record_id || "Sin expediente"}
              </Tag>
            </p>
          </Card>
        </div>

        
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Card title="Historial de citas" style={{ width: "100vw" }}>
            {loadingAppointments ? (
              <Spin />
            ) : appointments.length > 0 ? (
              <List
                dataSource={appointments}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onClick={() => {
                      setSelectedAppointment({
                        ...item,
                        id: item.appointment_id || item.id, // 🔹 asegura que tenga "id"
                      });
                      setIsModalVisible(true);
                    }}
                  >
                    <div>
                      <p>
                        <strong>Motivo:</strong> {item.appointment_reason || "Sin motivo"}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {item.appointment_type}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {dayjs(item.start_time).format("DD/MM/YYYY HH:mm")}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <Tag
                          color={
                            item.status === "Completada"
                              ? "green"
                              : item.status === "Cancelada"
                              ? "volcano"
                              : "blue"
                          }
                        >
                          {item.status}
                        </Tag>
                      </p>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p>Sin citas registradas.</p>
            )}
          </Card>
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentModal
          visible={isModalVisible}
          appointment={selectedAppointment}
          onClose={() => setIsModalVisible(false)}
          onUpdate={() => {
            setIsModalVisible(false);
            message.success("Actualizado correctamente");
          }}
        />
      )}
    </div>
  );
}
