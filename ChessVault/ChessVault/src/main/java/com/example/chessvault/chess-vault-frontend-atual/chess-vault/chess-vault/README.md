# Chess Vault

Biblioteca pessoal de xadrez — livros, vídeos, partidas, jogadores, puzzles e aberturas,
com autenticação real via backend Spring Boot (JWT) e um viewer de partidas com motor
de xadrez próprio.

## Como rodar

É um frontend estático puro (HTML/CSS/JS, sem build step). Basta servir a pasta:

```bash
cd chess-vault
python3 -m http.server 8080
# abra http://localhost:8080
```

## Estrutura

```
chess-vault/
├── index.html              # shell da app (tela de auth + app)
├── css/
│   ├── tokens.css          # cores, espaçamento, tipografia (design tokens)
│   ├── base.css            # reset + estilos base
│   ├── layout.css          # sidebar, topbar, grid geral
│   ├── components.css      # botões, inputs, modais, badges, toast...
│   ├── auth.css            # tela de login/cadastro
│   ├── modules.css         # livros, vídeos, partidas, jogadores, puzzles, aberturas
│   └── styles.css          # agrega todos os arquivos acima
└── js/
    ├── config.js            # endpoints da API, chaves de storage, mensagens
    ├── api.js                # cliente HTTP fino (injeta Bearer token, normaliza erros)
    ├── utils.js              # log/erro, validação, toast, troca de tela/seção
    ├── auth.js               # login, registro, logout — fala com o backend Spring Boot
    ├── chess-engine.js       # motor de xadrez (validação de lances) + parser de PGN
    ├── mockDataService.js    # dados de estudo (livros, partidas reais, jogadores, puzzles, aberturas)
    ├── players.js            # seção Jogadores (grid, detalhe, modal de adicionar)
    ├── viewer.js              # viewer de partida (tabuleiro interativo lance a lance)
    ├── books.js / videos.js / games.js / puzzles.js / openings.js   # renderização de cada seção
    ├── app.js                 # roteamento SPA + inicialização
    └── vendor/
        └── pgn-parser.umd.js  # @mliebelt/pgn-parser vendorizado (parser de PGN via gramática PEG)
```

## Autenticação (backend Spring Boot)

`js/config.js` aponta para `http://localhost:8080/api/v1` por padrão — ajuste
`CONFIG.API_BASE_URL` para a URL do seu backend.

Endpoints esperados:

| Método | Rota            | Body                          | Resposta                        |
|--------|-----------------|--------------------------------|----------------------------------|
| POST   | `/auth/register`| `{ nome, email, senha }`      | `201`                            |
| POST   | `/auth/login`    | `{ email, senha }`            | `{ token, nome, email }`         |

O token JWT é salvo em `localStorage` e enviado como `Authorization: Bearer <token>`
em toda chamada subsequente (`js/api.js`). Em qualquer resposta `401` fora do fluxo
de login/registro, o token é limpo automaticamente (sessão expirada).

## Motor de xadrez + PGN

O parser de PGN antigo (regex "artesanal") quebrava com PGN sem espaço entre lances.
Foi substituído por [`@mliebelt/pgn-parser`](https://www.npmjs.com/package/@mliebelt/pgn-parser),
que usa uma gramática PEG (via Peggy) para reconhecer a estrutura formal do PGN — mais
robusto que casar padrões de texto. A biblioteca está vendorizada em
`js/vendor/pgn-parser.umd.js` (não depende de CDN externo).

`parsePGN()` em `js/chess-engine.js` é só um wrapper fino sobre a lib — todo o resto
do motor (`goToMove`, `algebraicToMove`, `vApplyMove`...) continua chamando a mesma
função de sempre.

As partidas incluídas em `mockDataService.js` têm PGN verificado contra fonte primária
(chessgames.com / cobertura jornalística da época) e foram re-simuladas lance a lance
no próprio motor antes do envio — garantindo que o viewer nunca trava no meio de uma
partida por um lance ilegal.

## Seção "Partidas" e Chess.com API

`js/games.js` busca o perfil público de Magnus Carlsen na
[Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api)
(`GET /pub/player/{username}`) para exibir título, localização e rating em tempo real.
Como esse endpoint não envia cabeçalhos CORS para todas as origens, o código já trata
o cenário de falha (rate limit, CORS, offline) e cai num fallback estático — a UI nunca
quebra, só mostra um badge indicando a fonte dos dados (ao vivo vs. local).

## Próximos passos sugeridos

- Trocar `MockDataService` por chamadas reais a `/api/v1/books`, `/api/v1/videos`,
  `/api/v1/games` (os endpoints já estão mapeados em `config.js`).
- Modal real de "Importar PGN" em `games.js` (`openNewGameModal` é hoje um placeholder).
- Paginação/infinite scroll nas grids quando os dados vierem do backend.
