// js/config.js - Configuração central da aplicação
const CONFIG = {
  // Ajuste para a URL do seu backend Spring Boot
  API_BASE_URL: 'http://localhost:8080',

  DEBUG: true,

  ENDPOINTS: {
    AUTH: {
      LOGIN:    '/auth/login',
      REGISTER: '/auth/registrar',
    },
    BOOKS:   '/livros',
    VIDEOS:  '/videos',
    GAMES:   '/partidas',
    PLAYERS: '/jogadores',
  },

  STORAGE_KEYS: {
    ACCESS_TOKEN: 'chessvault_access_token',
  },

  MESSAGES: {
    SUCCESS: {
      LOGIN:    'Login realizado com sucesso!',
      REGISTER: 'Conta criada com sucesso! Faça login para continuar.',
      LOGOUT:   'Você saiu da sua conta.',
    },
    ERROR: {
      GENERIC: 'Algo deu errado. Tente novamente.',
      NETWORK: 'Não foi possível conectar ao servidor.',
    },
  },
};
