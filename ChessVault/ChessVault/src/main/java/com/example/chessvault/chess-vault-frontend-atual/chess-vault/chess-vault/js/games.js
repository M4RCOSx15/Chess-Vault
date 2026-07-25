// js/games.js - Seção "Partidas"

// Placeholder para o botão de importar/adicionar partida — abrir modal real fica para uma
// próxima iteração; por ora só sinaliza a intenção (mesmo padrão do restante do protótipo).
function openNewGameModal() {
  showToast('Importar PGN em breve!', 'info');
}

async function renderGames() {
  const area = document.getElementById('content-area');
  area.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>Carregando perfil de Magnus Carlsen via Chess.com Published-Data API…</div>
    </div>
  `;

  // ── Chess.com Published-Data API ────────────────────────────
  // Endpoint: GET https://api.chess.com/pub/player/{username}
  // Campos extraídos conforme documentação oficial:
  //   name, title, location, avatar, fide, followers, status
  //
  // Tratamento de erros: 429 (rate limit), CORS/offline, campo ausente
  // → sempre cai num fallback estático para não quebrar a UI.
  // ────────────────────────────────────────────────────────────
  const CARLSEN_USERNAME = 'MagnusCarlsen';
  const CARLSEN_FALLBACK = {
    name: 'Magnus Carlsen', title: 'GM', location: 'Tønsberg, Norway',
    avatar: '', fide: 2830, followers: 0, status: 'premium',
  };

  let playerInfo = null;
  let apiStatus  = '';

  try {
    const res = await fetch(
      `https://api.chess.com/pub/player/${CARLSEN_USERNAME}`,
      { headers: { 'User-Agent': 'ChessVault/1.0 (estudo pessoal)' } }
    );

    if (res.status === 429) {
      apiStatus = 'rate-limited';
      playerInfo = CARLSEN_FALLBACK;
    } else if (res.ok) {
      const data = await res.json();
      playerInfo = {
        name: data.name || CARLSEN_FALLBACK.name,
        title: data.title || CARLSEN_FALLBACK.title,
        location: data.location || CARLSEN_FALLBACK.location,
        avatar: data.avatar || CARLSEN_FALLBACK.avatar,
        fide: data.fide || CARLSEN_FALLBACK.fide,
        followers: data.followers || CARLSEN_FALLBACK.followers,
        status: data.status || CARLSEN_FALLBACK.status,
        url: data.url || `https://www.chess.com/member/${CARLSEN_USERNAME}`,
      };
      apiStatus = 'live';
    } else {
      apiStatus  = `http-${res.status}`;
      playerInfo = CARLSEN_FALLBACK;
    }
  } catch (e) {
    apiStatus  = 'offline';
    playerInfo = CARLSEN_FALLBACK;
  }

  const games = await MockDataService.getGames();

  function resultBadge(r) {
    if (r === '1-0') return `<span class="result-badge result-white">1–0</span>`;
    if (r === '0-1') return `<span class="result-badge result-black">0–1</span>`;
    return `<span class="result-badge result-draw">½–½</span>`;
  }

  const apiStatusBadge = {
    'live':         `<span class="badge badge-green">● API ao vivo</span>`,
    'rate-limited': `<span class="badge badge-amber">⚠ Rate limit (429) — dados locais</span>`,
    'offline':      `<span class="badge badge-muted">⚡ Offline — dados locais</span>`,
  }[apiStatus] || `<span class="badge badge-muted">⚡ Erro ${apiStatus} — dados locais</span>`;

  const fideDisplay = playerInfo.fide ? `FIDE ${playerInfo.fide}` : 'FIDE 2830';
  const followDisplay = playerInfo.followers ? `${playerInfo.followers.toLocaleString('pt-BR')} seguidores` : '';

  const playerBio = `
    <div class="card fade-up" style="display:flex;align-items:center;gap:var(--sp-4);padding:var(--sp-4) var(--sp-5);margin-bottom:var(--sp-6);">
      <img class="avatar avatar-lg" src="${playerInfo.avatar || ''}" onerror="this.style.display='none'" alt="Magnus Carlsen" />
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div style="font-size:var(--text-md);font-weight:var(--fw-bold);color:var(--ink);">${playerInfo.name}</div>
          <span class="badge badge-amber">${playerInfo.title}</span>
          ${apiStatusBadge}
        </div>
        <div style="font-size:var(--text-xs);color:var(--ink-3);margin-top:2px;">
          ${playerInfo.location}${fideDisplay ? ' · ' + fideDisplay : ''}${followDisplay ? ' · ' + followDisplay : ''}
        </div>
        <div style="font-size:11px;color:var(--ink-4);margin-top:4px;">
          Chess.com Published-Data API ·
          <a href="${playerInfo.url || 'https://www.chess.com/member/MagnusCarlsen'}" target="_blank">ver perfil ↗</a>
        </div>
      </div>
    </div>
  `;

  const winsAsCarlsen = games.filter(g =>
    (g.result === '1-0' && g.white.includes('Carlsen')) ||
    (g.result === '0-1' && g.black.includes('Carlsen'))
  ).length;

  const yearsSet = new Set(games.map(g => g.year));
  const yearRange = `${Math.min(...yearsSet)}–${Math.max(...yearsSet)}`;

  const cardsHtml = games.map(g => `
    <div class="game-card fade-up" onclick="openGame('${g.id}')">
      <div class="game-card-top">
        <div class="game-card-title">${g.event}</div>
        ${resultBadge(g.result)}
      </div>
      <div class="game-card-players">
        <span class="game-player">${g.white}</span>
        <span class="game-vs">vs</span>
        <span class="game-player">${g.black}</span>
      </div>
      <div class="game-card-meta">
        <span class="tag">${g.eco}</span>
        <span class="game-meta-item">📍 ${g.location}, ${g.year}</span>
        <span class="game-meta-item">${(g.pgn.match(/\d+\./g) || []).length} lances</span>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="fade-up">
      <div class="grid-3" style="margin-bottom:var(--sp-6);">
        <div class="stat-card"><div class="stat-label">Partidas salvas</div><div class="stat-value">${games.length}</div><div class="stat-sub">de Magnus Carlsen</div></div>
        <div class="stat-card"><div class="stat-label">Vitórias</div><div class="stat-value">${winsAsCarlsen}</div><div class="stat-sub">como Carlsen</div></div>
        <div class="stat-card"><div class="stat-label">Período</div><div class="stat-value">${yearRange}</div><div class="stat-sub">partidas clássicas OTB</div></div>
      </div>
      ${playerBio}
      <div class="section-header">
        <div>
          <div class="section-title">Partidas de Carlsen <span class="badge badge-muted">${games.length}</span></div>
          <div class="section-subtitle">Clique em uma partida para reproduzi-la lance a lance</div>
        </div>
      </div>
      <div class="games-grid">${cardsHtml}</div>
    </div>
  `;
}
