# Livraria Backend API

API REST completa para sistema de gerenciamento de livraria, desenvolvida com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

## 📋 Funcionalidades

### CRUD Completo para todas as entidades:

- **Autores** (`/autores`)
- **Livros** (`/livros`)
- **Categorias** (`/categorias`)
- **Editoras** (`/editoras`)

### Operações disponíveis:
- ✅ **GET** - Listar todos os registros
- ✅ **GET** `/:id` - Buscar por ID
- ✅ **POST** - Criar novo registro
- ✅ **PUT** `/:id` - Atualizar registro
- ✅ **DELETE** `/:id` - Deletar registro

## 🛠️ Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL
- Docker (opcional)

### Passos para instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/fabiolucenap/livraria.git
cd livraria
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados:**
```bash
# Com Docker (recomendado)
docker-compose up -d

# Ou configure manualmente o PostgreSQL
```

5. **Execute as migrações:**
```bash
npx prisma migrate dev
```

6. **Gere o cliente Prisma:**
```bash
npx prisma generate
```

7. **Inicie o servidor:**
```bash
npm run dev
```

## 📚 Documentação da API

### Autores

#### Listar autores
```http
GET /autores
```

#### Buscar autor por ID
```http
GET /autores/:id
```

#### Criar autor
```http
POST /autores
Content-Type: application/json

{
  "nome": "Machado de Assis",
  "email": "machado@email.com",
  "telefone": "11999999999",
  "bio": "Escritor brasileiro"
}
```

#### Atualizar autor
```http
PUT /autores/:id
Content-Type: application/json

{
  "nome": "Machado de Assis Atualizado"
}
```

#### Deletar autor
```http
DELETE /autores/:id
```

### Categorias

#### Listar categorias
```http
GET /categorias
```

#### Criar categoria
```http
POST /categorias
Content-Type: application/json

{
  "nome": "Ficção Científica"
}
```

### Editoras

#### Listar editoras
```http
GET /editoras
```

#### Criar editora
```http
POST /editoras
Content-Type: application/json

{
  "nome": "Editora Globo",
  "endereco": "Rua das Flores, 123",
  "telefone": "11999999999"
}
```

### Livros

#### Listar livros
```http
GET /livros
```

#### Criar livro
```http
POST /livros
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "resumo": "Romance de Machado de Assis",
  "ano": 1899,
  "paginas": 256,
  "isbn": "978-85-359-0277-5",
  "categoria_id": 1,
  "editora_id": 1,
  "autor_id": 1
}
```

## 🗄️ Estrutura do Banco de Dados

### Modelos Prisma:

```prisma
model Autor {
  id       Int     @id @default(autoincrement())
  nome     String  @db.VarChar(255)
  email    String  @unique @db.VarChar(255)
  telefone String? @db.VarChar(20)
  bio      String?
  livros   Livro[]
}

model Livro {
  id          Int   @id @default(autoincrement())
  titulo      String
  resumo      String?
  ano         Int
  paginas     Int?
  isbn        String
  categoria   Categoria @relation(fields: [categoria_id], references: [id])
  categoria_id Int
  editora     Editora   @relation(fields: [editora_id], references: [id])
  editora_id  Int
  autor       Autor     @relation(fields: [autor_id], references: [id])
  autor_id    Int
}

model Categoria {
  id    Int @id @default(autoincrement())
  nome  String @db.VarChar(50)
  livros Livro[]
}

model Editora {
  id       Int  @id @default(autoincrement())
  nome     String  @db.VarChar(255)
  endereco String?
  telefone String? @db.VarChar(20)
  livros   Livro[]
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

## 🐳 Docker

Para executar com Docker:

```bash
# Subir o banco de dados
docker-compose up -d

# Executar migrações
npx prisma migrate dev

# Iniciar aplicação
npm run dev
```

## 📝 Validações e Regras de Negócio

- **Email único** para autores
- **ISBN único** para livros
- **Nome único** para categorias e editoras
- **Proteção contra exclusão** de entidades com relacionamentos
- **Validação de relacionamentos** obrigatórios para livros
- **Tratamento de erros** completo com códigos HTTP apropriados

## 🌐 Endpoints

- **Base URL:** `http://localhost:3334`
- **Autores:** `/autores`
- **Livros:** `/livros`
- **Categorias:** `/categorias`
- **Editoras:** `/editoras`
- **Health Check:** `/ping`

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

**Fabio Lucena**
- GitHub: [@fabiolucenap](https://github.com/fabiolucenap)
