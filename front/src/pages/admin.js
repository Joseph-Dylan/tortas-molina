import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminSales from "../components/admin/AdminSales";

const AdminPage = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("ventas");

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Cargando...</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="mt-5 text-center">
        <h2>🔒 Acceso denegado</h2>
        <p>No tienes permisos de administrador</p>
        <a href="/" className="btn btn-primary mt-3">
          Volver al inicio
        </a>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">📊 Panel de Administración</h1>
      <p className="text-muted mb-4">
        Bienvenido, <strong>{user?.nombre}</strong>
      </p>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="ventas" title="📦 Ventas">
          <div className="mt-3">
            <AdminSales />
          </div>
        </Tab>
        <Tab eventKey="productos" title="🍰 Productos">
          <div className="mt-3">
            <AdminProducts />
          </div>
        </Tab>
        <Tab eventKey="dashboard" title="📊 Dashboard">
          <div className="mt-3">
            <AdminDashboard />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPage;