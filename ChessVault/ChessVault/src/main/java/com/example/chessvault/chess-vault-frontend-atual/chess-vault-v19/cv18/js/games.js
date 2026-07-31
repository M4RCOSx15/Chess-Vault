// js/games.js - Lista de partidas (substitui o CARLSEN_GAMES mock por dados reais)

// ============================================================
// CARD DE PARTIDA — visual inspirado no design de referência, mas
// usando SÓ dado real (nome que você digitou + o próprio PGN).
// Nada de ECO/abertura/data inventados, porque isso não existe no
// PartidasModel — mentir na tela é pior que não mostrar.
// ============================================================

const PECAS_DECORATIVAS = ['♜','♞','♝','♛','♚','♝','♞','♜','♟','♟','♟','♟','♟','♟','♟','♟'];

/**
 * Se o nome seguir o padrão "Jogador1 vs Jogador2" (o que você já
 * digita hoje no formulário), extraímos os dois nomes pra mostrar
 * como na referência. Se não seguir esse padrão, não forçamos nada.
 */
function extrairJogadores(nome) {
  const partes = (nome || '').split(/\s+(?:vs\.?|x)\s+/i);
  if (partes.length === 2 && partes[0].trim() && partes[1].trim()) {
    return { brancas: partes[0].trim(), pretas: partes[1].trim() };
  }
  return null;
}

/**
 * O resultado (1-0, 0-1, 1/2-1/2) já vem DENTRO do texto do PGN que
 * você cola no formulário — não precisamos adivinhar nada, só ler o
 * fim do texto.
 */
function extrairResultado(pgnTexto) {
  const m = (pgnTexto || '').trim().match(/(1-0|0-1|1\/2-1\/2)\s*$/);
  if (!m) return null;
  const mapa = { '1-0': 'Brancas vencem', '0-1': 'Pretas vencem', '1/2-1/2': 'Empate' };
  return mapa[m[1]];
}

function renderGameCardHTML(p) {
  const jogadores = extrairJogadores(p.nome);
  const resultado = extrairResultado(p.PGN);
  const lances = (typeof parsePGN === 'function') ? parsePGN(p.PGN || '').length : 0;
  const padrao = PECAS_DECORATIVAS.join(' ');

  const jsonSeguro = JSON.stringify(p).replace(/'/g, "&#39;");
  const nomeSeguro = (p.nome || '').replace(/'/g, "\\'");

  const bannerJogadores = jogadores ? `
    <div class="game-card-players">
      <div class="game-card-player">
        <span class="game-card-player-dot filled"></span>${jogadores.brancas}
      </div>
      <div class="game-card-vs">vs</div>
      <div class="game-card-player">
        <span class="game-card-player-dot empty"></span>${jogadores.pretas}
      </div>
    </div>
  ` : `
    <div class="game-card-players">
      <div class="game-card-player">♟ ${p.nome}</div>
    </div>
  `;

  return `
    <div class="game-card" onclick='openGameViewer(${jsonSeguro})'>
      <button class="game-card-delete" title="Deletar" onclick="event.stopPropagation(); handleDeleteGame(${p.id}, '${nomeSeguro}')">🗑</button>
      <div class="game-card-banner">
        <div class="game-card-pattern">${padrao}</div>
        ${bannerJogadores}
        ${resultado ? `<div class="game-card-badge">${resultado}</div>` : ''}
      </div>
      <div class="game-card-body">
        <div class="game-card-title-real">${p.nome}</div>
        <div class="game-card-footer">${lances} lance${lances === 1 ? '' : 's'}</div>
      </div>
    </div>
  `;
}

async function loadGamesList() {
  const container = document.getElementById('games-list');
  const statEl = document.getElementById('stat-total-games');

  // IMPORTANTE: limpar a tela ANTES do await, não depois. Sem isso,
  // o HTML do usuário anterior (ou da seção anterior) continua visível
  // durante toda a espera da requisição — e se o backend demorar
  // (ex: "cold start" do Render acordando de hibernação), esse dado
  // antigo/errado fica na tela por vários segundos.
  container.innerHTML = `<p style="color: var(--ink-muted); font-size: 13px;">Carregando partidas...</p>`;
  if (statEl) statEl.textContent = '—';

  try {
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

    container.innerHTML = `<div class="games-grid">${partidas.map(p => renderGameCardHTML(p)).join('')}</div>`;

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

/**
 * Detecta o sintoma mais comum de PGN colado sem espaço: uma casa do
 * tabuleiro (dígito 1-8) seguida IMEDIATAMENTE por uma letra que só
 * poderia ser o começo do PRÓXIMO lance (peça, coluna ou roque) — sem
 * espaço, xeque (+/#) ou promoção (=) entre os dois.
 *
 * Isso não cobre 100% dos casos possíveis de PGN (ex: desambiguação
 * por linha, tipo "R1a3", pode gerar falso positivo aqui) — mas cobre
 * o padrão real que você encontrou, e prefere AVISAR demais a aceitar
 * dado ruim silenciosamente.
 */
function pgnPareceColado(pgn) {
  const padraoColado = /[1-8](?=[a-hKQRBNO])/;
  return padraoColado.test(pgn);
}

async function handleNewGameSubmit(nome, pgn) {
  if (!nome.trim()) {
    showToast('Dê um nome para a partida.', 'error');
    return;
  }
  if (!pgn.trim()) {
    showToast('Cole o PGN da partida.', 'error');
    return;
  }
  if (pgnPareceColado(pgn)) {
    showToast(
      'O PGN parece estar sem espaços entre os lances (ex: "e5Nf3" em vez de "e5 Nf3"). Adicione os espaços e tente novamente.',
      'error'
    );
    return;
  }

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