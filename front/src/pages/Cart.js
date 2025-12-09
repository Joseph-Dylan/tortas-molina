import React, { useState } from 'react';
import { Table, Button, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, checkout } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    const result = await checkout();
    setLoading(false);
    if (result.success) {
      navigate('/orders');
    }
  };

  if (cart.items.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>Carrito Vacío</Alert.Heading>
        <p>Agrega algunos productos para comenzar a comprar.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Ver Productos
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mi Carrito</h1>
        <Button variant="danger" onClick={clearCart}>
          Vaciar Carrito
        </Button>
      </div>

      <Table responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map(item => (
            <tr key={item.producto_id}>
              <td>
                <div className="d-flex align-items-center">
                  <img 
                    src={item.imagen_url || 'https://via.placeholder.com/50'} 
                    alt={item.nombre}
                    width="50"
                    className="me-3"
                  />
                  <span>{item.nombre}</span>
                </div>
              </td>
              <td>${item.precio}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Button 
                    size="sm" 
                    variant="outline-secondary"
                    onClick={() => updateQuantity(item.producto_id, Math.max(1, item.cantidad - 1))}
                  >
                    <FaMinus />
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => updateQuantity(item.producto_id, parseInt(e.target.value) || 1)}
                    className="mx-2 text-center"
                    style={{ width: '70px' }}
                  />
                  <Button 
                    size="sm" 
                    variant="outline-secondary"
                    onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </td>
              <td>${(item.precio * item.cantidad).toFixed(2)}</td>
              <td>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => removeFromCart(item.producto_id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mt-4">
        <Col md={{ span: 4, offset: 8 }}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen de Compra</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total:</span>
                <span className="h5 text-primary">${cart.total.toFixed(2)}</span>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;