// js/puzzles.js — Chess Vault
//
// Consome GET /puzzles/diario e GET /puzzles/aleatorio do backend real.
// Exibe o tabuleiro com o FEN do puzzle e mostra o PGN da solução
// após o usuário pedir. O estado de "resolvido" fica em memória por sessão.
//
// Arquitetura: esta camada só sabe de fetch → render → evento.
// Nenhuma lógica de xadrez aqui: o tabuleiro usa as funções de
// chess-engine.js e games-viewer.js que já existem no projeto.

// ─── Estado do módulo ────────────────────────────────────────────────────────
const PuzzleState = {
  puzzleAtual: null,          // { title, fen, pgn, url, image }
  modo: 'diario',             // 'diario' | 'aleatorio'
  solucaoVisivel: false,
  tentativas: 0,
};

// ─── Carregar seção ──────────────────────────────────────────────────────────

async function loadPuzzlesSection() {
  // Sempre começa buscando o puzzle do dia
  await fetchPuzzle('diario');
}

async function fetchPuzzle(tipo) {
  PuzzleState.modo            = tipo;
  PuzzleState.solucaoVisivel  = false;
  PuzzleState.tentativas      = 0;
  PuzzleState.puzzleAtual     = null;

  _renderPuzzleSkeleton();

  try {
    const endpoint = tipo === 'diario'
      ? '/puzzles/diario'
      : '/puzzles/aleatorio';

    const puzzle = await api.get(endpoint);
    PuzzleState.puzzleAtual = puzzle;
    _renderPuzzle(puzzle);

  } catch (err) {
    error('Erro ao buscar puzzle', err);
    _renderPuzzleErro(err.message);
  }
}

// ─── Renders ─────────────────────────────────────────────────────────────────

function _renderPuzzleSkeleton() {
  const area = document.getElementById('puzzle-area');
  if (!area) return;
  area.innerHTML = `
    <div class="puzzle-skeleton">
      <div class="puzzle-board-skeleton skeleton"></div>
      <div class="puzzle-info-skeleton">
        <div class="skeleton" style="height:22px;width:60%;border-radius:6px;margin-bottom:12px;"></div>
        <div class="skeleton" style="height:14px;width:85%;border-radius:4px;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:14px;width:50%;border-radius:4px;margin-bottom:24px;"></div>
        <div class="skeleton" style="height:36px;width:140px;border-radius:6px;"></div>
      </div>
    </div>`;
}

function _renderPuzzleErro(msg) {
  const area = document.getElementById('puzzle-area');
  if (!area) return;
  area.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">⚠️</div>
      <div class="empty-state-title">Não foi possível carregar o puzzle</div>
      <p style="color:var(--ink-muted);font-size:13px;margin-bottom:1rem;">${msg}</p>
      <button class="btn btn-secondary" onclick="fetchPuzzle(PuzzleState.modo)">Tentar novamente</button>
    </div>`;
}

function _renderPuzzle(puzzle) {
  const area = document.getElementById('puzzle-area');
  if (!area) return;

  // Monta o HTML da área de puzzle
  area.innerHTML = `
    <div class="puzzle-layout">

      <!-- Tabuleiro (mesmo markup/engine do visualizador de Minhas Partidas) -->
      <div class="puzzle-board-col">
        <div id="puzzle-board-wrap">
          <div id="puzzle-vboard-ranks"></div>
          <div id="puzzle-vboard"></div>
        </div>
        <div id="puzzle-vboard-files"></div>
        <p class="puzzle-turn-label" id="puzzle-turn-label"></p>
      </div>

      <!-- Painel lateral -->
      <div class="puzzle-panel">

        <!-- Cabeçalho do puzzle -->
        <div class="puzzle-panel-header">
          <div class="puzzle-tipo-badge ${PuzzleState.modo === 'diario' ? 'badge-diario' : 'badge-aleatorio'}">
            ${PuzzleState.modo === 'diario' ? '☀️ Puzzle do Dia' : '🎲 Puzzle Aleatório'}
          </div>
          <h2 class="puzzle-title">${puzzle.title || 'Puzzle de Xadrez'}</h2>
          ${puzzle.url ? `<a class="puzzle-source-link" href="${puzzle.url}" target="_blank" rel="noopener">
            Ver no Chess.com ↗
          </a>` : ''}
        </div>

        <!-- Instrução -->
        <div class="puzzle-instruction">
          <span class="puzzle-instruction-icon">🎯</span>
          <span>Encontre o melhor lance para as <strong id="puzzle-side-text">—</strong>.</span>
        </div>

        <!-- Solução (escondida por padrão) -->
        <div class="puzzle-solution-wrap" id="puzzle-solution-wrap" style="display:none;">
          <div class="puzzle-solution-label">Solução (PGN)</div>
          <div class="puzzle-solution-pgn" id="puzzle-solution-pgn"></div>
        </div>

        <!-- Imagem do Chess.com (miniatura do tabuleiro deles) -->
        ${puzzle.image ? `
          <div class="puzzle-image-wrap">
            <img src="${puzzle.image}" alt="Posição do puzzle"
                 class="puzzle-image"
                 onerror="this.parentElement.style.display='none'" />
          </div>` : ''}

        <!-- Ações -->
        <div class="puzzle-actions">
          <button class="btn btn-primary" id="puzzle-show-solution-btn"
                  onclick="togglePuzzleSolution()">
            💡 Ver Solução
          </button>
          <button class="btn btn-secondary" onclick="fetchPuzzle('aleatorio')">
            🎲 Outro Puzzle
          </button>
          <button class="btn btn-secondary" onclick="fetchPuzzle('diario')">
            ☀️ Puzzle do Dia
          </button>
        </div>

        <!-- Dica de interação -->
        <p class="puzzle-hint">
          Use os botões acima para ver a solução ou carregar um novo puzzle.
          Para analisar a fundo, salve a partida em "Minhas Partidas".
        </p>
      </div>
    </div>`;

  // Monta o tabuleiro com o FEN do puzzle
  _montarTabuleiroPuzzle(puzzle.fen);
}

// ─── Tabuleiro ───────────────────────────────────────────────────────────────

function _montarTabuleiroPuzzle(fen) {
  if (!fen) return;

  const boardEl = document.getElementById('puzzle-vboard');
  if (!boardEl) return;

  const turnLabel = document.getElementById('puzzle-turn-label');
  const sideText  = document.getElementById('puzzle-side-text');

  // Carrega a posição no MESMO motor (vBoard/vTurn/...) e com o mesmo
  // parser de FEN usado pelo resto do app — nada de reimplementar leitura
  // de FEN aqui.
  vLoadFEN(fen);

  const nomeTurno = vTurn === 'w' ? 'Brancas' : 'Pretas';
  if (sideText)  sideText.textContent  = nomeTurno;
  if (turnLabel) turnLabel.textContent = `Vez das ${nomeTurno}`;

  _renderPuzzleBoard();
}

/**
 * Renderiza o tabuleiro do puzzle. Idêntico em estrutura ao renderViewerBoard
 * de games-viewer.js (mesmas classes .vsq/.vl/.vd, mesmo VPIECES, mesma
 * engine vGetLegal/vApplyMove) — só aponta para os ids #puzzle-vboard*
 * em vez de #vboard, e re-renderiza o painel do puzzle em vez da tabela
 * de lances. Isso já deixa o puzzle jogável (clicar numa peça mostra os
 * lances legais), não só uma imagem estática da posição.
 */
function _renderPuzzleBoard() {
  const boardEl = document.getElementById('puzzle-vboard');
  if (!boardEl) return;
  boardEl.innerHTML = '';

  const legalSet = new Set(vLegalMoves.map(([r, c]) => `${r},${c}`));

  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const sq = document.createElement('div');
    const isLight = (r + c) % 2 === 0;
    sq.className = 'vsq ' + (isLight ? 'vl' : 'vd');
    const isLast = vLastMove.some(([lr, lc]) => lr === r && lc === c);
    if (isLast) sq.classList.add('vlast');
    if (vSelected && vSelected[0] === r && vSelected[1] === c) sq.classList.add('vsel');
    if (legalSet.has(`${r},${c}`)) {
      sq.classList.add('vlegal');
      if (vBoard[r][c]) sq.classList.add('vhas');
    }
    if (vBoard[r][c]) sq.textContent = VPIECES[vBoard[r][c]] || '';
    sq.onclick = () => _handlePuzzleBoardClick(r, c);
    boardEl.appendChild(sq);
  }

  const ranksEl = document.getElementById('puzzle-vboard-ranks');
  if (ranksEl) {
    ranksEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      const d = document.createElement('div');
      d.className = 'vlab';
      d.textContent = 8 - r;
      ranksEl.appendChild(d);
    }
  }

  const filesEl = document.getElementById('puzzle-vboard-files');
  if (filesEl) {
    filesEl.innerHTML = '';
    for (const l of ['a','b','c','d','e','f','g','h']) {
      const d = document.createElement('div');
      d.className = 'vlab';
      d.textContent = l;
      filesEl.appendChild(d);
    }
  }
}

function _handlePuzzleBoardClick(r, c) {
  const p = vBoard[r][c];
  if (vSelected) {
    const mv = vLegalMoves.find(([mr, mc]) => mr === r && mc === c);
    if (mv) {
      vApplyMove(vSelected[0], vSelected[1], r, c, null);
      vSelected = null; vLegalMoves = [];
      _renderPuzzleBoard();
      return;
    }
  }
  if (p && vColor(p) === vTurn) {
    vSelected = [r, c];
    vLegalMoves = vGetLegal(r, c, vBoard, vTurn, vCastling, vEnPassant);
  } else {
    vSelected = null; vLegalMoves = [];
  }
  _renderPuzzleBoard();
}

// ─── Solução ─────────────────────────────────────────────────────────────────

function togglePuzzleSolution() {
  const wrap = document.getElementById('puzzle-solution-wrap');
  const btn  = document.getElementById('puzzle-show-solution-btn');
  const pgn  = document.getElementById('puzzle-solution-pgn');

  if (!wrap || !PuzzleState.puzzleAtual) return;

  PuzzleState.solucaoVisivel = !PuzzleState.solucaoVisivel;

  if (PuzzleState.solucaoVisivel) {
    // Mostrar PGN formatado
    const pgnTexto = PuzzleState.puzzleAtual.pgn || 'Solução não disponível.';
    pgn.textContent = pgnTexto;
    wrap.style.display = 'block';
    if (btn) btn.textContent = '🙈 Esconder Solução';
  } else {
    wrap.style.display = 'none';
    if (btn) btn.textContent = '💡 Ver Solução';
  }
}
