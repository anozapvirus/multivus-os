#!/bin/bash

echo "🚀 Configurando domínios de produção para MULTIVUS OS..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script precisa ser executado como root"
    exit 1
fi

# Get domain from user
read -p "Digite o domínio principal (ex: multivus.com): " MAIN_DOMAIN

if [ -z "$MAIN_DOMAIN" ]; then
    echo "❌ Domínio é obrigatório"
    exit 1
fi

# Create environment file with domains
cat > .env.production << EOF
# Production Domains
MAIN_DOMAIN=$MAIN_DOMAIN
ADMIN_DOMAIN=admin.$MAIN_DOMAIN
CLIENT_DOMAIN=portal.$MAIN_DOMAIN

# API Configuration
NEXT_PUBLIC_API_URL=https://$MAIN_DOMAIN
FRONTEND_URL=https://$MAIN_DOMAIN

# Database
DATABASE_NAME=multivus_os
DATABASE_USER=multivus
DATABASE_PASSWORD=$(openssl rand -base64 32)

# Security
JWT_SECRET=$(openssl rand -base64 64)
REDIS_PASSWORD=$(openssl rand -base64 32)
EOF

echo "✅ Arquivo .env.production criado"

# Install Certbot for SSL certificates
apt update
apt install -y certbot python3-certbot-nginx

# Generate SSL certificates
echo "🔒 Gerando certificados SSL..."
certbot certonly --standalone -d $MAIN_DOMAIN -d admin.$MAIN_DOMAIN -d portal.$MAIN_DOMAIN --agree-tos --no-eff-email

if [ $? -eq 0 ]; then
    echo "✅ Certificados SSL gerados com sucesso"
    
    # Update nginx configuration for HTTPS
    sed -i 's/# return 301 https/return 301 https/g' nginx.conf
    sed -i 's/# server {/server {/g' nginx.conf
    sed -i 's/# }/}/g' nginx.conf
    
    echo "✅ Configuração HTTPS ativada"
else
    echo "❌ Erro ao gerar certificados SSL"
    echo "Verifique se os domínios estão apontando para este servidor"
fi

echo ""
echo "📋 Domínios configurados:"
echo "   🌐 https://$MAIN_DOMAIN - Página inicial"
echo "   👨‍💼 https://admin.$MAIN_DOMAIN - Acesso administrativo"
echo "   👤 https://portal.$MAIN_DOMAIN - Portal do cliente"
echo ""
echo "🚀 Para iniciar o sistema:"
echo "   docker-compose --env-file .env.production up -d"
