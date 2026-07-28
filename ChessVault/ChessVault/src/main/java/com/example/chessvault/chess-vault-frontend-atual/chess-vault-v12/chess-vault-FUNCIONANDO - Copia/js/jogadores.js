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

async function openNewPlayerModal() {
  document.getElementById('new-player-form').reset();

  // O JogadorModel exige uma partida vinculada (partidasModel,
  // nullable = false) — por isso o formulário precisa deixar você
  // escolher uma das suas partidas já salvas.
  const select = document.getElementById('new-player-partida');
  select.innerHTML = `<option value="">Selecione uma partida salva...</option>`;

  try {
    const partidas = await api.get(CONFIG.ENDPOINTS.PARTIDAS.LISTAR);
    partidas.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.nome;
      select.appendChild(opt);
    });
  } catch (err) {
    error('Erro ao carregar partidas para o formulário de jogador', err);
  }

  document.getElementById('new-player-overlay').classList.add('visible');
}

function closeNewPlayerModal() {
  document.getElementById('new-player-overlay').classList.remove('visible');
}

async function handleNewPlayerSubmit(dados) {
  if (!dados.partidaId) {
    showToast('Selecione uma partida vinculada.', 'error');
    return;
  }

  try {
    await api.put('/jogador/criarjogador', {
      nome: dados.nome,
      rating: Number(dados.rating),
      descricao: dados.descricao,
      aberturasFav: dados.aberturas,
      // O backend espera o objeto PartidasModel completo pra
      // relacionar via @ManyToOne — mandamos só o id, que é o
      // suficiente pro Hibernate resolver a referência.
      partidasModel: { id: Number(dados.partidaId) },
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

function openPlayerDetail(index) {
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
      <h3 class="section-title" style="font-size: 17px;">Partida Vinculada</h3>
    </div>
    <div id="player-linked-game"></div>
    <div class="game-card-footer" style="margin-top: 1rem; justify-content: flex-start;">
      <button class="btn-danger" onclick="handleDeletePlayer(${j.id})">🗑 Remover jogador</button>
    </div>
  `;

  renderPlayerLinkedGame(j);
  showSection('player-detail');
}

function renderPlayerLinkedGame(j) {
  const container = document.getElementById('player-linked-game');
  const partida = j.partidasModel;

  if (!partida) {
    container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Nenhuma partida vinculada.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="game-card" style="max-width: 320px;" onclick='openGameViewer(${JSON.stringify(partida).replace(/'/g, "&#39;")})'>
      <div class="game-card-body" style="padding-top: 14px;">
        <div class="game-card-title-real">${partida.nome}</div>
        <div class="game-card-footer">Clique para abrir</div>
      </div>
    </div>
  `;
}

function closePlayerDetail() {
  showSection('jogadores');
}

async function handleDeletePlayer(id) {
  const confirmado = confirm('Remover este jogador? Essa ação não pode ser desfeita.');
  if (!confirmado) return;

  try {
    await api.delete(`/jogador/deletarjogador/${id}`);
    showToast('Jogador removido.', 'success');
    closePlayerDetail();
    await loadJogadoresList();
  } catch (err) {
    error('Erro ao remover jogador', err);
    showToast(err.message, 'error');
  }
}
