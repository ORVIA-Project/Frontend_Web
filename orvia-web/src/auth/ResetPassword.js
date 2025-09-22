import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordView() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    token: "",
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

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://tu-api.com/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: form.token,
          newPassword: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Error al cambiar la contraseña");

      setMessage("✅ Contraseña restablecida con éxito.");
      
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setMessage(err.message || "No se pudo restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="InputBox2">
      <form onSubmit={handleSubmit}>
        <h2>Restablecer contraseña</h2>
        <input
          type="text"
          name="token"
          placeholder="Código recibido"
          value={form.token}
          onChange={handleChange}
          required
          className="Input2"
        />
        <input
          type="password"
          name="password"
          placeholder="Nueva contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="Input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="Input"
        />
        {message && <p>{message}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Restablecer"}
        </button>
      </form>
    </section>
  );
}
