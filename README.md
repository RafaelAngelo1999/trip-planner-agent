# Trip Planner - LangGraph Generative UI

Sistema de planejamento de viagens inteligente construído com LangGraph Client SDK + Generative UI.

## 🎯 Objetivo

Trip Planner conversacional que permite:

- ✅ Busca de voos round-trip com UI generativa
- ✅ Reserva e cancelamento de voos com persistência (PNR)
- ✅ Busca de hotéis com cards interativos
- ✅ Reserva e cancelamento de hotéis (desejável)
- ✅ UX robusta: streaming, loading/erro, retry, acessibilidade

## 🏗️ Stack Tecnológico

- **Frontend**: React, TypeScript, Vite
- **Backend**: LangGraph Client SDK
- **LLM**: OpenAI GPT (LangGraph Agent)
- **UI Components**: shadcn/ui, Tailwind CSS
- **Carousel**: Embla Carousel React
- **Icons**: Lucide React

# Setup

Instale as dependências:

```bash
# npm ou pnpm
npm install
# ou
pnpm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Configure no `.env`:

```

## 🚀 Executar o Projeto

### Desenvolvimento

Execute o agente LangGraph:
```bash
npm run agent
# ou
pnpm agent

```bash
pnpm chat
```

### URLs Locais

- 🚀 Agent API: http://localhost:2024
- 💬 Chat Interface: http://localhost:3000
- 🎨 LangGraph Studio: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

### Produção

```bash
pnpm build
pnpm start
```

## 💬 Exemplos de Uso

### Busca de Voos

```
"CNF → SFO, ida 2025-10-01, volta 2025-10-10, 1 adulto"
"Voos do Rio para São Paulo amanhã"
"Procurar voos baratos para Londres, ida e volta, 2 pessoas"
```

### Reserva de Voos

```
"Quero reservar o voo da American Airlines"
[Preencher formulário: Nome, Email]
[Receber PNR: ABC123]
```

### Cancelamento

```
"Cancelar reserva PNR ABC123"
```

### Busca de Hotéis

```
"Hotéis em São Paulo de 01 a 10 de outubro"
"Acomodações baratas no centro do Rio"
"Hotéis 5 estrelas em Copacabana"
```

## 🏗️ Arquitetura

### Trip Planner Agent

O agente principal (`trip_planner`) possui os seguintes nós:

1. **classify**: Classifica o tipo de solicitação (voos, hotéis, cancelamento)
2. **extraction**: Extrai informações estruturadas da linguagem natural
3. **callTools**: Executa ferramentas específicas (busca, reserva, cancelamento)

### Tools Disponíveis

#### Flight Tools

```typescript
listFlights({
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
  adults: number,
  directOnly?: boolean,
  withBaggage?: boolean,
  cheapestOnly?: boolean
})

bookFlight({
  itineraryId: string,
  passenger: { fullName: string, email: string }
})

cancelFlight({ pnr: string })
```

#### Hotel Tools

```typescript
listHotels({
  city: string,
  checkin: string,
  checkout: string,
  rooms?: number,
  withBreakfast?: boolean,
  refundableOnly?: boolean
})

bookHotel({
  hotelId: string,
  checkin: string,
  checkout: string,
  guest: { fullName: string, email: string }
})
```

### Componentes UI Generativos

- **flight-search-results**: Cards de voos com preços, horários, companhias
- **flight-booking-form**: Formulário de reserva com validação
- **flight-booking-confirmation**: Confirmação com PNR e detalhes
- **hotel-search-results**: Cards de hotéis com avaliações e preços
- **accommodations-list**: Lista de acomodações (implementado)
- **restaurants-list**: Lista de restaurantes (implementado)

## 🗄️ Banco de Dados

### Tabelas

**flight_bookings**

```sql
CREATE TABLE flight_bookings (
  id SERIAL PRIMARY KEY,
  pnr VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('TICKETED', 'CANCELED')),
  total DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  itinerary_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**hotel_bookings**

```sql
CREATE TABLE hotel_bookings (
  id SERIAL PRIMARY KEY,
  reservation_id VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('BOOKED', 'CANCELED')),
  total DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  hotel_id VARCHAR(255) NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛡️ Resiliência & Error Handling

### Simulação de Falhas

- ⏱️ Latência simulada: 300-1200ms
- 🚫 Taxa de erro em bookings: ~15%
- 🔄 Retry automático com exponential backoff
- 📱 Toast notifications para erros
- 🦴 Loading skeletons durante processamento

### Estados de UI

- **Loading**: Skeleton components
- **Error**: Error messages + retry buttons
- **Success**: Confirmations com detalhes
- **Empty**: Estados vazios informativos

## 🧪 Testes

### Unit Tests (Vitest)

```bash
pnpm test:unit
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

### Cenários de Teste

- Busca de voos → seleção → reserva → confirmação → cancelamento
- Error handling com simulação de falhas
- Loading states e UX
- Acessibilidade (A11y)

## 🌐 Internacionalização

Suporte para:

- 🇧🇷 Português (pt-BR)
- 🇺🇸 English (en-US)

Troca de idioma via componente `LanguageSelector`.

## ♿ Acessibilidade

- ⌨️ Navegação por teclado
- 🗣️ Screen reader support (ARIA labels)
- 🎨 Contraste de cores adequado
- 🎯 Foco visível em elementos interativos

## 🔒 Segurança

- 🛡️ Sanitização de conteúdo HTML (DOMPurify)
- ✅ Validação de inputs (Zod schemas)
- 🚫 Prevenção XSS
- 🔐 Environment variables seguras

## 📊 Monitoramento

### Métricas de Performance

- Time to Interactive: < 3s
- Search Response: < 2s
- Booking Confirmation: < 1s
- Error Recovery: < 5s

### Logs

- 📝 Requisições LangGraph
- 🎯 Tool executions
- ❌ Error tracking
- 📈 Performance metrics

## 📝 Documentação

Documentação detalhada disponível em `/docs`:

- [Desafio Técnico](./docs/desafio-tecnico-blis-ai.md)
- [Plano de Implementação](./docs/implementation-plan.md)
- [Status de Progresso](./docs/progress-status.md)
- [Arquitetura do Sistema](./docs/trip-planner-flow.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Uso de IA

### AI-Assisted Development

- **GitHub Copilot**: Code completion e snippets
- **ChatGPT/Claude**: Debugging, estruturas base
- **Cursor AI**: Code generation para boilerplate

### Decisões Próprias

- ✅ Arquitetura geral do sistema
- ✅ Escolha de tecnologias (Next.js, Zustand, Tailwind)
- ✅ Design de APIs e componentes
- ✅ Estratégia de estado e error handling
- ✅ Estrutura de banco de dados
- ✅ Padrões de UX e acessibilidade

---

**✨ Trip Planner - Desafio Técnico Blis AI**  
_Sistema de planejamento inteligente com LangGraph + Generative UI_

````

## 🚀 Executar o Projeto

Only [OpenAI](https://platform.openai.com/), and [Google GenAI](https://aistudio.google.com/), API keys are required ([Financial Datasets](https://www.financialdatasets.ai/) is only required if you want to call the stockbroker graph, and [Anthropic](https://console.anthropic.com) is only used in the pizza ordering agent).

```bash
# Required
OPENAI_API_KEY=""
GOOGLE_API_KEY=""

# Optional, but recommended for best in class tracing and observability.
# LANGSMITH_PROJECT="default"
# LANGSMITH_API_KEY=""
# LANGSMITH_TRACING_V2=true

# Optional
# ANTHROPIC_API_KEY=""
# FINANCIAL_DATASETS_API_KEY=""
````

Start the LangGraph server:

```bash
pnpm agent
```

You should see output similar to:

```
          Welcome to

╦  ┌─┐┌┐┌┌─┐╔═╗┬─┐┌─┐┌─┐┬ ┬
║  ├─┤││││ ┬║ ╦├┬┘├─┤├─┘├─┤
╩═╝┴ ┴┘└┘└─┘╚═╝┴└─┴ ┴┴  ┴ ┴.js

- 🚀 API: http://localhost:2024
- 🎨 Studio UI: https://smith.langchain.com/studio?baseUrl=http://localhost:2024
```

# Example usage

The following are some prompts, and corresponding graph IDs you can use to test the agents:

- Graph ID: `agent`:
  - `What can you do?` - Will list all of the tools/actions it has available
  - `Show me places to stay in <insert location here>` - Will trigger a generative UI travel agent which renders a UI to select accommodations.
  - `Recommend some restaurants for me in <insert location here>` - Will trigger a generative UI travel agent which renders a UI to select restaurants.
  - `What's the current price of <insert company/stock ticker here>` - Will trigger a generative UI stockbroker agent which renders the current price of the stock.
  - `I want to buy <insert quantity here> shares of <insert company/stock ticker here>.` - Will trigger a generative UI stockbroker agent which renders a UI to buy a stock at its current price.
  - `Show me my portfolio` - Will trigger a generative UI stockbroker agent which renders a UI to show the user's portfolio.
  - `Write a React TODO app for me` - Will trigger the `Open Code` agent, which is a dummy re-implementation of Anthropic's Claude Code CLI. This agent is solely used to demonstrate different UI components you can render with LangGraph, and will not actually generate new code. The planning steps & generated code are all static values.
  - `Order me a pizza <include optional topping instructions> in <include location here>` - Used to demonstrate how tool calls/results are rendered.
- Graph ID: `chat`:
  - This is a plain chat agent, which simply passes the conversation to an LLM and generates a text response. This does not have access to any tools, or generative UI components.
- Graph ID: `email_agent`:
  - `Write me an email to <insert email here> about <insert email description here>` - Will generate an email for you, addressed to the email address you specified. Used to demonstrate how you can trigger the built in Human in the Loop (HITL) UI in the Agent Chat UI. This agent will throw an `interrupt`, with the standard [`HumanInterrupt`](https://github.com/langchain-ai/langgraph/blob/84c956bc8c3b2643819677bea962425e02e15ba4/libs/prebuilt/langgraph/prebuilt/interrupt.py#L42) schema, which the Agent Chat UI is able to automatically detect, and render a HITL UI component to manage the interrupt.

# Agents

Key

- [Supervisor](#supervisor)
  - [Stockbroker](#stockbroker)
  - [Trip Planner](#trip-planner)
  - [Open Code](#open-code)
  - [Order Pizza](#order-pizza)
- [Chat Agent](#chat-agent)
- [Email Agent](#email-agent)

## Supervisor

This is the default agent, which has access to a series of subgraphs it can call, depending on the context of the conversation. This includes the following agents:

- [Stockbroker](#stockbroker)
- [Trip Planner](#trip-planner)
- [Open Code](#open-code)
- [Order Pizza](#order-pizza)

This agent works by taking in the input, and passing it, along with the rest of the chat history to a `router` node. This node passes the entire chat history to Gemini 2.0 Flash, and forces it to call a tool, with the route to take based on the conversation.

If the context does not have a clear subgraph which should be called, it routes to the `General Input` node, which contains a single LLM call used to respond to the user's input.

### Stockbroker

The stockbroker agent has a series of tools available to it which will render generative UI components in the Agent Chat UI. It should be accessed via the `agent` graph ID, which means you'll need to go through the Supervisor agent to access it. The following are the prompts you can use to test the stockbroker agent:

- `What's the current price of <insert company/stock ticker here>` - Will trigger a generative UI stockbroker agent which renders the current price of the stock.
- `I want to buy <insert quantity here> shares of <insert company/stock ticker here>.` - Will trigger a generative UI stockbroker agent which renders a UI to buy a stock at its current price.
- `Show me my portfolio` - Will trigger a generative UI stockbroker agent which renders a UI to show the user's portfolio.

### Trip Planner

The trip planner agent has tools available to it which can render generative UI components for planning/booking trips. It should be accessed via the `agent` graph ID, which means you'll need to go through the Supervisor agent to access it. The following prompts will trigger the trip planner agent:

- `Show me places to stay in <insert location here>` - Will trigger a generative UI travel agent which renders a UI to select accommodations.
- `Recommend some restaurants for me in <insert location here>` - Will trigger a generative UI travel agent which renders a UI to select restaurants.

The agent will first extract the following information from your input, if present:

- `location` - Required field. This can be the city, state, or some other location for the trip.
- `startDate` - Optional field. The start date of the trip. Defaults to 4 weeks from now.
- `endDate` - Optional field. The end date of the trip. Defaults to 5 weeks from now.
- `numberOfGuests` - Optional field. The number of guests attending the trip. Defaults to 2.

The only field, `location`, is required, and the rest are optional.

### Open Code

This is a dummy code writing agent, used to demonstrate how you can implement generative UI components in agents. It should be accessed via the `agent` graph ID, which means you'll need to go through the Supervisor agent to access it. It is triggered by requesting the agent to write a React TODO app, like this:

- `Write a React TODO app for me`

This will then render a plan (these steps are static, and will always be the same). After that, it'll "generate" code (each plan item has a corresponding "generated code output") for each item in the plan. It only does this one at a time, and will not suggest the next part of generated code until after the previous suggestion has been accepted, rejected, or accepted for all future requests in this session. If you select that button, it will resume the graph, and continue through the rest of the steps, and suggest code without pausing to wait for your approval.

### Order Pizza

The order pizza agent is used to demonstrate how tool calls/results are rendered in the UI. It should be accessed via the `agent` graph ID, which means you'll need to go through the Supervisor agent to access it. You can trigger it via the following query:

- `Order me a pizza <include optional topping instructions> in <include location here>`

It will then call two tools, once to extract the fields from your input for the pizza order (order details, and location). After that, it calls the tool to "order" the pizza. Each of these tool calls will have corresponding tool call/result UI components rendered in the Agent Chat UI. These are the default UI components rendered when your graph calls a tool/returns a tool result.

## Chat Agent

The chat agent is a single LLM call, used to demonstrate the plain back and forth of a chat agent. It should be accessed via the `chat` graph ID. It does not have access to any tools, or generative UI components.

## Email Agent

The email agent is a dummy implementation of how you'd implement an email assistant with the Agent Chat UI. It is accessed via the `email_agent` graph ID. You can trigger it via the following query:

- `Write me an email to <insert email here> about <insert email description here>`

This will then call the graph which extracts fields from your input (or responds with a request for more information). Once it's extracted all of the required information it will interrupt, passing the standardized [`HumanInterrupt`](https://github.com/langchain-ai/langgraph/blob/84c956bc8c3b2643819677bea962425e02e15ba4/libs/prebuilt/langgraph/prebuilt/interrupt.py#L42) schema. The Agent Chat UI is able to detect when interrupts with this schema are thrown, and when it finds one it renders a UI component to handle actions by the user which are used to resume the graph.

The allowed actions are:

- `Accept` - If you accept the email as is, without making changes to any fields, it will "send" the email (emails aren't actually sent, just a message is displayed indicating the email was sent).
- `Edit` - If you edit any of the email fields and submit, it will "send" the email with the new values.
- `Respond` - If you send a text response back, it will be used to rewrite the email in some way, then interrupt again and wait for you to take an action.
- `Ignore` - This will send back an `ignore` response, and the graph will end without taking any actions.
- `Mark as resolved` - If you select this, it will resume the graph, but starting at the `__end__` node, causing the graph to end without taking any actions.

## Writer Agent

This is a dummy agent used to demonstrate how you can stream generative UI components as an artifact. It should be accessed via the `writer` graph ID. It should be accessed via the `agent` graph ID, which means you'll need to go through the Supervisor agent to access it. The following prompts will trigger the writer agent:

- `Write me a short story about a <insert topic here>`

This will render a generative UI component that contains the title and content of your short story. The generative UI component will be rendered in a side panel to the right of the chat and the contents of the story will be streamed to the UI as it is generated.
