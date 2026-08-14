# Chess Vault 

Eu sou o Marcos, eu tinha um problema: sempre que eu analisava uma boa partida , um jogo incrível entre o Fischer e o Tal ou até uma partida minha, eu não tinha onde guardar.

Foi daí que pensei no Chess Vault — minha biblioteca pessoal de partidas de xadrez onde eu (e voce) podemos desfrutar desse esporte que é o xadrez.


##  O que está vindo por aí
Após concluir a V3 da aplicação , já possui algumas funcionalidades interessantes como : seção de livros(conectada à API do google books), jogadores(API do chess com, tendo a possibilidade de extrair informações direto da plataforma do chesscom), partidas, puzzle(API do chess , sendo possivel resolver o do dia ou aleatorio) e videos (API do Youtube-- é possivel vizualizar a maioria dos videos que não possuem o embed bloqueado pela aplicação)

## Stack

- **Backend:** Java com Spring Boot
- **Frontend:** HTML5, CSS3 e JavaScript

## Lógica do projeto

Análise do Fluxo do Backend do ChessVault

Ponto de Entrada da Aplicação

- ChessVaultApplication.java: Classe principal do Spring Boot que inicia a aplicação com @SpringBootApplication
  Habilita a autoconfiguração, a varredura de componentes e o carregamento de propriedades

Arquitetura de Segurança
SecurityConfig.java: Configura a autenticação
UserDetailsService carrega usuários por e-mail do UserRepository
BCryptPasswordEncoder para hash seguro de senhas
 Sem implementação de JWT - usa autenticação de sessão simples (retorna a string "Bearer")

Fluxo de Autenticação

AuthController: Endpoints REST (/api/auth/registrar, /api/auth/login)
AuthService: Lógica de negócios
Registro: Valida a unicidade do e-mail, codifica a senha e salva o usuário com a função ROLE_USER
Login: Verifica as credenciais usando o codificador de senha
GlobalExceptionHandler: Tratamento centralizado de erros que converte exceções em respostas HTTP
Núcleo Padrão de Módulo (Repetido em Todas as Funcionalidades)

Cada módulo segue esta estrutura em camadas:
Controlador: Endpoints REST com @RestController, validação de entrada, ResponseEntity
Serviço: Lógica de negócios com @Service, @Transactional, orquestra repositórios
Repositório: Interfaces Spring Data JPA para acesso a dados
Entidade: Entidades JPA com @Entity, frequentemente estendendo AuditableEntity
DTOs: Objetos de Requisição/Resposta para contratos de API
Mapeadores (quando presentes): Convertem entre entidades e DTOs

Exemplos de Módulos
Jogo: CRUD completo para jogos de xadrez, importação de PGN, paginação, filtragem
Usuário: Gerenciamento de perfil, controle de acesso baseado em funções
Livro/Vídeo: CRUD simples para gerenciamento de conteúdo
Painel: Endpoints de estatísticas agregadas



7. Controlador → Resposta HTTP (saída formatada)

