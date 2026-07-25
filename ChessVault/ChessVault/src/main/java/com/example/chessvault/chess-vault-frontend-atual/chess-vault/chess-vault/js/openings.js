// js/openings.js - Seção "Aberturas"

async function renderOpenings() {
  const area = document.getElementById('content-area');
  area.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const openings = await MockDataService.getOpenings();

  const cardsHtml = openings.map(o => `
    <div class="opening-card fade-up" onclick="showToast('${o.name.replace(/'/g, "\\'")}', 'info')">
      <div class="opening-eco">${o.eco}</div>
      <div class="opening-name">${o.name}</div>
      <div class="opening-moves">${o.moves}</div>
      <div class="opening-winbar">
        <div class="opening-winbar-white" style="flex:${o.white}"></div>
        <div class="opening-winbar-draw"  style="flex:${o.draw}"></div>
        <div class="opening-winbar-black" style="flex:${o.black}"></div>
      </div>
      <div class="opening-win-stats">
        <span class="win-white">${o.white}% brancas</span>
        <span class="win-draw">${o.draw}% empates</span>
        <span class="win-black">${o.black}% pretas</span>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="fade-up">
      <div class="section-header">
        <div>
          <div class="section-title">Aberturas <span class="badge badge-muted">${openings.length}</span></div>
          <div class="section-subtitle">Estatísticas e teoria das principais aberturas</div>
        </div>
      </div>
      <div class="grid-3">${cardsHtml}</div>
    </div>
  `;
}
