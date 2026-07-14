// js/games.js - CRUD de partidas e gerenciamento

/**
 * Gerenciador de Partidas
 */
class GamesManager {
  constructor() {
    this.games = [];
    this.currentGame = null;
    this.currentPage = 0;
    this.pageSize = CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    this.totalPages = 0;
    this.filters = {};
  }

  /**
   * Listar partidas
   */
  async loadGames(page = 0, filters = {}) {
    try {
      showSkeleton('games-list');
      this.currentPage = page;
      this.filters = filters;

      const response = await listGames(page, this.pageSize, filters);
      
      this.games = response.content || [];
      this.totalPages = response.totalPages || 1;

      renderGamesList(this.games);
      renderPagination('games-pagination', page, this.totalPages);

      log(`Loaded ${this.games.length} games`);
      return true;
    } catch (err) {
      error('Erro ao carregar partidas', err);
      showToast(err.message, 'error');
      renderEmptyState('games-list', '❌', 'Erro ao carregar partidas');
      return false;
    }
  }

  /**
   * Carregar partida por ID
   */
  async loadGame(gameId) {
    try {
      const game = await getGame(gameId);
      this.currentGame = game;
      log('Game loaded', game);
      return game;
    } catch (err) {
      error('Erro ao carregar partida', err);
      showToast(err.message, 'error');
      return null;
    }
  }

  /**
   * Criar partida
   */
  async createGame(data) {
    try {
      showToast('Criando partida...', 'info');
      const game = await createGame(data);
      showToast(CONFIG.MESSAGES.SUCCESS.GAME_CREATED, 'success');
      await this.loadGames(0, this.filters); // Recarregar lista
      return game;
    } catch (err) {
      error('Erro ao criar partida', err);
      showToast(err.message, 'error');
      return null;
    }
  }

  /**
   * Atualizar partida
   */
  async updateGame(gameId, data) {
    try {
      showToast('Atualizando partida...', 'info');
      const game = await updateGame(gameId, data);
      showToast(CONFIG.MESSAGES.SUCCESS.GAME_UPDATED, 'success');
      this.currentGame = game;
      await this.loadGames(this.currentPage, this.filters); // Recarregar lista
      return game;
    } catch (err) {
      error('Erro ao atualizar partida', err);
      showToast(err.message, 'error');
      return null;
    }
  }

  /**
   * Deletar partida
   */
  async deleteGame(gameId) {
    try {
      const confirmed = confirm(CONFIG.MESSAGES.CONFIRM.DELETE_GAME);
      if (!confirmed) return false;

      showToast('Deletando partida...', 'info');
      await deleteGame(gameId);
      showToast(CONFIG.MESSAGES.SUCCESS.GAME_DELETED, 'success');
      
      // Recarregar lista
      await this.loadGames(this.currentPage, this.filters);
      this.currentGame = null;
      return true;
    } catch (err) {
      error('Erro ao deletar partida', err);
      showToast(err.message, 'error');
      return false;
    }
  }

  /**
   * Importar partida via PGN
   */
  async importGame(pgnContent) {
    try {
      showToast('Importando partida...', 'info');
      const game = await importGameFromPgn(pgnContent);
      showToast(CONFIG.MESSAGES.SUCCESS.GAME_IMPORTED, 'success');
      await this.loadGames(0, this.filters); // Recarregar lista
      return game;
    } catch (err) {
      error('Erro ao importar partida', err);
      showToast(err.message, 'error');
      return null;
    }
  }
}

/**
 * Instância global
 */
const games = new GamesManager();

// ========== RENDER FUNCTIONS ==========

/**
 * Renderizar lista de partidas
 */
function renderGamesList(gamesList) {
  const container = document.getElementById('games-list');
  if (!container) return;

  if (!gamesList || gamesList.length === 0) {
    renderEmptyState('games-list', '♟️', 'Nenhuma partida', 
      'Comece criando uma nova partida ou importe via PGN');
    return;
  }

  let html = '<table class="games-table"><thead><tr>' +
    '<th>Título</th>' +
    '<th>Jogadores</th>' +
    '<th>Resultado</th>' +
    '<th>Data</th>' +
    '<th>Ações</th>' +
    '</tr></thead><tbody>';

  gamesList.forEach(game => {
    const date = formatDate(game.createdAt, 'short');
    const resultBadge = getResultBadge(game.result);

    html += `
      <tr onclick="openGameViewer('${game.id}')">
        <td class="game-title-col">${game.title}</td>
        <td class="game-players-col">${game.whitePlayer} vs ${game.blackPlayer}</td>
        <td>${resultBadge}</td>
        <td class="game-date-col">${date}</td>
        <td class="game-actions-col">
          <button class="btn-icon" title="Editar" onclick="event.stopPropagation(); openEditGameModal('${game.id}')">✏️</button>
          <button class="btn-icon" title="Deletar" onclick="event.stopPropagation(); games.deleteGame('${game.id}')">🗑️</button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

/**
 * Obter badge de resultado
 */
function getResultBadge(result) {
  const badges = {
    '1-0': '<span class="game-result-badge result-white-win">Brancas (1-0)</span>',
    '0-1': '<span class="game-result-badge result-black-win">Pretas (0-1)</span>',
    '1/2-1/2': '<span class="game-result-badge result-draw">Empate (½-½)</span>',
    '*': '<span class="game-result-badge">Em Andamento</span>',
  };

  return badges[result] || '<span class="game-result-badge">-</span>';
}

/**
 * Abrir visualizador de partida
 */
async function openGameViewer(gameId) {
  try {
    const game = await games.loadGame(gameId);
    if (!game) return;

    // Renderizar tabuleiro e movimentos
    renderGameViewer(game);
    
    // Mostrar seção do visualizador
    showSection('game-viewer');
    setTopbarTitle(`Partida: ${game.title}`);
  } catch (err) {
    error('Erro ao abrir visualizador', err);
  }
}

/**
 * Renderizar visualizador de partida
 */
function renderGameViewer(game) {
  // Renderizar info da partida
  const infoPanel = document.getElementById('game-info-panel');
  if (infoPanel) {
    infoPanel.innerHTML = `
      <h3 class="game-info-title">${game.title}</h3>
      
      <div class="game-info-players">
        <div class="player-info player-white">
          <div class="player-name">⚪ ${game.whitePlayer}</div>
          ${game.result === '1-0' ? '<div class="player-result win">Vitória</div>' : 
           game.result === '0-1' ? '<div class="player-result loss">Derrota</div>' :
           game.result === '1/2-1/2' ? '<div class="player-result draw">Empate</div>' : ''}
        </div>
        
        <div class="player-info player-black">
          <div class="player-name">⚫ ${game.blackPlayer}</div>
          ${game.result === '0-1' ? '<div class="player-result win">Vitória</div>' : 
           game.result === '1-0' ? '<div class="player-result loss">Derrota</div>' :
           game.result === '1/2-1/2' ? '<div class="player-result draw">Empate</div>' : ''}
        </div>
      </div>

      <div class="divider"></div>

      <div class="game-info-item">
        <span class="game-info-label">Evento</span>
        <span class="game-info-value">${game.event || '-'}</span>
      </div>

      <div class="game-info-item">
        <span class="game-info-label">Data</span>
        <span class="game-info-value">${formatDate(game.gameDate, 'long')}</span>
      </div>

      <div class="game-info-item">
        <span class="game-info-label">Resultado</span>
        <span class="game-info-value">${game.result || '-'}</span>
      </div>

      ${game.notes ? `
        <div class="game-info-item">
          <span class="game-info-label">Anotações</span>
          <span class="game-info-value">${game.notes}</span>
        </div>
      ` : ''}
    `;
  }

  // Renderizar PGN/Movimentos
  if (game.pgnContent) {
    loadPgnContent(game.pgnContent);
  }

  log('Game viewer rendered', game);
}

/**
 * Abrir modal de criar partida
 */
function openCreateGameModal() {
  // Reset form
  const form = document.getElementById('create-game-form');
  if (form) form.reset();

  showModal('create-game');
}

/**
 * Handle do formulário de criar partida
 */
async function handleCreateGameSubmit(formData) {
  const success = await games.createGame(formData);
  if (success) {
    hideModal('create-game');
    showSection('games');
  }
}

/**
 * Abrir modal de editar partida
 */
async function openEditGameModal(gameId) {
  const game = await games.loadGame(gameId);
  if (!game) return;

  // Popular form com dados da partida
  populateEditForm(game);
  showModal('edit-game');
}

/**
 * Handle do formulário de editar partida
 */
async function handleEditGameSubmit(gameId, formData) {
  const success = await games.updateGame(gameId, formData);
  if (success) {
    hideModal('edit-game');
  }
}

/**
 * Página de partidas carregada
 */
async function loadGamesPage() {
  setTopbarTitle('Minhas Partidas');
  games.loadGames(0);
}
