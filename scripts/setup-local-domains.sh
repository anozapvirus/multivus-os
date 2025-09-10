#!/bin/bash

echo "🔧 Configurando domínios locais para MULTIVUS OS..."

# Check if running as root (needed to modify /etc/hosts)
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script precisa ser executado como root (sudo)"
    echo "Execute: sudo ./scripts/setup-local-domains.sh"
    exit 1
fi

# Backup original hosts file
cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)

# Remove existing MULTIVUS entries
sed -i '/# MULTIVUS OS/d' /etc/hosts
sed -i '/multivus\.local/d' /etc/hosts

# Add MULTIVUS domains
echo "" >> /etc/hosts
echo "# MULTIVUS OS - Local Development Domains" >> /etc/hosts
echo "127.0.0.1    multivus.local" >> /etc/hosts
echo "127.0.0.1    admin.multivus.local" >> /etc/hosts
echo "127.0.0.1    portal.multivus.local" >> /etc/hosts
echo "127.0.0.1    api.multivus.local" >> /etc/hosts

echo "✅ Domínios locais configurados com sucesso!"
echo ""
echo "📋 Domínios disponíveis:"
echo "   🌐 http://multivus.local - Página inicial"
echo "   👨‍💼 http://admin.multivus.local - Acesso administrativo"
echo "   👤 http://portal.multivus.local - Portal do cliente"
echo ""
echo "🚀 Para iniciar o sistema:"
echo "   docker-compose up -d"
echo ""
echo "📚 Documentação da API:"
echo "   http://multivus.local/api/docs"
