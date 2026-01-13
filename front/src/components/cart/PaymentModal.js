// PaymentModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PaymentModal = ({ show, onHide, onConfirm, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");

  const handleConfirm = () => {
    onConfirm({ metodo_pago: paymentMethod });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Método de Pago</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Método de pago</Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="tarjeta"
                label="💳 Tarjeta de crédito/débito"
                name="paymentMethod"
                value="tarjeta"
                checked={paymentMethod === "tarjeta"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="paypal"
                label="PayPal"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="efectivo"
                label="💰 Efectivo"
                name="paymentMethod"
                value="efectivo"
                checked={paymentMethod === "efectivo"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
