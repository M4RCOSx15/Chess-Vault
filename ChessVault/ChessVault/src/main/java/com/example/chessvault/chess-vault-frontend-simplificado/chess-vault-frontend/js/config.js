// js/config.js - Configurações e endpoints (versão mínima para login/registro)

const CONFIG = {
  // TODO (decisão sua): confirme com o backend qual vai ser o path real.
  // Hoje o UserController está em /api/usuario/v1, mas login/registro
  // deveriam viver num AuthController separado (ver mentoria anterior).
  // Ajuste API_BASE_URL e os ENDPOINTS abaixo para bater com o que você criar.
  API_BASE_URL: 'http://localhost:8080/auth',

  ENDPOINTS: {
    AUTH: {
      REGISTER: '/registrar',
      LOGIN: '/login',
    },
  },

  STORAGE_KEYS: {
    ACCESS_TOKEN: 'chess_vault_access_token',
  },

  TIMEOUTS: {
    API_REQUEST: 30000,
    TOAST_DURATION: 3000,
  },

  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Login realizado com sucesso!',
      REGISTER: 'Conta criada com sucesso! Faça login para continuar.',
    },
    ERROR: {
      NETWORK: 'Erro de conexão. Verifique sua internet.',
      TOKEN_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
      SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
    },
  },

  DEBUG: window.location.hostname === 'localhost',
};
