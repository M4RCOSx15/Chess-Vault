# Chess Vault ♟️

Eu sou o Marcos, e tenho um problema: toda vez que vejo uma partida incrível, seja uma vitória que custou minha sanidade mental ou um jogo histórico entre grandes mestres, eu não tenho onde guardar isso direito. Pasta no desktop? Anotação no celular? Um favorito perdido no navegador? Não, obrigado.

Foi daí que nasceu o Chess Vault — minha biblioteca pessoal de partidas de xadrez. Simples assim.

## 🎯 O que é isso aqui

Um lugar centralizado pra você armazenar, organizar e revisar as partidas que você não quer esquecer. Pode ser aquela partida sofrida sua, pode ser um clássico do Tal , pode ser qualquer coisa. O ponto é: vai estar aqui quando você precisar.

## 🔮 O que está vindo por aí

Tô trabalhando numa funcionalidade que vai conectar automaticamente a partida selecionada a vídeos no YouTube, independente do idioma. A ideia é transformar o vault num ambiente de estudo de verdade, não só um arquivo.

## 💻 Stack

- **Backend:** Java com Spring Boot
- **Frontend:** HTML5, CSS3 e JavaScript

## 💻 Lógica do projeto

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

AuthController: Endpoints REST (/api/auth/register, /api/auth/login)
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

Fluxo de Dados

1. Requisição HTTP → Controlador (validação)

2. Controlador → Serviço (lógica de negócios)

3. Serviço → Repositório (acesso a dados)

4. Repositório ↔ Banco de dados (persistência)

5. Serviço ← Repositório (recuperação de dados)

6. Serviço → Controlador (processamento de resultados)

7. Controlador → Resposta HTTP (saída formatada)

Principais decisões de design
Arquitetura em camadas com clara separação de responsabilidades
Tratamento de erros padronizado via GlobalExceptionHandler
Chaves primárias UUID para segurança distribuída
Padrão Builder para construção de entidades
Lombok para reduzir código repetitivo
Padrões de resposta de API consistentes entre os módulos

