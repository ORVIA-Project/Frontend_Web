import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/LogoFinal.png";
import "../styles/LoginStyle.css"

export default function LoginView({ switchToRegister }){
  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/v1/auth/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      console.log("Respuesta API:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        

      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Error en el login");
    }
  };

  return (
    <>
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
            type="text" 
            placeholder="Usuario" 
            value={email}
            onChange={(e) => setUsername(e.target.value)} 
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

          <p style={{ fontSize: "14px" , alignSelf: 'end'}}>
            ¿No tienes cuenta?{" "}
            <span onClick={switchToRegister} style={{cursor: "pointer", color: "#1F7A8C"}}>
              Regístrate
            </span>
          </p>

          <div className="ButtonBox">
            <button type="submit" className="LoginButton">Iniciar Sesión</button>
          </div>
        </form>
      </section>
    </>
  );
}
