... existing code ...

## 🏗️ Arquitetura

\`\`\`
multivus-os/
├── backend/          # <CHANGE> API NestJS separada
│   ├── src/          # Controllers, Services, Modules
│   ├── prisma/       # Schema e migrations
│   └── uploads/      # Arquivos enviados
├── frontend/         # <CHANGE> Cliente Next.js separado
│   ├── app/          # Pages e layouts (App Router)
│   ├── components/   # Componentes reutilizáveis
│   └── lib/          # Utilitários e configurações
├── docs/             # Documentação completa
├── scripts/          # Scripts de automação e deploy
└── docker-compose.yml # Orquestração de serviços
\`\`\`

### 🛠️ Stack Tecnológica

**Backend (Porta 3001):**
- NestJS + Fastify (Performance)
- Prisma ORM (Type-safe)
- PostgreSQL (Produção)
- JWT + Bcrypt (Segurança)
- Swagger (Documentação API)

**Frontend (Porta 3000):**
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- PWA (Service Worker)
- Axios (HTTP Client)
- React Hook Form + Zod

**Infraestrutura:**
- Docker + Docker Compose
- Nginx (Reverse Proxy + Domínios)
- PostgreSQL 15
- Scripts de backup automático

... existing code ...

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 15+
- pnpm (recomendado)
- Docker (opcional)

### 1. Clone e Configure

\`\`\`bash
# Clone o repositório
git clone https://github.com/anozapvirus/multivus-os.git
cd multivus-os

# <CHANGE> Instale dependências para backend e frontend separadamente
# Backend
cd backend
pnpm install
cp .env.example .env

# Frontend  
cd ../frontend
pnpm install
cp .env.example .env
\`\`\`

### 2. Configure o Banco de Dados

\`\`\`bash
# <CHANGE> Volte para a raiz do projeto
cd ..

# Opção 1: Docker Compose (Recomendado)
docker-compose up postgres -d

# Opção 2: Script automático
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh
\`\`\`

### 3. Execute Migrations e Seed

\`\`\`bash
# <CHANGE> Execute no diretório backend
cd backend
pnpm prisma migrate dev
pnpm prisma db seed
\`\`\`

### 4. Inicie os Serviços

\`\`\`bash
# <CHANGE> Opção 1: Docker Compose (Recomendado)
cd ..
docker-compose up -d

# Opção 2: Desenvolvimento separado
# Terminal 1 - Backend
cd backend
pnpm start:dev

# Terminal 2 - Frontend  
cd frontend
pnpm dev
\`\`\`

### 🎉 Pronto!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Prisma Studio**: http://localhost:5555

... existing code ...

## 🚀 Deploy em Produção

### Opção 1: Docker Compose com Domínios (Recomendado)

\`\`\`bash
# 1. Configure domínios locais (desenvolvimento)
sudo ./scripts/setup-local-domains.sh

# 2. Configure variáveis de produção
cp .env.example .env
# Edite o .env com suas configurações

# 3. Suba todos os serviços
docker-compose up -d

# 4. Configure SSL para produção
sudo ./scripts/setup-production-domains.sh seudominio.com
\`\`\`

**Acessos com domínios:**
- **Portal Principal**: http://multivus.local
- **Área Administrativa**: http://admin.multivus.local  
- **Portal do Cliente**: http://portal.multivus.local
- **API Backend**: http://api.multivus.local

### Opção 2: VPS Ubuntu (Script Automatizado)

\`\`\`bash
# <CHANGE> Download e execute o script atualizado
wget https://raw.githubusercontent.com/anozapvirus/multivus-os/main/scripts/deploy-production.sh
chmod +x deploy-production.sh
./deploy-production.sh seudominio.com

# O script irá:
# - Instalar Docker e dependências
# - Configurar PostgreSQL
# - Configurar Nginx com domínios separados
# - Configurar SSL automático (Let's Encrypt)
# - Configurar backup automático
# - Configurar firewall e segurança
\`\`\`

### Opção 3: Desenvolvimento Manual

\`\`\`bash
# <CHANGE> Instalar dependências separadamente
# Backend
cd backend
pnpm install
pnpm prisma migrate dev
pnpm start:dev

# Frontend (novo terminal)
cd frontend  
pnpm install
pnpm dev
\`\`\`

... existing code ...
\`\`\`

```yaml file="" isHidden
