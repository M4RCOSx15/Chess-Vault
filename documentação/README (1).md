# 🏁 Chess Vault - Guia de Início Rápido

## 📋 Pré-requisitos

- **Java 21+**
- **Maven 3.9+**
- **Docker & Docker Compose** (para rodar banco facilmente)
- **PostgreSQL 16** (ou use Docker)
- **Git**

## 🚀 Início Rápido com Docker

### 1. Clone o projeto
```bash
git clone https://github.com/seu-usuario/chess-vault.git
cd chess-vault
```

### 2. Configure variáveis de ambiente
```bash
# Criar arquivo .env na raiz do projeto
cat > .env << EOF
DB_PASSWORD=seu_senha_segura
JWT_SECRET=sua_chave_jwt_super_segura_aqui
EOF
```

### 3. Rode o projeto com Docker
```bash
docker-compose up --build
```

**Pronto!** A aplicação estará disponível em `http://localhost:8080`

---

## 🛠️ Desenvolvimento Local (sem Docker)

### 1. Configure PostgreSQL localmente
```bash
# Via Docker (apenas o BD):
docker run -d \
  --name chess-postgres \
  -e POSTGRES_DB=chessvault \
  -e POSTGRES_USER=chess \
  -e POSTGRES_PASSWORD=chess \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Instale dependências
```bash
mvn clean install
```

### 3. Configure application.yml
```bash
# Já vem configurado para localhost:5432
# Se precisar mudar, edite src/main/resources/application.yml
```

### 4. Rode a aplicação
```bash
# Option 1: Via Maven
mvn spring-boot:run

# Option 2: Compile e execute
mvn package
java -jar target/chess-vault-0.0.1-SNAPSHOT.jar
```

**Aplicação rodando em:** `http://localhost:8080`

---

## 🔐 Autenticação & Testes de API

### Registrar novo usuário
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marcos Silva",
    "email": "marcos@example.com",
    "password": "SenhaSegura123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer"
}
```

### Fazer login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marcos@example.com",
    "password": "SenhaSegura123"
  }'
```

### Criar partida (autenticado)
```bash
curl -X POST http://localhost:8080/api/v1/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI" \
  -d '{
    "title": "Minha primeira vitória",
    "whitePlayer": "Kasparov",
    "blackPlayer": "Eu",
    "result": "1-0",
    "event": "Treinamento",
    "gameDate": "2025-11-10",
    "tags": ["abertura-italiana", "favorita"],
    "notes": "Partida incrível!"
  }'
```

### Listar suas partidas (autenticado)
```bash
curl -X GET "http://localhost:8080/api/v1/games?player=Carlsen&result=1-0&page=0&size=20" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

### Listar livros (público)
```bash
curl -X GET "http://localhost:8080/api/v1/books?page=0&size=20"
```

---

## 📊 Estrutura do Projeto

```
chess-vault/
├── src/
│   ├── main/
│   │   ├── java/com/example/ChessVault/
│   │   │   ├── config/               # Spring Config
│   │   │   ├── entity/               # Entidades JPA
│   │   │   ├── repository/           # Spring Data JPA
│   │   │   ├── service/              # Lógica de negócio
│   │   │   ├── request/              # DTOs de entrada
│   │   │   ├── response/             # DTOs de saída
│   │   │   ├── security/             # JWT, filtros
│   │   │   ├── exception/            # Exceções customizadas
│   │   │   ├── mapper/               # MapStruct
│   │   │   ├── *Controller.java      # REST Controllers
│   │   │   └── ChessVaultApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/         # Flyway migrations
│   └── test/                         # Testes
├── docker-compose.yml
├── Dockerfile
├── pom.xml
└── ARQUITETURA_COMPLETA.md
```

---

## 📚 Endpoints da API

### Auth
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Fazer login
- `POST /api/v1/auth/refresh` - Renovar access token
- `POST /api/v1/auth/logout` - Fazer logout

### Games (Autenticado)
- `GET /api/v1/games` - Listar suas partidas
- `GET /api/v1/games/{id}` - Detalhe de uma partida
- `POST /api/v1/games` - Criar partida
- `PUT /api/v1/games/{id}` - Atualizar partida
- `DELETE /api/v1/games/{id}` - Excluir partida
- `POST /api/v1/games/import/pgn` - Importar via PGN

### Books (Público)
- `GET /api/v1/books` - Listar livros
- `GET /api/v1/books/{id}` - Detalhe do livro

### Videos (Público)
- `GET /api/v1/videos` - Listar vídeos
- `GET /api/v1/videos/{id}` - Detalhe do vídeo

### Dashboard (Autenticado)
- `GET /api/v1/dashboard` - Resumo e estatísticas

---

## 🧪 Executar Testes

```bash
# Todos os testes
mvn test

# Teste específico
mvn test -Dtest=GameServiceTest

# Com cobertura
mvn jacoco:report
```

---

## 🔧 Troubleshooting

### Erro: "Connection refused" na porta 5432
```bash
# Verifique se PostgreSQL está rodando
docker ps

# Se não estiver, inicie:
docker-compose up db
```

### Erro: "JWT token invalid"
```bash
# Gere um novo token fazendo login
# Use a resposta como Authorization header
```

### Erro ao compilar: "Lombok not found"
```bash
# Reconstrua:
mvn clean install -DskipTests
```

---

## 📝 Variáveis de Ambiente

```bash
# Banco de dados
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/chessvault
SPRING_DATASOURCE_USERNAME=chess
SPRING_DATASOURCE_PASSWORD=chess

# JWT
JWT_SECRET=sua_chave_segura_aqui

# Spring Profile
SPRING_PROFILES_ACTIVE=docker  # ou "dev", "prod"
```

---

## 🚢 Deploy em Produção

### Heroku
```bash
git push heroku main
heroku config:set JWT_SECRET="sua_chave_super_segura"
heroku config:set SPRING_DATASOURCE_URL="postgres://..."
```

### Digital Ocean / Railway
```bash
# Push Docker image
docker build -t seu-usuario/chess-vault .
docker push seu-usuario/chess-vault

# Deploy com docker-compose em produção
docker-compose -f docker-compose.yml up -d
```

---

## 📖 Documentação

Para entender a arquitetura completa, veja:
- **[ARQUITETURA_COMPLETA.md](./ARQUITETURA_COMPLETA.md)** - Design completo com fluxogramas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja `LICENSE` para detalhes.

---

## 👨‍💻 Autor

**Marcos Silva** - [LinkedIn](https://linkedin.com/in/seu-perfil)

---

## ❓ Dúvidas?

Abra uma **issue** no GitHub ou entre em contato!

**Email:** marcos@example.com  
**WhatsApp:** +55 31 9999-9999

---

**Última atualização:** 2025-11-10  
**Versão:** 0.0.1-SNAPSHOT (MVP)
