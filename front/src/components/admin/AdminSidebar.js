import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard", exact: true },
    { path: "/admin/ventas", icon: "📦", label: "Ventas" },
    { path: "/admin/productos", icon: "🍰", label: "Productos" },
    { path: "/admin/nueva-venta", icon: "➕", label: "Nueva Venta" },
    { path: "/admin/nuevo-producto", icon: "➕", label: "Nuevo Producto" },
  ];

  return (
    <Nav className="flex-column bg-light p-3" style={{ minHeight: "100vh", width: "250px" }}>
      <div className="mb-4">
        <h4>🔧 Administración</h4>
        <hr />
      </div>
      
      {menuItems.map((item) => {
        const isActive = item.exact 
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);
        
        return (
          <Nav.Item key={item.path} className="mb-2">
            <Nav.Link 
              as={Link} 
              to={item.path}
              className={`d-flex align-items-center ${isActive ? 'active' : ''}`}
              style={{
                borderRadius: "5px",
                padding: "10px 15px",
                backgroundColor: isActive ? "#0d6efd" : "transparent",
                color: isActive ? "white" : "inherit"
              }}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </Nav.Link>
          </Nav.Item>
        );
      })}
      
      <div className="mt-auto pt-4 border-top">
        <Nav.Link 
          as={Link} 
          to="/"
          className="d-flex align-items-center text-dark"
        >
          <span className="me-2">🏠</span>
          Volver al Sitio
        </Nav.Link>
      </div>
    </Nav>
  );
};

export default AdminSidebar;