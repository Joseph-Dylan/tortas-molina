import React, { useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LoadingSpinner, ConfirmModal } from "../components/common";
import {
  CartItem,
  CartSummary,
  EmptyCart,
  PaymentModal,
} from "../components/cart";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, checkout } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setShowPaymentModal(true);
  };

  const handleCheckout = async (paymentData) => {
    setLoading(true);
    setShowPaymentModal(false);

    const result = await checkout(paymentData); // ← Envía datos de pago
    setLoading(false);

    if (result.success) {
      navigate("/orders");
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearModal(false);
  };

  if (loading) {
    return <LoadingSpinner message="Procesando compra..." />;
  }

  if (!cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🛒 Mi Carrito</h1>
        <Button
          variant="outline-danger"
          onClick={() => setShowClearModal(true)}
          size="sm"
        >
          🗑️ Vaciar Carrito
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <CartItem
                  key={item.producto_id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </tbody>
          </Table>
        </Col>

        <Col lg={4}>
          <CartSummary
            total={cart.total}
            itemCount={cart.items.reduce((sum, item) => sum + item.cantidad, 0)}
            onCheckout={handleCheckoutClick}
            onClear={() => setShowClearModal(true)}
            loading={loading}
          />
        </Col>
      </Row>

      <ConfirmModal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        onConfirm={handleClearCart}
        title="¿Vaciar carrito?"
        message="¿Estás seguro de que deseas eliminar todos los productos del carrito?"
        confirmText="Sí, vaciar"
        variant="danger"
      />

      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        onConfirm={handleCheckout}
        loading={loading}
      />
    </div>
  );
};

export default Cart;
