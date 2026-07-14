# ♚ Chess Vault Frontend

Frontend moderno e organizado para Chess Vault - Biblioteca de Xadrez.

## 📁 Estrutura do Projeto

```
chess-vault-frontend/
├── index.html                ← HTML principal (semântico)
├── package.json             ← Metadados e scripts
├── README.md               ← Este arquivo
│
├── css/                    ← Estilos organizados em camadas
│   ├── variables.css       ← Cores, tipografia, tokens
│   ├── base.css           ← Reset e estilos globais
│   ├── layout.css         ← Sidebar, topbar, grid
│   ├── components.css     ← Botões, cards, forms
│   ├── auth.css           ← Tela de login/register
│   ├── games-list.css     ← Tabela de partidas
│   ├── games-viewer.css   ← Tabuleiro e visualizador
│   ├── modals.css         ← Diálogos
│   └── styles.css         ← Arquivo principal (imports)
│
└── js/                     ← JavaScript em módulos
    ├── config.js           ← Configurações globais
    ├── utils.js           ← Funções utilitárias
    ├── api.js             ← Cliente HTTP
    ├── auth.js            ← Autenticação
    ├── ui.js              ← Manipulação DOM
    ├── games.js           ← CRUD de partidas
    └── main.js            ← Inicialização
```

## 🎨 Arquitetura CSS

**Ordem de Importação (em `styles.css`):**

1. **Variables** → Cores, fontes, tamanhos
2. **Base** → Reset, tipografia, estilos globais
3. **Layout** → Sidebar, topbar, grid responsivo
4. **Components** → Botões, cards, forms reutilizáveis
5. **Screens** → Auth, games, etc
6. **Overlays** → Modais, toasts

**Benefícios:**
- ✅ Cascata CSS previsível
- ✅ Fácil override de estilos
- ✅ Modular e reutilizável
- ✅ Performance (CSS organizado)

## 🛠️ Arquitetura JavaScript

**Camadas (em ordem de execução):**

1. **Config** → Configurações, endpoints, constantes
2. **Utils** → Funções genéricas (format, debounce, etc)
3. **API** → Cliente HTTP com método para cada endpoint
4. **Auth** → Gerenciador de autenticação
5. **UI** → Funções de manipulação do DOM
6. **Games** → CRUD de partidas
7. **Main** → Event listeners e inicialização

**Padrões:**
- 📦 Cada módulo é responsável por uma coisa
- 🔗 Acoplamento baixo (utils não depende de nada)
- 🎯 Inversão de controle (callbacks, observers)
- 🌐 Funções globais expostas no `window` para HTML

## 🚀 Como Usar

### Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/chess-vault.git
cd chess-vault-frontend

# 2. Abra index.html em um servidor local
# (não abra diretamente file:// - CORS vai falhar)
python -m http.server 8000
# ou
npx http-server

# 3. Acesse http://localhost:8000
```

### Configurar Backend

No `js/config.js`, altere `API_BASE_URL`:

```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api/v1',  // ← altere aqui
  // ...
};
```

### Build para Produção

Se usar bundler (Webpack, Vite):

```bash
npm install
npm run build
# Arquivos compilados em dist/
```

## 📱 Features Implementadas

- ✅ **Autenticação** → Login, register, logout, tokens
- ✅ **Dashboard** → Stats, partidas recentes
- ✅ **Partidas** → Listar, buscar, filtrar, paginar
- ✅ **Visualizador** → Tabuleiro interativo, movimentos
- ✅ **Modais** → Criar, editar, confirmação
- ✅ **Responsive** → Mobile, tablet, desktop
- ✅ **Notificações** → Toast, confirmações
- ✅ **Keyboard Shortcuts** → Esc, Ctrl+K, setas

## 🎮 Usabilidade

### Keyboard Shortcuts

| Tecla | Ação |
|-------|------|
| `Esc` | Fechar modal |
| `Ctrl+K` | Focar busca |
| `Setas` | Navegar movimentos (no visualizador) |
| `Home` | Primeira jogada |
| `End` | Última jogada |

### Mobile

- Sidebar colapsável
- Tabelas responsivas
- Touch-friendly buttons
- Viewport optimizado

## 🔧 Customização

### Alterar Cores

Em `css/variables.css`:

```css
:root {
  --cobalt: #1c4f8a;       /* azul principal */
  --amber: #b06000;         /* laranja destaque */
  /* ... */
}
```

### Alterar Mensagens

Em `js/config.js`:

```javascript
CONFIG.MESSAGES.SUCCESS.LOGIN = 'Bem-vindo!';
```

### Alterar API Base URL

Em `js/config.js`:

```javascript
CONFIG.API_BASE_URL = 'https://api.chess-vault.com';
```

## 📊 Performance

- **CSS**: 12 KB (minificado)
- **JS**: 25 KB (minificado)
- **Total**: ~37 KB + assets

Otimizações:
- ✅ CSS em camadas (critical vs deferred)
- ✅ Debounce de busca (500ms)
- ✅ Lazy load de imagens
- ✅ Sem dependências externas

## 🧪 Testes

(A implementar)

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🐛 Debug

Ativar debug mode em `js/config.js`:

```javascript
CONFIG.DEBUG = true;
CONFIG.LOG_REQUESTS = true;
CONFIG.LOG_RESPONSES = true;
```

Abre console do navegador para ver logs.

## 📚 Documentação

- **API Endpoints** → `js/config.js` (ENDPOINTS)
- **Componentes CSS** → `css/components.css`
- **Utility Functions** → `js/utils.js`
- **Setup da App** → `js/main.js`

## 🔐 Segurança

- ✅ JWT tokens armazenados em localStorage
- ✅ CORS configurado no backend
- ✅ Validação de input (email, senha)
- ✅ XSS prevention (escape HTML)
- ✅ CSRF ready (token em body)

## 📈 Roadmap

- [ ] Tema escuro
- [ ] Internacionalização (i18n)
- [ ] PWA (offline support)
- [ ] Integração com Chess.com API
- [ ] Import/export PGN
- [ ] Análise de partida (motor)
- [ ] Compartilhar partidas
- [ ] Comentários em movimentos
- [ ] Stats e gráficos
- [ ] Notificações push

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 Licença

MIT

## 👨‍💻 Autor

**Marcos Silva**  
Desenvolvedor Full Stack  
[LinkedIn](https://linkedin.com/in/seu-perfil)

---

**Made with ♥ for chess lovers**
