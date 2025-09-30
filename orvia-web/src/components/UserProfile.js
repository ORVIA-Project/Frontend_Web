import { useState, useEffect } from "react";
import "../styles/UserProfileStyle.css";

import avatar1 from "../assets/UserPic1.jpg";
import avatar2 from "../assets/UserPic2.jpg";
import avatar3 from "../assets/UserPic3.jpg";


export default function UserProfile() {
  const avatars = [avatar1, avatar2, avatar3];

  const [userData, setUserData] = useState({
    nombre: "Diego",
    apellidos: "Portillo Bibiano",
    correo: "usuario@correo.com",
    especialidad: "Fisioterapia",
    consultorio: "Consultorio 2",
  });

  const [selectedImage, setSelectedImage] = useState(avatar1);
  const [isEditing, setIsEditing] = useState(false);

  const [tempData, setTempData] = useState({});
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedProfileImage");
    const storedUser = localStorage.getItem("userProfileData");

    if (storedImage) setSelectedImage(storedImage);
    if (storedUser) setUserData(JSON.parse(storedUser));
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

  const handleSave = () => {
    setSelectedImage(tempImage);
    setUserData(tempData);

    localStorage.setItem("selectedProfileImage", tempImage);
    localStorage.setItem("userProfileData", JSON.stringify(tempData));

    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
          <label>Especialidad:</label>
          <input
            type="text"
            name="especialidad"
            value={isEditing ? tempData.especialidad : userData.especialidad}
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
  );
}
