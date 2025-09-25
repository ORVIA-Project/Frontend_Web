import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import logo from "../assets/LogoV2.png";
import "../styles/SignUpStyle.css";

export default function RegisterView({ switchToLogin }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Doctor",
    specialty: "",
    license_number: "",
    office: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    const requiredFields = ["first_name", "last_name", "email", "password", "confirmPassword", "phone"];
    const emptyField = requiredFields.find((field) => !form[field].trim());

    if (emptyField) {
      api.error({
        message: "Error",
        description: "Todos los campos obligatorios deben estar llenos.",
        placement: "topRight",
      });
      return;
    }

    // Validación de contraseñas
    if (form.password !== form.confirmPassword) {
      api.error({
        message: "Error",
        description: "Las contraseñas no coinciden",
        placement: "topRight",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = { ...form };
      delete payload.confirmPassword;

      const response = await fetch("https://api.orviaapp.com/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Error del servidor: ${response.status}`);
      }

      api.success({
        message: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
        placement: "topRight",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      api.error({
        message: "Error de conexión o registro",
        description: err.message || "No se pudo conectar con el servidor.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <section className="InputBox2">
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5%",
            width: "55%",
            overflowY: "scroll",
            height: "80dvh",
          }}
        >
          <h2 style={{ color: "#0A2472", textAlign: "center", fontSize: "34px" }}>Crear cuenta</h2>

          <input type="text" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} className="Input2" />
          <input type="text" name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} className="Input2" />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="Input2" />
          <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="Input" />
          <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="Input" />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} className="Input" />
          <input type="text" name="specialty" placeholder="Especialidad" value={form.specialty} onChange={handleChange} className="Input" />
          <input type="text" name="license_number" placeholder="Número de licencia" value={form.license_number} onChange={handleChange} className="Input" />
          <input type="text" name="office" placeholder="Consultorio" value={form.office} onChange={handleChange} className="Input" />

          <p style={{ fontSize: "14px", alignSelf: "end" }}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={switchToLogin} style={{ cursor: "pointer", color: "#1F7A8C" }}>
              Inicia sesión
            </span>
          </p>

          <div className="ButtonBox">
            <button type="submit" className="RegisterButton" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>
      </section>

      <section className="TextBox">
        <img src={logo} alt="Logo" width="25%" />
        <h1 className="WTitle">¡Comienza tu viaje con nosotros!</h1>
        <h3 className="WSubtitle">¿Aún no tienes cuenta? Regístrate gratis y descubre todo lo que tenemos para ti.</h3>
      </section>
    </>
  );
}
