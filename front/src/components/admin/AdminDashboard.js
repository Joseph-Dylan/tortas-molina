import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      cargarVentas();
    }
  }, [isAdmin]);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const data = await adminService.obtenerTodasVentas();
      setVentas(data);
    } catch (error) {
      toast.error("Error al cargar ventas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarVenta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      try {
        await adminService.eliminarVenta(id);
        toast.success("Venta eliminada");
        cargarVentas();
      } catch (error) {
        toast.error(error.response?.data?.error || "Error al eliminar");
      }
    }
  };

  const actualizarEstado = async (id, estadoActual) => {
    const nuevoEstado = prompt(
      "Nuevo estado (pendiente, pagado, en_preparacion, entregado, cancelado):",
      estadoActual
    );

    if (nuevoEstado && nuevoEstado !== estadoActual) {
      try {
        await adminService.actualizarEstadoVenta(id, { estado: nuevoEstado });
        toast.success("Estado actualizado");
        cargarVentas();
      } catch (error) {
        toast.error("Error al actualizar estado");
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "pagado":
        return "info";
      case "en_preparacion":
        return "primary";
      case "entregado":
        return "success";
      case "cancelado":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "pagado":
        return "Pagado";
      case "en_preparacion":
        return "En Preparación";
      case "entregado":
        return "Entregado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  if (!isAdmin) {
    return (
      <Container className="mt-5 text-center">
        <h2>🔒 Acceso denegado</h2>
        <p>No tienes permisos de administrador</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando ventas...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">📊 Panel de Administración</h1>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Todas las Ventas</span>
        </Card.Header>
        <Card.Body>
          {ventas.length === 0 ? (
            <p className="text-center text-muted">No hay ventas registradas</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Método Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>#{venta.id}</td>
                    <td>{new Date(venta.fecha_pedido).toLocaleDateString()}</td>
                    <td>
                      {venta.usuario_nombre || `Usuario ${venta.usuario_id}`}
                    </td>
                    <td>${parseFloat(venta.total).toFixed(2)}</td>
                    <td>
                      <Badge bg={getEstadoColor(venta.estado)}>
                        {getEstadoTexto(venta.estado)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        {venta.metodo_pago}
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() =>
                            actualizarEstado(venta.id, venta.estado)
                          }
                          className="me-1"
                        >
                          Estado
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => eliminarVenta(venta.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
