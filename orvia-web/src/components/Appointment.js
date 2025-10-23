import { Modal, Form, Input, DatePicker, TimePicker, Select, notification } from "antd";

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export default function AppointmentModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const disabledHours = () => {
    const morningDisabled = range(0, 7); 
    const eveningDisabled = range(19, 24);
    
    return [...morningDisabled, ...eveningDisabled];
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (!values.fecha || !values.hora) {
          api.warning({
            message: "Faltan campos",
            description: "Selecciona la fecha y la hora correctamente",
          });
          return;
        }

        const start_time = values.fecha
          .hour(values.hora.hour())
          .minute(values.hora.minute())
          .second(0);

        const doctorId = localStorage.getItem("doctorId");

        if (!doctorId) {
          api.error({
            message: "Error de sesión",
            description: "No se encontró el ID del doctor en el sistema.",
          });
          return;
        }

        const payload = {
          doctorId,
          firstName: values.first_name,
          lastName: values.last_name,
          email: values.email,
          startTime: start_time.toISOString(),
          appointmentType: values.appointment_type,
          appointmentReason: values.appointment_reason,
          status: "Agendada",
        };

        try {
          const response = await fetch(
            "https://api.orviaapp.com/v1/appointments/schedule",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) throw new Error("No se pudo crear la cita");

          api.success({
            message: "Cita creada",
            description: "La cita se agendó correctamente 🎉",
          });

          form.resetFields();
          setTimeout(() => setOpen(false), 1000);
        } catch (err) {
          api.error({
            message: "Error al crear la cita",
            description: err.message || "Intenta nuevamente",
          });
        }
      })
      .catch((info) => {
        console.log("❌ Validación fallida:", info);
      });
  };

  const handleCancel = () => setOpen(false);

  return (
    <>
      {contextHolder}
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
            <TimePicker
              format="HH:mm"
              style={{ width: "100%" }}
              disabledHours={disabledHours}
              minuteStep={5}
              hideDisabledOptions
            />
          </Form.Item>

          <Form.Item
            name="appointment_type"
            label="Tipo de cita"
            rules={[{ required: true, message: "Selecciona el tipo de cita" }]}
          >
            <Select placeholder="Selecciona un tipo">
              <Select.Option key="checkup" value="Checkup">
                Consulta
              </Select.Option>
              <Select.Option key="followup" value="Seguimiento">
                Seguimiento
              </Select.Option>
              <Select.Option key="therapy" value="Terapia">
                Terapia
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="appointment_reason"
            label="Motivo de la cita"
            rules={[{ message: "Ingresa el motivo de la cita" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
