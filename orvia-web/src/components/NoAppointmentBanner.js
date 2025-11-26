import { useState } from "react";
import Lottie from "lottie-react";
import emptyAnimation from "../assets/CalendarAnimation.json";

const frases = [
  "Hoy no tienes citas. ¡Aprovecha para revisar tus pendientes!",
  "Día tranquilo. Perfecto para organizar tu agenda.",
  "Sin citas por ahora. ✨ Respira y continúa con tu día.",
  "No hay citas programadas. ¿Deseas revisar nuevamente?",
  "Todo despejado por hoy. 🌤️"
];

export default function NoAppointmentsBanner({ onRefresh }) {
  const [mensaje] = useState(frases[Math.floor(Math.random() * frases.length)]);

  return (
    <div
      style={{
        width: "100%",
        margin: "1rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #F0F0F0, #F0F0F0)",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <Lottie
        animationData={emptyAnimation}
        loop
        style={{ width: "20%"}}
      />

      <h3 style={{ fontSize: "1.1rem", marginBottom: "0.7rem" }}>{mensaje}</h3>


      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
