import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoV2.png";
import "../styles/SignUpStyle.css";

export default function RegisterView({ switchToLogin }) {
  const navigate = useNavigate();

  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    office: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
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
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        
        throw new Error(data?.message || `Error del servidor: ${response.status}`);
      }

      console.log("✅ Usuario registrado:", data);
      setSuccess("¡Registro exitoso!");

      
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error("🚨 Error de conexión o registro:", err);
      
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="InputBox2">
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5%",
            width: "55%",
            overflowY: "scroll",
            height: "80dvh"
          }}
        >
          <h2 style={{ color: '#0A2472', textAlign: 'center', fontSize: '34px' }}>Crear cuenta</h2>


          <input type="text" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} required className="Input2" />
          <input type="text" name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} required className="Input2" />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required className="Input2" />
          <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required className="Input" />
          <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="Input" />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} required className="Input" />
          <input type="text" name="specialty" placeholder="Especialidad" value={form.specialty} onChange={handleChange} className="Input" />
          <input type="text" name="license_number" placeholder="Número de licencia" value={form.license_number} onChange={handleChange} className="Input" />
          <input type="text" name="office" placeholder="Consultorio" value={form.office} onChange={handleChange} className="Input" />
          

          

          <p style={{ fontSize: "14px", alignSelf: 'end' }}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={switchToLogin} style={{ cursor: "pointer", color: "#1F7A8C" }}>
              Inicia sesión
            </span>
          </p>

          
          <div className="message-container">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </div>

          <div className="ButtonBox">
            <button type="submit" className="RegisterButton" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
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