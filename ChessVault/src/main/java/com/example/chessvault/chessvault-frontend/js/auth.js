// js/auth.js - Autenticação: login, register, logout, tokens

/**
 * Gerenciador de autenticação
 */
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = true;
    this.listeners = [];
  }

  /**
   * Registrar observer para mudanças de autenticação
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notificar observadores
   */
  notify() {
    this.listeners.forEach(callback => callback({
      isAuthenticated: this.isAuthenticated,
      user: this.currentUser,
    }));
  }

  /**
   * Registrar novo usuário
   */
  async registerUser(name, email, password) {
  return api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, { nome: name, email, senha: password });
}

  /**
   * Fazer login
   */
  async loginUser(email, password) {
  const data = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, { email, senha: password });
  api.setAccessToken(data.accessToken);
  return data;
}

  /**
   * Fazer logout
   */
  async logout() {
    try {
      await logoutUser();
      this.currentUser = null;
      this.isAuthenticated = false;
      this.notify();
      showToast('Logout realizado.', 'success');
      return true;
    } catch (err) {
      error('Erro ao fazer logout', err);
      return false;
    }
  }

  /**
   * Restaurar sessão (load do token e perfil)
   */
  async restoreSession() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!token) {
      this.isAuthenticated = false;
      this.notify();
      return false;
    }

    try {
      const profile = await getUserProfile();
      this.currentUser = profile;
      this.isAuthenticated = true;
      this.notify();
      return true;
    } catch (err) {
      // Token inválido ou expirado
      api.clearTokens();
      this.isAuthenticated = false;
      this.notify();
      return false;
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(data) {
    try {
      showToast('Atualizando perfil...', 'info');
      const updated = await updateUserProfile(data);
      this.currentUser = updated;
      this.notify();
      showToast(CONFIG.MESSAGES.SUCCESS.PROFILE_UPDATED, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }

  /**
   * Verificar se está autenticado
   */
  isLoggedIn() {
    return this.isAuthenticated && !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    return this.currentUser;
  }
}

/**
 * Instância global
 */
const auth = new AuthManager();

// ========== UI HANDLERS ==========

/**
 * Handle do formulário de login
 */
async function handleLoginSubmit(email, password) {
  /*if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return false;
  }

  if (!password || password.length < 6) {
    showToast('Senha deve ter pelo menos 6 caracteres', 'error');
    return false;
  }*/

  const success = await auth.loginUser(email, password);
  if (success) {
    // Redirecionar para dashboard
    showScreen('app');
     loadDashboard(); 
  }
  return success;
}

/**
 * Handle do formulário de registro
 */
async function handleRegisterSubmit(name, email, password, confirmPassword) {
  // Validações
  /*if (!name || name.length < 3) {
    showToast('Nome deve ter pelo menos 3 caracteres', 'error');
    return false;
  }

  if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return false;
  }

  if (!isValidPassword(password)) {
    showToast('Senha deve ter pelo menos 8 caracteres e conter um número', 'error');
    return false;
  }

  if (password !== confirmPassword) {
    showToast('Senhas não coincidem', 'error');
    return false;
  }*/

  const success = await auth.register(name, email, password);
  if (success) {
    // Trocar para aba de login
    switchAuthTab('login');
    return true;
  }
  return false;
}

/**
 * Handle de logout
 */
async function handleLogout() {
  const confirmed = confirm(CONFIG.MESSAGES.CONFIRM.LOGOUT);
  if (!confirmed) return;

  const success = await auth.logout();
  if (success) {
    showScreen('auth');
    resetAuthForms();
  }
}

/**
 * Limpar formulários de auth
 */
function resetAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
}

/**
 * Verificar se usuário está autenticado ao carregar página
 */
async function initAuth() {
  log('Inicializando autenticação...');
  const isAuthenticated = await auth.restoreSession();
  
  /*if (isAuthenticated) {
    log('Sessão restaurada, usuário autenticado');
    showScreen('app');
    loadDashboard();
  } else {
    log('Nenhuma sessão ativa, mostrando tela de login');
    showScreen('auth');
  }*/
}

/**
 * Subscribe às mudanças de autenticação
 */
auth.subscribe(({ isAuthenticated, user }) => {
  log('Auth status changed', { isAuthenticated, user });
  
  if (isAuthenticated && user) {
    // Atualizar UI com dados do usuário
    updateUserInfoInUI(user);
  }
});
