// js/auth.js - Autenticação: login, registro, logout

class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  async register(name, email, senha) {
    return api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, { nome: name, email, senha: senha });
  }

  async login(email, senha) {
    const data = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, { email, senha: senha });
    api.setAccessToken(data.token);
    this.isAuthenticated = true;
    this.currentUser = { nome: data.nome, email: data.email };
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

// ========== TABS DE LOGIN / CADASTRO ==========
function switchAuthTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-form').classList.toggle('active', tab === 'login');
  document.getElementById('register-form').classList.toggle('active', tab === 'register');
}

// ========== HANDLERS DE FORMULÁRIO ==========

async function handleLoginSubmit(email, senha) {
  if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return;
  }

  try {
    const data = await auth.login(email, senha);
    showToast(CONFIG.MESSAGES.SUCCESS.LOGIN, 'success');

    const nome = data.nome || email;
    document.getElementById('user-name').textContent = nome;
    document.getElementById('user-avatar').textContent = nome.charAt(0).toUpperCase();

    showScreen('app');
    showSection('dashboard');
  } catch (err) {
    error('Erro no login', err);
    showToast(err.message, 'error');
  }
}

async function handleRegisterSubmit(name, email, senha, confirmSenha) {
  if (!isValidEmail(email)) {
    showToast('Email inválido', 'error');
    return;
  }
  if (!isValidPassword(senha)) {
    showToast('Senha deve ter pelo menos 8 caracteres', 'error');
    return;
  }
  if (senha !== confirmSenha) {
    showToast('Senhas não coincidem', 'error');
    return;
  }

  try {
    await auth.register(name, email, senha);
    showToast(CONFIG.MESSAGES.SUCCESS.REGISTER, 'success');
    switchAuthTab('login');
  } catch (err) {
    error('Erro no registro', err);
    showToast(err.message, 'error');
  }
}

function handleLogout() {
  auth.logout();
  showToast(CONFIG.MESSAGES.SUCCESS.LOGOUT, 'info');
  showScreen('auth');
}

// ========== LIGAÇÃO COM O FORMULÁRIO NO HTML ==========

function onLoginFormSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-password').value;
  if (!email || !senha) { showToast('Preencha todos os campos', 'error'); return; }
  handleLoginSubmit(email, senha);
}

function onRegisterFormSubmit(e) {
  e.preventDefault();
  const name         = document.getElementById('register-name').value.trim();
  const email        = document.getElementById('register-email').value.trim();
  const senha        = document.getElementById('register-password').value;
  const confirmSenha = document.getElementById('register-confirm-password').value;
  if (!name || !email || !senha || !confirmSenha) { showToast('Preencha todos os campos', 'error'); return; }
  handleRegisterSubmit(name, email, senha, confirmSenha);
}
