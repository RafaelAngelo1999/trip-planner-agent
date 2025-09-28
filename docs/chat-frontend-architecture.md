# Chat Frontend - Arquitetura e Estrutura

## 📋 Visão Geral

O **Chat Frontend** é uma aplicação Next.js moderna que fornece uma interface de chat elegante e responsiva para comunicação com o LangGraph Agent. Inspirado em soluções como Supachat, oferece uma experiência de usuário premium com recursos avançados de streaming, retry automático e suporte completo a acessibilidade.

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios

```
chat-frontend/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── layout.tsx         # Layout raiz da aplicação
│   │   ├── page.tsx           # Página principal do chat
│   │   └── globals.css        # Estilos globais e temas
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Componentes base (Button, Input)
│   │   └── ChatLayout.tsx     # Layout principal do chat
│   ├── chat/                  # Componentes específicos do chat
│   │   ├── ChatHeader.tsx     # Cabeçalho com controles
│   │   ├── MessageList.tsx    # Lista de mensagens
│   │   ├── MessageBubble.tsx  # Bolha individual de mensagem
│   │   ├── ChatInput.tsx      # Input de mensagens
│   │   ├── TypingIndicator.tsx # Indicador de digitação
│   │   ├── EmptyState.tsx     # Estado vazio inicial
│   │   └── Sidebar.tsx        # Barra lateral com histórico
│   ├── services/              # Serviços de API
│   │   └── api.ts             # Cliente HTTP para LangGraph
│   ├── store/                 # Estado global
│   │   └── chat.ts            # Store Zustand do chat
│   ├── hooks/                 # Hooks personalizados
│   │   └── useChat.ts         # Hook principal do chat
│   ├── i18n/                  # Internacionalização
│   │   └── index.ts           # Configuração i18next
│   └── lib/                   # Utilitários
│       └── utils.ts           # Funções auxiliares
├── public/                    # Assets estáticos
├── package.json               # Dependências e scripts
├── next.config.js             # Configuração do Next.js
├── tailwind.config.ts         # Configuração do TailwindCSS
├── tsconfig.json              # Configuração do TypeScript
└── .env                       # Variáveis de ambiente
```

## 🔧 Tecnologias Utilizadas

### Core Framework

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática e IntelliSense
- **React 18** - Biblioteca de interface de usuário

### Styling & UI

- **TailwindCSS** - Framework CSS utilitário
- **Shadcn/ui** - Sistema de componentes
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos
- **next-themes** - Sistema de temas dark/light

### Estado e Dados

- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para APIs
- **React Markdown** - Renderização de Markdown
- **remark-gfm** - Suporte a GitHub Flavored Markdown

### Internacionalização

- **i18next** - Sistema de tradução
- **react-i18next** - Integração com React
- **i18next-browser-languagedetector** - Detecção automática de idioma

### Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **clsx + tailwind-merge** - Utilitários para classes CSS

## 🎨 Sistema de Design

### Paleta de Cores

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96%;
--muted: 210 40% 96%;
--accent: 210 40% 96%;
--destructive: 0 84.2% 60.2%;
--border: 214.3 31.8% 91.4%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 210 40% 98%;
--secondary: 217.2 32.6% 17.5%;
--muted: 217.2 32.6% 17.5%;
--accent: 217.2 32.6% 17.5%;
--destructive: 0 62.8% 30.6%;
--border: 217.2 32.6% 17.5%;
```

### Tipografia

- **Font**: Inter (Google Fonts)
- **Tamanhos**: sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)
- **Pesos**: normal (400), medium (500), semibold (600), bold (700)

### Animações

- **Fade In**: Entrada suave de elementos
- **Slide Up**: Deslizamento para cima
- **Typing**: Indicador de digitação animado
- **Pulse**: Indicador de carregamento
- **Scale**: Efeitos de hover/focus

## 📊 Fluxo de Dados

### Estado Global (Zustand)

```typescript
interface ChatState {
  // Messages
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  currentStreamingId?: string;

  // UI
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  language: "pt-BR" | "en-US";

  // Settings
  settings: ChatSettings;

  // Connection
  isConnected: boolean;
  connectionError: string | null;
  lastActivity: Date | null;
}
```

### Fluxo de Mensagens

1. **Entrada do Usuário** → ChatInput captura mensagem
2. **Validação** → Verificações de conteúdo e estado
3. **Envio** → API service comunica com LangGraph
4. **Streaming** → Resposta é recebida em chunks
5. **Renderização** → MessageBubble exibe conteúdo
6. **Estado Final** → Store atualizado com mensagem completa

## 🔌 Integração com LangGraph Agent

### Configuração da API

```typescript
// Variáveis de ambiente
NEXT_PUBLIC_LANGRAPH_URL=http://localhost:8123
NEXT_PUBLIC_API_URL=http://localhost:3000

// Endpoints disponíveis
POST /chat          // Enviar mensagem
POST /chat/stream   // Streaming de resposta
GET  /health        // Health check
GET  /models        // Modelos disponíveis
```

### Protocolo de Comunicação

- **Request Format**: JSON com message, conversationId, settings
- **Response Format**: JSON com content, metadata, timestamps
- **Streaming**: Server-Sent Events (SSE) com chunks incrementais
- **Error Handling**: HTTP status codes + mensagens descritivas

## 🎯 Funcionalidades Principais

### 💬 Chat Interface

- **Layout Fullscreen**: Header fixo, área de mensagens, input fixo
- **Scroll Inteligente**: Auto-scroll para novas mensagens
- **Typing Indicator**: Animação durante resposta do agente
- **Message Bubbles**: Design diferenciado para usuário/assistente

### 🔄 Streaming de Respostas

- **Real-time**: Tokens aparecem conforme são gerados
- **Cursor Animado**: Indicador visual de streaming
- **Cancelamento**: Possibilidade de interromper geração
- **Retry**: Reenvio automático em caso de falha

### 🎨 Sistema de Temas

- **Dark/Light Mode**: Alternância automática ou manual
- **System Theme**: Detecção de preferência do OS
- **Cores Personalizadas**: Paleta extensível
- **Alto Contraste**: Suporte para acessibilidade

### 🌍 Internacionalização

- **Multi-idioma**: Português (BR) e Inglês (US)
- **Detecção Automática**: Baseado no navegador
- **Troca em Tempo Real**: Sem necessidade de reload
- **Mensagens de Sistema**: Totalmente traduzidas

### ♿ Acessibilidade

- **ARIA Labels**: Roles e descrições apropriadas
- **Navegação por Teclado**: Suporte completo a teclas
- **Screen Readers**: Compatível com leitores de tela
- **Focus Management**: Controle inteligente de foco
- **Alto Contraste**: Cores acessíveis

## 🔒 Segurança

### Sanitização de Conteúdo

- **Markdown Seguro**: Componentes limitados para prevenir XSS
- **DOMPurify**: Sanitização de HTML quando necessário
- **CSP Headers**: Content Security Policy configurado
- **Input Validation**: Validação client e server-side

### Proteção contra Ataques

- **XSS Prevention**: Escape de conteúdo dinâmico
- **CSRF Protection**: Tokens em requests críticos
- **Rate Limiting**: Controle de spam no client
- **Error Handling**: Não exposição de dados sensíveis

## 🚀 Performance

### Otimizações Implementadas

- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes carregados conforme necessário
- **Memoização**: React.memo para componentes estáticos
- **Virtual Scrolling**: Para listas longas de mensagens
- **Bundle Analysis**: Monitoramento do tamanho final

### Métricas de Performance

- **First Paint**: < 1s
- **Interactive**: < 2s
- **Bundle Size**: < 500KB (gzipped)
- **Memory Usage**: Otimizado para sessões longas

## 📱 Responsividade

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Adaptações Mobile

- **Sidebar**: Overlay em mobile, fixa em desktop
- **Input**: Ajuste automático de altura
- **Touch Targets**: Mínimo 44px para touch
- **Viewport**: Safe areas para dispositivos com notch

## 🧪 Testes e Qualidade

### Estratégias de Teste

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress para fluxos críticos
- **Visual Tests**: Storybook para componentes
- **Accessibility Tests**: axe-core integration

### Ferramentas de Qualidade

- **ESLint**: Regras customizadas para React/Next.js
- **Prettier**: Formatação consistente
- **Husky**: Pre-commit hooks
- **TypeScript**: Verificação estática de tipos

## 🔧 Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
npm run type-check   # Verificação de tipos

# Monorepo
npm run chat         # Inicia apenas chat-frontend
npm run agent        # Inicia apenas agent
npm run dev          # Inicia ambos concorrentemente
```

## 🎯 Roadmap de Funcionalidades

### ✅ Implementado

- [x] Chat interface completa
- [x] Streaming de respostas
- [x] Sistema de temas
- [x] Internacionalização
- [x] Acessibilidade básica
- [x] Retry automático
- [x] Markdown rendering
- [x] Mobile responsive

### 🔄 Em Desenvolvimento

- [ ] Histórico de conversas
- [ ] Configurações avançadas
- [ ] Voice input
- [ ] File attachments
- [ ] Emoji picker
- [ ] Message reactions

### 🔮 Futuro

- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Multi-user chat
- [ ] Plugin system
- [ ] Advanced analytics

## 🐛 Troubleshooting

### Problemas Comuns

1. **Conexão Falhada**: Verificar NEXT_PUBLIC_LANGRAPH_URL
2. **Streaming não Funciona**: Checar suporte a SSE no browser
3. **Tema não Persiste**: Problema com localStorage
4. **Performance Lenta**: Bundle size ou memory leaks

### Debug Tools

- **React DevTools**: Profiling de componentes
- **Network Tab**: Análise de requests
- **Console Logs**: Logs estruturados com emojis
- **Store Inspector**: Estado Zustand via devtools

## 📈 Monitoramento

### Métricas Importantes

- **Response Time**: Latência das mensagens
- **Error Rate**: Taxa de falhas na comunicação
- **User Engagement**: Tempo de sessão e mensagens
- **Performance**: Core Web Vitals

### Ferramentas de Analytics

- **Vercel Analytics**: Performance e usage
- **Sentry**: Error tracking e monitoring
- **LogRocket**: Session replay para debug
- **Google Analytics**: User behavior

---

**Mantido por**: LangGraph Team  
**Última atualização**: 26 de setembro de 2025  
**Versão**: 1.0.0
