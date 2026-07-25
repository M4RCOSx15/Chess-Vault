// js/books.js - Seção "Livros"

async function renderBooks() {
  const area = document.getElementById('content-area');
  area.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const books = await MockDataService.getBooks();

  const cardsHtml = books.map(b => `
    <div class="book-tile fade-up" onclick="showToast('${b.title.replace(/'/g, "\\'")}', 'info')">
      <div class="book-cover p${b.paletteIndex}">
        <span style="position:relative">${b.emoji}</span>
      </div>
      <div>
        <div class="book-info-title">${b.title}</div>
        <div class="book-info-author">${b.author}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
          <span class="tag">${b.level}</span>
          <span style="font-size:11px;color:var(--amber);font-weight:600;margin-left:auto">${b.rating}</span>
        </div>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="fade-up">
      <div class="grid-3" style="margin-bottom:var(--sp-6);">
        <div class="stat-card"><div class="stat-label">Total de livros</div><div class="stat-value">${books.length}</div></div>
        <div class="stat-card"><div class="stat-label">Lendo agora</div><div class="stat-value">2</div></div>
        <div class="stat-card"><div class="stat-label">Concluídos</div><div class="stat-value">4</div></div>
      </div>
      <div class="section-header">
        <div>
          <div class="section-title">Coleção <span class="badge badge-muted">${books.length}</span></div>
          <div class="section-subtitle">Seus livros de xadrez</div>
        </div>
      </div>
      <div class="books-grid">${cardsHtml}</div>
    </div>
  `;
}
