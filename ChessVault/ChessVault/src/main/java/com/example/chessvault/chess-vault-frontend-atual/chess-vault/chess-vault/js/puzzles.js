// js/puzzles.js - Seção "Puzzles"

const PuzzlesState = { difficulty: null };

async function renderPuzzles() {
  const area = document.getElementById('content-area');
  area.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const puzzles = await MockDataService.getPuzzles({ difficulty: PuzzlesState.difficulty });
  const all = await MockDataService.getPuzzles();

  const diffs = ['Easy', 'Medium', 'Hard'];
  const filterHtml = diffs.map(d => `
    <div class="puzzle-filter-item ${PuzzlesState.difficulty === d ? 'active' : ''}" onclick="filterPuzzles(${d === PuzzlesState.difficulty ? 'null' : `'${d}'`})">
      <span>${d}</span>
      <span class="puzzle-filter-count">${all.filter(p => p.difficulty === d).length}</span>
    </div>
  `).join('');

  const cardsHtml = puzzles.map(p => `
    <div class="puzzle-card fade-up" onclick="showToast('${p.theme} · ${p.moves}', 'info')">
      <div class="puzzle-board-preview">♟</div>
      <div class="puzzle-card-body">
        <div class="puzzle-card-top">
          <div class="puzzle-theme">${p.theme}</div>
          <span class="puzzle-fav">☆</span>
        </div>
        <div style="font-size:var(--text-xs);color:var(--ink-3);margin-bottom:var(--sp-2);">${p.subtheme}</div>
        <div class="puzzle-card-meta">
          <span class="badge badge-muted">${p.rating}</span>
          <span class="puzzle-stat">${p.difficulty}</span>
          <span class="puzzle-stat">${p.solved.toLocaleString('pt-BR')} resolvidos</span>
        </div>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="fade-up">
      <div class="section-header">
        <div>
          <div class="section-title">Puzzles <span class="badge badge-muted">${puzzles.length}</span></div>
          <div class="section-subtitle">Táticas para afiar seu olho para combinações</div>
        </div>
      </div>
      <div class="puzzles-layout">
        <aside class="puzzles-sidebar">
          <div class="puzzles-sidebar-title">Dificuldade</div>
          <div class="puzzle-filter">${filterHtml}</div>
        </aside>
        <div class="puzzles-grid">${cardsHtml}</div>
      </div>
    </div>
  `;
}

function filterPuzzles(difficulty) {
  PuzzlesState.difficulty = difficulty;
  renderPuzzles();
}
