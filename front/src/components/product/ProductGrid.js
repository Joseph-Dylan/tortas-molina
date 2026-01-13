import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

/**
 * Grid de productos
 * @param {array} products - Array de productos
 * @param {function} onAddToCart - Función al agregar al carrito
 * @param {number} columns - Columnas por fila (default: 3)
 */
const ProductGrid = ({
  products,
  onAddToCart,
  columns = 3,
  loading = false,
}) => {
  const getColumnSize = () => {
    switch (columns) {
      case 2:
        return 6;
      case 3:
        return 4;
      case 4:
        return 3;
      default:
        return 4;
    }
  };

  return (
    <Row>
      {products.map((product) => (
        <Col key={product.id} md={getColumnSize()} className="mb-4">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            loading={loading}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
