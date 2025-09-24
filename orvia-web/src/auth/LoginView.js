import { useNavigate } from "react-router-dom";
import { notification } from 'antd';
import { useState } from "react";
import logo from "../assets/LogoV2.png";
import "../styles/LoginStyle.css";

export default function LoginView({ switchToRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validar antes de hacer fetch
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.orviaapp.com/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("email", email);

        api.success({
          message: "Inicio de sesión exitoso",
          description: `Bienvenido, ${email}`,
          placement: "topRight",
        });

        navigate("/");
      } else {
        throw new Error("El backend no devolvió un token");
      }
    } catch (err) {
      api.error({
        message: "Error al iniciar sesión",
        description: err.message || "Error en el login",
        placement: "topRight",
      });
      setError(err.message || "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <section className="TextBox">
        <img src={logo} alt="Logo" width="25%" />
        <h1 className="WTitle">¡Hola! Qué gusto tenerte de vuelta</h1>
        <h3 className="WSubtitle">
          Estamos listos para acompañarte en tu experiencia. 
          Ingresa y disfruta de todo lo que tenemos preparado para ti
        </h3>
      </section>
          
      <section className="InputBox">
        <form 
          onSubmit={handleSubmit} 
          style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}
        >
          <h2 style={{color: '#0A2472', textAlign: 'center', fontSize: '34px'}}>Iniciar Sesión</h2>
          
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="Input"
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="Input"
          />

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          
          <p style={{ fontSize: "14px", alignSelf: 'start' }}>
            <span onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer", color: "#1F7A8C" }}>
              ¿Olvidaste tu contraseña?{" "}
            </span>
          </p>

          <p style={{ fontSize: "14px" , alignSelf: 'end'}}>
            ¿No tienes cuenta?{" "}
            <span onClick={switchToRegister} style={{cursor: "pointer", color: "#1F7A8C"}}>
              Regístrate
            </span>
          </p>

          <div className="ButtonBox">
            <button type="submit" className="LoginButton" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
