/**
 * Formatear precio a moneda
 * @param {number} price - Precio a formatear
 * @param {string} currency - Moneda (default: MXN)
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price, currency = "MXN") => {
  const numPrice = parseFloat(price) || 0;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
};

/**
 * Formatear número con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} - Número formateado
 */
export const formatNumber = (num) => {
  const number = parseFloat(num) || 0;
  return new Intl.NumberFormat("es-MX").format(number);
};

/**
 * Formatear fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato (short, long, full)
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, format = "short") => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Fecha inválida";
  }

  const options = {
    short: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    full: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return new Intl.DateTimeFormat(
    "es-MX",
    options[format] || options.short
  ).format(dateObj);
};

/**
 * Formatear fecha relativa (hace 2 horas, hace 3 días, etc.)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha relativa
 */
export const formatRelativeDate = (date) => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Hace un momento";
  if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
  if (diffHour < 24) return `Hace ${diffHour} hora${diffHour > 1 ? "s" : ""}`;
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay > 1 ? "s" : ""}`;

  return formatDate(date, "short");
};

/**
 * Formatear teléfono
 * @param {string} phone - Teléfono a formatear
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  return phone;
};

/**
 * Capitalizar primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Truncar texto
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (default: ...)
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 100, suffix = "...") => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + suffix;
};

/**
 * Formatear porcentaje
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Decimales
 * @returns {string} - Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 0) => {
  const num = parseFloat(value) || 0;
  return `${num.toFixed(decimals)}%`;
};

/**
 * Formatear estado de orden
 * @param {string} status - Estado
 * @returns {object} - {text, variant}
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    completada: { text: "✅ Completada", variant: "success" },
    pendiente: { text: "⏳ Pendiente", variant: "warning" },
    cancelada: { text: "❌ Cancelada", variant: "danger" },
    procesando: { text: "🔄 Procesando", variant: "info" },
  };

  return statusMap[status] || { text: status, variant: "secondary" };
};

/**
 * Obtener iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} - Iniciales
 */
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
