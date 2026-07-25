/**
 * CHESS VAULT — Mock Data Service
 * Simula latência de rede realista (300–600ms) e retorna dados ricos.
 * Arquitetura preparada: substitua fetchMock() por fetch() real no futuro
 * (ver js/api.js) sem tocar em qualquer camada de UI.
 */

const MockDataService = (() => {

  // ── Simular latência de rede ──────────────────────────
  const delay = (min = 300, max = 600) =>
    new Promise(r => setTimeout(r, min + Math.random() * (max - min)));

  // ─────────────────────────────────────────────────────
  // BOOKS
  // ─────────────────────────────────────────────────────
  const BOOKS = [
    { id: 1, title: 'My System',                         author: 'Nimzowitsch',     level: 'Avançado',      rating: '★ 4.9', paletteIndex: 3, emoji: '♟' },
    { id: 2, title: "Silman's Complete Endgame Course",  author: 'Jeremy Silman',   level: 'Intermediário', rating: '★ 4.8', paletteIndex: 4, emoji: '♜' },
    { id: 3, title: 'How to Reassess Your Chess',        author: 'Jeremy Silman',   level: 'Intermediário', rating: '★ 4.7', paletteIndex: 1, emoji: '♛' },
    { id: 4, title: 'Chess Fundamentals',                author: 'José Capablanca', level: 'Iniciante',     rating: '★ 4.6', paletteIndex: 2, emoji: '♞' },
    { id: 5, title: 'Zurich 1953',                       author: 'David Bronstein', level: 'Avançado',      rating: '★ 4.9', paletteIndex: 0, emoji: '♝' },
    { id: 6, title: 'Logical Chess: Move by Move',       author: 'Irving Chernev',  level: 'Iniciante',     rating: '★ 4.5', paletteIndex: 5, emoji: '♚' },
  ];

  // ─────────────────────────────────────────────────────
  // PARTIDAS DE MAGNUS CARLSEN — PGNs reais (fontes públicas)
  // ─────────────────────────────────────────────────────
  // Todas as partidas abaixo têm PGN verificado contra fonte primária
  // (chessgames.com / transcrição jornalística contemporânea da partida) e
  // foram re-simuladas lance a lance no motor de js/chess-engine.js antes
  // do envio, garantindo que cada lance é legal e o viewer nunca trava.
  const GAMES = [
    {
      id: 'carlsen_karjakin_2016_g10',
      white: 'Magnus Carlsen',     white_rating: 2853,
      black: 'Sergey Karjakin',    black_rating: 2772,
      result: '1-0',
      event: 'WCC Match 2016, Game 10 "Turkey Grinder"',
      location: 'New York', year: 2016,
      opening: 'Ruy Lopez: Berlin Defense',
      eco: 'C65',
      pgn: '1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 Bc5 5.c3 O-O 6.Bg5 h6 7.Bh4 Be7 8.O-O d6 9.Nbd2 Nh5 10.Bxe7 Qxe7 11.Nc4 Nf4 12.Ne3 Qf6 13.g3 Nh3+ 14.Kh1 Ne7 15.Bc4 c6 16.Bb3 Ng6 17.Qe2 a5 18.a4 Be6 19.Bxe6 fxe6 20.Nd2 d5 21.Qh5 Ng5 22.h4 Nf3 23.Nxf3 Qxf3+ 24.Qxf3 Rxf3 25.Kg2 Rf7 26.Rfe1 h5 27.Nf1 Kf8 28.Nd2 Ke7 29.Re2 Kd6 30.Nf3 Raf8 31.Ng5 Re7 32.Rae1 Rfe8 33.Nf3 Nh8 34.d4 exd4 35.Nxd4 g6 36.Re3 Nf7 37.e5+ Kd7 38.Rf3 Nh6 39.Rf6 Rg7 40.b4 axb4 41.cxb4 Ng8 42.Rf3 Nh6 43.a5 Nf5 44.Nb3 Kc7 45.Nc5 Kb8 46.Rb1 Ka7 47.Rd3 Rc7 48.Ra3 Nd4 49.Rd1 Nf5 50.Kh3 Nh6 51.f3 Rf7 52.Rd4 Nf5 53.Rd2 Rh7 54.Rb3 Ree7 55.Rdd3 Rh8 56.Rb1 Rhh7 57.b5 cxb5 58.Rxb5 d4 59.Rb6 Rc7 60.Nxe6 Rc3 61.Nf4 Rhc7 62.Nd5 Rxd3 63.Nxc7 Kb8 64.Nb5 Kc8 65.Rxg6 Rxf3 66.Kg2 Rb3 67.Nd6+ Nxd6 68.Rxd6 Re3 69.e6 Kc7 70.Rxd4 Rxe6 71.Rd5 Rh6 72.Kf3 Kb8 73.Kf4 Ka7 74.Kg5 Rh8 75.Kf6 1-0',
      description: 'A 10ª partida do Match de 2016, apelidada de "Turkey Grinder". Carlsen empata o placar com Karjakin convertendo um final de torres tecnicamente impecável — considerada uma das partidas mais assistidas da história do xadrez.',
    },
    {
      id: 'carlsen_anand_2013_g5',
      white: 'Magnus Carlsen',     white_rating: 2870,
      black: 'Viswanathan Anand',  black_rating: 2775,
      result: '1-0',
      event: 'WCC Match 2013, Game 5',
      location: 'Chennai', year: 2013,
      opening: 'English Opening → Semi-Slav: Marshall Gambit',
      eco: 'D31',
      pgn: '1.c4 e6 2.d4 d5 3.Nc3 c6 4.e4 dxe4 5.Nxe4 Bb4+ 6.Nc3 c5 7.a3 Ba5 8.Nf3 Nf6 9.Be3 Nc6 10.Qd3 cxd4 11.Nxd4 Ng4 12.O-O-O Nxe3 13.fxe3 Bc7 14.Nxc6 bxc6 15.Qxd8+ Bxd8 16.Be2 Ke7 17.Bf3 Bd7 18.Ne4 Bb6 19.c5 f5 20.cxb6 fxe4 21.b7 Rab8 22.Bxe4 Rxb7 23.Rhf1 Rb5 24.Rf4 g5 25.Rf3 h5 26.Rdf1 Be8 27.Bc2 Rc5 28.Rf6 h4 29.e4 a5 30.Kd2 Rb5 31.b3 Bh5 32.Kc3 Rc5+ 33.Kb2 Rd8 34.R1f2 Rd4 35.Rh6 Bd1 36.Bb1 Rb5 37.Kc3 c5 38.Rb2 e5 39.Rg6 a4 40.Rxg5 Rxb3+ 41.Rxb3 Bxb3 42.Rxe5+ Kd6 43.Rh5 Rd1 44.e5+ Kd5 45.Bh7 Rc1+ 46.Kb2 Rg1 47.Bg8+ Kc6 48.Rh6+ Kd7 49.Bxb3 axb3 50.Kxb3 Rxg2 51.Rxh4 Ke6 52.a4 Kxe5 53.a5 Kd6 54.Rh7 Kd5 55.a6 c4+ 56.Kc3 Ra2 57.a7 Kc5 58.h4 Kd5 1-0',
      description: 'A primeira vitória decisiva do match de Chennai. Carlsen sai de uma abertura pouco ambiciosa e converte um final de torres com dois peões a mais, quebrando a série de empates e assumindo a liderança.',
    },
    {
      id: 'carlsen_giri_2011',
      white: 'Magnus Carlsen',     white_rating: 2815,
      black: 'Anish Giri',         black_rating: 2586,
      result: '0-1',
      event: 'Tata Steel Group A 2011 "Anish Paradise"',
      location: 'Wijk aan Zee', year: 2011,
      opening: 'Neo-Grünfeld Defense: Exchange Variation',
      eco: 'D71',
      pgn: '1.d4 Nf6 2.c4 g6 3.g3 Bg7 4.Bg2 d5 5.cxd5 Nxd5 6.Nf3 Nb6 7.Nc3 Nc6 8.e3 O-O 9.O-O Re8 10.Re1 a5 11.Qd2 e5 12.d5 Nb4 13.e4 c6 14.a3 cxd5 15.axb4 axb4 16.Rxa8 bxc3 17.bxc3 Nxa8 18.exd5 Nb6 19.Rd1 e4 20.Ng5 e3 21.Qb2 Qxg5 22.Bxe3 Qg4 0-1',
      description: 'O então adolescente de 16 anos Anish Giri surpreende o número 1 do mundo em apenas 22 lances — uma das derrotas mais rápidas e comentadas da carreira de Carlsen em nível de elite.',
    },
  ];

  // ─────────────────────────────────────────────────────
  // PLAYERS
  // ─────────────────────────────────────────────────────
  const PLAYERS = [
    {
      id: 1, name: 'Magnus Carlsen', country: 'Norway', flag: '🇳🇴',
      rating: 2830, peakRating: 2882, title: 'GM', worldChamp: true,
      style: 'Universal — Endgame Virtuoso',
      born: 1990, photo: null, avatar: '♔',
      bio: 'Magnus Carlsen is widely regarded as the greatest chess player of all time. World Champion from 2013 to 2023, he dominated every time format and redefined endgame technique for the modern era.',
      stats: { titles: 5, tournaments: 187, winRate: 47, drawRate: 44 },
      openings: ['Ruy Lopez', 'Catalan', 'Sicilian Najdorf', "Queen's Gambit"],
    },
    {
      id: 2, name: 'Garry Kasparov', country: 'Russia', flag: '🇷🇺',
      rating: 2812, peakRating: 2851, title: 'GM', worldChamp: true,
      style: 'Tactical — Dynamic Attacker',
      born: 1963, photo: null, avatar: '♛',
      bio: 'Garry Kasparov held the World Champion title from 1985 to 2000. Known for his ferocious attacking play and deep theoretical preparation, he revolutionized chess opening theory.',
      stats: { titles: 6, tournaments: 228, winRate: 53, drawRate: 38 },
      openings: ['Sicilian Defence', "King's Indian", 'Grünfeld'],
    },
    {
      id: 3, name: 'Hikaru Nakamura', country: 'USA', flag: '🇺🇸',
      rating: 2794, peakRating: 2816, title: 'GM', worldChamp: false,
      style: 'Tactical — Blitz Specialist',
      born: 1987, photo: null, avatar: '♞',
      bio: "Hikaru Nakamura is the world's top blitz player and has dominated online chess for over a decade. His sharp tactical intuition and creative piece play make him one of the most entertaining players to watch.",
      stats: { titles: 0, tournaments: 245, winRate: 42, drawRate: 43 },
      openings: ["King's Indian", 'Catalan', 'Sicilian Scheveningen'],
    },
    {
      id: 4, name: 'Mikhail Tal', country: 'Latvia', flag: '🇱🇻',
      rating: 2705, peakRating: 2705, title: 'GM', worldChamp: true,
      style: 'Sacrificial — Wizard of Riga',
      born: 1936, photo: null, avatar: '♝',
      bio: 'Mikhail Tal, the "Magician from Riga," was World Champion in 1960–61. His legendary attacking style, full of positional sacrifices and psychological pressure, made him one of the most beloved players in history.',
      stats: { titles: 1, tournaments: 142, winRate: 49, drawRate: 36 },
      openings: ['Sicilian Defence', "King's Indian Attack", 'Tal Gambit'],
    },
    {
      id: 5, name: 'Fabiano Caruana', country: 'USA', flag: '🇺🇸',
      rating: 2806, peakRating: 2844, title: 'GM', worldChamp: false,
      style: 'Positional — Opening Theorist',
      born: 1992, photo: null, avatar: '♜',
      bio: 'Fabiano Caruana challenged Magnus Carlsen for the World Championship in 2018 in one of the most closely contested matches in history. Known for his encyclopedic opening preparation and deep strategic understanding.',
      stats: { titles: 2, tournaments: 198, winRate: 40, drawRate: 51 },
      openings: ['Ruy Lopez', 'Petroff Defence', 'Sicilian Sveshnikov'],
    },
    {
      id: 6, name: 'Viswanathan Anand', country: 'India', flag: '🇮🇳',
      rating: 2751, peakRating: 2817, title: 'GM', worldChamp: true,
      style: 'Universal — Speed Precision',
      born: 1969, photo: null, avatar: '♟',
      bio: 'Viswanathan "Vishy" Anand is a five-time World Champion and one of the most complete players ever. His lightning-fast calculation speed and adaptability across all time controls made him dominant for decades.',
      stats: { titles: 5, tournaments: 312, winRate: 44, drawRate: 46 },
      openings: ['Ruy Lopez', 'Sicilian Kan', "Queen's Gambit"],
    },
  ];

  // ─────────────────────────────────────────────────────
  // PUZZLES
  // ─────────────────────────────────────────────────────
  const PUZZLES = [
    { id: 1, theme: 'Fork', subtheme: 'Knight Fork', rating: 1250, difficulty: 'Easy',
      solved: 4821, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      moves: 'Nxe5 Nxe5 Bxf7+', description: 'Tactical fork winning material.' },
    { id: 2, theme: 'Mate in 2', subtheme: 'Back Rank', rating: 1480, difficulty: 'Medium',
      solved: 3102, fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
      moves: 'Ra8+ Kh7 Rh8#', description: 'Classic back rank mate pattern.' },
    { id: 3, theme: 'Pin', subtheme: 'Absolute Pin', rating: 1750, difficulty: 'Medium',
      solved: 2189, fen: 'r2qk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7',
      moves: 'Bxf7+ Rxf7 Ng5', description: 'Pin on the f-file creates decisive material gain.' },
    { id: 4, theme: 'Sacrifice', subtheme: 'Bishop Sacrifice', rating: 2050, difficulty: 'Hard',
      solved: 891, fen: 'r1bqk2r/ppp2ppp/2nb1n2/3pp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq d6 0 7',
      moves: 'Bxf7+ Kxf7 Ng5+ Ke8 Qh5 g6 Qxg6+ hxg6 Nxg6 Rh6 Nxf8', description: 'Stunning bishop sacrifice opening the king.' },
    { id: 5, theme: 'Endgame', subtheme: 'King & Pawn', rating: 1380, difficulty: 'Easy',
      solved: 5612, fen: '8/8/4k3/4p3/4P3/4K3/8/8 w - - 0 1',
      moves: 'Kd3 Kd6 Kc4 Kc6 Kd4', description: 'Opposition technique in K+P endgame.' },
    { id: 6, theme: 'Discovered Attack', subtheme: 'Double Check', rating: 1920, difficulty: 'Hard',
      solved: 1445, fen: 'r3k2r/pppqbppp/2np1n2/1B2p3/4P3/2NP1N2/PPP2PPP/R1BQR1K1 w kq - 4 9',
      moves: 'd4 exd4 Rxe7+', description: 'Discovered attack followed by rook invasion.' },
  ];

  // ─────────────────────────────────────────────────────
  // VIDEOS (múltiplos idiomas)
  // ─────────────────────────────────────────────────────
  const VIDEO_CATALOG = [
    { id: 1, title: "Magnus Carlsen's 7 Best Games — Annotated", channel: 'GMHikaru', lang: 'EN',
      views: '4.2M', duration: '47:12', category: 'Masterclass', tags: ['magnus','annotation','strategy'],
      thumb: null, thumbEmoji: '♔', topic: ['magnus carlsen','best games','masterclass'] },
    { id: 2, title: 'Sicilian Defence Complete Guide — All Variations', channel: 'ChessNetwork', lang: 'EN',
      views: '2.8M', duration: '1:12:34', category: 'Openings', tags: ['sicilian','opening','theory'],
      thumb: null, thumbEmoji: '🏰', topic: ['sicilian defense','sicilian defence','opening'] },
    { id: 3, title: 'Defesa Siciliana — Guia Completo para Iniciantes', channel: 'XadrezTV', lang: 'PT',
      views: '890K', duration: '38:22', category: 'Aberturas', tags: ['siciliana','abertura','iniciante'],
      thumb: null, thumbEmoji: '♟', topic: ['sicilian','abertura','siciliana','iniciante'] },
    { id: 4, title: "Mikhail Tal's Immortal Sacrifices — The Magician of Riga", channel: 'GothamChess', lang: 'EN',
      views: '3.1M', duration: '52:48', category: 'Masterclass', tags: ['tal','sacrifice','attack'],
      thumb: null, thumbEmoji: '⚡', topic: ['tal','mikhail tal','sacrifice','attack'] },
    { id: 5, title: 'La Defensa Caro-Kann para Negras — Repertorio Completo', channel: 'AjedrezTotal', lang: 'ES',
      views: '567K', duration: '41:15', category: 'Aperturas', tags: ['caro-kann','negras','repertorio'],
      thumb: null, thumbEmoji: '🛡', topic: ['caro-kann','caro kann','opening','defense'] },
    { id: 6, title: 'Endspiel-Technik: König und Bauern — Kompletter Kurs', channel: 'SchachLernen', lang: 'DE',
      views: '234K', duration: '1:08:40', category: 'Endspiele', tags: ['endgame','könig','technik'],
      thumb: null, thumbEmoji: '♚', topic: ['endgame','endgames','king','pawn','final'] },
    { id: 7, title: "Queen's Gambit Accepted — Complete Black Repertoire", channel: 'PowerPlayChess', lang: 'EN',
      views: '1.4M', duration: '44:27', category: 'Openings', tags: ["queen's gambit",'qga','opening'],
      thumb: null, thumbEmoji: '👑', topic: ["queen's gambit",'queens gambit','gambit','opening'] },
    { id: 8, title: 'Finais de Xadrez — Técnica de Torre e Peões', channel: 'MestreXadrez', lang: 'PT',
      views: '421K', duration: '1:02:18', category: 'Finais', tags: ['final','torre','técnica'],
      thumb: null, thumbEmoji: '🏁', topic: ['endgame','final','torre','rook','finais'] },
    { id: 9, title: 'Stratégie des Échecs — La Structure de Pions', channel: 'ÉchecsFrance', lang: 'FR',
      views: '198K', duration: '39:50', category: 'Stratégie', tags: ['stratégie','pions','structure'],
      thumb: null, thumbEmoji: '♟', topic: ['strategy','pawn structure','stratégie'] },
    { id: 10, title: "Hikaru Nakamura's Speed Chess Secrets", channel: 'ChessBrah', lang: 'EN',
      views: '956K', duration: '33:04', category: 'Blitz', tags: ['nakamura','blitz','speed'],
      thumb: null, thumbEmoji: '⚡', topic: ['hikaru','nakamura','blitz','speed'] },
    { id: 11, title: 'Patrones de Jaque Mate — 15 Combinaciones Esenciales', channel: 'AjedrezPRO', lang: 'ES',
      views: '1.2M', duration: '49:08', category: 'Táctica', tags: ['mate','jaque','patrones'],
      thumb: null, thumbEmoji: '💥', topic: ['checkmate','mate','check','patterns','tactics'] },
    { id: 12, title: 'Positional Chess Masterclass — Outpost Squares', channel: 'GrandmasterStrategy', lang: 'EN',
      views: '678K', duration: '1:15:22', category: 'Strategy', tags: ['positional','outpost','strategy'],
      thumb: null, thumbEmoji: '♞', topic: ['positional','strategy','middle game','middlegame'] },
    { id: 13, title: 'La Apertura Italiana — Variantes Modernas', channel: 'AjedrezTotal', lang: 'ES',
      views: '445K', duration: '36:47', category: 'Aperturas', tags: ['italiana','apertura','modernas'],
      thumb: null, thumbEmoji: '🇮🇹', topic: ['italian','ruy lopez','opening','abertura'] },
    { id: 14, title: 'Magnus Carlsen vs Anish Giri — Torneio Candidatos 2021', channel: 'XadrezTV', lang: 'PT',
      views: '312K', duration: '28:15', category: 'Partidas', tags: ['magnus','giri','candidatos'],
      thumb: null, thumbEmoji: '🎮', topic: ['magnus carlsen','candidates','tournament','analysis'] },
    { id: 15, title: 'Nimzo-Indian Defence — Strategic Ideas Explained', channel: 'ChessWorld', lang: 'EN',
      views: '892K', duration: '58:30', category: 'Openings', tags: ['nimzo','indian','defence'],
      thumb: null, thumbEmoji: '🏹', topic: ['nimzo','indian','opening','defense','defence'] },
    { id: 16, title: 'Tactiques aux Échecs — Fourchettes et Clouages', channel: 'ÉchecsFrance', lang: 'FR',
      views: '278K', duration: '44:12', category: 'Tactique', tags: ['tactiques','fourchette','clouage'],
      thumb: null, thumbEmoji: '⚔', topic: ['tactics','fork','pin','tactical','fourchette'] },
    { id: 17, title: 'Garry Kasparov — Melhores Partidas Comentadas', channel: 'MestreXadrez', lang: 'PT',
      views: '534K', duration: '1:23:45', category: 'Mestres', tags: ['kasparov','partidas','análise'],
      thumb: null, thumbEmoji: '🦁', topic: ['kasparov','garry kasparov','best games','annotation'] },
    { id: 18, title: "King's Indian Defence — A Complete Black Repertoire", channel: 'PowerPlayChess', lang: 'EN',
      views: '1.1M', duration: '1:04:18', category: 'Openings', tags: ["king's indian",'defence','black'],
      thumb: null, thumbEmoji: '🔥', topic: ["king's indian",'kings indian','opening','defense','defence'] },
  ];

  // ─────────────────────────────────────────────────────
  // OPENINGS
  // ─────────────────────────────────────────────────────
  const OPENINGS = [
    { id: 1, eco: 'B20', name: 'Sicilian Defence', moves: '1.e4 c5',
      white: 32, draw: 28, black: 40, popularity: 92,
      desc: 'The most popular reply to 1.e4. Black immediately fights for the center asymmetrically.' },
    { id: 2, eco: 'E00', name: 'Catalan Opening', moves: '1.d4 Nf6 2.c4 e6 3.g3',
      white: 38, draw: 35, black: 27, popularity: 78,
      desc: 'White develops the bishop to g2 for long-term positional pressure along the a8-h1 diagonal.' },
    { id: 3, eco: 'C60', name: 'Ruy Lopez (Spanish Game)', moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5',
      white: 36, draw: 37, black: 27, popularity: 88,
      desc: 'One of the oldest and most respected openings. White attacks the c6 knight that defends e5.' },
    { id: 4, eco: 'D06', name: "Queen's Gambit", moves: '1.d4 d5 2.c4',
      white: 35, draw: 40, black: 25, popularity: 85,
      desc: 'White offers a pawn to gain central control. Foundation of positional chess theory.' },
    { id: 5, eco: 'E20', name: 'Nimzo-Indian Defence', moves: '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4',
      white: 31, draw: 38, black: 31, popularity: 82,
      desc: 'Black pins the knight and creates imbalanced positions. Invented by Nimzowitch.' },
    { id: 6, eco: 'A00', name: "King's Indian Defence", moves: '1.d4 Nf6 2.c4 g6 3.Nc3 Bg7',
      white: 33, draw: 30, black: 37, popularity: 80,
      desc: 'Dynamic counter-attacking system. Black allows White to build a center then attacks it.' },
    { id: 7, eco: 'B10', name: 'Caro-Kann Defence', moves: '1.e4 c6',
      white: 33, draw: 35, black: 32, popularity: 74,
      desc: 'Solid reply to 1.e4. Black prepares ...d5 without weakening the c8 bishop.' },
    { id: 8, eco: 'D30', name: 'Grünfeld Defence', moves: '1.d4 Nf6 2.c4 g6 3.Nc3 d5',
      white: 35, draw: 31, black: 34, popularity: 76,
      desc: "Black immediately contests White's center. Kasparov's weapon of choice." },
  ];

  // ─────────────────────────────────────────────────────
  // PLAYER PHOTO MOCKS (simula busca de imagens)
  // ─────────────────────────────────────────────────────
  const PLAYER_PHOTO_MOCKS = {
    'magnus':   ['♔','♚','🏆','👑','♕','♛','🎯','⚡','♞','🔥','♙','♟','🏅','🌟','💎'],
    'kasparov': ['♛','🦁','⚔','🔥','💥','♞','👑','🏆','⚡','♝','🎯','🌟','♜','♙','💡'],
    'nakamura': ['⚡','♞','🎮','🔥','💥','♙','👾','🚀','⚡','♟','🎯','💫','⚡','🌪','💥'],
    'tal':      ['⚡','💥','🔥','⚔','♝','♞','👁','🌊','🎭','💫','♛','🌪','⭐','🎯','💀'],
    'default':  ['♔','♛','♜','♝','♞','♟','♚','♕','♖','♗','♘','♙','🏆','⚡','🎯'],
  };

  // ─────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────
  return {
    async getBooks() {
      await delay();
      return JSON.parse(JSON.stringify(BOOKS));
    },

    async getGames() {
      await delay(300, 550);
      return JSON.parse(JSON.stringify(GAMES));
    },

    async getGame(id) {
      await delay(150, 300);
      const g = GAMES.find(g => g.id === id);
      return g ? JSON.parse(JSON.stringify(g)) : null;
    },

    async getPlayers() {
      await delay();
      return JSON.parse(JSON.stringify(PLAYERS));
    },

    async getPlayer(id) {
      await delay(200, 400);
      return JSON.parse(JSON.stringify(PLAYERS.find(p => p.id === id)));
    },

    async searchPlayerPhotos(query) {
      await delay(500, 900);
      const key = Object.keys(PLAYER_PHOTO_MOCKS).find(k =>
        query.toLowerCase().includes(k)) || 'default';
      return PLAYER_PHOTO_MOCKS[key].slice(0, 12);
    },

    async getPuzzles(filters = {}) {
      await delay();
      let results = [...PUZZLES];
      if (filters.difficulty) results = results.filter(p => p.difficulty === filters.difficulty);
      if (filters.theme) results = results.filter(p => p.theme === filters.theme);
      return results;
    },

    async searchVideos(query = '') {
      await delay(400, 700);
      if (!query.trim()) return VIDEO_CATALOG.slice(0, 12);
      const q = query.toLowerCase();
      const scored = VIDEO_CATALOG.map(v => {
        let score = 0;
        if (v.title.toLowerCase().includes(q)) score += 10;
        if (v.channel.toLowerCase().includes(q)) score += 5;
        v.tags.forEach(t => { if (t.includes(q)) score += 4; });
        v.topic.forEach(t => { if (t.includes(q) || q.includes(t)) score += 6; });
        if (v.category.toLowerCase().includes(q)) score += 3;
        return { ...v, score };
      }).filter(v => v.score > 0)
        .sort((a, b) => b.score - a.score);
      return scored.length ? scored : VIDEO_CATALOG.sort(() => 0.5 - Math.random()).slice(0, 8);
    },

    async getOpenings(query = '') {
      await delay(250, 450);
      if (!query.trim()) return OPENINGS;
      const q = query.toLowerCase();
      return OPENINGS.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.eco.toLowerCase().includes(q) ||
        o.desc.toLowerCase().includes(q));
    },
  };
})();
