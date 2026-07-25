    /**
 * PLAYERS MODULE — Chess Vault
 * Gerencia o grid de jogadores, modal de cadastro (foto padrão ou busca),
 * e a visão de detalhes de cada jogador.
 */

// Estado local do módulo
const PlayersState = {
  list: [],
  selectedAvatarEmoji: null,
  selectedAvatarMode: 'default',  // 'default' | 'search'
  selectedPhotoIndex: null,
  searchResults: [],
  currentPlayerId: null,
};

// ── AVATARES DEFAULT (combinam com o tema dark) ─────────────────────────────
const DEFAULT_AVATARS = ['♔','♛','♜','♝','♞','♟','♚','♕','♖','♗','♘','♙','🏆','👑','⚡','🎯'];

// ── RENDER PRINCIPAL ────────────────────────────────────────────────────────

async function loadPlayersSection() {
  const container = document.getElementById('players-list');
  if (!container) return;

  // Mostrar skeleton
  container.innerHTML = renderPlayerSkeletons(6);

  try {
    PlayersState.list = await MockDataService.getPlayers();
    renderPlayerGrid(container, PlayersState.list);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">Erro ao carregar jogadores</div>
        <div class="empty-desc">${err.message}</div>
      </div>`;
  }
}

function renderPlayerSkeletons(count) {
  return `<div class="players-grid">${Array.from({ length: count }, () => `
    <div class="card" style="overflow:hidden;">
      <div class="skeleton skel-img" style="height:80px;border-radius:0;"></div>
      <div style="padding:var(--sp-4)">
        <div class="skeleton skel-title" style="margin-top:24px;"></div>
        <div class="skeleton skel-line" style="width:40%;"></div>
        <div class="skeleton skel-line" style="width:55%;margin-top:var(--sp-3);"></div>
        <div class="skeleton skel-line" style="width:80%;"></div>
        <div style="display:flex;gap:var(--sp-2);margin-top:var(--sp-3);">
          <div class="skeleton skel-line" style="flex:1;height:32px;border-radius:var(--r-sm);margin-bottom:0;"></div>
          <div class="skeleton skel-line" style="flex:1;height:32px;border-radius:var(--r-sm);margin-bottom:0;"></div>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderPlayerGrid(container, players) {
  if (!players.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♟</div>
        <div class="empty-title">Nenhum jogador ainda</div>
        <div class="empty-desc">Adicione grandes mestres à sua biblioteca.</div>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="players-grid">${players.map(p => renderPlayerCard(p)).join('')}</div>`;
}

function renderPlayerCard(p) {
  const photoEl = p.photo
    ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
    : `<span style="font-size:26px;">${p.avatar || '♟'}</span>`;

  return `
  <div class="player-card fade-up" onclick="openPlayerDetail(${p.id})">
    <div class="player-card-hero">
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1f3c,#0e1628);opacity:0.7;"></div>
    </div>
    <div class="player-card-body">
      <div style="display:flex;gap:var(--sp-3);align-items:flex-start;margin-top:-28px;margin-bottom:var(--sp-3);">
        <div class="player-photo">${photoEl}</div>
        <div style="margin-top:32px;flex:1;min-width:0;">
          <div class="player-name truncate">${p.name}</div>
          <div class="player-country">${p.flag} ${p.country}
            ${p.worldChamp ? '<span class="badge badge-amber" style="margin-left:4px;">World Champ</span>' : ''}
          </div>
        </div>
      </div>

      <div class="player-rating-row">
        <div>
          <div class="player-rating-val">${p.rating.toLocaleString()}</div>
          <div class="player-rating-label">FIDE Rating</div>
        </div>
        <span class="badge badge-muted">${p.title}</span>
      </div>

      <div class="player-desc">${p.style}</div>

      <div class="player-card-footer">
        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openPlayerDetail(${p.id})">
          Ver Detalhes
        </button>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openAddGameForPlayer(${p.id}, '${p.name.replace(/'/g,"\\'")}')">
          + Partida
        </button>
      </div>
    </div>
  </div>`;
}

// ── PLAYER DETAIL ───────────────────────────────────────────────────────────

async function openPlayerDetail(playerId) {
  PlayersState.currentPlayerId = playerId;

  const container = document.getElementById('player-detail-body');
  if (!container) return;

  container.innerHTML = `<div style="display:flex;justify-content:center;padding:var(--sp-12);">
    <div class="spinner" style="width:32px;height:32px;border-width:3px;"></div></div>`;

  showSection('player-detail');
  document.getElementById('topbar-title').textContent = 'Carregando...';

  try {
    const p = await MockDataService.getPlayer(playerId);

    document.getElementById('topbar-title').textContent = p.name;

    const photoEl = p.photo
      ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span style="font-size:52px;">${p.avatar || '♟'}</span>`;

    container.innerHTML = `
      <!-- HERO -->
      <div class="player-detail-hero fade-up">
        <div class="player-detail-photo">${photoEl}</div>

        <div>
          <div class="player-detail-name">${p.name}
            ${p.worldChamp ? '<span class="badge badge-amber" style="margin-left:8px;font-size:13px;">♛ World Champion</span>' : ''}
          </div>
          <div class="player-detail-meta">
            <span style="font-size:var(--text-sm);color:var(--ink-3);">${p.flag} ${p.country}</span>
            <span class="badge badge-muted">${p.title}</span>
            <span style="font-size:var(--text-sm);color:var(--ink-3);">Born ${p.born}</span>
          </div>
          <div class="player-detail-bio">${p.bio}</div>
        </div>

        <div class="player-detail-stats">
          <div class="stat-card">
            <div class="stat-label">FIDE Rating</div>
            <div class="stat-value" style="color:var(--amber);">${p.rating.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Peak Rating</div>
            <div class="stat-value">${p.peakRating.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Win Rate</div>
            <div class="stat-value">${p.stats.winRate}%</div>
          </div>
        </div>
      </div>

      <!-- STATS ROW -->
      <div class="grid-4 fade-up" style="margin-bottom:var(--sp-6);">
        <div class="stat-card">
          <div class="stat-label">Títulos Mundiais</div>
          <div class="stat-value">${p.stats.titles}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Torneios</div>
          <div class="stat-value">${p.stats.tournaments}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Vitórias</div>
          <div class="stat-value">${p.stats.winRate}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Empates</div>
          <div class="stat-value">${p.stats.drawRate}%</div>
        </div>
      </div>

      <!-- OPENINGS -->
      <div class="card fade-up" style="padding:var(--sp-5);margin-bottom:var(--sp-6);">
        <h3 style="font-size:var(--text-lg);font-weight:var(--fw-bold);margin-bottom:var(--sp-4);">
          Aberturas Favoritas
        </h3>
        <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;">
          ${p.openings.map(o => `<span class="badge badge-blue" style="font-size:var(--text-sm);padding:6px 14px;">${o}</span>`).join('')}
        </div>
      </div>

      <!-- PARTIDAS DO JOGADOR -->
      <div class="fade-up">
        <div class="section-header">
          <div>
            <div class="section-title">Partidas</div>
            <div class="section-subtitle">Partidas vinculadas a ${p.name}</div>
          </div>
          <button class="btn btn-primary" onclick="openAddGameForPlayer(${p.id}, '${p.name.replace(/'/g,"\\'")}')">
            + Adicionar Partida
          </button>
        </div>
        <div class="empty-state" style="padding:var(--sp-10) var(--sp-6);">
          <div class="empty-icon">♟</div>
          <div class="empty-title">Nenhuma partida vinculada</div>
          <div class="empty-desc">Adicione partidas de ${p.name} para acompanhar seu repertório.</div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <div class="empty-title">Erro ao carregar</div>
      <div class="empty-desc">${err.message}</div>
    </div>`;
  }
}

function openAddGameForPlayer(playerId, playerName) {
  // Abre o modal de nova partida e pré-preenche o campo
  const nameInput = document.getElementById('new-game-nome');
  if (nameInput) nameInput.value = `${playerName} - `;
  openNewGameModal();
}

// ── MODAL DE ADICIONAR JOGADOR ───────────────────────────────────────────────

function openAddPlayerModal() {
  // Reset state
  PlayersState.selectedAvatarEmoji = null;
  PlayersState.selectedAvatarMode = 'default';
  PlayersState.selectedPhotoIndex = null;
  PlayersState.searchResults = [];

  // Render tab default
  switchPlayerPhotoTab('default');

  document.getElementById('add-player-overlay').classList.add('visible');
  document.getElementById('player-name-input').focus();
}

function closeAddPlayerModal() {
  document.getElementById('add-player-overlay').classList.remove('visible');
}

function switchPlayerPhotoTab(tab) {
  PlayersState.selectedAvatarMode = tab;

  document.querySelectorAll('.player-photo-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));

  const defaultPanel = document.getElementById('photo-default-panel');
  const searchPanel = document.getElementById('photo-search-panel');

  if (tab === 'default') {
    defaultPanel.style.display = 'block';
    searchPanel.style.display = 'none';
    renderAvatarGallery();
  } else {
    defaultPanel.style.display = 'none';
    searchPanel.style.display = 'block';
  }
}

function renderAvatarGallery() {
  const container = document.getElementById('avatar-gallery');
  if (!container) return;
  container.innerHTML = DEFAULT_AVATARS.map((emoji, i) => `
    <div class="avatar-option ${PlayersState.selectedAvatarEmoji === emoji ? 'selected' : ''}"
         onclick="selectDefaultAvatar('${emoji}', this)">
      ${emoji}
    </div>`).join('');
}

function selectDefaultAvatar(emoji, el) {
  PlayersState.selectedAvatarEmoji = emoji;
  document.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

async function searchPlayerPhotos() {
  const query = document.getElementById('player-photo-search').value.trim();
  if (!query) return;

  const container = document.getElementById('photo-search-results');
  container.innerHTML = `<div style="text-align:center;padding:var(--sp-8);">
    <div class="spinner" style="margin:0 auto;width:24px;height:24px;"></div>
    <p style="color:var(--ink-4);font-size:var(--text-xs);margin-top:var(--sp-3);">Buscando imagens...</p>
  </div>`;

  try {
    const results = await MockDataService.searchPlayerPhotos(query);
    PlayersState.searchResults = results;

    container.innerHTML = `<div class="img-search-grid">
      ${results.map((emoji, i) => `
        <div class="img-search-item ${PlayersState.selectedPhotoIndex === i ? 'selected' : ''}"
             onclick="selectPlayerPhoto(${i}, this)" title="Selecionar">
          <span style="font-size:36px;">${emoji}</span>
        </div>`).join('')}
    </div>`;
  } catch (err) {
    container.innerHTML = `<p style="color:var(--ink-4);font-size:var(--text-sm);text-align:center;padding:var(--sp-8);">${err.message}</p>`;
  }
}

function selectPlayerPhoto(index, el) {
  PlayersState.selectedPhotoIndex = index;
  document.querySelectorAll('.img-search-item').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

async function handleAddPlayerSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('player-name-input').value.trim();
  const country = document.getElementById('player-country-input').value.trim();
  const rating  = parseInt(document.getElementById('player-rating-input').value) || 2500;
  const style   = document.getElementById('player-style-input').value.trim();

  if (!name) { showToast('Nome é obrigatório', 'error'); return; }

  // Determinar avatar
  let avatar = '♟';
  if (PlayersState.selectedAvatarMode === 'default' && PlayersState.selectedAvatarEmoji) {
    avatar = PlayersState.selectedAvatarEmoji;
  } else if (PlayersState.selectedAvatarMode === 'search' && PlayersState.selectedPhotoIndex !== null) {
    avatar = PlayersState.searchResults[PlayersState.selectedPhotoIndex] || '♟';
  }

  const newPlayer = {
    id: Date.now(),
    name, country: country || 'Desconhecido', flag: '🌍',
    rating, peakRating: rating,
    title: 'FM', worldChamp: false,
    style: style || 'Universal',
    born: 1990, photo: null, avatar,
    bio: `${name} é um jogador de xadrez com rating ${rating}.`,
    stats: { titles: 0, tournaments: 0, winRate: 40, drawRate: 40 },
    openings: [],
  };

  PlayersState.list.push(newPlayer);

  closeAddPlayerModal();
  showToast(`${name} adicionado com sucesso!`, 'success');

  // Rerender grid
  const container = document.getElementById('players-list');
  if (container) renderPlayerGrid(container, PlayersState.list);
}
