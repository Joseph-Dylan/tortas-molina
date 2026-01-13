import React from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../common/EmptyState";

/**
 * Componente para carrito vacío
 */
const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon="🛒"
      title="Tu carrito está vacío"
      message="Agrega algunos productos para comenzar a comprar"
      action={{
        label: "Ver Productos",
        onClick: () => navigate("/products"),
      }}
    />
  );
};

export default EmptyCart;
