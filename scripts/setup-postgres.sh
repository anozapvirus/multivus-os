#!/bin/bash

# 🐘 Script de Configuração PostgreSQL - MULTIVUS OS
# Este script configura automaticamente o PostgreSQL para o projeto

set -e

echo "🚀 Configurando PostgreSQL para MULTIVUS OS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   error "Este script não deve ser executado como root"
   exit 1
fi

# Detectar sistema operacional
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    error "Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

log "Sistema detectado: $OS"

# Configurações padrão
DB_NAME="multivus_os"
DB_USER="multivus"
DB_HOST="localhost"
DB_PORT="5432"

# Solicitar senha do banco
echo -n "Digite a senha para o usuário PostgreSQL '$DB_USER': "
read -s DB_PASSWORD
echo

if [[ -z "$DB_PASSWORD" ]]; then
    error "Senha não pode estar vazia"
    exit 1
fi

# Função para instalar PostgreSQL no Linux
install_postgres_linux() {
    log "Instalando PostgreSQL no Linux..."
    
    # Detectar distribuição
    if command -v apt-get &> /dev/null; then
        # Debian/Ubuntu
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y postgresql-server postgresql-contrib
        sudo postgresql-setup initdb
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install -y postgresql-server postgresql-contrib
        sudo postgresql-setup --initdb
    else
        error "Gerenciador de pacotes não suportado"
        exit 1
    fi
    
    # Iniciar serviço
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
}

# Função para instalar PostgreSQL no macOS
install_postgres_macos() {
    log "Instalando PostgreSQL no macOS..."
    
    if ! command -v brew &> /dev/null; then
        error "Homebrew não encontrado. Instale em: https://brew.sh"
        exit 1
    fi
    
    brew install postgresql
    brew services start postgresql
}

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    warn "PostgreSQL não encontrado. Instalando..."
    
    case $OS in
        "linux")
            install_postgres_linux
            ;;
        "macos")
            install_postgres_macos
            ;;
        "windows")
            error "No Windows, baixe o PostgreSQL de: https://www.postgresql.org/download/windows/"
            exit 1
            ;;
    esac
else
    log "PostgreSQL já está instalado"
fi

# Verificar se PostgreSQL está rodando
if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    warn "PostgreSQL não está rodando. Tentando iniciar..."
    
    case $OS in
        "linux")
            sudo systemctl start postgresql
            ;;
        "macos")
            brew services start postgresql
            ;;
    esac
    
    sleep 3
    
    if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
        error "Não foi possível iniciar o PostgreSQL"
        exit 1
    fi
fi

log "PostgreSQL está rodando"

# Criar usuário e banco de dados
log "Criando usuário e banco de dados..."

# Verificar se usuário postgres existe
if sudo -u postgres psql -c '\du' | grep -q postgres; then
    POSTGRES_USER="postgres"
else
    # Tentar com usuário atual
    POSTGRES_USER=$(whoami)
fi

# Criar usuário multivus
sudo -u $POSTGRES_USER psql -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;
" 2>/dev/null || warn "Usuário $DB_USER já existe"

# Criar banco de dados
sudo -u $POSTGRES_USER psql -c "
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
" 2>/dev/null || warn "Banco $DB_NAME já existe"

# Dar permissões
sudo -u $POSTGRES_USER psql -c "
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
"

log "Usuário e banco criados com sucesso"

# Criar arquivo .env
ENV_FILE="apps/api/.env"
log "Criando arquivo de configuração: $ENV_FILE"

# Gerar JWT secret aleatório
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change-this-jwt-secret-in-production-$(date +%s)")

# Criar diretório se não existir
mkdir -p "$(dirname "$ENV_FILE")"

cat > "$ENV_FILE" << EOF
# 🗄️ DATABASE - PostgreSQL
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"

# 🔐 SECURITY
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="7d"

# 🌐 SERVER
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# 📁 UPLOADS
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# 📧 EMAIL (Configure conforme necessário)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-app"
SMTP_FROM="MULTIVUS <noreply@multivus.com>"

# 💰 PIX (Opcional - Configure se necessário)
PIX_ENVIRONMENT="sandbox"
PIX_WEBHOOK_URL="https://seudominio.com/api/webhooks/pix"

# 📱 WHATSAPP (Opcional - Configure se necessário)
WHATSAPP_API_URL="http://localhost:8080"
WHATSAPP_API_TOKEN="seu-token-whaticket"

# 💾 BACKUP
BACKUP_PATH="./backups"
BACKUP_RETENTION_DAYS=30

# 📊 OBSERVABILITY
LOG_LEVEL="info"
ENABLE_METRICS=true
EOF

log "Arquivo .env criado: $ENV_FILE"

# Verificar se Node.js e pnpm estão instalados
if ! command -v node &> /dev/null; then
    warn "Node.js não encontrado. Instale em: https://nodejs.org"
fi

if ! command -v pnpm &> /dev/null; then
    warn "pnpm não encontrado. Instale com: npm install -g pnpm"
fi

# Testar conexão
log "Testando conexão com o banco..."

if PGPASSWORD="$DB_PASSWORD" psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" &> /dev/null; then
    log "✅ Conexão com PostgreSQL estabelecida com sucesso!"
else
    error "❌ Falha na conexão com PostgreSQL"
    exit 1
fi

# Instruções finais
echo
echo -e "${BLUE}🎉 PostgreSQL configurado com sucesso!${NC}"
echo
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Instale as dependências: ${GREEN}pnpm install${NC}"
echo "2. Execute as migrations: ${GREEN}cd apps/api && pnpm prisma migrate dev${NC}"
echo "3. Execute o seed: ${GREEN}pnpm prisma db seed${NC}"
echo "4. Inicie a aplicação: ${GREEN}pnpm dev${NC}"
echo
echo -e "${YELLOW}Informações da configuração:${NC}"
echo "• Banco: $DB_NAME"
echo "• Usuário: $DB_USER"
echo "• Host: $DB_HOST:$DB_PORT"
echo "• Arquivo de config: $ENV_FILE"
echo
echo -e "${YELLOW}Comandos úteis:${NC}"
echo "• Prisma Studio: ${GREEN}cd apps/api && pnpm prisma studio${NC}"
echo "• Backup manual: ${GREEN}./scripts/backup.sh${NC}"
echo "• Logs PostgreSQL: ${GREEN}sudo journalctl -u postgresql -f${NC}"
echo
echo -e "${GREEN}✨ Configuração concluída!${NC}"
