import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Space, message, Tag } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

export default function PatientsView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const doctorId = localStorage.getItem("doctorId");

      if (!doctorId) {
        message.error("No se encontró el ID del doctor en localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.orviaapp.com/v1/users/by-doctor?doctorId=${doctorId}`,
          { headers: { accept: "application/json" } }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        const formatted = result.map((p) => ({
          id: p.patient_id,
          fullName: `${p.first_name} ${p.last_name}`,
          email: p.email || "Sin correo",
          phone: p.phone || "No registrado",
          medicalRecord: p.medical_record_id || "Sin expediente",
        }));

        setData(formatted);
        setFilteredData(formatted);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
        message.error("Error al cargar los pacientes del doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.fullName.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredData(data);
  };

  const columns = [
    { title: "Paciente", dataIndex: "fullName", key: "fullName" },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span>
          <MailOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {email}
        </span>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <span>
          <PhoneOutlined style={{ marginRight: 6, color: "#52c41a" }} />
          {phone}
        </span>
      ),
    },
    {
      title: "Expediente",
      dataIndex: "medicalRecord",
      key: "medicalRecord",
      render: (record) => (
        <Tag color={record === "Sin expediente" ? "volcano" : "blue"}>
          {record}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="primary"
          onClick={() => navigate(`/appointments/${record.id}`)} // 👈 patientId
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "1%", width: "100%" }}>
      <Space style={{ marginTop: "1%", marginBottom: "2%" }}>
        <Input
          placeholder="Buscar por nombre o correo"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          Reset
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No se encontraron pacientes registrados" }}
      />
    </div>
  );
}
