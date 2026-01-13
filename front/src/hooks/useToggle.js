import { useState, useCallback } from "react";

/**
 * Hook para manejar valores booleanos (toggle)
 * @param {boolean} initialValue - Valor inicial
 * @returns {[boolean, function, function, function]} - [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  /**
   * Alternar entre true y false
   */
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  /**
   * Establecer en true
   */
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  /**
   * Establecer en false
   */
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};
