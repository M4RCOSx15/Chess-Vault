# Chess Vault Frontend - Estrutura Profissional

```
chess-vault-frontend/
│
├── index.html                    ← HTML principal (semântico, sem CSS/JS inline)
├── package.json                  ← Dependências (se usar bundler)
├── README.md                     ← Documentação do frontend
│
├── 📁 css/                       ← Estilos organizados em camadas
│   ├── variables.css             ← Cores, tipografia, dimensões
│   ├── base.css                  ← Reset, html, body, global
│   ├── layout.css                ← Sidebar, main, topbar, grid
│   ├── components.css            ← Botões, inputs, cards, badges
│   ├── auth.css                  ← Tela de login/register
│   ├── dashboard.css             ← Stats, gráficos, widgets
│   ├── games-list.css            ← Tabela de partidas
│   ├── games-viewer.css          ← Tabuleiro, movimentos, PGN
│   ├── books.css                 ← Grid de livros
│   ├── videos.css                ← Grid de vídeos
│   ├── modals.css                ← Diálogos e overlays
│   ├── responsive.css            ← Media queries
│   └── styles.css                ← Arquivo principal (importa todos)
│
├── 📁 js/                        ← JavaScript em módulos
│   ├── config.js                 ← Constantes, endpoints, settings
│   ├── utils.js                  ← Funções auxiliares genéricas
│   ├── api.js                    ← Cliente HTTP (requisições ao backend)
│   ├── auth.js                   ← Login, register, logout, tokens
│   ├── storage.js                ← LocalStorage (cache, preferências)
│   ├── ui.js                     ← Funções de manipulação do DOM
│   ├── navigation.js             ← Sidebar, roteamento, abas
│   ├── dashboard.js              ← Carregar e renderizar dashboard
│   ├── games.js                  ← CRUD de partidas (listar, criar, editar)
│   ├── games-import.js           ← Importar PGN, integrar Chess.com
│   ├── games-viewer.js           ← Visualizador (tabuleiro + movimentos)
│   ├── chess-engine.js           ← Lógica de xadrez (movimentos legais, etc)
│   ├── books.js                  ← Carregar e renderizar livros
│   ├── videos.js                 ← Carregar e renderizar vídeos
│   ├── modals.js                 ← Gerenciar diálogos
│   ├── notifications.js          ← Toast, alertas, confirmações
│   └── main.js                   ← Inicialização da app
│
├── 📁 assets/                    ← Recursos estáticos
│   ├── 📁 icons/                 ← SVGs (chevron, star, search, etc)
│   ├── 📁 fonts/                 ← Fontes customizadas (@font-face)
│   └── 📁 images/                ← Imagens (logo, backgrounds)
│
└── 📁 pages/                     ← Componentes de página (opcional)
    ├── auth-page.html            ← Login/Register (se usar template)
    ├── dashboard-page.html
    ├── games-page.html
    └── books-page.html
```

---

## 📊 Mapeamento do Código Antigo → Novo

| Responsabilidade | Antes (HTML) | Depois (Arquivo JS) |
|-----------------|-------------|-------------------|
| Autenticação | `<script>` inline | `js/auth.js` |
| Requisições HTTP | `<script>` inline | `js/api.js` |
| Manipulação DOM | `<script>` inline | `js/ui.js` |
| Navegação/Abas | `<script>` inline | `js/navigation.js` |
| Lógica de Xadrez | `<script>` inline | `js/chess-engine.js` |
| Tabuleiro/Viewer | `<script>` inline | `js/games-viewer.js` |
| Estilos | `<style>` inline | `css/*.css` |
| Variáveis CSS | `<style>` inline | `css/variables.css` |

---

## 🎯 Benefícios da Reorganização

✅ **Manutenibilidade**: Cada arquivo tem uma responsabilidade única  
✅ **Reutilização**: Funções podem ser importadas por múltiplos arquivos  
✅ **Testabilidade**: Fácil testar funções isoladas  
✅ **Performance**: CSS crítico pode ser inlined, rest defer/async  
✅ **Escalabilidade**: Pronto para adicionar novos módulos  
✅ **Debugging**: Stack traces mais claros  
✅ **Versionamento**: Fácil rastrear mudanças  

