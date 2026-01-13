import { useState, useEffect } from "react";

/**
 * Hook para debounce de valores (útil para búsquedas)
 * @param {any} value - Valor a hacer debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {any} - Valor con debounce aplicado
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer timeout para actualizar el valor
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
