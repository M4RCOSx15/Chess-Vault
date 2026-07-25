// js/app.js - Roteamento SPA + inicialização da aplicação

let currentView = 'books';

const VIEW_TITLES = {
  books:    'Livros',
  videos:   'Vídeos',
  games:    'Partidas',
  players:  'Jogadores',
  puzzles:  'Puzzles',
  openings: 'Aberturas',
};

const VIEW_ADD_LABELS = {
  books:    '+ Adicionar livro',
  videos:   '+ Adicionar vídeo',
  games:    '+ Importar PGN',
  players:  '+ Adicionar jogador',
};

const VIEW_ADD_ACTIONS = {
  books:    () => showToast('Adicionar livro em breve!', 'info'),
  videos:   () => showToast('Adicionar vídeo em breve!', 'info'),
  games:    () => openNewGameModal(),
  players:  () => openAddPlayerModal(),
};

const VIEW_RENDERERS = {
  books:    renderBooks,
  videos:   renderVideos,
  games:    renderGames,
  players:  loadPlayersSection,
  puzzles:  renderPuzzles,
  openings: renderOpenings,
};

function navigateTo(view) {
  currentView = view;

  document.querySelectorAll('.nav-btn[id^="nav-"]').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + view);
  if (navEl) navEl.classList.add('active');

  document.getElementById('topbar-title').textContent = VIEW_TITLES[view] || view;

  const addBtn = document.getElementById('topbar-add-btn');
  const addLabel = document.getElementById('add-label');
  if (VIEW_ADD_LABELS[view]) {
    addBtn.style.display = '';
    addLabel.textContent = VIEW_ADD_LABELS[view];
    addBtn.onclick = VIEW_ADD_ACTIONS[view];
  } else {
    addBtn.style.display = 'none';
  }

  showSection('list');

  if (view === 'players') {
    document.getElementById('content-area').innerHTML = `<div id="players-list"></div>`;
  }

  const renderer = VIEW_RENDERERS[view];
  if (renderer) renderer();
}

function closePlayerDetail() {
  navigateTo('players');
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', onLoginFormSubmit);
  document.getElementById('register-form').addEventListener('submit', onRegisterFormSubmit);
  document.getElementById('add-player-form').addEventListener('submit', handleAddPlayerSubmit);

  if (auth.isLoggedIn()) {
    showScreen('app');
    navigateTo('books');
  } else {
    showScreen('auth');
  }
});
