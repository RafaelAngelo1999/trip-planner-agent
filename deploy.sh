#!/bin/bash

# 🚀 Script de Deploy Automático - LangGraph Trip Planner Agent
# Este script automatiza todo o processo de deploy

set -e  # Parar se houver erro

echo "🚀 Iniciando processo de deploy..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar se está no diretório correto
log_info "Verificando estrutura do projeto..."
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

if [ ! -f ".env.example" ]; then
    log_error ".env.example não encontrado. Certifique-se de ter o template de ambiente."
    exit 1
fi

log_success "Estrutura do projeto verificada"

# 2. Verificar se o Git está inicializado
log_info "Verificando repositório Git..."
if [ ! -d ".git" ]; then
    log_warning "Git não inicializado. Inicializando..."
    git init
    git branch -M main
fi

# 3. Verificar se há alterações não commitadas
if [ -n "$(git status --porcelain)" ]; then
    log_info "Há alterações não commitadas. Fazendo commit..."
    
    # Adicionar todos os arquivos
    git add .
    
    # Commit com timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "🚀 Deploy: $TIMESTAMP

- Updated project for deployment
- Ready for production"
    
    log_success "Alterações commitadas"
else
    log_success "Repositório limpo"
fi

# 4. Verificar origem remota
log_info "Verificando origem remota..."
if ! git remote | grep -q "origin"; then
    log_error "Origem remota não configurada."
    echo "Configure com: git remote add origin https://github.com/SEU_USUARIO/REPO.git"
    exit 1
fi

log_success "Origem remota configurada"

# 5. Push para GitHub
log_info "Enviando código para GitHub..."
git push -u origin main

log_success "Código enviado para GitHub"

# 6. Verificar se Vercel CLI está instalado
log_info "Verificando Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI não encontrada. Instalando..."
    npm install -g vercel
fi

log_success "Vercel CLI disponível"

# 7. Deploy na Vercel
log_info "Iniciando deploy na Vercel..."

# Verificar se já está logado
if ! vercel whoami &> /dev/null; then
    log_info "Faça login na Vercel..."
    vercel login
fi

# Fazer deploy
log_info "Executando deploy..."
vercel --prod

log_success "Deploy concluído com sucesso!"

# 8. Verificações finais
echo ""
echo "🎉 Deploy finalizado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse o dashboard da Vercel para ver a URL"
echo "2. Configure as variáveis de ambiente na Vercel:"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_API_KEY"
echo "   - ANTHROPIC_API_KEY"
echo "3. Teste a aplicação na URL fornecida"
echo ""
echo "📚 Links úteis:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Configurar domínio: Vercel → Settings → Domains"
echo "- Monitoramento: Vercel → Analytics"
echo ""

log_success "Processo completo! 🚀"