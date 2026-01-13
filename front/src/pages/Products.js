import React from "react";
import { Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useFetch } from "../hooks";
import { productService } from "../services";
import { LoadingSpinner, ErrorAlert, EmptyState } from "../components/common";
import { ProductGrid } from "../components/product";

const Products = () => {
  const { addToCart } = useCart();

  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch(productService.getAll);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        title="Error al cargar productos"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No hay productos disponibles"
        message="Vuelve más tarde para ver nuevos productos."
      />
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Productos Disponibles</h1>
        <Button variant="outline-primary" onClick={refetch} size="sm">
          🔄 Actualizar
        </Button>
      </div>

      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        columns={3}
      />
    </div>
  );
};

export default Products;
