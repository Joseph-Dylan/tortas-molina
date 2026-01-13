import api from "./api";

export const authService = {
  /**
   * Iniciar sesión
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, usuario: object}>}
   */
  login: async (email, password) => {
    const response = await api.post("/api/login", { email, password });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario (nombre, email, password, telefono, direccion)
   * @returns {Promise<{token: string, usuario: object}>}
   */
  register: async (userData) => {
    const response = await api.post("/api/register", userData);
    return response.data;
  },

  /**
   * Actualizar perfil del usuario
   * @param {object} profileData - Datos a actualizar (nombre, telefono, direccion)
   * @returns {Promise<object>}
   */
  updateProfile: async (profileData) => {
    const response = await api.put("/api/profile", profileData);
    return response.data;
  },

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<object>}
   */
  getProfile: async () => {
    const response = await api.get("/api/profile");
    return response.data;
  },

  /**
   * Cerrar sesión (opcional si tienes endpoint de logout)
   * @returns {Promise<object>}
   */
  logout: async () => {
    try {
      const response = await api.post("/api/logout");
      return response.data;
    } catch (error) {
      // Si no hay endpoint de logout, solo limpiamos el cliente
      return { success: true };
    }
  },
};
