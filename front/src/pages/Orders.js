import React from "react";
import { Button } from "react-bootstrap";
import { useFetch } from "../hooks";
import { orderService } from "../services";
import { LoadingSpinner, ErrorAlert, EmptyState } from "../components/common";
import { OrderCard } from "../components/order";

const Orders = () => {
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useFetch(orderService.getMyOrders);

  if (loading) {
    return <LoadingSpinner message="Cargando compras..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        title="Error al cargar compras"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No tienes compras"
        message="Aún no has realizado ninguna compra."
        action={{
          label: "Ver Productos",
          onClick: () => (window.location.href = "/products"),
        }}
      />
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📋 Mis Compras</h1>
        <Button variant="outline-primary" onClick={refetch} size="sm">
          🔄 Actualizar
        </Button>
      </div>

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
