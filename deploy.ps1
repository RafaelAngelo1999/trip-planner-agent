# 🚀 Deploy Rápido - Windows PowerShell
# Script para automatizar deploy no Windows

Write-Host "🚀 Iniciando deploy do LangGraph Trip Planner Agent..." -ForegroundColor Blue

# 1. Verificar estrutura
Write-Host "📁 Verificando estrutura do projeto..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Estrutura OK" -ForegroundColor Green

# 2. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# 3. Fazer build de teste
Write-Host "🔨 Testando build..." -ForegroundColor Yellow
npm run build

# 4. Verificar Git
Write-Host "🔧 Configurando Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

# 5. Commit das mudanças
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "🚀 Deploy: $timestamp - Ready for production"

# 6. Push (assumindo que remote já está configurado)
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Código enviado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Configure a origem remota primeiro:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/SEU_USUARIO/REPO.git" -ForegroundColor White
}

# 7. Deploy Vercel
Write-Host "🌐 Deploy na Vercel..." -ForegroundColor Yellow

# Instalar Vercel CLI se necessário
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📥 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Fazer deploy
Write-Host "🚀 Executando deploy..." -ForegroundColor Yellow
vercel --prod

Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Não esqueça de configurar as variáveis de ambiente na Vercel:" -ForegroundColor Yellow
Write-Host "- OPENAI_API_KEY" -ForegroundColor White
Write-Host "- GOOGLE_API_KEY" -ForegroundColor White  
Write-Host "- ANTHROPIC_API_KEY" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Acesse: https://vercel.com/dashboard" -ForegroundColor Cyan