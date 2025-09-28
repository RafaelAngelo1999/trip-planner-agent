# ⚡ **Comandos Rápidos para Deploy**

## 🚀 **Deploy em 3 Passos (Método Rápido)**

```bash
# 1. Configure o repositório GitHub (apenas primeira vez)
git remote add origin https://github.com/SEU_USUARIO/langgraph-trip-planner-agent.git

# 2. Execute o script de deploy
# No Linux/Mac:
chmod +x deploy.sh
./deploy.sh

# No Windows:
PowerShell -ExecutionPolicy Bypass -File deploy.ps1
```

## 📋 **Checklist Pré-Deploy (5 minutos)**

```bash
# ✅ 1. Verificar se tudo funciona localmente
npm install
npm run build
npm run dev

# ✅ 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves de API

# ✅ 3. Testar build de produção
npm run build

# ✅ 4. Commit final
git add .
git commit -m "🚀 Ready for production deploy"
git push origin main
```

## 🌐 **Deploy Manual Vercel**

```bash
# 1. Instalar CLI Vercel
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar domínio (opcional)
vercel domains add your-domain.com
```

## 🔑 **Variáveis de Ambiente Essenciais**

Na Vercel Dashboard → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=production
```

## 🔧 **Comandos Úteis**

```bash
# Ver logs de deploy
vercel logs

# Ver status do projeto
vercel list

# Remover projeto
vercel remove

# Ver informações
vercel inspect

# Deploy de preview (branch)
vercel

# Deploy de produção
vercel --prod
```

## 🐛 **Troubleshooting Comum**

### Build falha:

```bash
# Limpar cache
rm -rf node_modules .next dist
npm install
npm run build
```

### Erro de API keys:

```bash
# Verificar variáveis na Vercel
vercel env ls
vercel env add OPENAI_API_KEY
```

### Problemas de Git:

```bash
# Resetar origem
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/REPO.git
git push -u origin main
```

## 📱 **URLs Finais**

Após deploy bem-sucedido:

- **App:** https://your-project.vercel.app
- **Dashboard:** https://vercel.com/dashboard
- **Logs:** https://vercel.com/your-user/your-project/functions
- **Analytics:** https://vercel.com/your-user/your-project/analytics

## 🎯 **Automação Completa**

Para deploys futuros (após primeiro deploy):

```bash
# Apenas 2 comandos para atualizar:
git add . && git commit -m "Update" && git push
# Deploy automático via GitHub → Vercel
```
