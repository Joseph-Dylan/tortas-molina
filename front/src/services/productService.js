import api from "./api";

export const productService = {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get("/api/productos");
    return response.data;
  },

  /**
   * Obtener un producto por ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  getById: async (id) => {
    const response = await api.get(`/api/productos/${id}`);
    return response.data;
  },

  /**
   * Buscar productos por nombre o categoría
   * @param {string} query
   * @returns {Promise<Array>}
   */
  search: async (query) => {
    const response = await api.get(`/api/productos/buscar`, {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Crear un nuevo producto (solo admin)
   * @param {object} productData
   * @returns {Promise<object>}
   */
  create: async (productData) => {
    const response = await api.post("/api/productos", productData);
    return response.data;
  },

  /**
   * Actualizar un producto (solo admin)
   * @param {number} id
   * @param {object} productData
   * @returns {Promise<object>}
   */
  update: async (id, productData) => {
    const response = await api.put(`/api/productos/${id}`, productData);
    return response.data;
  },

  /**
   * Eliminar un producto (solo admin)
   * @param {number} id
   * @returns {Promise<object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/api/productos/${id}`);
    return response.data;
  },
};
