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

      <!-- Tabuleiro -->
      <div class="puzzle-board-col">
        <div class="puzzle-board-wrap">
          <div id="puzzle-board-ranks"></div>
          <div id="puzzle-vboard"></div>
        </div>
        <div id="puzzle-board-files"></div>
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

  const boardEl   = document.getElementById('puzzle-vboard');
  const ranksEl   = document.getElementById('puzzle-board-ranks');
  const filesEl   = document.getElementById('puzzle-board-files');
  const turnLabel = document.getElementById('puzzle-turn-label');
  const sideText  = document.getElementById('puzzle-side-text');

  if (!boardEl) return;

  // Determinar quem joga a partir do FEN
  // Formato: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  // O segundo campo separado por espaço é 'w' ou 'b'
  const partesFen = fen.trim().split(' ');
  const turno = partesFen[1] || 'w';
  const nomeTurno = turno === 'w' ? 'Brancas' : 'Pretas';

  if (sideText)  sideText.textContent  = nomeTurno;
  if (turnLabel) turnLabel.textContent = `Vez das ${nomeTurno}`;

  // Renderiza o tabuleiro visualmente (leitura do FEN → grade de peças)
  _renderFenBoard(boardEl, ranksEl, filesEl, fen);
}

/**
 * Renderiza um tabuleiro 8×8 estático a partir de um FEN.
 * Não usa a engine completa de jogadas — só exibe a posição.
 * Para interatividade completa futura, basta trocar esta função
 * por uma chamada ao chess-engine.js existente.
 */
function _renderFenBoard(boardEl, ranksEl, filesEl, fen) {
  const PECAS_UNICODE = {
    K:'♔', Q:'♕', R:'♖', B:'♗', N:'♘', P:'♙',
    k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟',
  };

  // Parsear a parte de posição do FEN (antes do primeiro espaço)
  const posicao = fen.split(' ')[0];
  const linhas  = posicao.split('/');

  // Limpar
  boardEl.innerHTML   = '';
  if (ranksEl) ranksEl.innerHTML = '';
  if (filesEl) filesEl.innerHTML = '';

  // Montar grade 8×8
  boardEl.style.cssText = `
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    width: 100%;
    aspect-ratio: 1;
    border: 2px solid var(--border-strong);
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
  `;

  for (let r = 0; r < 8; r++) {
    const linha = linhas[r] || '';
    let col = 0;

    for (const ch of linha) {
      if (ch >= '1' && ch <= '8') {
        // Casas vazias
        const n = parseInt(ch);
        for (let i = 0; i < n; i++) {
          boardEl.appendChild(_criarCasa(r, col, null, PECAS_UNICODE));
          col++;
        }
      } else {
        boardEl.appendChild(_criarCasa(r, col, ch, PECAS_UNICODE));
        col++;
      }
    }
  }

  // Labels de colunas (a–h)
  if (filesEl) {
    filesEl.style.cssText = `
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      margin-top: 4px;
      text-align: center;
      font-size: 10px;
      color: var(--ink-faint);
      font-weight: 600;
    `;
    ['a','b','c','d','e','f','g','h'].forEach(l => {
      const d = document.createElement('div');
      d.textContent = l;
      filesEl.appendChild(d);
    });
  }

  // Labels de linhas (8–1)
  if (ranksEl) {
    ranksEl.style.cssText = `
      display: grid;
      grid-template-rows: repeat(8, 1fr);
      width: 16px;
      text-align: center;
      font-size: 10px;
      color: var(--ink-faint);
      font-weight: 600;
      align-items: center;
    `;
    for (let i = 8; i >= 1; i--) {
      const d = document.createElement('div');
      d.textContent = i;
      ranksEl.appendChild(d);
    }
  }
}

function _criarCasa(row, col, peca, mapa) {
  const sq = document.createElement('div');
  const clara = (row + col) % 2 === 0;
  sq.style.cssText = `
    background: ${clara ? '#f0d9b5' : '#b58863'};
    display: flex; align-items: center; justify-content: center;
    font-size: clamp(20px, 4vw, 38px);
    line-height: 1; user-select: none;
    aspect-ratio: 1;
  `;
  if (peca && mapa[peca]) {
    sq.textContent = mapa[peca];
    // Peças brancas (maiúsculas) em preto, pretas em cor mais escura
    sq.style.color = peca === peca.toUpperCase() ? '#000' : '#1a1a1a';
    sq.style.textShadow = peca === peca.toUpperCase()
      ? '0 1px 2px rgba(0,0,0,0.3)'
      : '0 1px 2px rgba(255,255,255,0.4)';
  }
  return sq;
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
