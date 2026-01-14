import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { authService } from "../services";
import api from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      console.log(parsedUser);
      console.log(parsedUser.rol)
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  /**
   * Verificar si el usuario es administrador
   * ✨ NUEVA FUNCIÓN
   */
  const isAdmin = () => {
    return user?.rol === "admin";
  };

  /**
   * Verificar si tiene un rol específico
   * ✨ NUEVA FUNCIÓN
   */
  const hasRole = (role) => {
    return user?.rol === role;
  };

  /**
   * Iniciar sesión
   */
  const login = async (email, password) => {
    try {
      const { token, usuario } = await authService.login(email, password);

      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));

      // Actualizar estado
      setUser(usuario);

      toast.success("Login exitoso");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error en login";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Registrar nuevo usuario
   */
  const register = async (userData) => {
    try {
      const { token, usuario } = await authService.register(userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));
      setUser(usuario);

      toast.success("Registro exitoso");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error en registro";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Siempre limpiamos el localStorage y el estado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.info("Sesión cerrada");
    }
  };

  /**
   * Actualizar perfil del usuario
   */
  const updateProfile = async (profileData) => {
    try {
      await authService.updateProfile(profileData);

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Perfil actualizado");
      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al actualizar perfil";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        loading,
        isAdmin: user?.rol === "admin",
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};