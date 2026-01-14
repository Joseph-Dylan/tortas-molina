// src/utils/constants.js

/**
 * URLs de la API
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";

/**
 * Rutas de navegación
 */
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  CART: "/cart",
  ORDERS: "/orders",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
  ADMIN_VENTAS: "/admin/ventas",
  ADMIN_PRODUCTOS: "/admin/productos",
};
/**
 * Estados de venta
 */
export const VENTA_STATUS = {
  PENDING: "pendiente",
  PAID: "pagado",
  PREPARING: "en_preparacion",
  DELIVERED: "entregado",
  CANCELLED: "cancelado",
};

/**
 * Estados de orden
 */
export const ORDER_STATUS = {
  PENDING: "pendiente",
  PROCESSING: "procesando",
  COMPLETED: "completada",
  CANCELLED: "cancelada",
};

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "cliente",
  EMPLOYEE: "empleado",
};

/**
 * Variantes de Bootstrap
 */
export const VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
  LIGHT: "light",
  DARK: "dark",
};

/**
 * Tamaños
 */
export const SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
  EXTRA_LARGE: "xl",
};

/**
 * Keys de localStorage
 */
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  UNAUTHORIZED: "No autorizado. Inicia sesión nuevamente.",
  SERVER_ERROR: "Error del servidor. Intenta más tarde.",
  NOT_FOUND: "No encontrado.",
  VALIDATION_ERROR: "Error de validación. Verifica los datos.",
  GENERIC_ERROR: "Ha ocurrido un error inesperado.",
};

/**
 * Mensajes de éxito comunes
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Inicio de sesión exitoso",
  REGISTER_SUCCESS: "Registro exitoso",
  UPDATE_SUCCESS: "Actualización exitosa",
  DELETE_SUCCESS: "Eliminación exitosa",
  CART_ADD_SUCCESS: "Producto agregado al carrito",
  CART_REMOVE_SUCCESS: "Producto eliminado del carrito",
  CART_CLEAR_SUCCESS: "Carrito vaciado",
  CHECKOUT_SUCCESS: "Compra realizada exitosamente",
};

/**
 * Límites y configuraciones
 */
export const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  PHONE_LENGTH: 10,
  MAX_NAME_LENGTH: 100,
  MAX_ADDRESS_LENGTH: 255,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 3000,
  ITEMS_PER_PAGE: 12,
  MAX_CART_QUANTITY: 99,
};

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  ONLY_NUMBERS: /^\d+$/,
  ONLY_LETTERS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
};

/**
 * Placeholder images
 */
export const PLACEHOLDER_IMAGES = {
  PRODUCT: "https://via.placeholder.com/300x200?text=Sin+Imagen",
  USER: "https://via.placeholder.com/150?text=Usuario",
  NO_IMAGE: "https://via.placeholder.com/400x300?text=Imagen+no+disponible",
};

/**
 * Categorías de productos (ejemplo)
 */
export const PRODUCT_CATEGORIES = {
  TORTAS: "tortas",
  BEBIDAS: "bebidas",
  POSTRES: "postres",
  EXTRAS: "extras",
};

/**
 * Métodos de pago
 */
export const PAYMENT_METHODS = {
  CASH: "efectivo",
  CARD: "tarjeta",
  TRANSFER: "transferencia",
};

/**
 * Formato de moneda
 */
export const CURRENCY = {
  CODE: "MXN",
  SYMBOL: "$",
  NAME: "Peso Mexicano",
};

/**
 * Timeouts
 */
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10 segundos
  DEBOUNCE: 500, // 500ms
  TOAST: 3000, // 3 segundos
};

/**
 * Headers HTTP comunes
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: "application/json",
  AUTHORIZATION: "Authorization",
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
