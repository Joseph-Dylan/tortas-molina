import axios from "axios";

// Configuración base de axios
const api = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido (401)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Si hay error de servidor (500)
    if (error.response?.status === 500) {
      console.error("Error del servidor:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
