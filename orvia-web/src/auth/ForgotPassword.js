import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd"; 
import logo from "../assets/LogoFinal.png";
import "../styles/ForgotStyle.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
       'https://api.orviaapp.com/v1/auth/request-reset',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Error en la solicitud");

      
      api.success({
      message: "Correo enviado",
      description: "📩 Te hemos enviado un código a tu correo.",
      placement: "topRight",
    });

      setEmail("");
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      
      api.error({
      description: err.message || "No se pudo enviar el correo",
      placement: "topRight",
    });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {contextHolder}
      <section className="InputBox">
        <form onSubmit={handleSubmit}>
          <h2
            style={{
              color: "#0A2472",
              textAlign: "center",
              fontSize: "34px",
            }}
          >
            Recuperar contraseña
          </h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="Input3"
          />

          <p
            style={{
              fontSize: "14px",
              alignSelf: "center",
              marginBottom: "10%",
            }}
          >
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "#1F7A8C" }}
            >
              Regresar{" "}
            </span>
          </p>

          <button type="submit" disabled={isLoading} className="SendEmail">
            {isLoading ? "Enviando..." : "Enviar código"}
          </button>
        </form>
      </section>

      <section className="TextBox">
        <img src={logo} alt="Logo" width="25%" />
        <h1 className="WTitle">Todo bajo control... ¡Tranquilo!</h1>
        <h3 className="WSubtitle">
          No te preocupes, en seguida tendrás nuevamente acceso a tu página de
          inicio
        </h3>
      </section>
    </>
  );
}
