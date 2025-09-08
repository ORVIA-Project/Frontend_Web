import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/LogoFinal.png";
import "../styles/LoginStyle.css"

export default function LoginView({ switchToRegister }){
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora sin validación → solo redirige al Home
    console.log("Login con:", username, password);
    navigate("/"); 
  };

  return (
    <>
    <section className="TextBox">
      <img src={logo} alt="Logo" width="25%" />
      <h1 className="WTitle">¡Hola! Qué gusto tenerte de vuelta</h1>
      <h3 className="WSubtitle">Estamos listos para acompañarte en tu experiencia. Ingresa y disfruta de todo lo que tenemos preparado para ti</h3>
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
          value={username}
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