// js/api.js - Cliente HTTP: fala com o backend Spring Boot, injeta o Bearer token
// e normaliza erros para que o resto da aplicação só precise dar `catch(err)`
// e ler `err.message`.

const api = {
  baseUrl: CONFIG.API_BASE_URL,

  getAccessToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  clearTokens() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(this.baseUrl + path, { ...options, headers });
    } catch (networkErr) {
      error('Falha de rede', networkErr);
      throw new Error(CONFIG.MESSAGES.ERROR.NETWORK);
    }

    // 401 fora do fluxo de login/registro => sessão expirou
    if (res.status === 401 && !path.startsWith(CONFIG.ENDPOINTS.AUTH.LOGIN) && !path.startsWith(CONFIG.ENDPOINTS.AUTH.REGISTER)) {
      this.clearTokens();
    }

    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try { data = await res.json(); } catch (e) { data = null; }
    }

    if (!res.ok) {
      const message = (data && (data.message || data.error || data.erro)) || `Erro ${res.status}`;
      throw new Error(message);
    }

    return data;
  },

  get(path)          { return this.request(path, { method: 'GET' }); },
  post(path, body)   { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); },
  put(path, body)    { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }); },
  patch(path, body)  { return this.request(path, { method: 'PATCH', body: JSON.stringify(body) }); },
  delete(path)       { return this.request(path, { method: 'DELETE' }); },
};
