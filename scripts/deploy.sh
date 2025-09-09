#!/bin/bash

# MULTIVUS OS - Script de Deploy Automatizado
# Execute este script para fazer deploy da aplicação

set -e

echo "🚀 Iniciando deploy do MULTIVUS OS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] $1${NC}"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado"
    exit 1
fi

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    warn "Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    warn "⚠️  Configure o arquivo .env antes de continuar"
    exit 1
fi

# Fazer backup antes do deploy
log "Fazendo backup antes do deploy..."
if [ -f "scripts/backup.sh" ]; then
    ./scripts/backup.sh
else
    warn "Script de backup não encontrado"
fi

# Parar serviços existentes
log "Parando serviços existentes..."
docker-compose down --remove-orphans

# Fazer pull das imagens mais recentes
log "Atualizando imagens Docker..."
docker-compose pull

# Construir aplicação
log "Construindo aplicação..."
docker-compose build --no-cache

# Executar migrations do banco
log "Executando migrations do banco de dados..."
docker-compose run --rm app npx prisma migrate deploy

# Iniciar serviços
log "Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
log "Aguardando serviços ficarem prontos..."
sleep 30

# Verificar se aplicação está respondendo
log "Verificando se aplicação está funcionando..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Deploy concluído com sucesso!"
    log "🌐 Aplicação disponível em: http://localhost:3000"
else
    error "❌ Aplicação não está respondendo"
    log "Verificando logs..."
    docker-compose logs app
    exit 1
fi

# Limpeza de imagens antigas
log "Limpando imagens Docker antigas..."
docker image prune -f

log "🎉 Deploy finalizado!"
log "📊 Status dos serviços:"
docker-compose ps
