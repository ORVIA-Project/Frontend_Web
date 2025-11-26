import { useState, useEffect } from "react";
import { notification, Avatar } from "antd";
import "../styles/UserProfileStyle.css";
import { UserOutlined } from '@ant-design/icons';


export default function UserProfile() {


  const [api, contextHolder] = notification.useNotification();

  const [userData, setUserData] = useState({
    nombre: "Diego",
    apellidos: "Portillo Bibiano",
    correo: "usuario@correo.com",
    telefono: "",
    consultorio: "Consultorio 2",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfileData");
    const loggedUser = localStorage.getItem("loggedUser");

    if (loggedUser) {
      setUserData(JSON.parse(loggedUser));
    } else if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("UserId");

      if (!token || !userId) {
        console.error("Faltan datos de autenticación");
        api.error({
          message: "Error de autenticación",
          description: "No se encontró el token o el UserId.",
          placement: "topRight",
        });
        return;
      }

      const payload = {
        userId: Number(userId),
        firstName: tempData.nombre,
        lastName: tempData.apellidos,
        email: tempData.correo,
        phone: tempData.telefono || "",
        office: tempData.consultorio || "Consultorio 1",
      };

      const response = await fetch("https://api.orviaapp.com/v1/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("RESPUESTA ERROR:", errorMsg);

        api.error({
          message: "Error al actualizar",
          description: "El servidor rechazó la actualización del perfil.",
          placement: "topRight",
        });

        return;
      }

      const updatedUser = {
        ...tempData,
        userId: Number(userId),
      };

      setUserData(updatedUser);

      localStorage.setItem("userProfileData", JSON.stringify(updatedUser));
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

      setIsEditing(false);

      api.success({
        message: "Perfil actualizado",
        description: "La información se guardó correctamente 😊",
        placement: "topRight",
      });
    } catch (err) {
      console.error(err);

      api.error({
        message: "Error inesperado",
        description: "No se pudo conectar con el servidor.",
        placement: "topRight",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {contextHolder}

      <section className="profile-container">
        <div className="profile-image-container">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>

        <div className="profile-fields">
          <div className="field">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={isEditing ? tempData.nombre : userData.nombre}
              onChange={isEditing ? handleChange : undefined}
              disabled={!isEditing}
            />
          </div>

          <div className="field">
            <label>Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={isEditing ? tempData.apellidos : userData.apellidos}
              onChange={isEditing ? handleChange : undefined}
              disabled={!isEditing}
            />
          </div>

          <div className="field">
            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              value={isEditing ? tempData.correo : userData.correo}
              onChange={isEditing ? handleChange : undefined}
              disabled={!isEditing}
            />
          </div>

          <div className="field">
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={isEditing ? tempData.telefono : userData.telefono}
              onChange={isEditing ? handleChange : undefined}
              disabled={!isEditing}
            />
          </div>

          <div className="field">
            <label>Consultorio:</label>
            <input
              type="text"
              name="consultorio"
              value={isEditing ? tempData.consultorio : userData.consultorio}
              onChange={isEditing ? handleChange : undefined}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing ? (
          <>

            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                Guardar
              </button>
            </div>
          </>
        ) : (
          <button className="btn-edit" onClick={handleEdit}>
            Editar perfil
          </button>
        )}
      </section>
    </>
  );
}
