import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoFinal.png";
import "../styles/SignUpStyle.css";

export default function RegisterView({ switchToLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Doctor", // Valor por defecto
    specialty: "",
    license_number: "",
    office: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const response = await fetch(
      "http://orvia-alb-2103208119.us-east-2.elb.amazonaws.com/v1/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
          specialty: form.specialty,
          license_number: form.license_number,
          office: form.office
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("❌ Error en respuesta:", response.status, data);
      alert("Error: " + (data?.message || `Código ${response.status}`));
      return;
    }

    console.log("✅ Usuario registrado:", data);
    alert("Registro exitoso ✅");
    navigate("/login");
  } catch (err) {
    console.error("🚨 Error de conexión:", err);
    alert("No se pudo conectar con la API");
  }
};


  return (
    <>
      <section className="InputBox2">
        <form 
          onSubmit={handleSubmit} 
          style={{ display: "flex", flexDirection: "column", gap: "5%", width: "55%", overflowY:"scroll", height: "80dvh"}}
        >
        
          <h2 style={{color: '#0A2472', textAlign: 'center', fontSize: '34px'}}>Crear cuenta</h2>
        
          <input type="text" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} required className="Input2" />
          <input type="text" name="last_name" placeholder="Apellido" value={form.last_name} onChange={handleChange} required className="Input2" />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required className="Input2" />
          <input type="tel" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required className="Input" />
          
          <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="Input" />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} required className="Input" />

          <input type="text" name="specialty" placeholder="Especialidad" value={form.specialty} onChange={handleChange} className="Input" />
          <input type="text" name="license_number" placeholder="Número de licencia" value={form.license_number} onChange={handleChange} className="Input" />
          <input type="text" name="office" placeholder="Consultorio" value={form.office} onChange={handleChange} className="Input" />
        
          <p style={{ fontSize: "14px" , alignSelf: 'end'}}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={switchToLogin} style={{cursor: "pointer", color: "#1F7A8C"}}>
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
