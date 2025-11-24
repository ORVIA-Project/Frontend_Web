import { useState, useEffect } from "react";
import { notification } from "antd";
import "../styles/UserProfileStyle.css";

import avatar1 from "../assets/UserPic1.jpg";
import avatar2 from "../assets/UserPic2.jpg";
import avatar3 from "../assets/UserPic3.jpg";

export default function UserProfile() {
  const avatars = [avatar1, avatar2, avatar3];

  const [api, contextHolder] = notification.useNotification();

  const [userData, setUserData] = useState({
    nombre: "Diego",
    apellidos: "Portillo Bibiano",
    correo: "usuario@correo.com",
    telefono: "",
    consultorio: "Consultorio 2",
  });

  const [selectedImage, setSelectedImage] = useState(avatar1);
  const [isEditing, setIsEditing] = useState(false);

  const [tempData, setTempData] = useState({});
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedProfileImage");
    const storedUser = localStorage.getItem("userProfileData");
    const loggedUser = localStorage.getItem("loggedUser");

    if (storedImage) {
      setSelectedImage(storedImage);
    }

    if (loggedUser) {
      setUserData(JSON.parse(loggedUser));
    } else if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempImage(selectedImage);
    setTempData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempImage(null);
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

      setSelectedImage(tempImage);
      setUserData(updatedUser);

      localStorage.setItem("selectedProfileImage", tempImage);
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
          <img
            src={isEditing && tempImage ? tempImage : selectedImage}
            alt="Foto de perfil"
            className="profile-image"
          />
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
            <h4>Selecciona una imagen de perfil</h4>

            <div className="avatar-list">
              {avatars.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`avatar-${i}`}
                  className={`avatar-option ${
                    tempImage === img ? "selected" : ""
                  }`}
                  onClick={() => setTempImage(img)}
                />
              ))}
            </div>

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
