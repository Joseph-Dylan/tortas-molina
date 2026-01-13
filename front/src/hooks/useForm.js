import { useState } from "react";

/**
 * Hook personalizado para manejar formularios
 * @param {object} initialValues - Valores iniciales del formulario
 * @param {function} validate - Función de validación opcional
 * @returns {object} - Estado y funciones del formulario
 */
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Manejar blur de inputs (para mostrar errores)
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar el campo cuando pierde el foco
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    }
  };

  /**
   * Manejar submit del formulario
   */
  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar todo el formulario
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Si hay errores, no continuar
      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);

        // Marcar todos los campos como touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        return;
      }
    }

    try {
      await callback(values);
    } catch (error) {
      console.error("Error en submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resetear el formulario
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Establecer valores manualmente
   */
  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Establecer error manualmente
   */
  const setFieldError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Verificar si un campo tiene error y ha sido tocado
   */
  const getFieldError = (name) => {
    return touched[name] && errors[name] ? errors[name] : "";
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
    setFieldValue,
    setFieldError,
    getFieldError,
  };
};
