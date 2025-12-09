import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/productos');
      setProducts(response.data);
    } catch (error) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
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
      <h1 className="mb-4">Productos Disponibles</h1>
      <Row>
        {products.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={product.imagen_url || 'https://via.placeholder.com/300'} 
                height="200"
                style={{ objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.nombre}</Card.Title>
                <Card.Text>{product.descripcion}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 text-primary">${product.precio}</span>
                  <span className="text-muted">Stock: {product.stock}</span>
                </div>
                <Button 
                  variant="primary" 
                  className="mt-3 w-100"
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;