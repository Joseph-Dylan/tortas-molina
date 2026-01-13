/**
 * Generar ID único
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Crear un delay (útil para testing o UX)
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Crear función debounce
 */
export const debounce = (func, wait = 500) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Crear función throttle
 */
export const throttle = (func, limit = 500) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copiar texto al clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error("Error al copiar:", error);
    return { success: false, error };
  }
};

/**
 * Descargar archivo
 */
export const downloadFile = (data, filename, type = "text/plain") => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Scroll to top
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
};

/**
 * Scroll to element
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
};

/**
 * Obtener parámetros de URL
 */
export const getUrlParams = () => {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
};

/**
 * Actualizar parámetros de URL
 */
export const updateUrlParams = (params) => {
  const searchParams = new URLSearchParams(window.location.search);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  });

  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, "", newUrl);
};

/**
 * Agrupar array por propiedad
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Ordenar array por propiedad
 */
export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Eliminar duplicados de array
 */
export const removeDuplicates = (array, key) => {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Chunk array (dividir en grupos)
 */
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Verificar si es móvil
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Verificar si está online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Generar color random
 */
export const randomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Calcular total del carrito
 */
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
};

/**
 * Calcular descuento
 */
export const calculateDiscount = (price, discountPercent) => {
  return price - (price * discountPercent) / 100;
};

/**
 * Verificar si un objeto está vacío
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone de objeto
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objetos
 */
export const mergeObjects = (...objects) => {
  return Object.assign({}, ...objects);
};

/**
 * Pick propiedades de objeto
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omit propiedades de objeto
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};
