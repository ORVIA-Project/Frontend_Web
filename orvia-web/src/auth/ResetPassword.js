import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResetStyle.css"
import logo from "../assets/LogoV2.png"
import { notification, Spin, Input, Typography } from "antd";

export default function ResetPasswordView() {
  const { Title } = Typography;
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (form.password.length < 8) {
      api.warning({
        message: "Contraseña débil",
        description: "Debe tener al menos 8 caracteres.",
      });
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      api.error({
        description: "❌ Las contraseñas no coinciden",
        placement: "topRight",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.orviaapp.com/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.code,
          newPassword: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Error al cambiar la contraseña");

      api.success({
      message: "Contraseña restablecida",
      description: "✅ Ahora puedes iniciar sesión con tu nueva contraseña.",
      placement: "topRight",
    });
      
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setMessage(err.message || "No se pudo restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {contextHolder}
    <section className="InputBox">
      <form onSubmit={handleSubmit} className="FormBox">
        <h2 style={{
              color: "#0A2472",
              textAlign: "center",
              fontSize: "5vh",
            }}>Restablecer contraseña</h2>
        <Input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="Input4"
        />
        <Input
          length={6}
          type="text"
          name="code"
          placeholder="Código recibido"
          value={form.code}
          onChange={handleChange}
          required
          className="Input4"
        />
        <Input.Password
          type="password"
          name="password"
          placeholder="Nueva contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="Input4"
        />
        <Input.Password
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="Input4"
        />
        {message && <p>{message}</p>}
        <button type="submit" disabled={isLoading} className="SendPassword">
          {isLoading ? <Spin size="small" /> : "Restablecer"}
        </button>

      </form>
    </section>

    <section className="TextBox">
        <img src={logo} alt="Logo" width="25%" />
          <h1 className="WTitle">¡Ya casi lo tienes!</h1>
            <h3 className="WSubtitle">
              Confirma el codigo de acceso que llegó a tu correo y restablece tu contraseña por una nueva.
            </h3>
    </section>
  </>
  );
}
