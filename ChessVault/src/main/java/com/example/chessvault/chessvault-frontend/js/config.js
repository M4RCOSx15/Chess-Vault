// js/config.js - Configurações, endpoints e constantes globais

/**
 * Configuração da aplicação Chess Vault
 */

const CONFIG = {
  // ========== API ========== 
  API_BASE_URL:'http://localhost:8080/api/usuario/v1',
  
  // Endpoints da API
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    USERS: {
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/me',
      GET_USER: '/users/:id',
    },
    /*GAMES: {
      LIST: '/games',
      CREATE: '/games',
      GET: '/games/:id',
      UPDATE: '/games/:id',
      DELETE: '/games/:id',
      IMPORT_PGN: '/games/import/pgn',
    },
    BOOKS: {
      LIST: '/books',
      GET: '/books/:id',
    },
    VIDEOS: {
      LIST: '/videos',
      GET: '/videos/:id',
    },
    DASHBOARD: {
      GET: '/dashboard',
    },*/
  },

  // ========== STORAGE ========== 
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'chess_vault_access_token',
    REFRESH_TOKEN: 'chess_vault_refresh_token',
    USER_DATA: 'chess_vault_user_data',
    PREFERENCES: 'chess_vault_preferences',
    RECENT_GAMES: 'chess_vault_recent_games',
  },

  // ========== TIMEOUTS ========== 
  TIMEOUTS: {
    API_REQUEST: 30000, // 30 segundos
    TOKEN_REFRESH: 300000, // 5 minutos (antes de expirar)
    TOAST_DURATION: 3000, // 3 segundos
    DEBOUNCE_SEARCH: 500, // 500ms
  },

  // ========== PAGINAÇÃO ========== 
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // ========== FILTROS DE PARTIDA ========== 
  GAME_FILTERS: {
    RESULTS: [
      { value: '1-0', label: 'Vitória Brancas' },
      { value: '0-1', label: 'Vitória Pretas' },
      { value: '1/2-1/2', label: 'Empate' },
      { value: '*', label: 'Em Andamento' },
    ],
    TIME_CLASSES: [
      { value: 'bullet', label: 'Bullet' },
      { value: 'blitz', label: 'Blitz' },
      { value: 'rapid', label: 'Rápida' },
      { value: 'classical', label: 'Clássica' },
    ],
  },

  // ========== MENSAGENS ========== 
  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Login realizado com sucesso!',
      REGISTER: 'Conta criada com sucesso! Faça login para continuar.',
      GAME_CREATED: 'Partida criada com sucesso!',
      GAME_UPDATED: 'Partida atualizada com sucesso!',
      GAME_DELETED: 'Partida deletada com sucesso!',
      GAME_IMPORTED: 'Partida importada com sucesso!',
      PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
      PROFILE_LOADED: 'Perfil carregado.',
    },
    ERROR: {
      NETWORK: 'Erro de conexão. Verifique sua internet.',
      INVALID_CREDENTIALS: 'Email ou senha incorretos.',
      EMAIL_EXISTS: 'Este email já está cadastrado.',
      VALIDATION: 'Preencha todos os campos obrigatórios.',
      TOKEN_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
      UNAUTHORIZED: 'Você não tem permissão para acessar isto.',
      NOT_FOUND: 'Recurso não encontrado.',
      SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
      INVALID_PGN: 'PGN inválido. Verifique o formato.',
    },
    CONFIRM: {
      DELETE_GAME: 'Tem certeza que deseja deletar esta partida? Esta ação não pode ser desfeita.',
      LOGOUT: 'Deseja realmente fazer logout?',
    },
  },

  // ========== TEMAS ========== 
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },

  // ========== IDIOMAS ========== 
  LANGUAGE: {
    PT_BR: 'pt-BR',
    EN_US: 'en-US',
  },

  // ========== PEÇAS DE XADREZ ========== 
  PIECES: {
    WHITE_PAWN: '♙',
    WHITE_KNIGHT: '♘',
    WHITE_BISHOP: '♗',
    WHITE_ROOK: '♖',
    WHITE_QUEEN: '♕',
    WHITE_KING: '♔',
    BLACK_PAWN: '♟',
    BLACK_KNIGHT: '♞',
    BLACK_BISHOP: '♝',
    BLACK_ROOK: '♜',
    BLACK_QUEEN: '♛',
    BLACK_KING: '♚',
  },

  // ========== DEBUG ========== 
  DEBUG: window.location.hostname === 'localhost',
LOG_REQUESTS: window.location.hostname === 'localhost',
LOG_RESPONSES: window.location.hostname === 'localhost',
};

// Função helper para construir URL de endpoint
function buildEndpoint(endpoint, params = {}) {
  let url = CONFIG.API_BASE_URL + endpoint;
  
  // Substituir parâmetros na URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
}

// Exportar (se usar módulos)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, buildEndpoint };
}
