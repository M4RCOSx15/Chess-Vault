// js/games.js - Lista de partidas (substitui o CARLSEN_GAMES mock por dados reais)

async function loadGamesList() {
  const container = document.getElementById('games-list');
  const statEl = document.getElementById('stat-total-games');

  try {
    // TODO seu: isso só funciona depois de criar o endpoint que lista
    // TODAS as partidas do usuário logado (ver TODO no config.js).
    const partidas = await api.get(CONFIG.ENDPOINTS.PARTIDAS.LISTAR);

    if (statEl) statEl.textContent = partidas.length;

    if (!partidas || partidas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">♟️</div>
          <div class="empty-state-title">Nenhuma partida ainda</div>
          <p>Suas partidas salvas vão aparecer aqui.</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="games-grid">${partidas.map(p => `
      <div class="game-card" onclick="alert('Visualizador ainda não conectado — próximo passo!')">
        <div class="game-card-title">${p.nome}</div>
        <div class="game-card-sub">Clique para abrir (em breve)</div>
      </div>
    `).join('')}</div>`;

  } catch (err) {
    error('Erro ao carregar partidas', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Não foi possível carregar</div>
        <p>${err.message}</p>
      </div>`;
  }
}
