# 🤝 Guia de Contribuição - MULTIVUS OS

Obrigado por considerar contribuir com o MULTIVUS OS! Este documento fornece diretrizes para contribuições.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 📜 Código de Conduta

Este projeto adere ao [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter este código.

## 🚀 Como Contribuir

### Tipos de Contribuição

- 🐛 **Correção de bugs**
- ✨ **Novas funcionalidades**
- 📚 **Documentação**
- 🎨 **Melhorias de UI/UX**
- ⚡ **Otimizações de performance**
- 🧪 **Testes**

### Processo Geral

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua contribuição
4. **Faça** suas alterações
5. **Teste** suas alterações
6. **Commit** seguindo os padrões
7. **Push** para seu fork
8. **Abra** um Pull Request

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- pnpm (recomendado)
- Docker (opcional)

### Setup Local

\`\`\`bash
# Clone seu fork
git clone https://github.com/SEU-USUARIO/multivus-os.git
cd multivus-os

# Adicione o repositório original como upstream
git remote add upstream https://github.com/USUARIO-ORIGINAL/multivus-os.git

# Instale dependências
pnpm install

# Configure ambiente
cp apps/api/.env.example apps/api/.env

# Configure banco de dados
./scripts/setup-postgres.sh

# Execute migrations
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed

# Inicie desenvolvimento
pnpm dev
\`\`\`

## 📝 Padrões de Código

### Estrutura de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
\`\`\`

#### Tipos Permitidos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração de código
- `test`: Adição/correção de testes
- `chore`: Tarefas de manutenção

#### Exemplos

\`\`\`bash
feat(api): adicionar endpoint de relatórios financeiros

fix(web): corrigir bug na aprovação de orçamentos

docs(readme): atualizar instruções de instalação

style(components): formatar código com prettier

refactor(auth): simplificar lógica de autenticação

test(orders): adicionar testes para criação de OS

chore(deps): atualizar dependências do projeto
\`\`\`

### Padrões de Código

#### TypeScript/JavaScript

\`\`\`typescript
// ✅ Bom
interface WorkOrderData {
  id: string;
  customerId: string;
  status: WorkOrderStatus;
  createdAt: Date;
}

const createWorkOrder = async (data: WorkOrderData): Promise<WorkOrder> => {
  // Implementação
};

// ❌ Ruim
const createWorkOrder = async (data: any) => {
  // Implementação
};
\`\`\`

#### React Components

\`\`\`tsx
// ✅ Bom
interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onStatusChange: (id: string, status: WorkOrderStatus) => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  onStatusChange,
}) => {
  return (
    <Card className="p-4">
      {/* Implementação */}
    </Card>
  );
};

// ❌ Ruim
export const WorkOrderCard = ({ workOrder, onStatusChange }: any) => {
  return <div>{/* Implementação */}</div>;
};
\`\`\`

#### Naming Conventions

- **Arquivos**: `kebab-case` (ex: `work-order-card.tsx`)
- **Componentes**: `PascalCase` (ex: `WorkOrderCard`)
- **Funções/Variáveis**: `camelCase` (ex: `createWorkOrder`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_FILE_SIZE`)
- **Interfaces**: `PascalCase` com sufixo quando necessário (ex: `WorkOrderData`)

### Linting e Formatação

\`\`\`bash
# Verificar linting
pnpm lint

# Corrigir automaticamente
pnpm lint:fix

# Verificar formatação
pnpm format:check

# Formatar código
pnpm format
\`\`\`

## 🔄 Processo de Pull Request

### Antes de Abrir o PR

1. **Sincronize** com upstream:
\`\`\`bash
git fetch upstream
git checkout main
git merge upstream/main
\`\`\`

2. **Crie** uma branch descritiva:
\`\`\`bash
git checkout -b feat/financial-reports
\`\`\`

3. **Teste** suas alterações:
\`\`\`bash
pnpm test
pnpm lint
pnpm type-check
\`\`\`

### Template do PR

\`\`\`markdown
## 📋 Descrição

Breve descrição das alterações realizadas.

## 🎯 Tipo de Mudança

- [ ] 🐛 Correção de bug
- [ ] ✨ Nova funcionalidade
- [ ] 💥 Breaking change
- [ ] 📚 Documentação
- [ ] 🎨 Melhoria de UI/UX

## 🧪 Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## 📸 Screenshots (se aplicável)

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Não há breaking changes não documentadas
- [ ] Todas as verificações passaram
\`\`\`

### Revisão do PR

- PRs precisam de pelo menos 1 aprovação
- Todas as verificações devem passar
- Conflitos devem ser resolvidos
- Código deve estar documentado

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Verifique** se já existe uma issue
2. **Teste** na versão mais recente
3. **Colete** informações do ambiente

### Template de Bug Report

\`\`\`markdown
## 🐛 Descrição do Bug

Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## ✅ Comportamento Esperado

Descrição do que deveria acontecer.

## 📸 Screenshots

Se aplicável, adicione screenshots.

## 🖥️ Ambiente

- OS: [ex: Ubuntu 22.04]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]
- Node.js: [ex: 18.17.0]

## 📋 Informações Adicionais

Qualquer contexto adicional sobre o problema.
\`\`\`

## ✨ Sugerir Funcionalidades

### Template de Feature Request

\`\`\`markdown
## 🚀 Descrição da Funcionalidade

Descrição clara da funcionalidade desejada.

## 🎯 Problema que Resolve

Qual problema esta funcionalidade resolve?

## 💡 Solução Proposta

Descrição de como você imagina que funcione.

## 🔄 Alternativas Consideradas

Outras soluções que você considerou.

## 📋 Informações Adicionais

Contexto adicional, mockups, etc.
\`\`\`

## 🏷️ Labels

- `bug`: Algo não está funcionando
- `enhancement`: Nova funcionalidade ou melhoria
- `documentation`: Melhorias na documentação
- `good first issue`: Boa para iniciantes
- `help wanted`: Ajuda extra é bem-vinda
- `priority: high`: Alta prioridade
- `priority: low`: Baixa prioridade

## 🎉 Reconhecimento

Contribuidores são reconhecidos:

- **README.md**: Lista de contribuidores
- **CHANGELOG.md**: Créditos nas releases
- **GitHub**: Perfil destacado

## 📞 Dúvidas?

- **Issues**: Para bugs e funcionalidades
- **Discussions**: Para dúvidas gerais
- **Email**: dev@multivus.com

---

**Obrigado por contribuir com o MULTIVUS OS! 🙏**
