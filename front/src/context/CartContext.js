import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { cartService } from "../services";

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  /**
   * Obtener el carrito del servidor
   */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.get();
      setCart(cartData);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      // Si hay error, reseteamos el carrito
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar producto al carrito
   */
  const addToCart = async (productoId, cantidad = 1) => {
    try {
      await cartService.add(productoId, cantidad);
      await fetchCart(); // Recargar carrito
      toast.success("Producto agregado al carrito");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al agregar producto";
      toast.error(errorMsg);
      throw error;
    }
  };

  /**
   * Eliminar producto del carrito
   */
  const removeFromCart = async (productoId) => {
    try {
      await cartService.remove(productoId);
      await fetchCart();
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al eliminar producto";
      toast.error(errorMsg);
      throw error;
    }
  };

  /**
   * Actualizar cantidad de un producto
   */
  const updateQuantity = async (productoId, cantidad, stock) => {
    if (cantidad > stock) {
      toast.error(`Solo hay ${stock} unidades disponibles`);
      return;
    }

    try {
      await cartService.updateQuantity(productoId, cantidad);
      await fetchCart();
      toast.success("Cantidad actualizada");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "No se pudo actualizar la cantidad"
      );
    }
  };

  /**
   * Vaciar todo el carrito
   */
  const clearCart = async () => {
    try {
      await cartService.clear();
      setCart({ items: [], total: 0 });
      toast.success("Carrito vaciado");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al vaciar carrito";
      toast.error(errorMsg);
      throw error;
    }
  };

  /**
   * Realizar la compra
   */
  const checkout = async (checkoutData = {}) => {
    try {
      setLoading(true);
      const response = await cartService.checkout(checkoutData);
      setCart({ items: [], total: 0 }); // Limpiar carrito local
      toast.success("Compra realizada exitosamente");
      return { success: true, data: response };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al realizar la compra";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito cuando el usuario inicia sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        fetchCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
