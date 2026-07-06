// js/utils.js - Funções utilitárias genéricas

/**
 * Log com prefix
 */
function log(message, data = null) {
  if (CONFIG.DEBUG) {
    console.log(`[Chess Vault] ${message}`, data);
  }
}

/**
 * Log de erro com prefix
 */
function error(message, err = null) {
  console.error(`[Chess Vault ERROR] ${message}`, err);
}

/**
 * Formatar data para exibição
 * @param {Date|string} date - Data a formatar
 * @param {string} format - Formato ('short', 'long', 'time')
 * @returns {string}
 */
function formatDate(date, format = 'short') {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', hour12: false },
  }[format] || {});
  
  return formatter.format(d);
}

/**
 * Formatar hora
 * @param {Date|string} date
 * @returns {string}
 */
function formatTime(date) {
  return formatDate(date, 'time');
}

/**
 * Formatar relativamente (ex: "há 2 minutos")
 * @param {Date|string} date
 * @returns {string}
 */
function formatRelative(date) {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)} minuto(s)`;
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)} hora(s)`;
  if (seconds < 604800) return `há ${Math.floor(seconds / 86400)} dia(s)`;
  
  return formatDate(d, 'short');
}

/**
 * Debounce uma função
 * @param {Function} func
 * @param {number} delay - Delay em ms
 * @returns {Function}
 */
function debounce(func, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle uma função
 * @param {Function} func
 * @param {number} limit - Limit em ms
 * @returns {Function}
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Validar email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validar senha (mínimo 8 caracteres, pelo menos 1 número)
 * @param {string} password
 * @returns {boolean}
 */
function isValidPassword(password) {
  return password.length >= 8 && /\d/.test(password);
}

/**
 * Copiar texto para clipboard
 * @param {string} text
 * @returns {Promise}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback para navegadores antigos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    return true;
  } catch (err) {
    error('Erro ao copiar para clipboard', err);
    return false;
  }
}

/**
 * Download de arquivo
 * @param {string} content - Conteúdo do arquivo
 * @param {string} filename - Nome do arquivo
 * @param {string} mimeType - MIME type (default: text/plain)
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Parse URL query params
 * @param {string} queryString
 * @returns {Object}
 */
function parseQueryParams(queryString = window.location.search) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

/**
 * Build query string
 * @param {Object} params
 * @returns {string}
 */
function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

/**
 * Verificar se é mobile
 * @returns {boolean}
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Sleep/delay
 * @param {number} ms - Milisegundos
 * @returns {Promise}
 */
function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Array de range
 * @param {number} start
 * @param {number} end
 * @returns {Array}
 */
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Flatten array
 * @param {Array} arr
 * @returns {Array}
 */
function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

/**
 * Unique array
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Group array by key
 * @param {Array} arr
 * @param {string|Function} key
 * @returns {Object}
 */
function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Sort array
 * @param {Array} arr
 * @param {string|Function} key
 * @param {string} order - 'asc' ou 'desc'
 * @returns {Array}
 */
function sortBy(arr, key, order = 'asc') {
  const sorted = [...arr].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

/**
 * Truncate string
 * @param {string} str
 * @param {number} length
 * @param {string} suffix
 * @returns {string}
 */
function truncate(str, length = 50, suffix = '...') {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * Capitalize string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Deep clone object
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects
 * @param {...Object} objects
 * @returns {Object}
 */
function merge(...objects) {
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
        result[key] = merge(result[key] || {}, obj[key]);
      } else {
        result[key] = obj[key];
      }
    });
    return result;
  }, {});
}
