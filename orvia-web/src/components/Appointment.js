import { Modal, Form, Input, DatePicker, Select } from "antd";

export default function AppointmentModal({ open, setOpen }) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const start_time = values.fecha
          .hour(values.hora.hour())
          .minute(values.hora.minute())
          .second(0);
  const userId = localStorage.getItem("email");
  
        const payload = {
          userId,
          p_first_name: values.first_name,
          p_last_name: values.last_name,
          p_email: values.email,
          p_start_time: start_time.toISOString(), // formato ISO para backend
          p_appointment_type: values.appointment_type,
          p_status: "Agendada"
        };

        console.log("📌 Payload listo para enviar:", payload);
        
        fetch("https://api.orviaapp.com/v1/appointments/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        form.resetFields();
        setOpen(false);
      })
      .catch((info) => {
        console.log("❌ Validación fallida:", info);
      });
  };

  const handleCancel = () => setOpen(false);

  return (
    <Modal
      title="Agendar nueva cita"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Agendar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="first_name"
          label="Nombre"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Apellido"
          rules={[{ required: true, message: "Ingresa el apellido" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[{ type: "email", required: true, message: "Correo inválido" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fecha"
          label="Fecha"
          rules={[{ required: true, message: "Selecciona la fecha" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="hora"
          label="Hora"
          rules={[{ required: true, message: "Selecciona la hora" }]}
        >
          <DatePicker.TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="appointment_type"
          label="Tipo de cita"
          rules={[{ required: true, message: "Selecciona el tipo de cita" }]}
        >
          <Select placeholder="Selecciona un tipo">
            <Select.Option value="consulta">Consulta</Select.Option>
            <Select.Option value="seguimiento">Seguimiento</Select.Option>
            <Select.Option value="terapia">Terapia</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
