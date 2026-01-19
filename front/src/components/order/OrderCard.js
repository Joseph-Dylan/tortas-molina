import React, { useState, useEffect } from "react";
import { Card, Badge, Table, Button, Alert } from "react-bootstrap";
import { orderService } from "../../services";

/**
 * Tarjeta de orden/compra
 * @param {object} order - Objeto de la orden básico
 */
const OrderCard = ({ order }) => {
  const { id, fecha_venta, estado, total } = order;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusBadge = (estado) => {
    const variants = {
      completada: "success",
      pendiente: "warning",
      cancelada: "danger",
      procesando: "info",
    };
    return variants[estado] || "secondary";
  };

  const getStatusText = (estado) => {
    const texts = {
      completada: "✅ Completada",
      pendiente: "⏳ Pendiente",
      cancelada: "❌ Cancelada",
      procesando: "🔄 Procesando",
    };
    return texts[estado] || estado;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cargar detalles de la orden
  const loadOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await orderService.getById(id);
      setOrderDetails(details);
    } catch (err) {
      setError("Error al cargar los detalles de la orden");
      console.error("Error cargando detalles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar detalles automáticamente al montar el componente
  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const items = orderDetails?.items || [];

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">Orden #{id}</h5>
            <small className="text-muted">{formatDate(fecha_venta)}</small>
          </div>
          <div className="text-end">
            <Badge bg={getStatusBadge(estado)} className="mb-2">
              {getStatusText(estado)}
            </Badge>
            <h5 className="text-primary mb-0">
              Total: ${Number(total).toFixed(2)}
            </h5>
          </div>
        </div>

        {loading && (
          <Alert variant="info" className="text-center">
            Cargando detalles de la orden...
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
            <div className="mt-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={loadOrderDetails}
              >
                Reintentar
              </Button>
            </div>
          </Alert>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <h6 className="mb-3">📦 Productos de la compra:</h6>
            <Table responsive hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unit.</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <strong>{item.nombre}</strong>
                        {item.imagen_url && (
                          <div>
                            <img
                              src={item.imagen_url}
                              alt={item.nombre}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">
                      ${Number(item.precio_unitario).toFixed(2)}
                    </td>
                    <td className="text-end">
                      <strong>${Number(item.subtotal).toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {!loading && !error && items.length === 0 && (
          <Alert variant="warning" className="text-center">
            No se encontraron productos para esta orden
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
