import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/mis-compras');
      setOrders(response.data);
    } catch (error) {
      setError('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const variants = {
      completada: 'success',
      pendiente: 'warning',
      cancelada: 'danger'
    };
    return variants[estado] || 'secondary';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h1 className="mb-4">Mis Compras</h1>
      
      {orders.length === 0 ? (
        <Alert variant="info">
          No has realizado ninguna compra todavía.
        </Alert>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5>Orden #{order.id}</h5>
                  <small className="text-muted">
                    {new Date(order.fecha_venta).toLocaleDateString()}
                  </small>
                </div>
                <div>
                  <Badge bg={getStatusBadge(order.estado)}>
                    {order.estado}
                  </Badge>
                  <h5 className="mt-2 text-end">Total: ${order.total}</h5>
                </div>
              </div>
              
              <Table responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(order.items).map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.precio_unitario}</td>
                      <td>${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default Orders;