import React from "react";
import { Card, Badge, Table } from "react-bootstrap";

/**
 * Tarjeta de orden/compra
 * @param {object} order - Objeto de la orden
 */
const OrderCard = ({ order }) => {
  const { id, fecha_venta, estado, total, items } = order;

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

  let orderItems = [];

  try {
    if (Array.isArray(items)) {
      orderItems = items;
    } else if (typeof items === "string") {
      orderItems = JSON.parse(items);
    }
  } catch (e) {
    orderItems = [];
  }

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

        <Table responsive hover size="sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Precio Unit.</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-end">
                  ${Number(item.precio_unitario).toFixed(2)}
                </td>
                <td className="text-end">
                  <strong>
                    ${(item.cantidad * item.precio_unitario).toFixed(2)}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
