// js/videos.js - Seção "Vídeos"

async function renderVideos() {
  const area = document.getElementById('content-area');
  area.innerHTML = `<div class="loading-state"><div class="spinner"></div></div>`;

  const videos = await MockDataService.searchVideos('');

  const cardsHtml = videos.map(v => `
    <div class="video-card fade-up" onclick="showToast('${v.title.replace(/'/g, "\\'")}', 'info')">
      <div class="video-thumb">
        <span class="video-thumb-placeholder">${v.thumbEmoji}</span>
        <span class="video-lang-badge">${v.lang}</span>
        <span class="video-duration">${v.duration}</span>
      </div>
      <div class="video-body">
        <div class="video-title">${v.title}</div>
        <div class="video-channel">🎬 ${v.channel}</div>
        <div class="video-meta">
          <span class="tag">${v.category}</span>
          <span style="margin-left:auto">${v.views} views</span>
        </div>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="fade-up">
      <div class="grid-3" style="margin-bottom:var(--sp-6);">
        <div class="stat-card"><div class="stat-label">Total de vídeos</div><div class="stat-value">${videos.length}</div></div>
        <div class="stat-card"><div class="stat-label">Assistidos</div><div class="stat-value">7</div></div>
        <div class="stat-card"><div class="stat-label">Horas estudadas</div><div class="stat-value">18h</div></div>
      </div>
      <div class="section-header">
        <div>
          <div class="section-title">Vídeos <span class="badge badge-muted">${videos.length}</span></div>
          <div class="section-subtitle">Aulas e análises salvas, em vários idiomas</div>
        </div>
      </div>
      <div class="videos-grid">${cardsHtml}</div>
    </div>
  `;
}
