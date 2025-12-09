import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/carrito');
      setCart(response.data);
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
  };

  const addToCart = async (productoId, cantidad = 1) => {
    try {
      await axios.post('/api/carrito/agregar', { productoId, cantidad });
      await fetchCart();
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al agregar');
    }
  };

  const removeFromCart = async (productoId) => {
    try {
      await axios.delete(`/api/carrito/${productoId}`);
      await fetchCart();
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar');
    }
  };

  const updateQuantity = async (productoId, cantidad) => {
    try {
      await axios.put(`/api/carrito/${productoId}`, { cantidad });
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/carrito');
      setCart({ items: [], total: 0 });
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al vaciar');
    }
  };

  const checkout = async () => {
    try {
      const response = await axios.post('/api/comprar');
      setCart({ items: [], total: 0 });
      toast.success('Compra realizada exitosamente');
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error en la compra');
      return { success: false };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      fetchCart,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};