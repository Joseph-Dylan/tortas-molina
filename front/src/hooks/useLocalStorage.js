import { useState, useEffect } from "react";

/**
 * Hook para sincronizar estado con localStorage
 * @param {string} key - Clave en localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, function, function]} - [valor, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Obtener valor inicial de localStorage o usar initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error);
      return initialValue;
    }
  });

  /**
   * Establecer valor en estado y localStorage
   */
  const setValue = (value) => {
    try {
      // Permitir que value sea una función como useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  };

  /**
   * Remover valor de localStorage
   */
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};
