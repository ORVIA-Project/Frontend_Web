import { Drawer } from "antd";

export default function FAQDrawer({ open, onClose }) {
  return (
    <Drawer
      title="Preguntas Frecuentes"
      placement="right"
      onClose={onClose}
      open={open}
      width={350}
    >
      <p><b>¿Cómo puedo agendar una cita?</b></p>
      <p>Puedes hacerlo desde la sección de pacientes o agendando desde el calendario.</p>

      <p><b>¿Dónde veo mis próximas citas?</b></p>
      <p>En el panel principal se listan las 5 más próximas.</p>

      <p><b>¿Cómo elimino o edito una cita?</b></p>
      <p>Desde la lista de citas puedes seleccionar la opción correspondiente.</p>
    </Drawer>
  );
}
