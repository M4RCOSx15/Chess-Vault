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
          <p>Clique em "+ Nova Partida" para adicionar a primeira.</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="games-grid">${partidas.map(p => `
      <div class="game-card" onclick='openGameViewer(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        <button class="game-card-delete" title="Deletar" onclick="event.stopPropagation(); handleDeleteGame(${p.id}, '${p.nome.replace(/'/g, "\\'")}')">🗑</button>
        <div class="game-card-title">${p.nome}</div>
        <div class="game-card-sub">Clique para abrir</div>
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

// ========== DELETAR PARTIDA ==========

async function handleDeleteGame(id, nome) {
  const confirmado = confirm(`Deletar a partida "${nome}"? Essa ação não pode ser desfeita.`);
  if (!confirmado) return;

  try {
    await api.delete(`${CONFIG.ENDPOINTS.PARTIDAS.DELETAR}/${id}`);
    showToast('Partida deletada.', 'success');
    await loadGamesList();
  } catch (err) {
    error('Erro ao deletar partida', err);
    showToast(err.message, 'error');
  }
}

// ========== CRIAR PARTIDA ==========

function openNewGameModal() {
  document.getElementById('new-game-form').reset();
  document.getElementById('new-game-overlay').classList.add('visible');
}

function closeNewGameModal() {
  document.getElementById('new-game-overlay').classList.remove('visible');
}

async function handleNewGameSubmit(nome, pgn) {
  try {
    // ATENÇÃO: o endpoint recebe o PartidasModel direto (sem DTO).
    // Por causa do getter getPGN() (duas letras maiúsculas seguidas),
    // o Jackson espera a chave "PGN" maiúscula no JSON, não "pgn".
    await api.post(CONFIG.ENDPOINTS.PARTIDAS.CRIAR, { nome: nome, PGN: pgn });
    showToast('Partida salva com sucesso!', 'success');
    closeNewGameModal();
    await loadGamesList();
  } catch (err) {
    error('Erro ao criar partida', err);
    showToast(err.message, 'error');
  }
}
