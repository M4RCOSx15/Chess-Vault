// js/utils.js - Funções utilitárias usadas em toda a aplicação

function log(message, data = null) {
  if (CONFIG.DEBUG) console.log(`[Chess Vault] ${message}`, data);
}

function error(message, err = null) {
  console.error(`[Chess Vault ERROR] ${message}`, err);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}

// ============================================================
// TOAST — feedback visual (usa as classes toast-success/error/info
// já definidas em css/components.css)
// ============================================================
let toastTimer = null;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast-${type} visible`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

// ============================================================
// TROCA DE TELA — auth (login/registro) vs app (depois de logado)
// ============================================================
function showScreen(screen) {
  const authScreen = document.getElementById('auth-screen');
  const appScreen  = document.getElementById('app-screen');
  if (screen === 'app') {
    authScreen.classList.remove('visible');
    appScreen.classList.add('visible');
  } else {
    appScreen.classList.remove('visible');
    authScreen.classList.add('visible');
  }
}

// ============================================================
// TROCA DE SEÇÃO — dentro da área principal (main), alterna entre
// a listagem (content-area), o detalhe de jogador e o viewer de partida.
// 'dashboard' é um alias de conveniência para a tela inicial (Livros).
// ============================================================
function showSection(name) {
  if (name === 'dashboard') {
    navigateTo('books');
    return;
  }

  const sectionEls = {
    list:           document.getElementById('content-area'),
    'player-detail': document.getElementById('player-detail-screen'),
    'game-viewer':   document.getElementById('game-viewer'),
  };

  Object.entries(sectionEls).forEach(([key, el]) => {
    if (!el) return;
    el.style.display = (key === name) ? (key === 'game-viewer' ? 'flex' : 'block') : 'none';
  });

  const addBtn = document.getElementById('topbar-add-btn');
  if (addBtn) addBtn.style.display = (name === 'list') ? '' : 'none';
}
