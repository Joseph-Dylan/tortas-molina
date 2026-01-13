import api from "./api";

export const cartService = {
  /**
   * Obtener el carrito del usuario actual
   * @returns {Promise<{items: Array, total: number}>}
   */
  get: async () => {
    const response = await api.get("/api/carrito");
    return response.data;
  },

  /**
   * Agregar un producto al carrito
   * @param {number} productoId
   * @param {number} cantidad
   * @returns {Promise<object>}
   */
  add: async (productoId, cantidad = 1) => {
    const response = await api.post("/api/carrito/agregar", {
      productoId,
      cantidad,
    });
    return response.data;
  },

  /**
   * Actualizar la cantidad de un producto en el carrito
   * @param {number} productoId
   * @param {number} cantidad
   * @returns {Promise<object>}
   */
  updateQuantity: async (productoId, cantidad) => {
    const response = await api.put(`/api/carrito/${productoId}`, {
      cantidad,
    });
    return response.data;
  },

  /**
   * Eliminar un producto del carrito
   * @param {number} productoId
   * @returns {Promise<object>}
   */
  remove: async (productoId) => {
    const response = await api.delete(`/api/carrito/${productoId}`);
    return response.data;
  },

  /**
   * Vaciar todo el carrito
   * @returns {Promise<object>}
   */
  clear: async () => {
    const response = await api.delete("/api/carrito");
    return response.data;
  },

  /**
   * Realizar la compra (checkout)
   * @param {object} checkoutData - Datos adicionales como método de pago
   * @returns {Promise<object>}
   */
  checkout: async (checkoutData = {}) => {
    const response = await api.post("/api/comprar", {
      metodo_pago: checkoutData.metodo_pago || "tarjeta",
      ...checkoutData,
    });
    return response.data;
  },
};
