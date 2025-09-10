## 🏗️ Arquitetura

\`\`\`
multivus-os/
├── backend/          # API NestJS separada
│   ├── src/          # Controllers, Services, Modules
│   ├── prisma/       # Schema e migrations
│   └── uploads/      # Arquivos enviados
├── frontend/         # Cliente Next.js separado
│   ├── app/          # Pages e layouts (App Router)
│   ├── components/   # Componentes reutilizáveis
│   └── lib/          # Utilitários e configurações
├── docs/             # Documentação completa
├── scripts/          # Scripts de automação e deploy
├── nginx.conf        # Configuração do Nginx
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

# Instale dependências para backend e frontend separadamente
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
# Volte para a raiz do projeto
cd ..

# Opção 1: Docker Compose (Recomendado)
docker-compose up postgres -d

# Opção 2: Script automático
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh
\`\`\`

### 3. Execute Migrations e Seed

\`\`\`bash
# Execute no diretório backend
cd backend
pnpm prisma migrate dev
pnpm prisma db seed
\`\`\`

### 4. Inicie os Serviços

\`\`\`bash
# Opção 1: Docker Compose (Recomendado)
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
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/api/docs
- **Prisma Studio**: `pnpm prisma studio` (porta 5555)


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
# Download e execute o script atualizado
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
# Instalar dependências separadamente
# Backend
cd backend
pnpm install
pnpm prisma migrate dev --name init
pnpm start:dev

# Frontend (novo terminal)
cd frontend
pnpm install
pnpm dev
\`\`\`


## 📋 Instalação Detalhada

### 🖥️ **Windows Local - Desenvolvimento**

#### Pré-requisitos Windows
\`\`\`bash
# 1. Instalar Node.js 18+ (https://nodejs.org)
# 2. Instalar PostgreSQL 15+ (https://www.postgresql.org/download/windows/)
# 3. Instalar Git (https://git-scm.com/download/win)
# 4. Instalar pnpm
npm install -g pnpm
\`\`\`

#### Configuração PostgreSQL Windows
\`\`\`bash
# 1. Durante instalação PostgreSQL, configure:
# - Usuário: postgres
# - Senha: postgres123 (ou sua preferência)
# - Porta: 5432

# 2. Criar banco de dados
psql -U postgres
CREATE DATABASE multivus_os;
CREATE USER multivus WITH PASSWORD 'multivus123';
GRANT ALL PRIVILEGES ON DATABASE multivus_os TO multivus;
\q
\`\`\`

#### Instalação Completa Windows
\`\`\`bash
# 1. Clone o repositório
git clone https://github.com/anozapvirus/multivus-os.git
cd multivus-os

# 2. Configure Backend
cd backend
pnpm install
copy .env.example .env

# Edite backend/.env com suas configurações:
# DATABASE_URL="postgresql://multivus:multivus123@localhost:5432/multivus_os"
# JWT_SECRET="seu-jwt-secret-super-seguro"
# FRONTEND_URL="http://localhost:3000"

# 3. Configure Frontend
cd ../frontend
pnpm install
copy .env.example .env

# Edite frontend/.env:
# NEXT_PUBLIC_API_URL="http://localhost:3001/api"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="seu-nextauth-secret"

# 4. Execute Migrations
cd ../backend
pnpm prisma migrate dev --name init
pnpm prisma db seed

# 5. Inicie os Serviços
# Terminal 1 - Backend
cd backend
pnpm start:dev

# Terminal 2 - Frontend (novo terminal)
cd frontend
pnpm dev
\`\`\`

#### Acessos Windows Local
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Documentação API**: http://localhost:3001/api/docs
- **Prisma Studio**: `pnpm prisma studio` (porta 5555)

---

### 🐧 **Ubuntu VPS - Produção**

#### Script de Instalação Automática (Recomendado)
\`\`\`bash
# 1. Conecte na sua VPS
ssh root@seu-servidor-ip

# 2. Execute o script de instalação
wget https://raw.githubusercontent.com/anozapvirus/multivus-os/main/scripts/install-ubuntu-complete.sh
chmod +x install-ubuntu-complete.sh
./install-ubuntu-complete.sh seudominio.com

# O script irá instalar automaticamente:
# - Docker e Docker Compose
# - PostgreSQL 15
# - Nginx com SSL (Let's Encrypt)
# - Configurar domínios e subdomínios
# - Configurar backup automático diário
# - Configurar firewall e segurança
# - Clonar e configurar o projeto
\`\`\`

#### Instalação Manual Ubuntu VPS
\`\`\`bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências
sudo apt install -y curl wget git nginx postgresql postgresql-contrib

# 3. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar pnpm
npm install -g pnpm

# 5. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 6. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 7. Configurar PostgreSQL
sudo -u postgres psql
CREATE DATABASE multivus_os;
CREATE USER multivus WITH PASSWORD 'senha-super-segura';
GRANT ALL PRIVILEGES ON DATABASE multivus_os TO multivus;
\q

# 8. Clone e configure o projeto
git clone https://github.com/anozapvirus/multivus-os.git
cd multivus-os

# 9. Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edite os arquivos .env com suas configurações de produção
nano backend/.env
nano frontend/.env

# 10. Configure domínios no Nginx
sudo cp nginx.conf /etc/nginx/sites-available/multivus
sudo ln -s /etc/nginx/sites-available/multivus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 11. Configure SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d admin.seudominio.com -d portal.seudominio.com -d api.seudominio.com

# 12. Inicie com Docker
docker-compose up -d

# 13. Configure backup automático
sudo cp scripts/backup-daily.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/backup-daily.sh
sudo crontab -e
# Adicione: 0 2 * * * /usr/local/bin/backup-daily.sh
\`\`\`

#### Configuração de Domínios Ubuntu
\`\`\`bash
# A    seudominio.com          -> IP_DA_VPS
# A    admin.seudominio.com    -> IP_DA_VPS  
# A    portal.seudominio.com   -> IP_DA_VPS
# A    api.seudominio.com      -> IP_DA_VPS

# Após configurar DNS, teste os acessos:
# - https://seudominio.com (Página inicial)
# - https://admin.seudominio.com (Área administrativa)
# - https://portal.seudominio.com (Portal do cliente)
# - https://api.seudominio.com (API backend)
\`\`\`

#### Backup Automático Ubuntu
\`\`\`bash
# - Backup do banco PostgreSQL
# - Backup dos arquivos enviados
# - Backup das configurações
# - Retenção de 30 dias
# - Logs em /var/log/multivus-backup.log

# Para restaurar backup:
sudo /usr/local/bin/restore-backup.sh /caminho/para/backup.tar.gz
\`\`\`

#### Monitoramento e Logs Ubuntu
\`\`\`bash
# Ver logs dos containers
docker-compose logs -f

# Ver status dos serviços
docker-compose ps

# Reiniciar serviços
docker-compose restart

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver logs do sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
\`\`\`

---

### 🔧 **Solução de Problemas Comuns**

#### Windows
\`\`\`bash
# Erro de conexão PostgreSQL
# 1. Verifique se PostgreSQL está rodando
# 2. Confirme usuário/senha no .env
# 3. Teste conexão: psql -U multivus -d multivus_os

# Erro de porta ocupada
# 1. Verifique processos: netstat -ano | findstr :3000
# 2. Mate processo: taskkill /PID <PID> /F

# Erro de permissão
# 1. Execute terminal como Administrador
# 2. Configure permissões: icacls pasta /grant Users:F
\`\`\`

#### Ubuntu VPS
\`\`\`bash
# Erro de SSL/HTTPS
sudo certbot renew --dry-run
sudo systemctl reload nginx

# Erro de memória
# Adicione swap se necessário
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Erro de firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
\`\`\`
