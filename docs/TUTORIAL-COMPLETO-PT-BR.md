# 🇧🇷 Tutorial Completo MULTIVUS OS - Português Brasil

## 📋 Índice

1. [🪟 Instalação Local Windows](#-instalação-local-windows)
2. [🐧 Instalação VPS Ubuntu](#-instalação-vps-ubuntu)
3. [💾 Sistema de Backup Automático](#-sistema-de-backup-automático)
4. [🔧 Manutenção e Monitoramento](#-manutenção-e-monitoramento)
5. [🆘 Solução de Problemas](#-solução-de-problemas)

---

## 🪟 Instalação Local Windows

### Pré-requisitos

- Windows 10/11
- 8GB RAM (mínimo 4GB)
- 20GB espaço livre
- Conexão com internet

### Passo 1: Instalar Ferramentas Necessárias

#### 1.1 Instalar Node.js
\`\`\`bash
# Baixe e instale do site oficial
https://nodejs.org/pt-br/download/

# Versão recomendada: 18.x LTS
# Durante instalação, marque "Add to PATH"
\`\`\`

#### 1.2 Instalar Git
\`\`\`bash
# Baixe e instale do site oficial
https://git-scm.com/download/win

# Durante instalação, use configurações padrão
\`\`\`

#### 1.3 Instalar PostgreSQL
\`\`\`bash
# Baixe e instale do site oficial
https://www.postgresql.org/download/windows/

# Durante instalação:
# - Usuário: postgres
# - Senha: anote a senha (ex: postgres123)
# - Porta: 5432 (padrão)
# - Marque pgAdmin 4
\`\`\`

#### 1.4 Instalar pnpm (Gerenciador de Pacotes)
\`\`\`bash
# Abra PowerShell como Administrador
npm install -g pnpm

# Verificar instalação
pnpm --version
\`\`\`

### Passo 2: Configurar Banco de Dados

#### 2.1 Criar Banco via pgAdmin
\`\`\`sql
-- Abra pgAdmin 4
-- Conecte com usuário postgres
-- Clique direito em "Databases" > Create > Database

-- Nome: multivus_os
-- Owner: postgres
-- Encoding: UTF8
\`\`\`

#### 2.2 Criar Usuário Específico
\`\`\`sql
-- No Query Tool do pgAdmin, execute:

-- Criar usuário
CREATE USER multivus WITH PASSWORD 'multivus123';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE multivus_os TO multivus;
GRANT ALL ON SCHEMA public TO multivus;
ALTER USER multivus CREATEDB;
\`\`\`

### Passo 3: Baixar e Configurar Projeto

#### 3.1 Clonar Repositório
\`\`\`bash
# Abra PowerShell ou CMD
# Navegue até onde quer instalar (ex: C:\projetos)
cd C:\projetos

# Clone o projeto
git clone https://github.com/seu-usuario/multivus-os.git
cd multivus-os
\`\`\`

#### 3.2 Instalar Dependências
\`\`\`bash
# Instalar todas as dependências
pnpm install

# Aguarde a instalação (pode demorar alguns minutos)
\`\`\`

#### 3.3 Configurar Variáveis de Ambiente
\`\`\`bash
# Copie o arquivo de exemplo
copy apps\api\.env.example apps\api\.env

# Edite o arquivo .env com Notepad ou VS Code
notepad apps\api\.env
\`\`\`

#### 3.4 Configuração do arquivo .env
\`\`\`env
# 🗄️ DATABASE - PostgreSQL Local
DATABASE_URL="postgresql://multivus:multivus123@localhost:5432/multivus_os?schema=public"

# 🔐 SECURITY
JWT_SECRET="meu-jwt-secret-super-seguro-local-123"
JWT_EXPIRES_IN="7d"

# 🌐 SERVER
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# 📁 UPLOADS
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# 📧 EMAIL (Opcional para desenvolvimento)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"
SMTP_FROM="MULTIVUS <noreply@multivus.com>"

# 💰 PIX (Opcional)
PIX_ENVIRONMENT="sandbox"
PIX_WEBHOOK_URL="http://localhost:3001/api/webhooks/pix"
\`\`\`

### Passo 4: Configurar Banco de Dados

#### 4.1 Executar Migrations
\`\`\`bash
# Navegar para pasta da API
cd apps\api

# Gerar cliente Prisma
pnpm prisma generate

# Executar migrations (criar tabelas)
pnpm prisma migrate dev

# Quando perguntado o nome da migration, digite: init
\`\`\`

#### 4.2 Popular Banco com Dados Iniciais
\`\`\`bash
# Executar seed (dados de exemplo)
pnpm prisma db seed

# Verificar se funcionou
pnpm prisma studio
# Abrirá no navegador: http://localhost:5555
\`\`\`

### Passo 5: Executar Aplicação

#### 5.1 Iniciar Servidor de Desenvolvimento
\`\`\`bash
# Voltar para raiz do projeto
cd ..\..

# Iniciar todos os serviços
pnpm dev

# Ou iniciar separadamente:
# pnpm dev:api    # API na porta 3001
# pnpm dev:web    # Frontend na porta 3000
\`\`\`

#### 5.2 Acessar Aplicação
\`\`\`bash
# Frontend (Interface Principal)
http://localhost:3000

# API (Documentação Swagger)
http://localhost:3001/api/docs

# Prisma Studio (Visualizar Banco)
http://localhost:5555
\`\`\`

### Passo 6: Login Inicial

#### 6.1 Usuário Padrão Criado pelo Seed
\`\`\`
Email: admin@multivus.com
Senha: admin123

# OU criar novo usuário via Prisma Studio
\`\`\`

---

## 🐧 Instalação VPS Ubuntu

### Pré-requisitos VPS

- Ubuntu 20.04 LTS ou superior
- 2GB RAM (recomendado 4GB+)
- 20GB SSD (recomendado 50GB+)
- Acesso root via SSH
- Domínio apontado para VPS (opcional)

### Passo 1: Preparar Servidor

#### 1.1 Conectar via SSH
\`\`\`bash
# Do seu computador, conecte na VPS
ssh root@SEU_IP_VPS

# Ou se tiver usuário específico:
ssh usuario@SEU_IP_VPS
\`\`\`

#### 1.2 Atualizar Sistema
\`\`\`bash
# Atualizar pacotes
apt update && apt upgrade -y

# Instalar ferramentas básicas
apt install -y curl wget git unzip nano htop
\`\`\`

#### 1.3 Criar Usuário para Aplicação (se usando root)
\`\`\`bash
# Criar usuário
adduser multivus

# Adicionar ao grupo sudo
usermod -aG sudo multivus

# Trocar para o usuário
su - multivus
\`\`\`

### Passo 2: Instalar Dependências

#### 2.1 Instalar Node.js
\`\`\`bash
# Instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
\`\`\`

#### 2.2 Instalar pnpm
\`\`\`bash
# Instalar pnpm globalmente
sudo npm install -g pnpm

# Verificar
pnpm --version
\`\`\`

#### 2.3 Instalar PostgreSQL
\`\`\`bash
# Instalar PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar status
sudo systemctl status postgresql
\`\`\`

#### 2.4 Instalar Docker (Opcional)
\`\`\`bash
# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sessão para aplicar mudanças
exit
# Conectar novamente via SSH
\`\`\`

### Passo 3: Configurar PostgreSQL

#### 3.1 Configurar Usuário e Banco
\`\`\`bash
# Trocar para usuário postgres
sudo -u postgres psql

# Dentro do PostgreSQL, executar:
CREATE USER multivus WITH PASSWORD 'SUA_SENHA_SEGURA_AQUI';
CREATE DATABASE multivus_os OWNER multivus;
GRANT ALL PRIVILEGES ON DATABASE multivus_os TO multivus;
ALTER USER multivus CREATEDB;

# Sair do PostgreSQL
\q
\`\`\`

#### 3.2 Configurar Acesso Remoto (se necessário)
\`\`\`bash
# Editar configuração PostgreSQL
sudo nano /etc/postgresql/15/main/postgresql.conf

# Encontrar e alterar:
listen_addresses = 'localhost'  # ou '*' para acesso externo

# Editar autenticação
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Adicionar linha para aplicação:
host    multivus_os     multivus        127.0.0.1/32            md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
\`\`\`

### Passo 4: Instalar Aplicação

#### 4.1 Clonar Repositório
\`\`\`bash
# Criar diretório para aplicação
sudo mkdir -p /opt/multivus
sudo chown $USER:$USER /opt/multivus
cd /opt/multivus

# Clonar projeto
git clone https://github.com/seu-usuario/multivus-os.git .
\`\`\`

#### 4.2 Configurar Ambiente
\`\`\`bash
# Copiar arquivo de ambiente
cp apps/api/.env.example apps/api/.env

# Editar configurações
nano apps/api/.env
\`\`\`

#### 4.3 Configuração .env para Produção
\`\`\`env
# 🗄️ DATABASE - PostgreSQL Produção
DATABASE_URL="postgresql://multivus:SUA_SENHA_SEGURA@localhost:5432/multivus_os?schema=public"

# 🔐 SECURITY - GERAR SENHAS SEGURAS!
JWT_SECRET="$(openssl rand -base64 64)"
JWT_EXPIRES_IN="7d"

# 🌐 SERVER
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://seudominio.com"

# 📁 UPLOADS
MAX_FILE_SIZE=10485760
UPLOAD_PATH="/opt/multivus/uploads"

# 📧 EMAIL - CONFIGURAR COM SEU PROVEDOR
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"
SMTP_FROM="MULTIVUS <noreply@seudominio.com>"

# 💰 PIX - CONFIGURAR SE USAR
PIX_ENVIRONMENT="production"
PIX_WEBHOOK_URL="https://seudominio.com/api/webhooks/pix"
\`\`\`

#### 4.4 Instalar Dependências e Configurar
\`\`\`bash
# Instalar dependências
pnpm install

# Navegar para API
cd apps/api

# Gerar cliente Prisma
pnpm prisma generate

# Executar migrations
pnpm prisma migrate deploy

# Popular com dados iniciais
pnpm prisma db seed

# Voltar para raiz
cd ../..
\`\`\`

### Passo 5: Configurar Nginx

#### 5.1 Instalar Nginx
\`\`\`bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar e habilitar
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

#### 5.2 Configurar Virtual Host
\`\`\`bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/multivus
\`\`\`

#### 5.3 Configuração Nginx
\`\`\`nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    # Redirecionar HTTP para HTTPS (após SSL)
    # return 301 https://$server_name$request_uri;
    
    # Configuração temporária para HTTP
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Tamanho máximo de upload
    client_max_body_size 100M;
}
\`\`\`

#### 5.4 Ativar Site
\`\`\`bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/multivus /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
\`\`\`

### Passo 6: Configurar SSL (HTTPS)

#### 6.1 Instalar Certbot
\`\`\`bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx
\`\`\`

#### 6.2 Obter Certificado SSL
\`\`\`bash
# Gerar certificado (substitua pelo seu domínio)
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Seguir instruções na tela
# Escolher opção 2 (redirecionar HTTP para HTTPS)
\`\`\`

#### 6.3 Configurar Renovação Automática
\`\`\`bash
# Testar renovação
sudo certbot renew --dry-run

# Adicionar ao crontab para renovação automática
sudo crontab -e

# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

### Passo 7: Configurar Serviço Systemd

#### 7.1 Criar Serviço para API
\`\`\`bash
# Criar arquivo de serviço
sudo nano /etc/systemd/system/multivus-api.service
\`\`\`

#### 7.2 Configuração do Serviço API
\`\`\`ini
[Unit]
Description=MULTIVUS OS API
After=network.target postgresql.service

[Service]
Type=simple
User=multivus
WorkingDirectory=/opt/multivus/apps/api
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

#### 7.3 Criar Serviço para Frontend
\`\`\`bash
# Criar arquivo de serviço
sudo nano /etc/systemd/system/multivus-web.service
\`\`\`

#### 7.4 Configuração do Serviço Web
\`\`\`ini
[Unit]
Description=MULTIVUS OS Web Frontend
After=network.target

[Service]
Type=simple
User=multivus
WorkingDirectory=/opt/multivus/apps/web
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

#### 7.5 Ativar e Iniciar Serviços
\`\`\`bash
# Recarregar systemd
sudo systemctl daemon-reload

# Habilitar serviços
sudo systemctl enable multivus-api
sudo systemctl enable multivus-web

# Iniciar serviços
sudo systemctl start multivus-api
sudo systemctl start multivus-web

# Verificar status
sudo systemctl status multivus-api
sudo systemctl status multivus-web
\`\`\`

---

## 💾 Sistema de Backup Automático

### Passo 1: Criar Scripts de Backup

#### 1.1 Script Principal de Backup
\`\`\`bash
# Criar diretório para scripts
mkdir -p /opt/multivus/scripts

# Criar script de backup
nano /opt/multivus/scripts/backup-completo.sh
\`\`\`

#### 1.2 Conteúdo do Script de Backup
\`\`\`bash
#!/bin/bash

# MULTIVUS OS - Script de Backup Completo
# Executa backup do banco de dados e arquivos

# Configurações
BACKUP_DIR="/opt/multivus/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
DB_NAME="multivus_os"
DB_USER="multivus"
APP_DIR="/opt/multivus"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função de log
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] AVISO: $1${NC}"
}

# Criar diretório de backup
mkdir -p $BACKUP_DIR

log "Iniciando backup completo do MULTIVUS OS..."

# 1. Backup do Banco de Dados
log "Fazendo backup do banco de dados..."
if pg_dump -h localhost -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/database_$DATE.sql.gz; then
    log "Backup do banco concluído: database_$DATE.sql.gz"
else
    error "Falha no backup do banco de dados"
    exit 1
fi

# 2. Backup dos Arquivos de Upload
log "Fazendo backup dos arquivos de upload..."
if [ -d "$APP_DIR/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR uploads
    log "Backup dos uploads concluído: uploads_$DATE.tar.gz"
else
    warn "Diretório de uploads não encontrado"
fi

# 3. Backup das Configurações
log "Fazendo backup das configurações..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz -C $APP_DIR apps/api/.env apps/web/.env.local 2>/dev/null || true
log "Backup das configurações concluído: config_$DATE.tar.gz"

# 4. Backup dos Logs
log "Fazendo backup dos logs..."
if [ -d "$APP_DIR/logs" ]; then
    tar -czf $BACKUP_DIR/logs_$DATE.tar.gz -C $APP_DIR logs
    log "Backup dos logs concluído: logs_$DATE.tar.gz"
fi

# 5. Criar arquivo de informações do backup
cat > $BACKUP_DIR/info_$DATE.txt << EOF
MULTIVUS OS - Informações do Backup
Data: $(date)
Servidor: $(hostname)
Versão do Sistema: $(lsb_release -d | cut -f2)
Espaço em Disco: $(df -h $BACKUP_DIR | tail -1)

Arquivos incluídos:
- database_$DATE.sql.gz (Banco PostgreSQL)
- uploads_$DATE.tar.gz (Arquivos de upload)
- config_$DATE.tar.gz (Configurações)
- logs_$DATE.tar.gz (Logs do sistema)

Para restaurar:
1. Banco: gunzip -c database_$DATE.sql.gz | psql -U $DB_USER -d $DB_NAME
2. Uploads: tar -xzf uploads_$DATE.tar.gz -C $APP_DIR
3. Config: tar -xzf config_$DATE.tar.gz -C $APP_DIR
EOF

# 6. Limpeza de backups antigos
log "Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.txt" -mtime +$RETENTION_DAYS -delete

# 7. Verificar espaço em disco
DISK_USAGE=$(df $BACKUP_DIR | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    warn "Espaço em disco baixo: ${DISK_USAGE}% usado"
fi

# 8. Estatísticas do backup
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Backup concluído com sucesso!"
log "Tamanho total dos backups: $BACKUP_SIZE"
log "Arquivos salvos em: $BACKUP_DIR"

# 9. Enviar notificação (opcional)
# curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
#      -d "chat_id=<CHAT_ID>" \
#      -d "text=✅ Backup MULTIVUS OS concluído: $DATE"
\`\`\`

#### 1.3 Tornar Script Executável
\`\`\`bash
# Dar permissão de execução
chmod +x /opt/multivus/scripts/backup-completo.sh

# Testar execução
/opt/multivus/scripts/backup-completo.sh
\`\`\`

### Passo 2: Script de Restauração

#### 2.1 Criar Script de Restore
\`\`\`bash
# Criar script de restauração
nano /opt/multivus/scripts/restore-backup.sh
\`\`\`

#### 2.2 Conteúdo do Script de Restore
\`\`\`bash
#!/bin/bash

# MULTIVUS OS - Script de Restauração de Backup

BACKUP_DIR="/opt/multivus/backups"
APP_DIR="/opt/multivus"
DB_NAME="multivus_os"
DB_USER="multivus"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: $1${NC}"
}

# Verificar parâmetro
if [ -z "$1" ]; then
    echo "Uso: $0 <data_backup>"
    echo "Exemplo: $0 20241208_140000"
    echo ""
    echo "Backups disponíveis:"
    ls -la $BACKUP_DIR/database_*.sql.gz | awk '{print $9}' | sed 's/.*database_//' | sed 's/.sql.gz//'
    exit 1
fi

BACKUP_DATE=$1

# Verificar se backup existe
if [ ! -f "$BACKUP_DIR/database_$BACKUP_DATE.sql.gz" ]; then
    error "Backup não encontrado: database_$BACKUP_DATE.sql.gz"
    exit 1
fi

log "Iniciando restauração do backup: $BACKUP_DATE"

# Confirmar restauração
read -p "⚠️  ATENÇÃO: Isso irá SOBRESCREVER todos os dados atuais. Continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log "Restauração cancelada pelo usuário"
    exit 0
fi

# Parar serviços
log "Parando serviços..."
sudo systemctl stop multivus-api
sudo systemctl stop multivus-web

# Restaurar banco de dados
log "Restaurando banco de dados..."
dropdb -U $DB_USER $DB_NAME 2>/dev/null || true
createdb -U $DB_USER $DB_NAME
gunzip -c $BACKUP_DIR/database_$BACKUP_DATE.sql.gz | psql -U $DB_USER -d $DB_NAME

# Restaurar uploads
if [ -f "$BACKUP_DIR/uploads_$BACKUP_DATE.tar.gz" ]; then
    log "Restaurando arquivos de upload..."
    rm -rf $APP_DIR/uploads
    tar -xzf $BACKUP_DIR/uploads_$BACKUP_DATE.tar.gz -C $APP_DIR
fi

# Restaurar configurações (opcional)
if [ -f "$BACKUP_DIR/config_$BACKUP_DATE.tar.gz" ]; then
    log "Restaurando configurações..."
    tar -xzf $BACKUP_DIR/config_$BACKUP_DATE.tar.gz -C $APP_DIR
fi

# Reiniciar serviços
log "Reiniciando serviços..."
sudo systemctl start multivus-api
sudo systemctl start multivus-web

log "Restauração concluída com sucesso!"
log "Verifique se os serviços estão funcionando:"
log "- sudo systemctl status multivus-api"
log "- sudo systemctl status multivus-web"
\`\`\`

#### 2.3 Tornar Script Executável
\`\`\`bash
chmod +x /opt/multivus/scripts/restore-backup.sh
\`\`\`

### Passo 3: Configurar Backup Automático

#### 3.1 Configurar Crontab
\`\`\`bash
# Editar crontab do usuário
crontab -e

# Adicionar linha para backup diário às 2h da manhã:
0 2 * * * /opt/multivus/scripts/backup-completo.sh >> /var/log/multivus-backup.log 2>&1

# Adicionar linha para backup semanal completo aos domingos às 3h:
0 3 * * 0 /opt/multivus/scripts/backup-completo.sh >> /var/log/multivus-backup-weekly.log 2>&1
\`\`\`

#### 3.2 Configurar Rotação de Logs
\`\`\`bash
# Criar configuração de logrotate
sudo nano /etc/logrotate.d/multivus
\`\`\`

#### 3.3 Configuração do Logrotate
\`\`\`
/var/log/multivus-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 multivus multivus
}
\`\`\`

### Passo 4: Backup Remoto (Opcional)

#### 4.1 Configurar Backup para AWS S3
\`\`\`bash
# Instalar AWS CLI
sudo apt install -y awscli

# Configurar credenciais
aws configure
# AWS Access Key ID: SUA_ACCESS_KEY
# AWS Secret Access Key: SUA_SECRET_KEY
# Default region: us-east-1
# Default output format: json
\`\`\`

#### 4.2 Script de Backup Remoto
\`\`\`bash
# Criar script de backup remoto
nano /opt/multivus/scripts/backup-s3.sh
\`\`\`

#### 4.3 Conteúdo do Backup S3
\`\`\`bash
#!/bin/bash

# Backup para AWS S3
BACKUP_DIR="/opt/multivus/backups"
S3_BUCKET="seu-bucket-backup"
DATE=$(date +%Y%m%d_%H%M%S)

# Sincronizar backups locais com S3
aws s3 sync $BACKUP_DIR s3://$S3_BUCKET/multivus-backups/

# Manter apenas últimos 90 dias no S3
aws s3 ls s3://$S3_BUCKET/multivus-backups/ | while read -r line; do
    createDate=$(echo $line | awk '{print $1" "$2}')
    createDate=$(date -d "$createDate" +%s)
    olderThan=$(date -d "90 days ago" +%s)
    if [[ $createDate -lt $olderThan ]]; then
        fileName=$(echo $line | awk '{print $4}')
        if [[ $fileName != "" ]]; then
            aws s3 rm s3://$S3_BUCKET/multivus-backups/$fileName
        fi
    fi
done

echo "Backup S3 concluído: $DATE"
\`\`\`

---

## 🔧 Manutenção e Monitoramento

### Comandos Úteis de Manutenção

#### Verificar Status dos Serviços
\`\`\`bash
# Status geral
sudo systemctl status multivus-api multivus-web

# Logs em tempo real
sudo journalctl -f -u multivus-api
sudo journalctl -f -u multivus-web

# Logs específicos
tail -f /var/log/multivus-backup.log
\`\`\`

#### Monitorar Recursos
\`\`\`bash
# Uso de CPU e memória
htop

# Espaço em disco
df -h

# Uso do banco de dados
sudo -u postgres psql -d multivus_os -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
"
\`\`\`

#### Atualizar Sistema
\`\`\`bash
# Atualizar código
cd /opt/multivus
git pull origin main

# Reinstalar dependências
pnpm install

# Executar migrations
cd apps/api
pnpm prisma migrate deploy

# Reiniciar serviços
sudo systemctl restart multivus-api multivus-web
\`\`\`

---

## 🆘 Solução de Problemas

### Problemas Comuns

#### 1. Serviço não inicia
\`\`\`bash
# Verificar logs
sudo journalctl -u multivus-api --no-pager

# Verificar configuração
nano /opt/multivus/apps/api/.env

# Testar conexão com banco
psql -h localhost -U multivus -d multivus_os -c "SELECT 1;"
\`\`\`

#### 2. Erro de conexão com banco
\`\`\`bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar conexões ativas
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
\`\`\`

#### 3. Erro de permissões
\`\`\`bash
# Corrigir permissões dos arquivos
sudo chown -R multivus:multivus /opt/multivus
chmod +x /opt/multivus/scripts/*.sh
\`\`\`

#### 4. Espaço em disco cheio
\`\`\`bash
# Verificar uso
df -h

# Limpar logs antigos
sudo journalctl --vacuum-time=7d

# Limpar backups antigos
find /opt/multivus/backups -name "*.gz" -mtime +30 -delete
\`\`\`

#### 5. SSL não funciona
\`\`\`bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew

# Testar configuração Nginx
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Scripts de Diagnóstico

#### Script de Verificação Completa
\`\`\`bash
# Criar script de diagnóstico
nano /opt/multivus/scripts/diagnostico.sh
\`\`\`

\`\`\`bash
#!/bin/bash

echo "=== DIAGNÓSTICO MULTIVUS OS ==="
echo "Data: $(date)"
echo ""

echo "1. STATUS DOS SERVIÇOS:"
systemctl is-active multivus-api multivus-web postgresql nginx

echo ""
echo "2. CONEXÃO COM BANCO:"
psql -h localhost -U multivus -d multivus_os -c "SELECT 'OK' as status;" 2>/dev/null || echo "ERRO"

echo ""
echo "3. ESPAÇO EM DISCO:"
df -h /opt/multivus

echo ""
echo "4. MEMÓRIA:"
free -h

echo ""
echo "5. ÚLTIMOS BACKUPS:"
ls -la /opt/multivus/backups/ | tail -5

echo ""
echo "6. LOGS DE ERRO (últimas 10 linhas):"
sudo journalctl -u multivus-api --no-pager | tail -10
\`\`\`

\`\`\`bash
chmod +x /opt/multivus/scripts/diagnostico.sh
\`\`\`

---

## 📞 Suporte e Contatos

### Canais de Suporte
- **Email**: suporte@multivus.com
- **WhatsApp**: +55 (11) 99999-9999
- **GitHub**: https://github.com/seu-usuario/multivus-os/issues

### Documentação Adicional
- [Documentação da API](docs/API.md)
- [Guia PostgreSQL](docs/POSTGRESQL-SETUP.md)
- [FAQ](docs/FAQ.md)

---

**✅ Tutorial completo finalizado!**

**🎉 Seu MULTIVUS OS está pronto para uso em produção!**

Para dúvidas específicas, consulte a documentação ou entre em contato com o suporte.
