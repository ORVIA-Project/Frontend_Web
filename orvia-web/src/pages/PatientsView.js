import { useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function PatientsView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Simulación de fetch de pacientes
  useEffect(() => {
    setLoading(true);
    // Aquí deberías hacer el fetch a tu API real
    setTimeout(() => {
      const patients = [
        { id: 1, name: "Juan Pérez", phone: "555-1234", age: 30 },
        { id: 2, name: "María López", phone: "555-5678", age: 25 },
        { id: 3, name: "Carlos García", phone: "555-9876", age: 40 },
      ];
      setData(patients);
      setFilteredData(patients);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar pacientes por nombre o teléfono
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.phone.includes(value)
    );
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredData(data);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Edad",
      dataIndex: "age",
      key: "age",
    },
  ];

  return (
    <div style={{ padding: "1%", width: "100%" }}>
      
      <Space style={{ marginTop: '1%', marginBottom: '2%'}}>
        <Input
          placeholder="Buscar paciente por nombre"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
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
      />
    </div>
  );
}
