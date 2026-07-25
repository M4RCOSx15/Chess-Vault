// js/viewer.js - Viewer de partida (tabuleiro interativo lance a lance)

let currentGameData = null;
let viewerMoves = [];
let viewerMoveIndex = 0;

// ============================================================
// ABRIR PARTIDA NO VIEWER
// ============================================================
async function openGame(id) {
  const game = await MockDataService.getGame(id);
  if (!game) { showToast('Partida não encontrada', 'error'); return; }

  currentGameData = game;
  viewerMoves = parsePGN(game.pgn);
  viewerMoveIndex = 0;

  showSection('game-viewer');

  document.getElementById('vg-title').textContent = `${game.white} vs ${game.black}`;
  document.getElementById('vg-sub').textContent   = `${game.event} · ${game.location}, ${game.year} · ${game.result}`;

  const whoWon = game.result === '1-0'
    ? `${game.white} (Brancas) vencem`
    : game.result === '0-1'
    ? `${game.black} (Pretas) vencem`
    : 'Empate';

  document.getElementById('moves-info').innerHTML = `
    <div class="moves-players">
      <div class="moves-player-row"><div class="moves-player-dot mpd-w"></div><span class="moves-player-name">${game.white}</span><span class="moves-player-rating">${game.white_rating}</span></div>
      <div class="moves-player-row"><div class="moves-player-dot mpd-b"></div><span class="moves-player-name">${game.black}</span><span class="moves-player-rating">${game.black_rating}</span></div>
    </div>
    <div class="moves-event">📍 ${game.event} · ${game.year}</div>
    <div class="moves-result">🏆 ${whoWon}</div>
    <div style="font-size:var(--text-xs);color:var(--ink-3);margin-top:6px;line-height:1.5">${game.description}</div>
  `;

  goToMove(0);
}

function closeViewer() {
  navigateTo(currentView || 'games');
}

// ============================================================
// NAVEGAÇÃO DE LANCES (linha do tempo da partida)
// ============================================================
function goToMove(idx) {
  const total = viewerMoves.length;
  if (idx === -1) idx = total;
  idx = Math.max(0, Math.min(idx, total));

  resetViewerEngine();
  for (let i = 0; i < idx; i++) {
    const san = viewerMoves[i];
    const mv  = algebraicToMove(san, vBoard, vTurn);
    if (mv) {
      vApplyMove(mv[0], mv[1], mv[2], mv[3], mv[4]);
    } else {
      console.error(`goToMove: lance inválido "${san}" no índice ${i} (turn=${vTurn})`);
      break;
    }
  }
  viewerMoveIndex = idx;
  renderViewerBoard();
  renderMovesTable();
}

function nextMove() { if (viewerMoveIndex < viewerMoves.length) goToMove(viewerMoveIndex + 1); }
function prevMove() { if (viewerMoveIndex > 0) goToMove(viewerMoveIndex - 1); }

document.addEventListener('keydown', e => {
  const viewer = document.getElementById('game-viewer');
  if (!viewer || viewer.style.display === 'none') return;
  if (e.key === 'ArrowRight') nextMove();
  if (e.key === 'ArrowLeft')  prevMove();
  if (e.key === 'Home')       goToMove(0);
  if (e.key === 'End')        goToMove(-1);
});

// ============================================================
// RENDER DO TABULEIRO (viewer)
// ============================================================
function renderViewerBoard() {
  const boardEl = document.getElementById('vboard');
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
    sq.onclick = () => handleViewerClick(r, c);
    boardEl.appendChild(sq);
  }

  const ranksEl = document.getElementById('vboard-ranks');
  ranksEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    const d = document.createElement('div');
    d.className = 'vlab';
    d.textContent = 8 - r;
    ranksEl.appendChild(d);
  }
  const filesEl = document.getElementById('vboard-files');
  filesEl.innerHTML = '';
  for (const l of ['a','b','c','d','e','f','g','h']) {
    const d = document.createElement('div');
    d.className = 'vlab';
    d.textContent = l;
    filesEl.appendChild(d);
  }

  document.getElementById('move-counter').textContent = `${viewerMoveIndex} / ${viewerMoves.length}`;
  document.getElementById('btn-prev').disabled  = viewerMoveIndex === 0;
  document.getElementById('btn-start').disabled = viewerMoveIndex === 0;
  document.getElementById('btn-next').disabled  = viewerMoveIndex === viewerMoves.length;
  document.getElementById('btn-end').disabled   = viewerMoveIndex === viewerMoves.length;
}

// Clique livre no tabuleiro (permite explorar variações manualmente)
function handleViewerClick(r, c) {
  const p = vBoard[r][c];
  if (vSelected) {
    const mv = vLegalMoves.find(([mr, mc]) => mr === r && mc === c);
    if (mv) {
      vApplyMove(vSelected[0], vSelected[1], r, c, null);
      vSelected = null; vLegalMoves = [];
      renderViewerBoard();
      return;
    }
  }
  if (p && vColor(p) === vTurn) {
    vSelected   = [r, c];
    vLegalMoves = vGetLegal(r, c, vBoard, vTurn, vCastling, vEnPassant);
  } else {
    vSelected = null; vLegalMoves = [];
  }
  renderViewerBoard();
}

// ============================================================
// TABELA DE MOVIMENTOS
// ============================================================
function renderMovesTable() {
  const table = document.getElementById('moves-table');
  if (!table) return;
  let html = '';
  for (let i = 0; i < viewerMoves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const wMove   = viewerMoves[i]     || '';
    const bMove   = viewerMoves[i + 1] || '';
    const wActive = viewerMoveIndex === i + 1 ? 'active' : '';
    const bActive = viewerMoveIndex === i + 2 ? 'active' : '';
    html += `<tr>
      <td class="move-num">${moveNum}.</td>
      <td class="move-cell ${wActive}" onclick="goToMove(${i + 1})">${wMove}</td>
      <td class="move-cell ${bActive}" onclick="goToMove(${i + 2})">${bMove}</td>
    </tr>`;
  }
  table.innerHTML = html;

  const active = table.querySelector('.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
