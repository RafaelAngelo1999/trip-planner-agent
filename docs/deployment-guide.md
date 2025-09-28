# 🚀 **Guia Completo: Deploy do Agent no GitHub + Vercel**

## 📋 **Pré-requisitos**

- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Git instalado localmente
- [ ] Node.js 18+ instalado
- [ ] Chaves de API configuradas (OpenAI, Anthropic, etc.)

---

## 🔧 **ETAPA 1: Preparação do Projeto**

### 1.1 **Limpar e Organizar o Projeto**

```bash
# 1. Remover node_modules e arquivos temporários
rm -rf node_modules
rm -rf .next
rm -rf dist
rm -rf build

# 2. Limpar logs e caches
rm -rf .turbo
rm -rf .vercel
rm pnpm-lock.yaml
```

### 1.2 **Verificar Arquivos Necessários**

Certifique-se de que existem:

- ✅ `package.json` com scripts de build
- ✅ `.gitignore` configurado
- ✅ `vercel.json` (criaremos na próxima etapa)
- ✅ Variáveis de ambiente documentadas

### 1.3 **Criar .gitignore Completo**

```bash
# Crie ou atualize o .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel

# Turbo
.turbo

# LangGraph specific
langgraph.db
*.db
*.sqlite

# Temporary files
*.tmp
*.temp
EOF
```

---

## 📦 **ETAPA 2: Configuração para Deploy**

### 2.1 **Criar vercel.json**

```json
{
  "version": 2,
  "name": "langgraph-trip-planner-agent",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/agent/**/*.ts": {
      "runtime": "@vercel/node@18.x"
    }
  }
}
```

### 2.2 **Atualizar package.json Scripts**

Adicione/atualize os scripts no `package.json`:

```json
{
  "scripts": {
    "dev": "langgraphjs dev --no-browser",
    "build": "tsc -b && langgraphjs build",
    "start": "langgraphjs start",
    "preview": "langgraphjs start --port 8000",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "deploy:vercel": "vercel --prod"
  }
}
```

### 2.3 **Criar arquivo de Variáveis de Ambiente**

Crie `.env.example`:

```bash
# API Keys (obrigatórias)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LangGraph Configuration
LANGGRAPH_API_URL=https://your-app.vercel.app
NODE_ENV=production

# External APIs (opcionais)
TRIP_PLANNER_API_URL=https://trip-planner-backend-three.vercel.app

# Database (se usar)
DATABASE_URL=your_database_url_here
```

---

## 🐙 **ETAPA 3: Publicar no GitHub**

### 3.1 **Inicializar Repositório Git**

```bash
# 1. Inicializar git (se ainda não foi feito)
git init

# 2. Adicionar remote origin
git remote add origin https://github.com/SEU_USUARIO/langgraph-trip-planner-agent.git

# 3. Configurar branch principal
git branch -M main
```

### 3.2 **Primeiro Commit**

```bash
# 1. Adicionar todos os arquivos
git add .

# 2. Commit inicial
git commit -m "🚀 Initial commit: LangGraph Trip Planner Agent

- ✅ Sistema de resiliência implementado
- ✅ API de hotéis com dados mock
- ✅ Sistema I18n (pt-BR/en-US)
- ✅ Booking operations sem toast
- ✅ Configuração para deploy Vercel
- 📚 Documentação completa"

# 3. Push para GitHub
git push -u origin main
```

### 3.3 **Configurar Repositório no GitHub**

1. **Acesse GitHub** → Criar novo repositório
2. **Nome:** `langgraph-trip-planner-agent`
3. **Descrição:** "🤖 Intelligent Trip Planner Agent built with LangGraph"
4. **Público** ou **Privado** (sua escolha)
5. **NÃO** inicialize com README (já temos)
6. **Criar repositório**

---

## 🌐 **ETAPA 4: Deploy na Vercel**

### 4.1 **Conectar Repositório GitHub → Vercel**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Login** com GitHub
3. **New Project**
4. **Import** seu repositório `langgraph-trip-planner-agent`

### 4.2 **Configurar Projeto na Vercel**

```bash
# Configurações do projeto:
Project Name: langgraph-trip-planner-agent
Framework Preset: Other
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.3 **Configurar Variáveis de Ambiente**

No dashboard da Vercel → Settings → Environment Variables:

```bash
# Adicione uma por uma:
OPENAI_API_KEY=your_actual_key
ANTHROPIC_API_KEY=your_actual_key
NODE_ENV=production
LANGGRAPH_API_URL=https://your-project.vercel.app
```

### 4.4 **Fazer Deploy**

```bash
# Clique em "Deploy" na Vercel
# Ou via CLI:
npx vercel --prod
```

---

## 🔄 **ETAPA 5: Automatizar Deploys**

### 5.1 **Configurar GitHub Actions (Opcional)**

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📚 **ETAPA 6: Documentação e README**

### 6.1 **Criar README.md Profissional**

````markdown
# 🤖 LangGraph Trip Planner Agent

> Intelligent travel planning agent built with LangGraph, TypeScript, and modern AI APIs

## 🌟 Features

- 🛫 **Smart Flight Search** - AI-powered flight recommendations
- 🏨 **Hotel Booking** - Integrated hotel search and booking
- 🌍 **Multi-language** - Support for Portuguese and English
- 🔄 **Resilience System** - Automatic retry and error handling
- 🎨 **Modern UI** - Beautiful, responsive interface

## 🚀 Live Demo

- **Production:** [https://your-project.vercel.app](https://your-project.vercel.app)
- **API Docs:** [https://your-project.vercel.app/docs](https://your-project.vercel.app/docs)

## 🛠️ Tech Stack

- **Framework:** LangGraph + TypeScript
- **UI:** React + Tailwind CSS
- **AI:** OpenAI GPT-4 + Anthropic Claude
- **Deploy:** Vercel
- **I18n:** Custom implementation

## 📦 Installation

```bash
git clone https://github.com/SEU_USUARIO/langgraph-trip-planner-agent.git
cd langgraph-trip-planner-agent
npm install
cp .env.example .env
# Configure your API keys in .env
npm run dev
```
````

## 🔑 Environment Variables

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
NODE_ENV=development
```

## 📖 Documentation

- [Implementation Guide](./docs/implementation-plan.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment-guide.md)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LangGraph team for the amazing framework
- OpenAI and Anthropic for AI APIs
- Vercel for seamless deployment

````

---

## ✅ **ETAPA 7: Verificação Final**

### 7.1 **Checklist Pré-Deploy**

- [ ] ✅ Código commitado no GitHub
- [ ] ✅ Variáveis de ambiente configuradas na Vercel
- [ ] ✅ Build funcionando localmente (`npm run build`)
- [ ] ✅ Testes passando (`npm run test`)
- [ ] ✅ Linting ok (`npm run lint`)
- [ ] ✅ README.md atualizado
- [ ] ✅ .gitignore configurado
- [ ] ✅ vercel.json criado

### 7.2 **Comandos de Teste**

```bash
# Testar build local
npm run build

# Testar preview local
npm run preview

# Verificar deploy
curl https://your-project.vercel.app/health
````

---

## 🔗 **Links Úteis**

- **Vercel Docs:** https://vercel.com/docs
- **LangGraph Docs:** https://langchain-ai.github.io/langgraph/
- **GitHub Pages:** https://pages.github.com/
- **Domínio Customizado:** Vercel → Settings → Domains

---

## 🎉 **Pronto!**

Seu **LangGraph Trip Planner Agent** está agora:

- 📦 **Versionado** no GitHub
- 🌐 **Publicado** na Vercel
- 🚀 **Acessível** via URL pública
- 🔄 **Auto-deploy** a cada push

**URL Final:** `https://your-project.vercel.app` 🎊
