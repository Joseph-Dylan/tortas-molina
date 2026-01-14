import api from "./api";

export const adminService = {
  /**
   * Obtener todas las ventas
   * @returns {Promise<Array>} Lista de ventas
   */
  obtenerTodasVentas: async () => {
    const response = await api.get("/api/admin/ventas");
    return response.data;
  },

  /**
   * Obtener detalle completo de una venta
   * @param {number} id - ID de la venta
   * @returns {Promise<object>} Detalle de la venta con items
   */
  obtenerDetalleVentaCompleto: async (id) => {
    const response = await api.get(`/api/admin/ventas/${id}`);
    return response.data;
  },

  /**
   * Crear venta manualmente
   * @param {object} ventaData - Datos de la venta {usuario_id, items, metodo_pago, notas, estado}
   * @returns {Promise<object>} Venta creada
   */
  crearVentaManual: async (ventaData) => {
    const response = await api.post("/api/admin/ventas", ventaData);
    return response.data;
  },

  /**
   * Actualizar estado de una venta
   * @param {number} id - ID de la venta
   * @param {object} estadoData - {estado, fecha_entrega?}
   * @returns {Promise<object>} Resultado de la actualización
   */
  actualizarEstadoVenta: async (id, estadoData) => {
    const response = await api.put(`/api/admin/ventas/${id}/estado`, estadoData);
    return response.data;
  },

  /**
   * Eliminar una venta
   * @param {number} id - ID de la venta
   * @returns {Promise<object>} Resultado de la eliminación
   */
  eliminarVenta: async (id) => {
    const response = await api.delete(`/api/admin/ventas/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo producto
   * @param {object} productoData - Datos del producto
   * @returns {Promise<object>} Producto creado
   */
  crearProducto: async (productoData) => {
    const response = await api.post("/api/admin/productos", productoData);
    return response.data;
  },

  /**
   * Actualizar producto existente
   * @param {number} id - ID del producto
   * @param {object} productoData - Datos a actualizar
   * @returns {Promise<object>} Producto actualizado
   */
  actualizarProducto: async (id, productoData) => {
    const response = await api.put(`/api/admin/productos/${id}`, productoData);
    return response.data;
  },

  /**
   * Eliminar producto
   * @param {number} id - ID del producto
   * @returns {Promise<object>} Resultado de la eliminación
   */
  eliminarProducto: async (id) => {
    const response = await api.delete(`/api/admin/productos/${id}`);
    return response.data;
  },

  /**
   * Obtener todas las categorías (para formularios)
   * @returns {Promise<Array>} Lista de categorías
   */
  obtenerCategorias: async () => {
    const response = await api.get("/api/admin/categorias");
    return response.data;
  },

  /**
   * Crear nueva categoría
   * @param {object} categoriaData - {nombre, descripcion?}
   * @returns {Promise<object>} Categoría creada
   */
  crearCategoria: async (categoriaData) => {
    const response = await api.post("/api/admin/categorias", categoriaData);
    return response.data;
  }
};