import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

/**
 * Tarjeta de producto individual
 * @param {object} product - Objeto del producto
 * @param {function} onAddToCart - Función al agregar al carrito
 * @param {boolean} loading - Estado de carga
 */
const ProductCard = ({ product, onAddToCart, loading = false }) => {
  const { id, nombre, descripcion, precio, stock, imagen_url } = product;

  const isOutOfStock = stock === 0;

  return (
    <Card className="h-100 shadow-sm">
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={
            imagen_url || "https://via.placeholder.com/300x200?text=Sin+Imagen"
          }
          height="200"
          style={{ objectFit: "cover" }}
        />

        {isOutOfStock && (
          <Badge
            bg="danger"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            Agotado
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title>{nombre}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {descripcion || "Sin descripción"}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="h5 mb-0 text-primary">
            ${Number(precio).toFixed(2)}
          </span>
          <Badge bg={stock > 10 ? "success" : stock > 0 ? "warning" : "danger"}>
            Stock: {stock}
          </Badge>
        </div>

        <Button
          variant={isOutOfStock ? "secondary" : "primary"}
          className="w-100"
          onClick={() => onAddToCart(id)}
          disabled={isOutOfStock || loading}
        >
          {loading
            ? "Agregando..."
            : isOutOfStock
            ? "Sin Stock"
            : "Agregar al Carrito"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
