import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Form, Modal, Row, Col, Spinner } from "react-bootstrap";
import { adminService } from "../../services";
import { toast } from "react-toastify";

const AdminSales = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevaVenta, setNuevaVenta] = useState({
    usuario_id: "",
    items: [{ producto_id: "", cantidad: 1 }],
    metodo_pago: "efectivo",
    notas: "",
    estado: "pagado"
  });
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  useEffect(() => {
    cargarVentas();
  }, []);

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

  const handleVentaChange = (e) => {
    setNuevaVenta({
      ...nuevaVenta,
      [e.target.name]: e.target.value
    });
  };

  const cambiarItemVenta = (index, field, value) => {
    const nuevosItems = [...nuevaVenta.items];
    nuevosItems[index][field] = field === 'cantidad' ? parseInt(value) || 1 : value;
    setNuevaVenta({ ...nuevaVenta, items: nuevosItems });
  };

  const agregarItemVenta = () => {
    setNuevaVenta({
      ...nuevaVenta,
      items: [...nuevaVenta.items, { producto_id: "", cantidad: 1 }]
    });
  };

  const eliminarItemVenta = (index) => {
    if (nuevaVenta.items.length > 1) {
      const nuevosItems = nuevaVenta.items.filter((_, i) => i !== index);
      setNuevaVenta({ ...nuevaVenta, items: nuevosItems });
    }
  };

  const crearVenta = async () => {
    try {
      // Validar
      if (!nuevaVenta.usuario_id) {
        toast.error("El ID de usuario es requerido");
        return;
      }

      if (nuevaVenta.items.some(item => !item.producto_id || item.cantidad < 1)) {
        toast.error("Todos los productos deben tener ID y cantidad válida");
        return;
      }

      await adminService.crearVentaManual(nuevaVenta);
      toast.success("Venta creada exitosamente");
      setShowModal(false);
      setNuevaVenta({
        usuario_id: "",
        items: [{ producto_id: "", cantidad: 1 }],
        metodo_pago: "efectivo",
        notas: "",
        estado: "pagado"
      });
      cargarVentas();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al crear venta");
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
    switch(estado) {
      case 'pendiente': return 'warning';
      case 'pagado': return 'info';
      case 'en_preparacion': return 'primary';
      case 'entregado': return 'success';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  const getEstadoTexto = (estado) => {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'pagado': return 'Pagado';
      case 'en_preparacion': return 'En Preparación';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Ventas</h3>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Nueva Venta Manual
        </Button>
      </div>

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
                <td>{venta.usuario_nombre || `Usuario ${venta.usuario_id}`}</td>
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
                      variant="outline-info" 
                      size="sm"
                      onClick={() => window.open(`/admin/ventas/${venta.id}`, '_blank')}
                      className="me-1"
                    >
                      Ver
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      onClick={() => actualizarEstado(venta.id, venta.estado)}
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

      {/* Modal para nueva venta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Venta Manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>ID del Usuario *</Form.Label>
                  <Form.Control
                    type="number"
                    name="usuario_id"
                    value={nuevaVenta.usuario_id}
                    onChange={handleVentaChange}
                    placeholder="Ej: 2"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Método de Pago</Form.Label>
                  <Form.Select
                    name="metodo_pago"
                    value={nuevaVenta.metodo_pago}
                    onChange={handleVentaChange}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Productos *</Form.Label>
              {nuevaVenta.items.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="number"
                    placeholder="ID Producto"
                    value={item.producto_id}
                    onChange={(e) => cambiarItemVenta(index, 'producto_id', e.target.value)}
                    className="me-2"
                    style={{ flex: 2 }}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Cantidad"
                    value={item.cantidad}
                    onChange={(e) => cambiarItemVenta(index, 'cantidad', e.target.value)}
                    className="me-2"
                    style={{ flex: 1 }}
                    min="1"
                  />
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => eliminarItemVenta(index)}
                    disabled={nuevaVenta.items.length === 1}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button variant="outline-secondary" size="sm" onClick={agregarItemVenta}>
                + Agregar Producto
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={nuevaVenta.estado}
                onChange={handleVentaChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="en_preparacion">En Preparación</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                name="notas"
                value={nuevaVenta.notas}
                onChange={handleVentaChange}
                rows={2}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={crearVenta}>
            Crear Venta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSales;