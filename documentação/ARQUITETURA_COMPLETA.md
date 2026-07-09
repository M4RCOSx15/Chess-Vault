# 📚 Chess Vault - Documentação Arquitetural Completa

## 📖 Índice
1. [Visão Geral do Projeto](#visão-geral)
2. [Arquitetura da Aplicação](#arquitetura)
3. [Estrutura de Camadas](#estrutura-camadas)
4. [Fluxogramas Principais](#fluxogramas)
5. [Decisões Arquiteturais](#decisões)
6. [Como Funciona: Passo a Passo](#passo-a-passo)

---

## <a name="visão-geral"></a> 1️⃣ Visão Geral do Projeto

**O que é Chess Vault?**
- Uma plataforma web para jogadores de xadrez armazenarem, organizarem e revisarem suas partidas
- Funciona como uma "biblioteca pessoal de xadrez"
- Permite importar, criar, editar e deletar partidas
- Oferece um catálogo de livros e vídeos educacionais

**Usuários-alvo:**
- Jogadores de xadrez amadores
- Estudantes de xadrez
- Treinadores que querem revisar partidas

**MVP (Fase 1):**
- Autenticação com JWT
- CRUD completo de partidas
- Busca e filtros
- Dashboard básico
- Catálogo de livros e vídeos (leitura apenas)

---

## <a name="arquitetura"></a> 2️⃣ Arquitetura da Aplicação

### O que é "Package-by-Layer"?

Nossa estrutura organiza o código em **camadas horizontais**, não em módulos verticais.

```
Exemplo ERRADO (Package-by-Feature):
com.example.ChessVault
├── game/
│   ├── GameController
│   ├── GameService
│   └── GameRepository
├── book/
│   ├── BookController
│   ├── BookService
│   └── BookRepository
```

```
Exemplo CORRETO (Package-by-Layer):
com.example.ChessVault
├── Controller/ (ou direto no root)
├── Service/
├── Repository/
├── Entity/
├── DTO/
└── Mapper/
```

**Por que escolhemos Package-by-Layer?**
- ✅ Mais simples de navegar no início (tudo organizado por tipo)
- ✅ Fácil encontrar onde adicionar um novo controller, service, etc
- ✅ Padrão em empresas pequenas/médias
- ✅ Spring Boot recomenda para projetos iniciais

**Quando usar Package-by-Feature?**
- Quando o projeto cresce muito (mais de 500 classes)
- Quando você quer isolar módulos para extrair como microsserviços
- Quando diferentes times trabalham em diferentes features

---

## <a name="estrutura-camadas"></a> 3️⃣ Estrutura de Camadas

Nossa arquitetura tem **4 camadas principais**:

```
┌─────────────────────────────────────────┐
│   PRESENTATION (Controllers)            │
│   - Recebe requisições HTTP             │
│   - Valida inputs (Bean Validation)     │
│   - Retorna JSONs                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   APPLICATION (Services)                │
│   - Orquestra os casos de uso           │
│   - Chama repositories                  │
│   - Transações (@Transactional)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   DOMAIN (Entities + Value Objects)     │
│   - Regras de negócio PURAS             │
│   - Factory Methods (Game.create)       │
│   - Sem dependências do Spring          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   INFRASTRUCTURE (Repositories + DB)    │
│   - Spring Data JPA                     │
│   - Queries customizadas                │
│   - Conexão com PostgreSQL              │
└─────────────────────────────────────────┘
```

**Regra de ouro:** As dependências SEMPRE apontam para baixo (para o domínio), nunca para cima!

```
❌ ERRADO:
Entity → Service → Controller

✅ CORRETO:
Controller → Service → Entity → Repository
                ↓
            Repository acessa Entity
```

---

## <a name="fluxogramas"></a> 4️⃣ Fluxogramas Principais

### A. Fluxo de Autenticação (Login/Register)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO CLICA EM "REGISTRAR" OU "LOGIN"                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
        ┌────────────────────────────┐
        │ FRONTEND                   │
        │ Envia POST com             │
        │ email + senha              │
        └────────────┬───────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ 2. AuthController recebe a requisição                         │
│    @PostMapping("/auth/register") ou @PostMapping("/auth/login")
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ 3. AuthService processa                                        │
│    - Se REGISTER: cria novo User no banco                      │
│    - Se LOGIN: valida credenciais com PasswordEncoder          │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ 4. JwtService gera DOIS tokens                                 │
│    - accessToken (15 min): para usar a API                     │
│    - refreshToken (7 dias): para renovar o accessToken         │
│    - Ambos são salvos em banco                                 │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ 5. Retorna ao FRONTEND                                         │
│    {                                                            │
│      "accessToken": "eyJhbGciOiJIUzI1NiIs...",                │
│      "refreshToken": "550e8400-e29b-41d4...",                 │
│      "tokenType": "Bearer"                                      │
│    }                                                            │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND armazena tokens (localStorage/sessionStorage)      │
│    e usa accessToken em todas as requisições:                  │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...               │
└────────────────────────────────────────────────────────────────┘
```

**Por que 2 tokens?**
- `accessToken` curto (15 min) = seguro, mas precisa renovar
- `refreshToken` longo (7 dias) = não é exposto em cada requisição
- Se `accessToken` vencer → FRONTEND usa `refreshToken` para pedir novo
- Se `refreshToken` vencer → usuário faz login de novo

---

### B. Fluxo de Criar Partida (Game)

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO PREENCHE FORM E CLICA "SALVAR PARTIDA"              │
│    Dados: Título, Resultado, Jogadores, Tags, Anotações, PGN   │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
        ┌────────────────────────────────────────┐
        │ FRONTEND                               │
        │ POST /api/v1/games                     │
        │ + Authorization: Bearer {accessToken}  │
        │ + Body: CreateGameRequest (JSON)       │
        └────────────────┬───────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. JwtAuthenticationFilter intercepta a requisição             │
│    - Extrai token do header "Authorization"                    │
│    - Valida assinatura JWT (é válido?)                         │
│    - Se válido: coloca usuário no SecurityContext              │
│    - Se inválido: bloqueia com 401 Unauthorized                │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. GameController recebe a requisição                           │
│    @PostMapping("/")                                            │
│    public ResponseEntity<GameResponse> createGame(              │
│        @Valid @RequestBody CreateGameRequest request)           │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. Bean Validation valida o CreateGameRequest                   │
│    - @NotBlank title? ✓ Sim                                     │
│    - @Size tags? ✓ Dentro do limite                             │
│    - @Pattern result? ✓ É "1-0" ou "0-1" ou...                 │
│    Se falhar: retorna 400 Bad Request com erro                  │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. GameService.createGame() processa a lógica                   │
│                                                                  │
│    a) getCurrentUser()                                          │
│       - Pega email do SecurityContext                           │
│       - Busca User no banco                                     │
│                                                                  │
│    b) Game.create(user, title)  [FACTORY METHOD]                │
│       - Valida invariantes de domínio                           │
│       - Se título vazio → BusinessException                     │
│       - Se usuário null → BusinessException                     │
│       - Retorna Game válido                                     │
│                                                                  │
│    c) Popula campos adicionais                                  │
│       - game.setWhitePlayer(request.whitePlayer())              │
│       - game.setGameDate(request.gameDate())                    │
│       - game.setPgn(new PgnContent(request.pgnContent()))       │
│       - game.replaceTags(request.tags())                        │
│                                                                  │
│    d) gameRepository.save(game)                                 │
│       - Salva no banco PostgreSQL                               │
│       - Populate createdAt, createdBy (Spring Auditing)         │
│                                                                  │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. GameMapper.toResponse(game) converte Entity para DTO         │
│    Entity (banco)      →  Response DTO (JSON)                   │
│    - game.id          →  response.id                            │
│    - game.result      →  response.result (enum → string)        │
│    - game.pgn.value() →  response.pgnContent                    │
│    - game.tags        →  response.tags (Set<GameTag> → Set<String>)
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 7. Controller retorna resposta                                  │
│    201 Created                                                  │
│    {                                                            │
│      "id": "550e8400-e29b-41d4-a716-446655440000",             │
│      "title": "Minha vitória",                                  │
│      "whitePlayer": "Eu",                                       │
│      "blackPlayer": "Oponente",                                 │
│      "result": "1-0",                                           │
│      "tags": ["abertura-italiana", "favorita"],                 │
│      "createdAt": "2025-11-10T14:30:00Z",                       │
│      "createdBy": "user@email.com"                              │
│    }                                                            │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND recebe resposta e atualiza a UI                     │
│    - Mostra mensagem "Partida criada com sucesso!"              │
│    - Redireciona para página de detalhes da partida             │
│    - Adiciona game à lista de partidas do usuário               │
└──────────────────────────────────────────────────────────────────┘
```

---

### C. Fluxo de Listar Partidas com Filtros

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO CLICA EM "MINHAS PARTIDAS" COM FILTROS              │
│    GET /api/v1/games?player=Carlsen&result=1-0&page=0&size=20   │
│    + Authorization: Bearer {accessToken}                         │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Passa por JwtAuthenticationFilter (mesmo que antes)          │
│    Se não autenticado → 401                                     │
│    Se token inválido → 401                                      │
│    Se válido → continua                                         │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. GameController.listGames() recebe parâmetros                 │
│    @GetMapping                                                  │
│    public ResponseEntity<PageResponse<GameResponse>> listGames( │
│        @RequestParam(defaultValue = "0") int page,              │
│        @RequestParam(defaultValue = "20") int size,             │
│        @RequestParam(required = false) String player,           │
│        @RequestParam(required = false) String result,           │
│        @RequestParam(required = false) String event)            │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. GameService.listGames() processa lógica                      │
│                                                                  │
│    a) getCurrentUser() → pega usuário autenticado                │
│                                                                  │
│    b) Cria Pageable                                             │
│       PageRequest.of(page, size, Sort.by("createdAt").desc)    │
│       = "pega página 0, com 20 itens, ordenado por data desc"   │
│                                                                  │
│    c) Converte parâmetros para tipos corretos                   │
│       - result (String "1-0") → GameResult.WHITE_WINS (Enum)    │
│                                                                  │
│    d) Executa query com filtros                                 │
│       gameRepository.findByFilters(                             │
│           userId,                                              │
│           "Carlsen",                                            │
│           GameResult.WHITE_WINS,                                │
│           null,                                                 │
│           pageable                                              │
│       )                                                         │
│                                                                  │
│    E) Query SQL (gerada por @Query no Repository)              │
│       SELECT g FROM Game g                                      │
│       WHERE g.user.id = :userId                                 │
│       AND (LOWER(g.whitePlayer) LIKE LOWER('%Carlsen%')         │
│            OR LOWER(g.blackPlayer) LIKE LOWER('%Carlsen%'))     │
│       AND g.result = WHITE_WINS                                 │
│       ORDER BY g.createdAt DESC                                 │
│       LIMIT 20 OFFSET 0                                         │
│                                                                  │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. Banco retorna Page<Game> (2 partidas encontradas)            │
│    game1: Carlsen vs Fischer, 1-0                               │
│    game2: Carlsen vs Kasparov, 1-0                              │
│    Total: 2 / página 0 / totalPages: 1                          │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. GameMapper converte cada Game para GameResponse              │
│    Entity → DTO (JSON-friendly)                                 │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 7. PageResponse<GameResponse>.of() embrulha os dados            │
│    {                                                            │
│      "content": [                                               │
│        { game1 response... },                                   │
│        { game2 response... }                                    │
│      ],                                                         │
│      "page": 0,                                                 │
│      "size": 20,                                                │
│      "totalElements": 2,                                        │
│      "totalPages": 1,                                           │
│      "last": true                                               │
│    }                                                            │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND recebe e renderiza a tabela com resultados          │
└──────────────────────────────────────────────────────────────────┘
```

---

### D. Fluxo de Erro (Exception Handling)

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. ALGO DÁ ERRADO (erro de validação, recurso não encontrado)   │
│    Ex: DELETE /api/v1/games/999 (ID que não existe)             │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. GameService lança uma exceção customizada                    │
│    throw new ResourceNotFoundException("Game", id);              │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. Exceção sobe para o Controller                               │
│    (não é tratada lá)                                           │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. GlobalExceptionHandler captura a exceção                     │
│    @ExceptionHandler(ResourceNotFoundException.class)            │
│    public ResponseEntity<ErrorResponse> handleNotFound(...)     │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. Retorna erro padronizado ao FRONTEND                         │
│    404 Not Found                                                │
│    {                                                            │
│      "code": "NOT_FOUND",                                       │
│      "message": "Game não encontrado com id: 999",              │
│      "timestamp": "2025-11-10T14:30:00Z"                        │
│    }                                                            │
└────────────────────┬─────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND exibe mensagem amigável ao usuário                  │
│    "Partida não encontrada! Tente novamente."                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## <a name="decisões"></a> 5️⃣ Decisões Arquiteturais

### 1️⃣ Por que Package-by-Layer e não Package-by-Feature?

| Aspecto | Package-by-Layer | Package-by-Feature |
|---------|------------------|-------------------|
| **Projeto Inicial** | ✅ Melhor | ❌ Over-engineering |
| **Escalabilidade** | ❌ Fica confuso com crescimento | ✅ Escalável |
| **Tempo de aprendizado** | ✅ Mais fácil | ❌ Mais complexo |
| **Microsserviços** | ❌ Difícil separar depois | ✅ Fácil extrair módulos |

**Nossa escolha:** Package-by-Layer porque é MVP, time pequeno, fácil navegar.
**Quando migrar?** Quando tiver >500 classes ou crescimento previsto.

---

### 2️⃣ Por que 4 Camadas? Por que não MVC simples?

```
❌ MVC Simples (errado para esse projeto):
Controller → Service → Repository
            (sem domínio claro)

✅ 4 Camadas + DDD (correto):
Controller → Service → Entity (com Factory Methods) → Repository
            (domínio com regras de negócio)
```

**Por que?**
- Regras de negócio ficam no Entity (Game.create, Game.addTag)
- Não contaminamos Service com lógica de domínio
- Testamos Entity sem mockar nada (puro)
- Fácil mudar banco de dados sem afetar regras

---

### 3️⃣ Por que 2 Tokens (Access + Refresh)?

```
❌ ERRADO (um token):
User login → accessToken (7 dias) → armazenar no localStorage
Problema: Se token vazou, invasor tem acesso por 7 dias!

✅ CORRETO (dois tokens):
User login → accessToken (15 min) + refreshToken (7 dias, em cookie seguro)
Frontend usa accessToken em requisições
Quando expirar → usa refreshToken para pedir novo accessToken
Problema resolvido: Mesmo se accessToken vazar, duração é curta
```

---

### 4️⃣ Por que Value Objects (PgnContent, GameTag, GameResult)?

```
❌ ERRADO:
public class Game {
    String result;  // pode ser "abc" → inválido!
    String pgnContent;  // pode ser null e vazio
}

✅ CORRETO:
public class Game {
    GameResult result;  // só pode ser WHITE_WINS, BLACK_WINS, DRAW, UNKNOWN
    PgnContent pgn;  // valida no construtor
}

Benefício: Compiler garante que result é válido!
```

---

### 5️⃣ Por que Factory Method (Game.create)?

```
❌ ERRADO:
var game = new Game();
game.setTitle(title);
game.setUser(user);
// Mas alguém pode fazer:
game.setTitle(null);  // boom!

✅ CORRETO:
var game = Game.create(user, title);  // Factory Method
// Garante invariantes:
// - user não-null
// - title não-vazio
// Objeto sempre válido!
```

---

### 6️⃣ Por que Auditing (createdAt, createdBy, etc)?

```
Benefícios:
1. Rastreabilidade: quem criou? quando?
2. Compliance: LGPD, GDPR exigem isso
3. Debug: "por que essa partida foi criada?"
4. Auditoria legal: provar quem fez o quê

Como funciona:
@CreatedDate  → Spring popula automaticamente
@CreatedBy    → Pega do SecurityContext (email do usuário)
@EntityListeners(AuditingEntityListener.class)  → Ativa a mágica
```

---

### 7️⃣ Por que MapStruct (não ModelMapper)?

```
❌ ModelMapper (reflection):
- Usa reflexão em RUNTIME
- Lento em alta concorrência
- Erros só aparecem em testes

✅ MapStruct (compile-time):
- Gera código Java em COMPILE TIME
- Rápido como código manual
- Erros aparecem na compilação
- Type-safe: compiler valida
```

---

### 8️⃣ Por que PostgreSQL? Por que UUID?

```
PostgreSQL:
✅ Open source
✅ Robusto, confiável
✅ Full-text search (futuro)
✅ Suporta JSON, Arrays
✅ Supabase (free tier, gerenciado)

UUID (em vez de Long):
❌ Sequencial (id=1,2,3) expõe dados
✅ UUID (aleatório) mais seguro
✅ Merge de dados fácil (sem collision)
✅ Pronto para sharding
```

---

### 9️⃣ Por que Flyway? Por que não JPA ddl-auto?

```
❌ JPA ddl-auto=create-drop:
- Deleta dados em deploy
- Não funciona em produção
- Sem versionamento

✅ Flyway:
- Versionado (V001__create_users.sql)
- Auditável (quem mudou o schema?)
- Funciona em múltiplos ambientes
- Rollback fácil
```

---

## <a name="passo-a-passo"></a> 6️⃣ Como Funciona: Passo a Passo Simplificado

### Cenário Real: "Quero guardar uma partida de xadrez"

#### Passo 1: Abrir a aplicação
```
User abre browser → vai em https://chessvault.com
Se não tem conta → clica em "Registrar"
Preenche: Nome, Email, Senha
```

#### Passo 2: Registrar (Backend)
```
FRONTEND envia:
POST /api/v1/auth/register
{
  "name": "Marcos Silva",
  "email": "marcos@example.com",
  "password": "minhaSenha123"
}

BACKEND processa:
1. Controller valida (Bean Validation)
   - Email é válido? ✓
   - Senha tem 8+ chars? ✓

2. Service checa negócio
   - Email já existe? ✗ Não
   - OK, cria user novo

3. Repository salva no BD
   - INSERT INTO users (id, name, email, password_hash, role, created_at, created_by)
   - VALUES ('uuid-xxx', 'Marcos Silva', 'marcos@example.com', '$2a$10$...', 'USER', now(), 'system')

4. JwtService gera tokens
   - accessToken (validade 15 min)
   - refreshToken (validade 7 dias, salvo em BD)

5. Retorna ao FRONTEND:
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
     "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     "tokenType": "Bearer"
   }

FRONTEND armazena tokens no localStorage
```

#### Passo 3: Login (Backend)
```
User faz login → POST /api/v1/auth/login

Mesmo processo de registrar, mas:
- Não cria novo user
- Valida senha com PasswordEncoder (bcrypt)
- Revoga tokens antigos (segurança)
```

#### Passo 4: User acessa Dashboard
```
Browser envia:
GET /api/v1/dashboard
Authorization: Bearer {accessToken}

BACKEND processa:
1. JwtAuthenticationFilter valida token
   - Assinatura JWT válida? ✓
   - Token expirado? ✗ (15 min ainda vale)
   - OK, coloca user no SecurityContext

2. Controller chama DashboardService
   - Pega userId do SecurityContext
   - Conta total de games: COUNT(*)
   - Pega últimas 5 partidas

3. Retorna:
   {
     "userName": "Marcos Silva",
     "totalGames": 12,
     "recentGames": [
       {
         "id": "uuid-1",
         "title": "Minha vitória",
         "whitePlayer": "Eu",
         "blackPlayer": "Oponente",
         "result": "1-0",
         "createdAt": "2025-11-10T14:30:00Z"
       },
       ...
     ]
   }

FRONTEND renderiza dashboard
```

#### Passo 5: User cria uma partida
```
User preenche form:
- Título: "Vitória genial contra o IA"
- Brancas: "Kasparov"
- Pretas: "Eu"
- Resultado: "1-0"
- Evento: "Treinamento"
- Data: "2025-11-10"
- Tags: ["abertura-italiana", "favorita"]
- Anotações: "Movimento 23 foi brilhante!"
- PGN: "[Event \"Training\"] 1.e4 c5 2.Nf3..."

Frontend envia:
POST /api/v1/games
Authorization: Bearer {accessToken}
{
  "title": "Vitória genial contra o IA",
  "whitePlayer": "Kasparov",
  "blackPlayer": "Eu",
  "result": "1-0",
  "event": "Treinamento",
  "gameDate": "2025-11-10",
  "tags": ["abertura-italiana", "favorita"],
  "notes": "Movimento 23 foi brilhante!",
  "pgnContent": "[Event \"Training\"] 1.e4 c5..."
}

BACKEND processa:
1. JwtAuthenticationFilter valida token ✓

2. Bean Validation valida request
   - Title não-vazio? ✓
   - Result é padrão PGN? ✓
   - gameDate não é futuro? ✓

3. GameController chama GameService

4. GameService executa lógica:
   a) getCurrentUser()
      - Pega email do SecurityContext
      - Busca User no DB
      - user_id = "uuid-marcos"

   b) Game.create(user, "Vitória genial...")
      - Factory Method valida invariantes
      - Cria novo Game object na memória (não BD ainda)

   c) Popula campos adicionais
      - game.setWhitePlayer("Kasparov")
      - game.setResult(GameResult.WHITE_WINS) [Enum]
      - game.setPgn(new PgnContent("[Event...]"))
      - game.replaceTags(["abertura-italiana", "favorita"])

   d) gameRepository.save(game)
      - ENTRA NA TRANSAÇÃO @Transactional
      - INSERT INTO games (id, user_id, title, result, pgn_content, ...)
      - VALUES ('uuid-game-1', 'uuid-marcos', 'Vitória genial...', 'WHITE_WINS', '[Event...]', ...)
      - Spring Auditing popula automaticamente:
        - created_at = NOW()
        - created_by = "marcos@example.com" (do SecurityContext)
      - INSERE tags na tabela game_tags
      - TRANSACTION COMMITTED (salvo no BD)

5. GameMapper converte Entity para DTO
   Game (entity) → GameResponse (DTO)
   - game.id → response.id
   - game.result (enum) → response.result ("1-0")
   - game.pgn (ValueObject) → response.pgnContent

6. Controller retorna 201 Created:
   {
     "id": "uuid-game-1",
     "title": "Vitória genial contra o IA",
     "whitePlayer": "Kasparov",
     "blackPlayer": "Eu",
     "result": "1-0",
     "event": "Treinamento",
     "gameDate": "2025-11-10",
     "pgnContent": "[Event \"Training\"] 1.e4 c5...",
     "notes": "Movimento 23 foi brilhante!",
     "tags": ["abertura-italiana", "favorita"],
     "createdBy": "marcos@example.com",
     "createdAt": "2025-11-10T14:30:00Z",
     "updatedAt": "2025-11-10T14:30:00Z"
   }

FRONTEND:
- Mostra mensagem "Partida criada com sucesso!"
- Adiciona novo game à lista de games
- Atualiza dashboard (totalGames agora é 13)
```

#### Passo 6: User lista suas partidas com filtro
```
User clica em filtro:
- Jogador: "Carlsen"
- Resultado: "1-0"

Frontend envia:
GET /api/v1/games?player=Carlsen&result=1-0&page=0&size=20
Authorization: Bearer {accessToken}

BACKEND:
1. Valida token (JWT) ✓

2. GameService.listGames processa:
   - Pega userId do SecurityContext = "uuid-marcos"
   - Cria PageRequest = página 0, 20 itens, ordenado por createdAt desc
   - Converte result string "1-0" → enum GameResult.WHITE_WINS

3. GameRepository.findByFilters executa query:
   SELECT g FROM Game g
   WHERE g.user.id = 'uuid-marcos'
   AND (LOWER(g.whitePlayer) LIKE LOWER('%carlsen%')
        OR LOWER(g.blackPlayer) LIKE LOWER('%carlsen%'))
   AND g.result = 'WHITE_WINS'
   ORDER BY g.createdAt DESC
   LIMIT 20 OFFSET 0

4. Banco retorna Page<Game> com 2 games encontrados

5. GameMapper converte cada Game → GameResponse

6. PageResponse embrulha resultado:
   {
     "content": [
       {game1_response},
       {game2_response}
     ],
     "page": 0,
     "size": 20,
     "totalElements": 2,
     "totalPages": 1,
     "last": true
   }

FRONTEND renderiza tabela com 2 linhas
```

#### Passo 7: Token expira, user faz refresh
```
User clica em algum botão
Frontend faz requisição:
GET /api/v1/games
Authorization: Bearer {accessToken}

Server responde:
401 Unauthorized - Token expirado

Frontend detecta 401 e:
1. Pega refreshToken do localStorage
2. Envia:
   POST /api/v1/auth/refresh
   {
     "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
   }

BACKEND:
1. AuthService.refresh processa
   - Busca refreshToken no BD
   - É válido? (não expirado, não revogado) ✓
   - Marca antigo como revoked
   - Gera novo accessToken (15 min)
   - Gera novo refreshToken (7 dias)
   - Salva novo refreshToken em BD

2. Retorna:
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...(novo)",
     "refreshToken": "novo-uuid",
     "tokenType": "Bearer"
   }

FRONTEND:
1. Armazena novos tokens
2. Repete requisição original com novo accessToken
3. Server responde 200 OK com games

User não viu nada! Refresh automático!
```

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────────┐
│         FRONTEND (HTML + JavaScript)               │
│    - Formulários, botões, tabelas                   │
│    - Armazena tokens (localStorage)                 │
│    - Envia requisições HTTP                         │
└────────────────┬────────────────────────────────────┘
                 │ HTTP Request
                 │ GET/POST/PUT/DELETE
                 │ + Authorization: Bearer token
                 ↓
┌─────────────────────────────────────────────────────┐
│   BACKEND (Java + Spring Boot)                      │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │ SECURITY LAYER                             │   │
│   │ JwtAuthenticationFilter                      │   │
│   │ - Valida token                              │   │
│   │ - Popula SecurityContext                    │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
│   ┌─────────────────────────────────────────────┐   │
│   │ PRESENTATION LAYER                         │   │
│   │ Controllers (@RestController)               │   │
│   │ - Recebe HTTP requests                      │   │
│   │ - Valida inputs (Bean Validation)           │   │
│   │ - Chama services                            │   │
│   │ - Retorna respostas JSON                    │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
│   ┌─────────────────────────────────────────────┐   │
│   │ APPLICATION LAYER                          │   │
│   │ Services (@Service)                         │   │
│   │ - Orquestra casos de uso                    │   │
│   │ - Gerencia transações                       │   │
│   │ - Chama repositories                        │   │
│   │ - Aplica lógica de negócio                  │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
│   ┌─────────────────────────────────────────────┐   │
│   │ DOMAIN LAYER                               │   │
│   │ Entities, Value Objects                     │   │
│   │ - Contém regras de negócio (Factory)        │   │
│   │ - Garante invariantes                       │   │
│   │ - Sem dependências do Spring                │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
│   ┌─────────────────────────────────────────────┐   │
│   │ INFRASTRUCTURE LAYER                       │   │
│   │ Repositories + Mappers                      │   │
│   │ - Spring Data JPA                           │   │
│   │ - Queries customizadas                      │   │
│   │ - MapStruct (Entity → DTO)                  │   │
│   │ - Conexão com BD                            │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
│   ┌─────────────────────────────────────────────┐   │
│   │ EXCEPTION HANDLING                         │   │
│   │ GlobalExceptionHandler                      │   │
│   │ - Captura exceções                          │   │
│   │ - Retorna erros padronizados                │   │
│   └────────────┬────────────────────────────────┘   │
│                ↓                                    │
└─────────────────────────────────────────────────────┘
                 │ HTTP Response
                 │ 200, 201, 400, 401, 404, 500...
                 │ + Body (JSON)
                 ↓
┌─────────────────────────────────────────────────────┐
│         FRONTEND (recebe resposta)                  │
│    - Renderiza UI                                   │
│    - Mostra mensagens ao usuário                    │
└─────────────────────────────────────────────────────┘
                 │
                 └──→ Volta para a requisição anterior
```

---

## 📝 Checklist: Por que essa arquitetura?

- ✅ **Separação de responsabilidades**: Cada camada tem uma função clara
- ✅ **Testável**: Domain layer não precisa de Spring para testar
- ✅ **Mantenível**: Fácil encontrar onde adicionar nova feature
- ✅ **Escalável**: Pronta para crescer (até Package-by-Feature se precisar)
- ✅ **Segura**: JWT com 2 tokens, autorização em camadas
- ✅ **Auditável**: createdAt, createdBy rastreiam tudo
- ✅ **Flexível**: Trocar BD sem afetar lógica
- ✅ **Performance**: MapStruct compile-time, índices no BD
- ✅ **Profissional**: Padrão usado em empresas grandes

---

## 🚀 Próximos Passos

1. **Flyway Migrations** → Criar tabelas no BD
2. **Docker + docker-compose** → Rodar BD + App localmente
3. **Testes Unitários** → GameService, GameRepository
4. **Testes Integração** → Controllers com @WebMvcTest
5. **Frontend** → React/Vue conectado à API
6. **CI/CD** → GitHub Actions executar testes
7. **Deploy** → Heroku, Railway, Digital Ocean

---

## 📚 Referências

- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Spring Security**: https://spring.io/projects/spring-security
- **JWT com JJWT**: https://github.com/jwtk/jjwt
- **MapStruct**: https://mapstruct.org/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **DDD**: https://www.domainlanguage.com/ddd/

---

**Autor:** Documentação Chess Vault  
**Data:** 2025  
**Versão:** 1.0  
**Status:** MVP - Phase 1
