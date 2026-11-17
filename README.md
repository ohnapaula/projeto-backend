# Backend API

API REST em Node.js e Express para gerenciamento de usuarios, categorias e produtos. A persistencia utiliza MySQL com Sequelize, autenticação JWT e hash de senhas com bcrypt.

## Arquitetura

O projeto segue o padrão MVC com separação em camadas:

- Routes: definição dos endpoints REST.
- Middlewares: autenticação, validação e tratamento global de erros.
- Controllers: adaptação das requisições HTTP.
- Services: regras de negócio e orquestração.
- Repositories: acesso ao banco de dados.
- Models: entidades Sequelize e relações.
- Validators: validação de payloads e parâmetros.
- Database/migrations: schema versionado do MySQL.
- Docs: especificação OpenAPI 3.0.

## Tecnologias

- Node.js 20
- Express
- Sequelize e Sequelize CLI
- MySQL 8
- JWT
- bcryptjs
- Joi
- Swagger UI
- Jest e Supertest
- Docker e Docker Compose

## Estrutura

```text
src/
  config/
  controllers/
  services/
  repositories/
  models/
  routes/
  middlewares/
  validators/
  errors/
  database/migrations/
  docs/
  app.js
  server.js
tests/
uploads/
```

## Pré-requisitos

- Node.js 20 ou superior
- npm
- MySQL 8 ou Docker

## Configuração local

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Variáveis disponíveis:

| Variável | Descrição | Padrão |
|---|---|---|
| NODE_ENV | Ambiente da aplicação | development |
| PORT | Porta HTTP da API | 3000 |
| JWT_SECRET | Chave usada para assinar tokens | obrigatório |
| JWT_EXPIRES_IN | Validade do JWT | 1d |
| DB_HOST | Host do MySQL | localhost |
| DB_PORT | Porta do MySQL | 3306 |
| DB_NAME | Nome do banco | store |
| DB_USER | Usuário do banco | store |
| DB_PASSWORD | Senha do banco | store |
| DATABASE_URL | URL completa de conexão | opcional |

Instale as dependências:

```bash
npm install
```

Execute as migrations:

```bash
npm run migrate
```

Inicie em desenvolvimento:

```bash
npm run dev
```

Inicie em produção:

```bash
npm start
```

## Execução com Docker

Construa e inicie os containers:

```bash
docker compose up -d --build
```

A API executa as migrations automaticamente antes de iniciar. Os serviços ficam disponíveis em:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Health check: http://localhost:3000/health

Verifique os containers e logs:

```bash
docker compose ps
docker compose logs api
```

Pare e remova os containers temporários:

```bash
docker compose down
```

Para remover também os volumes persistentes:

```bash
docker compose down -v
```

## Autenticação

Obtenha um JWT em `POST /v1/user/token`. Envie o token nas rotas protegidas:

```text
Authorization: Bearer <jwt>
```

Rotas protegidas: criação, atualização e remoção de categorias e produtos; atualização e remoção de usuários.

## API

A documentação interativa completa está disponível em `/api-docs`.

| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| GET | /health | Não | Verifica a disponibilidade da API |
| POST | /v1/user/token | Não | Gera um JWT |
| GET | /v1/user/:id | Não | Obtém um usuário |
| POST | /v1/user | Não | Cadastra um usuário |
| PUT | /v1/user/:id | JWT | Atualiza um usuário |
| DELETE | /v1/user/:id | JWT | Remove um usuário |
| GET | /v1/category/search | Não | Lista categorias com filtros e paginação |
| GET | /v1/category/:id | Não | Obtém uma categoria |
| POST | /v1/category | JWT | Cria uma categoria |
| PUT | /v1/category/:id | JWT | Atualiza uma categoria |
| DELETE | /v1/category/:id | JWT | Remove uma categoria |
| GET | /v1/product/search | Não | Lista produtos com filtros e paginação |
| GET | /v1/product/:id | Não | Obtém um produto |
| POST | /v1/product | JWT | Cria um produto |
| PUT | /v1/product/:id | JWT | Atualiza um produto |
| DELETE | /v1/product/:id | JWT | Remove um produto |

### Filtros de categorias

- `limit=-1` remove o limite de paginação.
- `limit` define itens por página. O padrão é 12.
- `page` define a página.
- `fields=name,slug` limita os campos.
- `use_in_menu=true` filtra categorias exibidas no menu.

### Filtros de produtos

- `limit=-1` retorna todos os itens.
- `page` e `limit` controlam a paginação.
- `fields=name,images,price` limita os campos.
- `match=Tenis` busca por nome ou descrição.
- `category_ids=15,24` filtra por categorias.
- `price-range=100-200` filtra por faixa de preço.
- `option[45]=GG,PP` filtra por valores de opções.

## Banco de dados

O schema é criado exclusivamente pelas migrations em `src/database/migrations`.

Entidades principais:

- users: dados pessoais, email único e senha com hash.
- categories: nome, slug único e indicação de menu.
- products: habilitação, nome, slug, estoque, descrição e preços.
- product_images: referência opcional ao produto e caminho relativo da imagem.
- product_options: título, formato, raio, tipo e valores separados por vírgula.
- product_categories: relação muitos para muitos entre produtos e categorias.

Chaves estrangeiras possuem atualização e remoção em cascata. Índices foram criados em emails, slugs, filtros e chaves estrangeiras.

## Testes

Execute os testes focados:

```bash
npm test
```

Os testes cobrem health check, Swagger, proteção por autenticação e resposta para rota inexistente.

## Qualidade e erros

Todas as rotas de escrita validam entrada com Joi. Os erros são padronizados por `AppError` e pelo error handler central. A API utiliza os códigos HTTP 200, 201, 204, 400, 401, 404, 409, 422 e 500 conforme o cenário.
