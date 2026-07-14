// js/api.js - Cliente HTTP para requisições à API

/**
 * Cliente HTTP
 */
class ApiClient {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
    this.timeout = CONFIG.TIMEOUTS.API_REQUEST;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obter token de acesso
   * @returns {string}
   */
  getAccessToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Definir token de acesso
   * @param {string} token
   */
  setAccessToken(token) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Limpar tokens
   */
  clearTokens() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Construir headers com autenticação
   * @returns {Object}
   */
  getHeaders() {
    const headers = { ...this.defaultHeaders };
    const token = this.getAccessToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Requisição HTTP genérica
   * @param {string} method
   * @param {string} endpoint
   * @param {Object} options
   * @returns {Promise}
   */
  async request(method, endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      headers: this.getHeaders(),
      ...options,
    };

    // Log de requisição
    if (CONFIG.LOG_REQUESTS) {
      log(`${method} ${endpoint}`, options.body ? JSON.parse(options.body) : null);
    }

    try {
      const response = await Promise.race([
        fetch(url, config),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        ),
      ]);

      const data = await response.json();

      // Log de resposta
      if (CONFIG.LOG_RESPONSES) {
        log(`${method} ${endpoint} - ${response.status}`, data);
      }

      // Tratar erros da API
     
if (!response.ok) {
  const errorMsg = data.message || CONFIG.MESSAGES.ERROR.SERVER_ERROR;

  if (response.status === 401) {
    this.clearTokens();
    showToast(CONFIG.MESSAGES.ERROR.TOKEN_EXPIRED, 'error');
    showScreen('auth');
  }

  throw new ApiError(errorMsg, response.status, data);
}

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      
      if (err.message === 'Timeout') {
        throw new ApiError(CONFIG.MESSAGES.ERROR.NETWORK, 0);
      }
      
      if (err instanceof TypeError) {
        throw new ApiError(CONFIG.MESSAGES.ERROR.NETWORK, 0);
      }
      
      throw new ApiError(err.message, 0);
    }
  }

  /**
   * GET
   */
  async get(endpoint, query = null) {
    let url = endpoint;
    if (query && Object.keys(query).length > 0) {
      url += '?' + buildQueryString(query);
    }
    return this.request('GET', url);
  }

  /**
   * POST
   */
  async post(endpoint, data) {
    return this.request('POST', endpoint, {
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT
   */
  async put(endpoint, data) {
    return this.request('PUT', endpoint, {
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH
   */
  async patch(endpoint, data) {
    return this.request('PATCH', endpoint, {
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE
   */
  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  /**
   * Renovar token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new ApiError(CONFIG.MESSAGES.ERROR.TOKEN_EXPIRED, 401);
    }

    try {
      const data = await this.request('POST', CONFIG.ENDPOINTS.AUTH.REFRESH, {
        body: JSON.stringify({ refreshToken }),
        headers: this.defaultHeaders, // Sem autorização
      });

      this.setAccessToken(data.accessToken);
      localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      
      return data;
    } catch (err) {
      this.clearTokens();
      throw err;
    }
  }
}

/**
 * Classe de erro customizada
 */
class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Instância global do cliente
 */
const api = new ApiClient();

// ========== AUTH API ==========

/**
 * Registrar novo usuário
 */
async function registerUser(name, email, password) {
  return api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, { name, email, password });
}

/**
 * Login
 */
async function loginUser(email, password) {
  const data = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
  api.setAccessToken(data.accessToken);
  return data;
}

/**
 * Logout
 */
async function logoutUser() {
  api.clearTokens();
}

// ========== USER API ==========

/**
 * Obter perfil do usuário
 */
async function getUserProfile() {
  return api.get(CONFIG.ENDPOINTS.USERS.PROFILE);
}

/**
 * Atualizar perfil do usuário
 */
async function updateUserProfile(data) {
  return api.put(CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, data);
}

// ========== GAMES API ==========

/**
 * Listar partidas
 */
async function listGames(page = 0, size = 20, filters = {}) {
  const query = {
    page,
    size,
    ...filters,
  };
  return api.get(CONFIG.ENDPOINTS.GAMES.LIST, query);
}

/**
 * Obter partida por ID
 */
async function getGame(id) {
  return api.get(CONFIG.ENDPOINTS.GAMES.GET.replace(':id', id));
}

/**
 * Criar partida
 */
async function createGame(data) {
  return api.post(CONFIG.ENDPOINTS.GAMES.CREATE, data);
}

/**
 * Atualizar partida
 */
async function updateGame(id, data) {
  return api.put(CONFIG.ENDPOINTS.GAMES.UPDATE.replace(':id', id), data);
}

/**
 * Deletar partida
 */
async function deleteGame(id) {
  return api.delete(CONFIG.ENDPOINTS.GAMES.DELETE.replace(':id', id));
}

/**
 * Importar partida via PGN
 */
async function importGameFromPgn(pgnContent) {
  return api.post(CONFIG.ENDPOINTS.GAMES.IMPORT_PGN, { pgnContent });
}

// ========== BOOKS API ==========

/**
 * Listar livros
 */
async function listBooks(page = 0, size = 20, category = null) {
  const query = { page, size };
  if (category) query.category = category;
  return api.get(CONFIG.ENDPOINTS.BOOKS.LIST, query);
}

/**
 * Obter livro por ID
 */
async function getBook(id) {
  return api.get(CONFIG.ENDPOINTS.BOOKS.GET.replace(':id', id));
}

// ========== VIDEOS API ==========

/**
 * Listar vídeos
 */
async function listVideos(page = 0, size = 20, category = null) {
  const query = { page, size };
  if (category) query.category = category;
  return api.get(CONFIG.ENDPOINTS.VIDEOS.LIST, query);
}

/**
 * Obter vídeo por ID
 */
async function getVideo(id) {
  return api.get(CONFIG.ENDPOINTS.VIDEOS.GET.replace(':id', id));
}

// ========== DASHBOARD API ==========

/**
 * Obter dados do dashboard
 */
async function getDashboard() {
  return api.get(CONFIG.ENDPOINTS.DASHBOARD.GET);
}
