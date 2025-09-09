# 🐘 Guia Completo de Configuração PostgreSQL - MULTIVUS OS

## 📋 Resumo da Configuração

O projeto MULTIVUS OS está **totalmente configurado** para PostgreSQL com:
- ✅ Schema Prisma com 30+ tabelas
- ✅ Docker Compose para desenvolvimento
- ✅ Scripts de backup/restore automáticos
- ✅ Migrations e seeds configurados
- ✅ Conexão segura com pooling

---

## 🚀 Configuração Rápida (Desenvolvimento)

### 1. **Usando Docker (Recomendado)**

\`\`\`bash
# Clone o projeto
git clone <seu-repositorio>
cd multivus-os

# Configure as variáveis de ambiente
cp apps/api/.env.example apps/api/.env

# Edite o .env com suas configurações
nano apps/api/.env

# Suba o banco PostgreSQL
docker-compose up postgres -d

# Instale dependências
pnpm install

# Execute as migrations
cd apps/api
pnpm prisma migrate dev

# Execute o seed (dados iniciais)
pnpm prisma db seed

# Inicie a aplicação
pnpm dev
\`\`\`

### 2. **Instalação Local do PostgreSQL**

#### Ubuntu/Debian:
\`\`\`bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Configurar usuário
sudo -u postgres createuser --interactive multivus
sudo -u postgres createdb multivus_os

# Definir senha
sudo -u postgres psql
ALTER USER multivus PASSWORD 'sua_senha_aqui';
\q
\`\`\`

#### Windows:
\`\`\`bash
# Baixar e instalar PostgreSQL do site oficial
# https://www.postgresql.org/download/windows/

# Criar banco via pgAdmin ou psql
createdb -U postgres multivus_os
\`\`\`

#### macOS:
\`\`\`bash
# Usando Homebrew
brew install postgresql
brew services start postgresql

# Criar usuário e banco
createuser multivus
createdb multivus_os
\`\`\`

---

## ⚙️ Configuração das Variáveis de Ambiente

### Arquivo `.env` (apps/api/.env):

\`\`\`env
# 🗄️ DATABASE - PostgreSQL
DATABASE_URL="postgresql://multivus:SUA_SENHA@localhost:5432/multivus_os?schema=public"

# 🔐 SECURITY
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"
JWT_EXPIRES_IN="7d"

# 🌐 SERVER
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# 📁 UPLOADS
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# 📧 EMAIL (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"
SMTP_FROM="MULTIVUS <noreply@multivus.com>"

# 💰 PIX (Opcional)
PIX_ENVIRONMENT="sandbox"
PIX_WEBHOOK_URL="https://seudominio.com/api/webhooks/pix"

# 📱 WHATSAPP (Opcional)
WHATSAPP_API_URL="http://localhost:8080"
WHATSAPP_API_TOKEN="seu-token-whaticket"
\`\`\`

---

## 🗃️ Estrutura do Banco de Dados

### **Principais Tabelas:**

| Tabela | Descrição | Registros Típicos |
|--------|-----------|-------------------|
| `companies` | Empresas (Multi-tenant) | 1-100 |
| `branches` | Filiais por empresa | 1-50 por empresa |
| `users` | Usuários do sistema | 5-500 por empresa |
| `customers` | Clientes | 100-50.000 |
| `work_orders` | Ordens de Serviço | 1.000-100.000 |
| `products` | Produtos/Peças | 100-10.000 |
| `payments` | Pagamentos | 1.000-100.000 |
| `warranties` | Garantias | 500-50.000 |

### **Schema Completo:**
- 🏢 **Multi-tenant**: Empresas e filiais
- 👥 **Usuários**: Roles e autenticação
- 🛠️ **Ordens de Serviço**: Workflow completo
- 📦 **Estoque**: Produtos e movimentações
- 💰 **Financeiro**: Pagamentos e recebíveis
- 🔄 **Sincronização**: Suporte offline
- 📊 **Auditoria**: Logs completos

---

## 🛠️ Comandos Prisma Disponíveis

\`\`\`bash
# Navegar para o diretório da API
cd apps/api

# 🔄 Gerar cliente Prisma
pnpm prisma generate

# 📊 Visualizar banco (Prisma Studio)
pnpm prisma studio

# 🗄️ Push do schema (desenvolvimento)
pnpm prisma db push

# 📝 Criar migration
pnpm prisma migrate dev --name nome_da_migration

# 🌱 Executar seed (dados iniciais)
pnpm prisma db seed

# 🔍 Verificar status das migrations
pnpm prisma migrate status

# ⚠️ Reset do banco (CUIDADO!)
pnpm prisma migrate reset
\`\`\`

---

## 🐳 Configuração Docker Compose

### **Arquivo docker-compose.yml** (já configurado):

\`\`\`yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: multivus-postgres
    environment:
      POSTGRES_DB: multivus_os
      POSTGRES_USER: multivus
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U multivus"]
      interval: 30s
      timeout: 10s
      retries: 3
\`\`\`

### **Comandos Docker:**

\`\`\`bash
# Subir apenas o PostgreSQL
docker-compose up postgres -d

# Ver logs do banco
docker-compose logs postgres -f

# Conectar ao banco via psql
docker-compose exec postgres psql -U multivus -d multivus_os

# Backup manual
docker-compose exec postgres pg_dump -U multivus multivus_os > backup.sql

# Parar o banco
docker-compose down postgres
\`\`\`

---

## 💾 Sistema de Backup Automático

### **Script de Backup** (`scripts/backup.sh`):

\`\`\`bash
# Executar backup manual
./scripts/backup.sh

# Configurar backup automático (crontab)
crontab -e
# Adicionar: 0 2 * * * /caminho/para/backup.sh
\`\`\`

### **Restaurar Backup:**

\`\`\`bash
# Restaurar do backup mais recente
./scripts/restore.sh

# Restaurar backup específico
./scripts/restore.sh backup_2024-01-15_02-00-01.sql.gz
\`\`\`

---

## 🔧 Configuração de Produção

### **1. Otimizações PostgreSQL** (`postgresql.conf`):

\`\`\`conf
# Memória
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# Conexões
max_connections = 200
max_prepared_transactions = 200

# Logs
log_statement = 'mod'
log_min_duration_statement = 1000

# Checkpoint
checkpoint_completion_target = 0.9
wal_buffers = 16MB
\`\`\`

### **2. Segurança** (`pg_hba.conf`):

\`\`\`conf
# Conexões locais
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Conexões da aplicação
host    multivus_os     multivus        10.0.0.0/8              md5
\`\`\`

### **3. Monitoramento:**

\`\`\`bash
# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;

# Verificar tamanho do banco
SELECT pg_size_pretty(pg_database_size('multivus_os'));

# Verificar queries lentas
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
\`\`\`

---

## 🚨 Troubleshooting

### **Problemas Comuns:**

#### 1. **Erro de Conexão:**
\`\`\`bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar porta
sudo netstat -tlnp | grep 5432

# Testar conexão
psql -h localhost -U multivus -d multivus_os
\`\`\`

#### 2. **Erro de Permissão:**
\`\`\`sql
-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE multivus_os TO multivus;
GRANT ALL ON SCHEMA public TO multivus;
\`\`\`

#### 3. **Erro de Migration:**
\`\`\`bash
# Verificar status
pnpm prisma migrate status

# Resolver conflitos
pnpm prisma migrate resolve --applied "migration_name"

# Reset (CUIDADO!)
pnpm prisma migrate reset
\`\`\`

#### 4. **Performance Lenta:**
\`\`\`sql
-- Analisar queries
EXPLAIN ANALYZE SELECT * FROM work_orders WHERE status = 'IN_PROGRESS';

-- Recriar índices
REINDEX DATABASE multivus_os;

-- Atualizar estatísticas
ANALYZE;
\`\`\`

---

## 📊 Monitoramento e Métricas

### **Queries Úteis:**

\`\`\`sql
-- 📈 Estatísticas gerais
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables;

-- 🔍 Conexões por usuário
SELECT usename, count(*) 
FROM pg_stat_activity 
GROUP BY usename;

-- 💾 Uso de espaço por tabela
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- ⏱️ Queries mais lentas
SELECT 
  query,
  mean_exec_time,
  calls,
  total_exec_time
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
\`\`\`

---

## ✅ Checklist de Configuração

### **Desenvolvimento:**
- [ ] PostgreSQL instalado/Docker rodando
- [ ] Arquivo `.env` configurado
- [ ] `pnpm prisma generate` executado
- [ ] `pnpm prisma migrate dev` executado
- [ ] `pnpm prisma db seed` executado
- [ ] Aplicação conectando sem erros

### **Produção:**
- [ ] PostgreSQL otimizado
- [ ] Backup automático configurado
- [ ] SSL/TLS habilitado
- [ ] Firewall configurado
- [ ] Monitoramento ativo
- [ ] Logs configurados
- [ ] Usuários com permissões mínimas

---

## 🆘 Suporte

### **Logs Importantes:**
\`\`\`bash
# Logs do PostgreSQL
tail -f /var/log/postgresql/postgresql-15-main.log

# Logs da aplicação
tail -f apps/api/logs/app.log

# Logs do Docker
docker-compose logs postgres -f
\`\`\`

### **Comandos de Diagnóstico:**
\`\`\`bash
# Verificar versão
psql --version

# Verificar configuração
SHOW all;

# Verificar extensões
SELECT * FROM pg_extension;

# Verificar replicação
SELECT * FROM pg_stat_replication;
\`\`\`

---

## 🎯 Próximos Passos

1. **Configure o ambiente** seguindo este guia
2. **Execute os testes** com `pnpm test`
3. **Acesse o Prisma Studio** em `http://localhost:5555`
4. **Configure backups automáticos** para produção
5. **Monitore performance** com as queries fornecidas

---

**✨ O PostgreSQL está 100% configurado e pronto para uso!**

Para dúvidas específicas, consulte a documentação oficial do [PostgreSQL](https://www.postgresql.org/docs/) e [Prisma](https://www.prisma.io/docs/).
