<div align="center">

# 🛠️ MULTIVUS OS
### Sistema Completo de Gestão de Ordens de Serviço

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/seu-usuario/multivus-os)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D15.0-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com/)

[🚀 Instalação](#-instalação-rápida) • [📚 Documentação](#-documentação) • [🎯 Funcionalidades](#-funcionalidades) • [🤝 Contribuição](#-contribuição)

</div>

---

## 📋 Sobre o Projeto

O **MULTIVUS OS** é um sistema completo e moderno para gestão de ordens de serviço, desenvolvido para empresas de assistência técnica que precisam de uma solução robusta, offline-first e multi-tenant.

### ✨ Principais Diferenciais

- 🌐 **Offline-First**: Funciona 100% sem internet, sincroniza automaticamente
- 🏢 **Multi-Tenant**: Suporte completo para múltiplas empresas e filiais
- 📱 **PWA + Desktop**: Aplicação web progressiva + app desktop nativo
- 💰 **Financeiro Integrado**: Controle completo de pagamentos, PIX, recebíveis
- 📦 **Gestão de Estoque**: Controle profissional de inventário e compras
- 🔄 **Sincronização Inteligente**: Resolução automática de conflitos
- 📊 **Relatórios Avançados**: Dashboards e métricas em tempo real
- 🔐 **Segurança LGPD**: Auditoria completa e conformidade

---

## 🎯 Funcionalidades

### 🛠️ **Gestão de Ordens de Serviço**
- ✅ Workflow completo (Triagem → Orçamento → Execução → Entrega)
- ✅ Check-in técnico com fotos antes/depois
- ✅ Leitura de serial e catalogação de acessórios
- ✅ Aprovação de orçamento com um clique
- ✅ Controle de garantias e RMA

### 👥 **Portal do Cliente (PWA)**
- ✅ Acompanhamento em tempo real
- ✅ Aprovação/rejeição de orçamentos
- ✅ Histórico completo de serviços
- ✅ Pagamento via PIX integrado
- ✅ Download de comprovantes

### 📦 **Gestão de Estoque**
- ✅ Controle profissional de inventário
- ✅ Alertas de estoque mínimo
- ✅ Ordens de compra automatizadas
- ✅ Gestão de fornecedores
- ✅ Movimentações com auditoria

### 💰 **Sistema Financeiro**
- ✅ Contas a receber integradas
- ✅ Conciliação automática PIX
- ✅ Fluxo de caixa diário
- ✅ Relatórios financeiros
- ✅ Controle de inadimplência

### 🔄 **Sincronização Offline**
- ✅ Funcionamento 100% offline
- ✅ Sincronização automática
- ✅ Resolução de conflitos
- ✅ Backup automático
- ✅ Recuperação de dados

### 🏠 **Página Inicial - Seleção de Acesso**
- Escolha entre Acesso Administrativo ou Portal do Cliente com design moderno e intuitivo.

### 👨‍💼 **Dashboard SuperAdmin**
- Controle total sobre empresas, planos e renovações com métricas em tempo real e gestão completa do modelo SaaS.

### 🏢 **Sistema Administrativo**
- Interface completa para funcionários com gestão de ordens de serviço, clientes, estoque e relatórios financeiros.

### 📞 **Central de Notificações**
- Sistema integrado de comunicação via WhatsApp, SMS, Email e Push Notifications com templates personalizáveis.

---

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 15+
- pnpm (recomendado)

### 1. Clone e Configure

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/multivus-os.git
cd multivus-os

# Instale dependências
pnpm install

# Configure ambiente
cp apps/api/.env.example apps/api/.env
\`\`\`

### 2. Configure o Banco de Dados

\`\`\`bash
# Opção 1: Docker (Recomendado)
docker-compose up postgres -d

# Opção 2: Script automático
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh

# Opção 3: Manual
# Veja: docs/POSTGRESQL-SETUP.md
\`\`\`

### 3. Execute Migrations e Seed

\`\`\`bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
\`\`\`

### 4. Inicie a Aplicação

\`\`\`bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
\`\`\`

### 🎉 Pronto!

- **API**: http://localhost:3001
- **Web App**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [📖 Guia de Instalação](docs/INSTALLATION.md) | Instalação completa e configuração |
| [🐘 PostgreSQL Setup](docs/POSTGRESQL-SETUP.md) | Configuração detalhada do banco |
| [🔌 API Documentation](docs/API.md) | Referência completa da API |
| [🏗️ Arquitetura](docs/ARCHITECTURE.md) | Visão técnica do sistema |
| [🤝 Contribuição](CONTRIBUTING.md) | Como contribuir com o projeto |
| [📝 Changelog](CHANGELOG.md) | Histórico de alterações |
| [❓ FAQ](docs/FAQ.md) | Perguntas frequentes |
| [🔧 Solução de Problemas](docs/TROUBLESHOOTING.md) | Guia de solução de problemas |
| [📖 Tutorial Completo PT-BR](docs/TUTORIAL-COMPLETO-PT-BR.md) | **Guia definitivo** |

---

## 🏗️ Arquitetura

\`\`\`
multivus-os/
├── apps/
│   ├── api/          # NestJS + Fastify + Prisma
│   ├── web/          # Next.js + Tailwind + shadcn/ui
│   └── desktop/      # Tauri (Rust + React)
├── packages/
│   ├── shared/       # Tipos e utilitários compartilhados
│   └── ui/           # Componentes UI reutilizáveis
├── docs/             # Documentação completa
└── scripts/          # Scripts de automação
\`\`\`

### 🛠️ Stack Tecnológica

**Backend:**
- NestJS + Fastify (Performance)
- Prisma ORM (Type-safe)
- PostgreSQL (Produção)
- JWT + Bcrypt (Segurança)

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- PWA (Service Worker)
- IndexedDB (Offline)

**Desktop:**
- Tauri (Rust + React)
- Backup local automático
- Sincronização P2P

**DevOps:**
- Docker + Docker Compose
- Nginx (Reverse Proxy)
- Scripts de backup automático
- Monitoramento integrado

---

## 🚀 Deploy em Produção

### Opção 1: Docker Compose (Recomendado)

\`\`\`bash
# 1. Configure variáveis de produção
cp .env.example .env
# Edite o .env com suas configurações

# 2. Suba todos os serviços
docker-compose up -d

# 3. Execute migrations
docker-compose exec app npx prisma migrate deploy

# 4. Configure SSL (Let's Encrypt)
sudo certbot --nginx -d seudominio.com
\`\`\`

### Opção 2: VPS Ubuntu (Script Automatizado)

\`\`\`bash
# Download e execute o script de instalação
wget https://raw.githubusercontent.com/seu-usuario/multivus-os/main/scripts/install-ubuntu.sh
chmod +x install-ubuntu.sh
./install-ubuntu.sh

# O script irá:
# - Instalar todas as dependências
# - Configurar PostgreSQL
# - Configurar Nginx com SSL
# - Configurar backup automático
# - Configurar firewall e segurança
\`\`\`

### Opção 3: Manual (Desenvolvimento)

\`\`\`bash
# 1. Instalar dependências
pnpm install

# 2. Configurar banco
./scripts/setup-postgres.sh

# 3. Executar migrations
pnpm db:migrate

# 4. Popular dados iniciais
pnpm db:seed

# 5. Iniciar aplicação
pnpm dev
\`\`\`

---

## 💾 Sistema de Backup Automático

### Backup Diário Automatizado

O sistema inclui backup automático completo:

\`\`\`bash
# Configurado automaticamente via cron
# Executa diariamente às 2h da manhã
0 2 * * * /opt/multivus/scripts/backup-completo.sh

# Backup manual
./scripts/backup-completo.sh

# Restaurar backup
./scripts/restore-backup.sh 20241208_020000
\`\`\`

### O que é incluído no backup:
- ✅ Banco de dados PostgreSQL completo
- ✅ Arquivos de upload (fotos, anexos)
- ✅ Configurações do sistema (.env)
- ✅ Logs do sistema
- ✅ Retenção automática (30 dias)
- ✅ Compressão e otimização

### Backup Remoto (Opcional)
- AWS S3 integrado
- Google Drive sync
- FTP/SFTP automático

---

## 🛡️ Segurança e Conformidade

### Recursos de Segurança
- 🔐 **Autenticação JWT** com refresh tokens
- 🔒 **Criptografia bcrypt** para senhas
- 🛡️ **Rate limiting** em APIs críticas
- 🚫 **Proteção CSRF** e XSS
- 📊 **Auditoria completa** de ações
- 🔍 **Logs de segurança** detalhados

### Conformidade LGPD
- ✅ Consentimento explícito
- ✅ Direito ao esquecimento
- ✅ Portabilidade de dados
- ✅ Anonimização automática
- ✅ Relatórios de conformidade

---

## 📊 Monitoramento e Observabilidade

### Métricas Incluídas
- 📈 **Performance** - Tempo de resposta, throughput
- 💾 **Recursos** - CPU, memória, disco
- 🗄️ **Banco de dados** - Conexões, queries lentas
- 👥 **Usuários** - Sessões ativas, ações
- 💰 **Negócio** - OS criadas, faturamento, conversão

### Alertas Automáticos
- 🚨 Espaço em disco baixo
- ⚡ Performance degradada
- 🔴 Serviços offline
- 💸 Planos vencidos
- 📊 Metas não atingidas

---

## 🆘 Suporte

### 📞 Canais de Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/multivus-os/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/multivus-os/discussions)
- **Email**: suporte@multivus.com
- **WhatsApp**: +55 (11) 99999-9999
- **Documentação**: [Tutorial Completo PT-BR](docs/TUTORIAL-COMPLETO-PT-BR.md)

### 📚 Recursos Úteis

- [📖 Tutorial Completo PT-BR](docs/TUTORIAL-COMPLETO-PT-BR.md) - **Guia definitivo**
- [🐘 Configuração PostgreSQL](docs/POSTGRESQL-SETUP.md)
- [🔌 Documentação da API](docs/API.md)
- [❓ FAQ](docs/FAQ.md)
- [🔧 Solução de Problemas](docs/TROUBLESHOOTING.md)
- [📝 Changelog](CHANGELOG.md)

### 🎯 Casos de Uso Comuns

**Para Assistências Técnicas:**
- Gestão completa de ordens de serviço
- Portal do cliente automatizado
- Controle de estoque e peças
- Sistema financeiro integrado

**Para Empresas de Manutenção:**
- Workflow de aprovação de orçamentos
- Controle de garantias e RMA
- Relatórios de produtividade
- App mobile para técnicos

**Para Redes e Franquias:**
- Multi-tenant com controle centralizado
- Relatórios consolidados
- Gestão de planos e renovações
- Backup e sincronização automática

---

## 🎉 Status do Projeto

### ✅ **Funcionalidades Implementadas (100%)**

**Core System:**
- ✅ Sistema de autenticação multi-nível completo
- ✅ SuperAdmin para gestão de empresas e planos
- ✅ Gestão completa de ordens de serviço
- ✅ Portal do cliente responsivo (PWA)
- ✅ Sistema de inventário profissional
- ✅ Sistema financeiro com PIX integrado
- ✅ Central de notificações (WhatsApp, SMS, Email)
- ✅ Sistema de backup automático
- ✅ Deployment completo com Docker
- ✅ Documentação completa em PT-BR

**Infraestrutura:**
- ✅ Docker e Docker Compose configurados
- ✅ Scripts de instalação automatizada
- ✅ Nginx com SSL/HTTPS
- ✅ Backup diário automatizado
- ✅ Monitoramento e logs
- ✅ Segurança e conformidade LGPD

### 🚀 **Pronto para Produção**

O MULTIVUS OS está **100% funcional** e pronto para uso em produção com:
- Sistema completo de gestão de ordens de serviço
- Portal do cliente com PWA
- Infraestrutura robusta e escalável
- Documentação completa e suporte
- Scripts de deployment automatizado

---

## 🔑 Acessos Padrão do Sistema

### SuperAdmin (Gestão de Empresas)
- **URL**: `/superadmin/login`
- **Email**: `superadmin@multivus.com`
- **Senha**: `super123`
- **Funcionalidades**: Gerenciar empresas, planos, ativação/desativação

### Administrador da Empresa
- **URL**: `/admin/login`
- **Código da Empresa**: `MULTIVUS001`
- **Email**: `admin@multivus.com`
- **Senha**: `admin123`
- **Funcionalidades**: Gestão completa de OS, clientes, estoque, financeiro

### Portal do Cliente
- **URL**: `/portal/login`
- **CPF/CNPJ**: Use qualquer CPF cadastrado no sistema
- **Verificação**: Código SMS automático (desenvolvimento)
- **Funcionalidades**: Acompanhar OS, aprovar orçamentos, pagamentos

---

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/) - Framework backend
- [Next.js](https://nextjs.org/) - Framework frontend
- [Prisma](https://prisma.io/) - ORM type-safe
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tauri](https://tauri.app/) - Desktop app framework

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/multivus-os?style=social)](https://github.com/seu-usuario/multivus-os/stargazers)

**Feito com ❤️ pela equipe MULTIVUS**

</div>
