import api from "./api";

export const orderService = {
  /**
   * Obtener todas las compras del usuario
   * @returns {Promise<Array>}
   */
  getMyOrders: async () => {
    const response = await api.get("/api/mis-compras");
    return response.data;
  },

  /**
   * Obtener detalles de una orden específica
   * @param {number} orderId
   * @returns {Promise<object>}
   */
  getById: async (orderId) => {
    const response = await api.get(`/api/compras/${orderId}`);
    return response.data;
  },

  /**
   * Cancelar una orden (si está permitido)
   * @param {number} orderId
   * @returns {Promise<object>}
   */
  cancel: async (orderId) => {
    const response = await api.put(`/api/compras/${orderId}/cancelar`);
    return response.data;
  },

  /**
   * Obtener el historial completo de compras
   * @param {object} filters - Filtros opcionales (fecha_inicio, fecha_fin, estado)
   * @returns {Promise<Array>}
   */
  getHistory: async (filters = {}) => {
    const response = await api.get("/api/compras/historial", {
      params: filters,
    });
    return response.data;
  },
};
