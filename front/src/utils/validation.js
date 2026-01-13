/**
 * Validar formato de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar longitud de contraseña
 */
export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Validar teléfono (10 dígitos)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validar que un campo no esté vacío
 */
export const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validar longitud mínima
 */
export const hasMinLength = (value, min) => {
  return value && value.length >= min;
};

/**
 * Validar longitud máxima
 */
export const hasMaxLength = (value, max) => {
  return !value || value.length <= max;
};

/**
 * Validar que sea un número
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validar que sea un número positivo
 */
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * VALIDACIONES DE FORMULARIOS ESPECÍFICOS
 */

/**
 * Validar formulario de login
 */
export const validateLoginForm = (values) => {
  const errors = {};

  // Email
  if (!isRequired(values.email)) {
    errors.email = "El email es requerido";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Email inválido";
  }

  // Password
  if (!isRequired(values.password)) {
    errors.password = "La contraseña es requerida";
  } else if (!isValidPassword(values.password, 6)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
};

/**
 * Validar formulario de registro
 */
export const validateRegisterForm = (values) => {
  const errors = {};

  // Nombre
  if (!isRequired(values.nombre)) {
    errors.nombre = "El nombre es requerido";
  } else if (!hasMinLength(values.nombre, 3)) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres";
  } else if (!hasMaxLength(values.nombre, 100)) {
    errors.nombre = "El nombre no puede exceder 100 caracteres";
  }

  // Email
  if (!isRequired(values.email)) {
    errors.email = "El email es requerido";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Email inválido";
  }

  // Password
  if (!isRequired(values.password)) {
    errors.password = "La contraseña es requerida";
  } else if (!isValidPassword(values.password, 6)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  // Confirmar password
  if (!isRequired(values.confirmPassword)) {
    errors.confirmPassword = "Debes confirmar la contraseña";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  // Teléfono (opcional pero si lo pone debe ser válido)
  if (values.telefono && !isValidPhone(values.telefono)) {
    errors.telefono = "El teléfono debe tener 10 dígitos";
  }

  // Dirección (opcional)
  if (values.direccion && !hasMaxLength(values.direccion, 255)) {
    errors.direccion = "La dirección no puede exceder 255 caracteres";
  }

  return errors;
};

/**
 * Validar formulario de perfil
 */
export const validateProfileForm = (values) => {
  const errors = {};

  // Nombre
  if (!isRequired(values.nombre)) {
    errors.nombre = "El nombre es requerido";
  } else if (!hasMinLength(values.nombre, 3)) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres";
  }

  // Teléfono
  if (values.telefono && !isValidPhone(values.telefono)) {
    errors.telefono = "El teléfono debe tener 10 dígitos";
  }

  // Dirección
  if (values.direccion && !hasMaxLength(values.direccion, 255)) {
    errors.direccion = "La dirección no puede exceder 255 caracteres";
  }

  return errors;
};

/**
 * Validar cantidad de producto
 */
export const validateQuantity = (quantity) => {
  if (!isNumber(quantity)) {
    return "La cantidad debe ser un número";
  }
  if (!isPositiveNumber(quantity)) {
    return "La cantidad debe ser mayor a 0";
  }
  if (quantity < 1) {
    return "La cantidad mínima es 1";
  }
  return null;
};
