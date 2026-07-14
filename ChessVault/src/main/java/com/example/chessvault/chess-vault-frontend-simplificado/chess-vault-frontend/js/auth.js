// js/auth.js - Autenticação: login, registro, logout

class AuthManager {
  constructor() {
    // BUG do original: isso vinha hardcoded como `true`.
    // Um AuthManager que nasce autenticado sem token nenhum é o tipo de bug
    // que só aparece quando você já esqueceu que escreveu essa linha.
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  async register(name, email, senha) {
    // TODO seu: confirme com o UserRequestDTO do backend se os nomes de campo
    // (nome, email, senha) batem exatamente com o que o Jackson espera.
    return api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, { nome: name, email, senha: password });
  }

  async login(email, senha) {
    const data = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, { email, senha: password });
    // TODO seu: o backend ainda não tem /auth/login implementado.
    // Quando implementar, decida: o JWT volta em `data.token` ou `data.accessToken`?
    // Ajuste a linha abaixo para bater com o nome exato do campo do seu DTO de resposta.
    api.setAccessToken(data.accessToken);
    this.isAuthenticated = true;
    return data;
  }

  logout() {
    api.clearTokens();
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  isLoggedIn() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }
}

const auth = new AuthManager();

// ========== HANDLERS DE FORMULÁRIO ==========

async function handleLoginSubmit(email, password) {
  if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return;
  }

  try {
    await auth.login(email, password);
    showToast(CONFIG.MESSAGES.SUCCESS.LOGIN, 'success');
    document.getElementById('home-username').textContent = email;
    showScreen('app');
  } catch (err) {
    error('Erro no login', err);
    showToast(err.message, 'error');
  }
}

async function handleRegisterSubmit(name, email, password, confirmPassword) {
  if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return;
  }
  if (!isValidPassword(password)) {
    showToast('Senha deve ter pelo menos 8 caracteres', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Senhas não coincidem', 'error');
    return;
  }

  try {
    await auth.register(name, email, password);
    showToast(CONFIG.MESSAGES.SUCCESS.REGISTER, 'success');
    switchAuthTab('login');
  } catch (err) {
    error('Erro no registro', err);
    showToast(err.message, 'error');
  }
}

function handleLogout() {
  auth.logout();
  showScreen('auth');
}
