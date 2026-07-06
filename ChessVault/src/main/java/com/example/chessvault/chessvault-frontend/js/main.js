// js/main.js - Inicialização e setup da aplicação

/**
 * Inicializar aplicação ao carregar página
 */
document.addEventListener('DOMContentLoaded', async () => {
  log('Inicializando Chess Vault...');

  // Setup de event listeners
  setupEventListeners();

  // Setup de modais
  setupModalBackdropClose();
  setupModalCloseButtons();

  // Restaurar sessão e verificar autenticação
  await initAuth();

  log('Chess Vault inicializado com sucesso!');
});

/**
 * Setup de event listeners
 */
function setupEventListeners() {
  // ========== AUTH ==========
  
  // Tabs de autenticação
  const authTabs = document.querySelectorAll('.auth-tab');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchAuthTab(tab.dataset.tab);
    });
  });

  // Form de Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      await handleLoginSubmit(email, password);
    });
  }

  // Form de Registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      await handleRegisterSubmit(name, email, password, confirmPassword);
    });
  }

  // ========== NAVIGATION ==========

  // Nav items - navegação entre seções
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section === 'logout') {
        handleLogout();
      } else if (section) {
        showSection(section);
        
        // Carregar dados da seção
        if (section === 'dashboard') {
          loadDashboard();
        } else if (section === 'games') {
          loadGamesPage();
        } else if (section === 'books') {
          loadBooksPage();
        } else if (section === 'videos') {
          loadVideosPage();
        }
      }
    });
  });

  // ========== USER MENU ==========

  // User pill - perfil do usuário
  const userPill = document.querySelector('.user-pill');
  if (userPill) {
    userPill.addEventListener('click', () => {
      showSection('profile');
      loadProfilePage();
    });
  }

  // ========== TOPBAR ACTIONS ==========

  // Botão de criar nova partida
  const createGameBtn = document.getElementById('create-game-btn');
  if (createGameBtn) {
    createGameBtn.addEventListener('click', openCreateGameModal);
  }

  // ========== GAMES ==========

  // Busca de partidas
  const gamesSearch = document.getElementById('games-search');
  if (gamesSearch) {
    gamesSearch.addEventListener('input', debounce((e) => {
      const query = e.target.value;
      games.loadGames(0, { ...games.filters, player: query });
    }, CONFIG.TIMEOUTS.DEBOUNCE_SEARCH));
  }

  // Filtro de resultado
  const resultFilter = document.getElementById('result-filter');
  if (resultFilter) {
    resultFilter.addEventListener('change', (e) => {
      games.filters.result = e.target.value;
      games.loadGames(0, games.filters);
    });
  }

  // ========== MODAIS ==========

  // Fechar modal ao clicar botão X
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // ========== KEYBOARD SHORTCUTS ==========

  document.addEventListener('keydown', (e) => {
    // Esc fecha modal
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal-overlay.visible');
      if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = 'auto';
      }
    }

    // Ctrl+K abre busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchBox = document.getElementById('games-search');
      if (searchBox) searchBox.focus();
    }
  });

  log('Event listeners setup completo');
}

/**
 * Carregar dashboard
 */
async function loadDashboard() {
  try {
    setTopbarTitle('Dashboard');
    showToast('Carregando dashboard...', 'info');
    
    const dashboard = await getDashboard();
    
    // Renderizar stats
    renderDashboardStats(dashboard);
    
    // Renderizar partidas recentes
    renderRecentGames(dashboard.recentGames);
    
    showToast(CONFIG.MESSAGES.SUCCESS.PROFILE_LOADED, 'success');
  } catch (err) {
    error('Erro ao carregar dashboard', err);
    showToast(err.message, 'error');
  }
}

/**
 * Renderizar stats do dashboard
 */
function renderDashboardStats(dashboard) {
  const statsContainer = document.getElementById('dashboard-stats');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total de Partidas</div>
      <div class="stat-value">${dashboard.totalGames}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Última Partida</div>
      <div class="stat-value">${dashboard.recentGames?.[0] ? formatRelative(dashboard.recentGames[0].createdAt) : '-'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Usuário</div>
      <div class="stat-value">${dashboard.userName}</div>
    </div>
  `;
}

/**
 * Renderizar partidas recentes
 */
function renderRecentGames(games) {
  const container = document.getElementById('recent-games');
  if (!container) return;

  if (!games || games.length === 0) {
    renderEmptyState('recent-games', '📋', 'Sem partidas', 'Crie sua primeira partida!');
    return;
  }

  let html = '<div class="games-grid">';
  games.forEach(game => {
    const resultBadge = getResultBadge(game.result);
    html += `
      <div class="game-card" onclick="openGameViewer('${game.id}')">
        <div class="game-card-content">
          <h3 class="game-card-title">${game.title}</h3>
          <div class="game-card-players">
            ${game.whitePlayer} vs ${game.blackPlayer}
          </div>
          <div class="game-card-info">
            <span>${resultBadge}</span>
            <span>${formatDate(game.createdAt, 'short')}</span>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Carregar página de livros
 */
async function loadBooksPage() {
  setTopbarTitle('Livros');
  // TODO: Implementar
}

/**
 * Carregar página de vídeos
 */
async function loadVideosPage() {
  setTopbarTitle('Vídeos');
  // TODO: Implementar
}

/**
 * Carregar página de perfil
 */
async function loadProfilePage() {
  setTopbarTitle('Meu Perfil');
  
  const user = auth.getCurrentUser();
  if (user) {
    // Popular form de perfil
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
  }
}

/**
 * Atualizar perfil
 */
async function handleProfileSubmit(name) {
  const success = await auth.updateProfile({ name });
  if (success) {
    showToast('Perfil atualizado!', 'success');
  }
}

/**
 * Helper: renderizar skeleton
 */
function showSkeleton(elementId) {
  renderSkeleton(elementId, 3);
}

/**
 * Global window functions para HTML onclick
 */
window.showSection = showSection;
window.switchAuthTab = switchAuthTab;
window.handleLogout = handleLogout;
window.openGameViewer = openGameViewer;
window.openCreateGameModal = openCreateGameModal;
window.openEditGameModal = openEditGameModal;
window.pageChange = (page) => games.loadGames(page, games.filters);
window.loadDashboard = loadDashboard;
window.loadGamesPage = loadGamesPage;
window.loadBooksPage = loadBooksPage;
window.loadVideosPage = loadVideosPage;
window.loadProfilePage = loadProfilePage;
window.handleProfileSubmit = handleProfileSubmit;

log('Main.js carregado');
