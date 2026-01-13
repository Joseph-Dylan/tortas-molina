import React from "react";
import { Card, Button } from "react-bootstrap";

/**
 * Resumen del carrito con total y botón de checkout
 * @param {number} total - Total del carrito
 * @param {number} itemCount - Cantidad de items
 * @param {function} onCheckout - Función para checkout
 * @param {function} onClear - Función para vaciar carrito
 * @param {boolean} loading - Estado de carga
 */
const CartSummary = ({
  total,
  itemCount,
  onCheckout,
  onClear,
  loading = false,
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Resumen de Compra</Card.Title>

        <div className="d-flex justify-content-between mb-2">
          <span>Productos ({itemCount}):</span>
          <span>${Number(total).toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Envío:</span>
          <span className="text-success">Gratis</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between mb-3">
          <strong>Total:</strong>
          <strong className="h5 text-primary mb-0">
            ${Number(total).toFixed(2)}
          </strong>
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-100 mb-2"
          onClick={onCheckout}
          disabled={loading || itemCount === 0}
        >
          {loading ? "Procesando..." : "💳 Finalizar Compra"}
        </Button>

        {onClear && (
          <Button
            variant="outline-danger"
            size="sm"
            className="w-100"
            onClick={onClear}
            disabled={loading || itemCount === 0}
          >
            🗑️ Vaciar Carrito
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CartSummary;
