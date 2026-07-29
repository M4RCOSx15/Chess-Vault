// js/jogadores.js - Jogadores (CRUD conectado ao JogadorController)

const ICONES_JOGADOR = ['♔', '♕', '♖', '♗', '♘', '♙'];

function iconeDoJogador(nome) {
  let soma = 0;
  for (let i = 0; i < (nome || '').length; i++) soma += nome.charCodeAt(i);
  return ICONES_JOGADOR[soma % ICONES_JOGADOR.length];
}

// Guardamos em memória os jogadores carregados (pra abrir detalhe sem
// buscar de novo) — seguindo o mesmo padrão de livrosCarregados.
let jogadoresCarregados = [];
// Guarda as partidas vinculadas ao jogador atualmente aberto na tela
// de detalhes — precisamos do id de uma delas pra deletar o jogador,
// já que o endpoint agora exige desvincular da chave estrangeira primeiro.
let partidasVinculadasAtual = [];

async function loadJogadoresList() {
  const container = document.getElementById('jogadores-list');

  // Mesma correção que já aplicamos em games/books: limpar ANTES do
  // await, pra não mostrar jogador de outro usuário durante a espera.
  container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Carregando jogadores...</p>`;

  try {
    jogadoresCarregados = await api.get('/jogador/buscartodosjogadores');

    if (!jogadoresCarregados || jogadoresCarregados.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">♟️</div>
          <div class="empty-state-title">Nenhum jogador ainda</div>
          <p>Clique em "+ Adicionar Jogador" para cadastrar o primeiro.</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="players-grid">${jogadoresCarregados.map((j, i) => `
      <div class="player-card">
        <div class="player-card-icon">${iconeDoJogador(j.nome)}</div>
        <div class="player-card-nome">${j.nome}</div>
        <div class="player-card-rating">${j.rating ?? '—'}</div>
        <div class="player-card-rating-label">FIDE Rating</div>
        <div class="player-card-desc">${j.descricao || 'Sem descrição.'}</div>
        <div class="player-card-actions">
          <button class="btn btn-secondary" onclick="openPlayerDetail(${i})">Ver Detalhes</button>
        </div>
      </div>
    `).join('')}</div>`;

  } catch (err) {
    error('Erro ao carregar jogadores', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Não foi possível carregar</div>
        <p>${err.message}</p>
      </div>`;
  }
}

// ============================================================
// CRIAR JOGADOR
// ============================================================

function openNewPlayerModal() {
  document.getElementById('new-player-form').reset();
  document.getElementById('new-player-overlay').classList.add('visible');
}

function closeNewPlayerModal() {
  document.getElementById('new-player-overlay').classList.remove('visible');
}

async function handleNewPlayerSubmit(dados) {
  try {
    // Criar um jogador não envolve mais nenhuma partida — isso agora
    // é uma ação separada, feita DEPOIS, na tela de detalhes (o
    // vínculo vive do lado da PartidasModel, via jogador1/jogador2).
    await api.post('/jogador/criarjogador', {
      nome: dados.nome,
      rating: Number(dados.rating),
      descricao: dados.descricao,
      aberturasFav: dados.aberturas,
    });
    showToast('Jogador salvo com sucesso!', 'success');
    closeNewPlayerModal();
    await loadJogadoresList();
  } catch (err) {
    error('Erro ao salvar jogador', err);
    showToast(err.message, 'error');
  }
}

// ============================================================
// DETALHES DO JOGADOR
// ============================================================

async function openPlayerDetail(index) {
  const j = jogadoresCarregados[index];
  if (!j) return;

  const tags = (j.aberturasFav || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `<span class="player-tag">${t}</span>`)
    .join('');

  document.getElementById('player-detail-content').innerHTML = `
    <div class="player-detail-card">
      <div class="player-detail-icon">${iconeDoJogador(j.nome)}</div>
      <div>
        <div class="player-detail-nome">${j.nome}</div>
        <div class="player-detail-rating">FIDE Rating: <strong>${j.rating ?? '—'}</strong></div>
        <p class="player-detail-desc">${j.descricao || 'Sem descrição.'}</p>
        ${tags ? `<div class="player-tags">${tags}</div>` : ''}
      </div>
    </div>

    <div class="section-header">
      <h3 class="section-title" style="font-size: 17px;">Partidas Vinculadas</h3>
      <button class="btn btn-secondary" onclick="abrirSeletorVincularPartida(${j.id})">+ Adicionar Partida</button>
    </div>
    <div id="player-linked-games">
      <p style="color: var(--ink-muted); font-size: 13px;">Carregando...</p>
    </div>
    <div id="player-link-selector" style="display:none; margin-top: 1rem;"></div>

    <div class="game-card-footer" style="margin-top: 1.5rem; justify-content: flex-start;">
      <button class="btn-danger" onclick="handleDeletePlayer(${j.id})">🗑 Remover jogador</button>
    </div>
  `;

  showSection('player-detail');
  await carregarPartidasDoJogador(j.id);
}

/**
 * Busca as partidas vinculadas a esse jogador DIRETO na fonte real —
 * o endpoint que consulta PartidasModel.jogador1/jogador2 — em vez de
 * confiar em algum campo embutido no próprio objeto do jogador.
 */
async function carregarPartidasDoJogador(jogadorId) {
  const container = document.getElementById('player-linked-games');

  try {
    const partidas = await api.get(`/partidas/buscarpartidasdojogador/${jogadorId}`);
    partidasVinculadasAtual = partidas || [];
    renderPlayerLinkedGames(partidas, jogadorId);
  } catch (err) {
    error('Erro ao carregar partidas do jogador', err);
    partidasVinculadasAtual = [];
    container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Não foi possível carregar as partidas vinculadas.</p>`;
  }
}

function renderPlayerLinkedGames(partidas, jogadorId) {
  const container = document.getElementById('player-linked-games');

  if (!partidas || partidas.length === 0) {
    container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Nenhuma partida vinculada ainda.</p>`;
    return;
  }

  container.innerHTML = `<div class="games-grid">${partidas.map(partida => `
    <div class="game-card">
      <button class="game-card-delete" title="Desvincular" onclick="event.stopPropagation(); handleDesvincularPartida(${partida.id}, ${jogadorId})">✕</button>
      <div class="game-card-body" style="padding-top: 14px;" onclick='openGameViewer(${JSON.stringify(partida).replace(/'/g, "&#39;")})'>
        <div class="game-card-title-real">${partida.nome}</div>
        <div class="game-card-footer">Clique para abrir</div>
      </div>
    </div>
  `).join('')}</div>`;
}

/**
 * Mostra um seletor simples (partidas do usuário) pra escolher qual
 * vincular a esse jogador — a ação de "adicionar partida" que ficou
 * de fora da criação do jogador.
 */
async function abrirSeletorVincularPartida(jogadorId) {
  const container = document.getElementById('player-link-selector');
  container.style.display = 'block';
  container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Carregando suas partidas...</p>`;

  try {
    const partidas = await api.get(CONFIG.ENDPOINTS.PARTIDAS.LISTAR);

    if (!partidas || partidas.length === 0) {
      container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Você ainda não tem partidas salvas.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="auth-field">
        <label class="auth-label">Escolha uma partida para vincular</label>
        <select id="player-link-select" class="auth-input">
          ${partidas.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')}
        </select>
      </div>
      <button class="auth-submit" onclick="handleVincularPartida(${jogadorId})">Vincular</button>
    `;
  } catch (err) {
    error('Erro ao carregar partidas para vincular', err);
    container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Erro ao carregar suas partidas.</p>`;
  }
}

async function handleVincularPartida(jogadorId) {
  const select = document.getElementById('player-link-select');
  const partidaId = select ? select.value : null;
  if (!partidaId) return;

  try {
    await api.put(`/partidas/vincularjogador/${partidaId}/${jogadorId}`);
    showToast('Partida vinculada com sucesso!', 'success');
    document.getElementById('player-link-selector').style.display = 'none';
    await carregarPartidasDoJogador(jogadorId);
  } catch (err) {
    error('Erro ao vincular partida', err);
    showToast(err.message, 'error');
  }
}

async function handleDesvincularPartida(partidaId, jogadorId) {
  try {
    await api.delete(`/partidas/desvincularjogador/${partidaId}/${jogadorId}`);
    showToast('Partida desvinculada.', 'success');
    await carregarPartidasDoJogador(jogadorId);
  } catch (err) {
    error('Erro ao desvincular partida', err);
    showToast(err.message, 'error');
  }
}

function closePlayerDetail() {
  showSection('jogadores');
}

async function handleDeletePlayer(id) {
  // O backend exige desvincular da chave estrangeira antes de deletar
  // — por isso precisa do id de uma partida vinculada. Usamos a
  // primeira da lista que já carregamos na tela de detalhes.
  const partida = partidasVinculadasAtual[0];

  if (!partida) {
    showToast('Este jogador não tem partida vinculada para desvincular — confira com o backend se é possível deletar sem isso.', 'error');
    return;
  }

  const confirmado = confirm('Remover este jogador? Essa ação não pode ser desfeita.');
  if (!confirmado) return;

  try {
    await api.delete(`/jogador/deletarjogador/${partida.id}/${id}`);
    showToast('Jogador removido.', 'success');
    closePlayerDetail();
    await loadJogadoresList();
  } catch (err) {
    error('Erro ao remover jogador', err);
    showToast(err.message, 'error');
  }
}
