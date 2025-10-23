import { Modal, Form, Input, Button, message, DatePicker, TimePicker, Select, Spin, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default function AppointmentModal({ visible, onClose, appointment, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [fullData, setFullData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [form] = Form.useForm();

  // 🔹 Obtener el ID del doctor almacenado en localStorage
  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    if (!storedDoctorId) {
      message.error("No se encontró el ID del doctor. Inicia sesión nuevamente.");
      return;
    }
    setDoctorId(storedDoctorId);
  }, []);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointment?.id) return;
      setFetching(true);
      setAppointmentId(appointment.id);

      try {
        const res = await fetch(`https://api.orviaapp.com/v1/appointments/by-id/${appointment.id}`);
        if (!res.ok) throw new Error("Error al obtener los detalles de la cita");
        const data = await res.json();

        if (typeof data.data !== "object" || Array.isArray(data.data)) {
          throw new Error("Formato de respuesta inesperado: se esperaba un objeto");
        }

        setFullData(data.data);

        const fecha = dayjs(data.data.start_time);
        form.setFieldsValue({
          patient_name: `${data.data.first_name} ${data.data.last_name}`,
          date: fecha,
          time: fecha,
          appointment_type: data.data.appointment_type || "",
          appointment_reason: data.data.appointment_reason || "",
          notes: data.data.notes || "",
          prescription: data.data.prescription || "",
        });
      } catch (err) {
        console.error(err);
        message.error("No se pudieron cargar los detalles de la cita");
      } finally {
        setFetching(false);
      }
    };

    if (visible) fetchAppointmentDetails();
  }, [visible, appointment, form]);

  // 🔹 Editar cita
  const handleEdit = async () => {
    try {
      if (!doctorId) {
        message.error("No se encontró el ID del doctor en sesión");
        return;
      }
      if (!appointmentId || !fullData) {
        message.error("Los datos de la cita no están completos");
        return;
      }

      setLoading(true);

      const values = form.getFieldsValue();
      if (!values.date || !values.time) {
        message.error("Por favor selecciona fecha y hora válidas");
        return;
      }

      const date = values.date.format("YYYY-MM-DD");
      const time = values.time.format("HH:mm:ss");
      const start_time = dayjs(`${date}T${time}`).toISOString();

      
      const updatedAppointment = {
        appointment_id: Number(appointmentId),
        doctor_id: Number(doctorId), 
        start_time,
        appointment_type: values.appointment_type || fullData.appointment_type,
        appointment_reason: values.appointment_reason || fullData.appointment_reason,
        status: fullData.status,
        notes: values.notes || fullData.notes,
        prescription: values.prescription || fullData.prescription,
      };

      Object.keys(updatedAppointment).forEach(
        (key) =>
          (updatedAppointment[key] === "" || updatedAppointment[key] === undefined) &&
          delete updatedAppointment[key]
      );

      console.log("📤 Body enviado:", JSON.stringify(updatedAppointment, null, 2));

      const res = await fetch(`https://api.orviaapp.com/v1/appointments/update-by-doctor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointment),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al actualizar la cita: ${errorText}`);
      }

      const data = await res.json();
      message.success("Cita actualizada correctamente");
      onUpdate(data.data || data);
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      message.error("No se pudo actualizar la cita");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      if (!doctorId || !appointmentId || !fullData) {
        message.error("Faltan datos para completar la cita");
        return;
      }

      const values = form.getFieldsValue();
      setLoading(true);

      const completedAppointment = {
        appointment_id: Number(appointmentId),
        doctor_id: Number(doctorId),
        start_time: fullData.start_time,
        appointment_type: values.appointment_type || fullData.appointment_type,
        appointment_reason: values.appointment_reason || fullData.appointment_reason,
        status: "Cancelada", 
        notes: values.notes || fullData.notes,
        prescription: values.prescription || fullData.prescription,
      };

      Object.keys(completedAppointment).forEach(
        (key) =>
          (completedAppointment[key] === "" || completedAppointment[key] === undefined) &&
          delete completedAppointment[key]
      );

      console.log("📤 Body completado:", JSON.stringify(completedAppointment, null, 2));

      const res = await fetch(`https://api.orviaapp.com/v1/appointments/update-by-doctor`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completedAppointment),
      });

      if (!res.ok) throw new Error("Verificar los campos");

      message.success("Cita Cancelada");
      onUpdate();
      onClose();
    } catch (err) {
      console.error("❌ Error al cancelar la cita:", err);
      message.error(err.message || "No se pudo cancelar la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title= "Detalles de la Cita"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {fetching ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item label="Paciente" name="patient_name">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Fecha" name="date" rules={[{ required: true, message: "Selecciona una fecha" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Hora" name="time" rules={[{ required: true, message: "Selecciona una hora" }]}>
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Tipo de cita" name="appointment_type">
            <Select
              placeholder="Selecciona el tipo"
              options={[
                { label: "Checkup", value: "Checkup" },
                { label: "Consulta", value: "Consulta" },
                { label: "Urgencia", value: "Urgencia" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Motivo" name="appointment_reason" rules={[{ required: true, message: "Selecciona una hora" }]}>
            <Input placeholder="Motivo de la cita" />
          </Form.Item>

          <Form.Item label="Notas" name="notes">
            <Input.TextArea rows={2} placeholder="Notas adicionales..." />
          </Form.Item>

          <Form.Item label="Prescripción" name="prescription">
            <Input.TextArea rows={2} placeholder="Medicamentos o indicaciones..." />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <div>
              <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!fullData}
            style={{ marginRight: 10 }}
          >
            Guardar
          </Button>

          <Popconfirm
            title="¿Estás seguro de cancelar esta cita?"
            description="Esta acción no se puede deshacer"
            onConfirm={handleComplete}
            okText="Cancelar"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={loading}>
              Cancelar cita
            </Button>
          </Popconfirm>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
}
