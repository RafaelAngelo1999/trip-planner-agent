# Monorepo LangGraph + Chat Frontend

## 🏗️ Estrutura do Projeto

Este é um monorepo que contém dois projetos principais:

```
langgraphjs-monorepo/
├── agent/                     # LangGraph Agent (Existente)
│   ├── src/                  # Agentes e configurações
│   ├── langgraph.json        # Configuração do LangGraph
│   ├── package.json          # Dependências do agent
│   └── .env                  # Variáveis do agent
├── chat-frontend/            # Next.js Chat Interface (Novo)
│   ├── src/                  # Aplicação React/Next.js
│   ├── package.json          # Dependências do frontend
│   ├── next.config.js        # Configuração do Next.js
│   └── .env                  # Variáveis do frontend
├── docs/                     # Documentação
│   ├── monorepo-guide.md     # Este arquivo
│   ├── trip-planner-flow.md  # Documentação do trip-planner
│   └── chat-frontend-architecture.md # Arquitetura do frontend
├── package.json              # Scripts do monorepo
└── README.md                 # Documentação geral
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Instalação

```bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
npm install                    # Dependências raiz
cd agent && npm install        # Dependências do agent
cd chat-frontend && npm install # Dependências do frontend
```

### Executar em Desenvolvimento

#### Executar Ambos os Projetos (Recomendado)

```bash
npm run dev
```

Este comando inicia:

- **LangGraph Agent** em `http://localhost:8123`
- **Chat Frontend** em `http://localhost:3000`

#### Executar Projetos Individualmente

```bash
# Apenas o LangGraph Agent
npm run agent

# Apenas o Chat Frontend
npm run chat
```

### Build de Produção

```bash
npm run build
```

## 🔧 Configuração

### Agent (LangGraph)

```bash
# agent/.env
OPENAI_API_KEY=your_openai_key
LANGSMITH_API_KEY=your_langsmith_key
LANGSMITH_TRACING=true
```

### Chat Frontend (Next.js)

```bash
# chat-frontend/.env
NEXT_PUBLIC_LANGRAPH_URL=http://localhost:8123
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

## 📚 Documentação Adicional

- [`trip-planner-flow.md`](./trip-planner-flow.md) - Fluxo detalhado do Trip Planner Agent
- [`chat-frontend-architecture.md`](./chat-frontend-architecture.md) - Arquitetura completa do Frontend

---

**Versão**: 1.0.0  
**Última atualização**: 26 de setembro de 2025  
**Mantido por**: LangGraph Team
