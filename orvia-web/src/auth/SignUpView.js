import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoFinal.png"
import "./SignUpStyle.css"

export default function RegisterView() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora no validamos nada más que confirmar password
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Usuario registrado:", username, password);

    // Después de registrar, mandamos al login
    navigate("/login");
  };

  return (
    <>
      <section className="InputBox">
      <form 
        onSubmit={handleSubmit} 
        style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}
      >
        <h2 style={{color: '#0A2472', textAlign: 'center', fontSize: '34px'}}>Crear cuenta</h2>
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
        <input 
          type="password" 
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required
          className="Input"
        />

        <p style={{ fontSize: "14px" , alignSelf: 'end'}}>
          ¿Ya tienes cuenta?{" "}
          <span 
            style={{ color: "#1F7A8C", cursor: "pointer" }} 
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>

        <div className="ButtonBox">
          <button type="submit" className="RegisterButton">Registrarse</button>
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
