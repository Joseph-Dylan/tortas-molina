import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para fetch de datos
 * @param {function} fetchFunction - Función que hace el fetch
 * @param {array} dependencies - Dependencias para re-ejecutar el fetch
 * @param {object} options - Opciones adicionales
 * @returns {object} - Estado del fetch
 */
export const useFetch = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  /**
   * Ejecutar el fetch
   */
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction(...args);
        setData(result);

        return { success: true, data: result };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || err.message || "Error desconocido";
        setError(errorMessage);

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  /**
   * Refetch - volver a ejecutar el fetch
   */
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  /**
   * Ejecutar automáticamente si no es manual
   */
  useEffect(() => {
    if (!options.manual) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    setData,
  };
};
