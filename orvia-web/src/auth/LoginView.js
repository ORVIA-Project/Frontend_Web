/* global google */
import { useNavigate } from "react-router-dom";
import { notification, Input, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import logo from "../assets/LogoV2.png";
import "../styles/LoginStyle.css";

export default function LoginView({ switchToRegister }) {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleGoogleResponse = async (response) => {
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));

      const providerPayload = {
        providerName: "GOOGLE",
        providerUid: payload.sub,
        email: payload.email,
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        intendedRole: "Doctor"
      };
        console.log("Payload enviado al backend:", providerPayload);

        
      const res = await fetch("https://api.orviaapp.com/v1/auth/register/provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providerPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log("ERROR DEL BACKEND:", errText);
        throw new Error(errText || "Error al autenticarse con Google");
      }


      const data = await res.json();

      localStorage.setItem("token", data.tokens.access_token);
      localStorage.setItem("refresh_token", data.tokens.refresh_token);
      localStorage.setItem("doctorId", data.user.doctor_id);
      localStorage.setItem("UserId", String(data.user.user_id));

      const userProfile = {
        userId: data.user.user_id,
        nombre: data.user.first_name || "",
        apellidos: data.user.last_name || "",
        correo: data.user.email || "",
        telefono: data.user.phone || "",
        consultorio: data.user.office || ""
      };

      localStorage.setItem("loggedUser", JSON.stringify(userProfile));

      api.success({
        message: "Inicio de sesión con Google",
        description: `Bienvenido, ${data.user.first_name}`,
        placement: "topRight",
      });

      navigate("/");

    } catch (err) {
      api.error({
        message: "Error al iniciar sesión con Google",
        description: err.message,
        placement: "topRight",
      });
    }
  };


  const googleLogin = () => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    google.accounts.id.prompt();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      if (data.tokens?.access_token && data.user?.doctor_id) {
        localStorage.setItem("token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);
        localStorage.setItem("doctorId", data.user.doctor_id);
        localStorage.setItem("UserId", String(data.user.user_id));

        const userProfile = {
          userId: data.user.user_id,
          nombre: data.user.first_name || "",
          apellidos: data.user.last_name || "",
          correo: data.user.email || "",
          telefono: data.user.phone || "",
          consultorio: data.user.office || ""
        };

        localStorage.setItem("loggedUser", JSON.stringify(userProfile));

        api.success({
          message: "Inicio de sesión exitoso",
          description: `Bienvenido, ${data.user.first_name} ${data.user.last_name}`,
          placement: "topRight",
        });

        navigate("/");
      } else {
        throw new Error("El backend no devolvió los datos esperados");
      }
    } catch (err) {
      api.error({
        message: "Error al iniciar sesión",
        description: err.message || "Ocurrió un error inesperado",
        placement: "topRight",
      });
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
          
          <Input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="Input"
          />
          
          <Input.Password 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="Input"
          />

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <p style={{ fontSize: "14px", alignSelf: 'start', cursor: "pointer", color: "#1F7A8C" }}
             onClick={() => navigate("/forgot-password")}
          >
            ¿Olvidaste tu contraseña?
          </p>

          <p style={{display:"flex", justifyContent: "center", color: "#8e8e8eff"}}>
            Ingresa con:
          </p>

          <Button
            type="default"
            icon={<GoogleOutlined />}
            size="large"
            className={"GoogleButton"}
            onClick={googleLogin}
          >
            Continuar con Google
          </Button>

          <p style={{ fontSize: "14px" , alignSelf: 'end' }}>
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
