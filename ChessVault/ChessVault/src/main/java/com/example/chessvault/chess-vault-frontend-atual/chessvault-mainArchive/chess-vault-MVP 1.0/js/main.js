// js/main.js - Inicialização (versão mínima: só auth)

document.addEventListener('DOMContentLoaded', () => {
  log('Inicializando Chess Vault...');

  // Tabs de login/registro
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Form de login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await handleLoginSubmit(email, password);
  });

  // Form de registro
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    await handleRegisterSubmit(name, email, password, confirmPassword);
  });

  // Navegação da sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section === 'logout') {
        handleLogout();
        return;
      }
      showSection(section);
      if (section === 'games') loadGamesList();
    });
  });

  // Nova Partida
  document.getElementById('new-game-btn').addEventListener('click', openNewGameModal);
  document.getElementById('new-game-close').addEventListener('click', closeNewGameModal);
  document.getElementById('new-game-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'new-game-overlay') closeNewGameModal();
  });
  document.getElementById('new-game-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('new-game-nome').value;
    const pgn = document.getElementById('new-game-pgn').value;
    await handleNewGameSubmit(nome, pgn);
  });

  // Visualizador de partida
  document.getElementById('viewer-back-btn').addEventListener('click', closeGameViewer);
  document.getElementById('btn-start').addEventListener('click', () => goToMove(0));
  document.getElementById('btn-prev').addEventListener('click', prevMove);
  document.getElementById('btn-next').addEventListener('click', nextMove);
  document.getElementById('btn-end').addEventListener('click', () => goToMove(-1));

  // Se já existe token salvo, pula direto pra home (sem validar contra o backend
  // ainda - isso é uma simplificação, não uma solução definitiva. Ver nota abaixo.)
  if (auth.isLoggedIn()) {
    showScreen('app');
    showSection('dashboard');
  } else {
    showScreen('auth');
  }

  log('Chess Vault inicializado.');
});
