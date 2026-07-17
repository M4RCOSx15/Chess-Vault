// js/config.js - Configurações e endpoints (versão mínima para login/registro)

const CONFIG = {
  API_BASE_URL: 'http://localhost:8080',

  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/registrar',
      LOGIN: '/auth/login',
    },
    // ATENÇÃO: buscartodaspartidas hoje retorna TODAS as partidas de
    // TODOS os usuários (não filtra por dono, porque PartidasModel ainda
    // não tem relação com UserModel). Funciona pra testar agora, mas
    // ver o alerta de segurança que já te dei sobre isso.
    PARTIDAS: {
      LISTAR: '/partidas/buscartodaspartidas',
      CRIAR: '/partidas/criarpartida',
      // ATENÇÃO: seu backend deleta por NOME (query param), não por ID.
      // Isso significa que se duas partidas tiverem o mesmo nome, a
      // exclusão pode se comportar de forma inesperada — vale revisar
      // isso quando você tiver tempo, mudando pra deletar por ID.
      DELETAR: '/partidas/deletarpartidas',
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
