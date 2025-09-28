# 📋 Avaliação Técnica - Desafio Senior Frontend Engineer (Blis AI)

**Avaliador:** Simulação de Avaliação Técnica  
**Data:** 28 de setembro de 2025  
**Projeto:** Trip Planner com LangGraph + Generative UI

---

## 🎯 **RESUMO EXECUTIVO**

| **Aspecto**               | **Status**          | **Nota** | **Comentários**                                  |
| ------------------------- | ------------------- | -------- | ------------------------------------------------ |
| **Arquitetura do Agente** | ✅ Implementado     | 8.5/10   | Boa estrutura com LangGraph, tools tipadas       |
| **Generative UI**         | ✅ Implementado     | 9.0/10   | Excelente streaming, componentes reutilizáveis   |
| **Integração com API**    | ✅ Implementado     | 7.5/10   | API real integrada, mas sem persistência backend |
| **UX/Acessibilidade**     | 🔄 Parcial          | 6.5/10   | Boa usabilidade, falta i18n completo             |
| **Testes**                | ❌ Não Implementado | 3.0/10   | Estrutura existe, mas testes específicos faltam  |
| **Persistência**          | ❌ Não Implementado | 2.0/10   | Apenas mock/fallback, sem DB real                |

**Nota Geral: 7.2/10** - _Boa implementação do agente e UI, mas falta persistência e testes_

---

## 🏗️ **ARQUITETURA DO AGENTE - ANÁLISE DETALHADA**

### ✅ **Pontos Fortes Implementados**

#### **1. Estrutura LangGraph Sólida**

```typescript
// ✅ Agente bem estruturado
src/agent/
├── flights/
│   ├── utils/flights-tools.ts     // Tools tipadas
│   └── types.ts                   // Tipos bem definidos
├── trip-planner/
│   ├── nodes/                     // Nós do grafo
│   ├── schemas/                   // Validação Zod
│   └── types.ts                   // Estados tipados
```

#### **2. Tools Bem Definidas e Tipadas**

```typescript
// ✅ Excelente: Tools com schemas Zod
const listFlightsSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  departDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // ... outros campos validados
});
```

#### **3. Integração API Real**

```typescript
// ✅ Implementado: Cliente API robusto
export const bookFlight = async (
  params: BookFlightParams,
): Promise<BookFlightResponse> => {
  // Converte parâmetros para formato da API
  const apiRequest = convertBookingParamsToApiRequest(params);

  // Chamada real à API
  const response = await apiClient.post(
    `/api/flights/${params.itineraryId}/book`,
  );

  // Converte resposta para formato legado
  return convertApiBookingToResponse(bookingData);
};
```

#### **4. Generative UI Excellente**

```tsx
// ✅ Componentes streaming bem implementados
export default function FlightsList(props: FlightsListProps) {
  const thread = useStreamContext();
  const { t } = useI18n(contextLanguage);

  // Carrossel responsivo com múltiplos cards
  <Carousel className="w-full" opts={{ align: "start", loop: false }}>
    <CarouselContent className="-ml-1 md:-ml-2">
      {props.flights.map((flight) => (
        <CarouselItem key={flight.itineraryId}
                     className="pl-1 md:pl-2 basis-full sm:basis-1/2 lg:basis-1/3">
```

### 🔧 **Implementações de Qualidade**

#### **1. Tratamento de Tipos e Conversões**

```typescript
// ✅ Excelente: Conversão entre formatos API/legado
export function convertApiFlightToItinerary(
  apiFlight: ApiFlight,
): FlightItinerary {
  return {
    itineraryId: apiFlight.id,
    airline: apiFlight.airline,
    outbound: convertApiSegmentsToLegacy(apiFlight.segments),
    // ... conversões bem estruturadas
  };
}
```

#### **2. Error Handling Robusto**

```typescript
// ✅ Implementado: Fallbacks inteligentes
} catch (error) {
  console.error("❌ Erro ao reservar voo:", error);
  throw new Error(
    error instanceof Error ? error.message : "Erro ao reservar voo",
  );
}
```

---

## 📊 **HISTÓRIAS DE USUÁRIO - STATUS**

### ✅ **A) Voos - Buscar (IMPLEMENTADO)**

- **Status:** ✅ **Completo**
- **Funcionalidades:**
  - ✅ Integração com API real `https://trip-planner-backend-three.vercel.app/api/flights`
  - ✅ Cards interativos com carrossel responsivo
  - ✅ Informações completas: airline, horários, conexões, preço
  - ✅ UI streaming com loading states

### 🔄 **B) Voos - Reservar (PARCIALMENTE IMPLEMENTADO)**

- **Status:** 🔄 **70% Completo**
- **Implementado:**
  - ✅ Modal de booking com validação
  - ✅ Captura nome/email
  - ✅ Integração com API (com fallback)
- **Faltando:**
  - ❌ Persistência real no backend
  - ❌ PNR real (apenas mock)

### 🔄 **C) Voos - Cancelar (ESTRUTURA PRONTA)**

- **Status:** 🔄 **60% Completo**
- **Implementado:**
  - ✅ Função `cancelFlight` estruturada
  - ✅ API client preparado
- **Faltando:**
  - ❌ Endpoint real no backend
  - ❌ UI de cancelamento

### ❌ **D-F) Hotéis (NÃO IMPLEMENTADO)**

- **Status:** ❌ **Faker.js/Mock apenas**
- **Situação:** Usa `@faker-js/faker` para dados fictícios
- **Endpoint:** `/api/hotels` não existe no backend

### ❌ **G) Resiliência (NÃO IMPLEMENTADO)**

- **Status:** ❌ **Falta implementar**
- **Necessário:**
  - Simulação de latência (300-1200ms)
  - ~15% taxa de erro
  - Toast/retry mechanism
  - Loading skeletons

---

## 🎨 **GENERATIVE UI - ANÁLISE TÉCNICA**

### ✅ **Excelências Implementadas**

#### **1. Arquitetura de Componentes**

```
src/agent-uis/flights/flights-list/
├── index.tsx                    // ✅ Container principal
├── components/
│   ├── BookingModal.tsx         // ✅ Modal complexo (391 linhas)
│   ├── FlightCard.tsx          // ✅ Card individual
│   ├── FlightHeader.tsx        // ✅ Header premium
│   ├── EmptyFlights.tsx        // ✅ Estado vazio
│   └── FlightBadge.tsx         // ✅ Badges informativos
```

#### **2. Responsividade Excelente**

```tsx
// ✅ Implementação responsiva profissional
<CarouselItem className="pl-1 md:pl-2 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
  <div className="h-full">
    <FlightCard flight={flight} />
  </div>
</CarouselItem>
```

#### **3. Estados de Loading/Erro**

```tsx
// ✅ Loading states bem implementados
if (!showResults) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl">
      <LoadingState message={t("flight.list.searchingFlights")} size="lg" />
    </div>
  );
}
```

### 🔧 **Melhorias Implementadas (Durante Avaliação)**

- ✅ Carrossel corrigido: de `basis-[38%]` para responsivo
- ✅ Cards com largura mínima `min-w-[320px]`
- ✅ Melhor espaçamento e navegação

---

## 🔍 **QUALIDADE DE CÓDIGO**

### ✅ **Pontos Fortes**

#### **1. TypeScript Robusto**

```typescript
// ✅ Tipos bem definidos
export interface FlightItinerary {
  itineraryId: string;
  airline: string;
  outbound: FlightSegment[];
  inbound?: FlightSegment[];
  stops: number;
  baggageIncluded: boolean;
  totalPrice: number;
  currency: string;
}
```

#### **2. Separação de Responsabilidades**

```
src/services/
├── api-client.ts        // ✅ Cliente HTTP genérico
├── api-types.ts         // ✅ Conversões API/legado
└── flights-api.ts       // ✅ Serviço específico voos
```

#### **3. Hooks Customizados**

```typescript
// ✅ Hook i18n bem estruturado
export const useI18n = (language: string = "en-US") => {
  const t = useCallback(
    (key: string): string => {
      return (
        translations[language]?.[key] || translations["en-US"]?.[key] || key
      );
    },
    [language],
  );

  return { t };
};
```

---

## ⚠️ **GAPS E MELHORIAS NECESSÁRIAS**

### 🚨 **CRÍTICO - Implementar**

#### **1. Persistência de Dados**

```sql
-- ❌ FALTA: Estrutura de banco
-- Necessário implementar:
CREATE TABLE flight_bookings (
  id SERIAL PRIMARY KEY,
  pnr VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  itinerary_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. Testes E2E**

```typescript
// ❌ FALTA: Teste crítico
test("Fluxo completo: buscar → reservar → cancelar", async () => {
  // Buscar voos CNF → SFO
  // Selecionar voo e reservar
  // Verificar PNR gerado
  // Cancelar reserva
  // Verificar status CANCELED
});
```

#### **3. Simulação de Resiliência**

```typescript
// ❌ FALTA: Middleware de simulação
const simulateLatencyAndErrors = (
  latencyRange: [number, number] = [300, 1200],
  errorRate: number = 0.15,
) => {
  // Simular latência aleatória
  // Simular falhas ocasionais
  // Implementar retry logic
};
```

### 🔧 **IMPORTANTE - Melhorar**

#### **1. Internacionalização Completa**

```typescript
// 🔄 PARCIAL: Expandir traduções
const translations = {
  "pt-BR": {
    // ❌ FALTA: Mais chaves de tradução
    "flight.booking.error": "Erro ao reservar voo",
    "flight.booking.retry": "Tentar novamente",
    "flight.booking.success": "Voo reservado com sucesso!",
  },
};
```

#### **2. Acessibilidade ARIA**

```tsx
// 🔄 PARCIAL: Melhorar ARIA
<button
  onClick={() => onBookFlight(flight)}
  aria-label={`Reservar voo ${flight.airline} por ${flight.totalPrice}`}
  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
>
```

---

## 📈 **CRITÉRIOS DE AVALIAÇÃO - NOTAS DETALHADAS**

### **Frontend — Arquitetura de Componentes & Design de APIs UI (40%)**

**Nota: 8.5/10**

- ✅ **Excelente:** Componentes bem estruturados e reutilizáveis
- ✅ **Excelente:** Separação clara de responsabilidades
- ✅ **Muito Bom:** APIs de UI consistentes e tipadas
- 🔧 **Melhorar:** Alguns componentes poderiam ser mais modulares

### **UX/Produto & Acessibilidade (25%)**

**Nota: 7.0/10**

- ✅ **Excelente:** Loading states e transições suaves
- ✅ **Muito Bom:** Interface intuitiva e carrossel responsivo
- 🔄 **Bom:** Acessibilidade básica implementada
- ❌ **Falta:** ARIA labels completos, navegação por teclado

### **Qualidade de Código & Manutenibilidade (20%)**

**Nota: 8.0/10**

- ✅ **Excelente:** TypeScript robusto com tipos bem definidos
- ✅ **Excelente:** Estrutura de pastas organizada
- ✅ **Muito Bom:** Error handling consistente
- 🔧 **Melhorar:** Alguns arquivos muito longos (391 linhas)

### **LangGraph & Generative UI (10%)**

**Nota: 9.0/10**

- ✅ **Excelente:** Integração perfeita com LangGraph SDK
- ✅ **Excelente:** Streaming funcionando corretamente
- ✅ **Excelente:** Tools tipadas com Zod schemas
- ✅ **Excelente:** Estado do agente bem gerenciado

### **Resiliência & Testes (5%)**

**Nota: 3.0/10**

- ❌ **Crítico:** Falta simulação de latência/erros
- ❌ **Crítico:** Testes E2E não implementados
- 🔄 **Parcial:** Estrutura de testes existe (Vitest)
- ❌ **Falta:** Retry mechanisms

---

## 🎯 **PRÓXIMOS PASSOS RECOMENDADOS**

### **Prioridade ALTA (Críticos)**

1. **Implementar Persistência Real**

   - PostgreSQL/SQLite com Prisma
   - Migrations para flight_bookings
   - Endpoints reais de booking/cancel

2. **Testes E2E Completos**

   - Playwright setup
   - Fluxo: buscar → reservar → cancelar
   - Cenários de erro e retry

3. **Simulação de Resiliência**
   - Middleware de latência (300-1200ms)
   - Taxa de erro ~15% em bookings
   - Toast notifications para erros

### **Prioridade MÉDIA (Importantes)**

1. **Hotéis - Implementação Completa**

   - API real para hotéis
   - Componentes de listagem/booking
   - Persistência de reservas

2. **Melhorias de UX**

   - Loading skeletons mais detalhados
   - Animações de transição
   - Feedback visual robusto

3. **Internacionalização Completa**
   - Expandir dicionário pt-BR/en-US
   - Formatação de datas/moedas
   - RTL support (futuro)

### **Prioridade BAIXA (Desejáveis)**

1. **Performance Optimizations**

   - Code splitting por rotas
   - Lazy loading de componentes
   - Caching de resultados

2. **Monitoramento**
   - Analytics de conversão
   - Error tracking (Sentry)
   - Performance metrics

---

## 📋 **CHECKLIST FINAL**

### ✅ **Implementado e Funcionando**

- [x] Agente LangGraph estruturado
- [x] Tools tipadas com Zod
- [x] Generative UI com streaming
- [x] Integração API real para voos
- [x] Componentes responsivos
- [x] Loading states
- [x] TypeScript robusto
- [x] Carrossel de voos corrigido

### 🔄 **Parcialmente Implementado**

- [x] Booking de voos (sem persistência)
- [x] Cancelamento (estrutura pronta)
- [x] Internacionalização (básica)
- [x] Acessibilidade (básica)

### ❌ **Não Implementado (Crítico)**

- [ ] Persistência em banco de dados
- [ ] Testes E2E automatizados
- [ ] Simulação de resiliência (latência/erros)
- [ ] Hotéis (API real)
- [ ] Retry mechanisms com toast

### ❌ **Não Implementado (Importante)**

- [ ] ARIA labels completos
- [ ] Navegação por teclado
- [ ] Error boundaries
- [ ] Performance monitoring

---

## 🏆 **CONSIDERAÇÕES FINAIS**

**Este é um projeto de ALTA QUALIDADE** que demonstra:

1. **Domínio Técnico Avançado:** Implementação sólida do LangGraph com Generative UI
2. **Arquitetura Sênior:** Separação de responsabilidades e código limpo
3. **UX Cuidadosa:** Interface polida com atenção aos detalhes
4. **Integração Real:** API externa funcionando corretamente

**Pontos que elevam o projeto:**

- Streaming de componentes bem implementado
- Types TypeScript robustos
- Carrossel responsivo profissional
- Error handling consistente

**Principais gaps para produção:**

- Falta de persistência real (crítico para o desafio)
- Ausência de testes E2E (requisito explícito)
- Simulação de resiliência não implementada

**Veredicto:** Excelente base técnica, mas necessita completar os requisitos de persistência e testes para estar production-ready.

---

## 🔧 **MELHORIAS NO CÓDIGO EXISTENTE**

### **1. Otimizações de Performance**

#### **FlightCard Component (149 linhas) - Quebrar em Subcomponentes**

```tsx
// ❌ Atual: Componente monolítico
export function FlightCard({ flight, onBookFlight, t }: FlightCardProps) {
  return (
    <div className="border rounded-lg p-2 bg-white hover:shadow-md">
      {/* 149 linhas de código... */}
    </div>
  );
}

// ✅ Melhorar: Componentes menores e focados
export function FlightCard({ flight, onBookFlight, t }: FlightCardProps) {
  return (
    <div className="border rounded-lg p-2 bg-white hover:shadow-md">
      <FlightCardHeader flight={flight} t={t} />
      <FlightSegments segments={flight.outbound} inbound={flight.inbound} />
      <FlightPriceSection
        price={flight.totalPrice}
        currency={flight.currency}
      />
      <FlightBookingButton onClick={() => onBookFlight(flight)} t={t} />
    </div>
  );
}
```

#### **BookingModal (391 linhas) - Refatoração Necessária**

```tsx
// ❌ Problema: Modal muito complexo (391 linhas)
// ✅ Solução: Quebrar em steps e hooks customizados

// 1. Hook para lógica de validação
const useBookingValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateName = (name: string) => {
    if (name.trim().length < 2 || name.trim().split(" ").length < 2) {
      return "Nome completo é obrigatório";
    }
    return null;
  };

  return { validateName, validateEmail, errors };
};

// 2. Componentes separados por responsabilidade
<BookingModal>
  <BookingStepIndicator currentStep={step} />
  <PassengerInformationForm onValidate={handleValidation} />
  <FlightSummarySection flight={selectedFlight} />
  <BookingConfirmationButtons onConfirm={handleConfirm} />
</BookingModal>;
```

### **2. Melhorias na Arquitetura do Agent**

#### **Estado Global vs Local - Otimizar Context**

```typescript
// ❌ Atual: useStreamContext em cada componente
const thread = useStreamContext<
  { messages: Message[]; ui: UIMessage[] },
  { MetaType: { ui: UIMessage | undefined } }
>();

// ✅ Melhorar: Context Provider específico
export const FlightSearchProvider = ({ children }: PropsWithChildren) => {
  const thread = useStreamContext();
  const [flightState, dispatch] = useReducer(flightReducer, initialState);

  return (
    <FlightSearchContext.Provider value={{ thread, flightState, dispatch }}>
      {children}
    </FlightSearchContext.Provider>
  );
};

// Hook customizado
export const useFlightSearch = () => {
  const context = useContext(FlightSearchContext);
  if (!context) throw new Error('useFlightSearch must be used within FlightSearchProvider');
  return context;
};
```

#### **Error Boundaries para Robustez**

```tsx
// ✅ Implementar: Error boundary específico para UI generativa
export class GenerativeUIErrorBoundary extends Component<PropsWithChildren> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Generative UI Error:", error, errorInfo);
    // Log to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return (
        <GenerativeUIFallback
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}
```

### **3. Melhorias na Integração com API**

#### **Cache e Debounce para Busca**

```typescript
// ✅ Implementar: Cache inteligente
const flightCache = new Map<
  string,
  { data: FlightItinerary[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const listFlightsWithCache = async (
  params: ListFlightsParams,
): Promise<FlightItinerary[]> => {
  const cacheKey = JSON.stringify(params);
  const cached = flightCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("🎯 Cache hit for flights search");
    return cached.data;
  }

  const flights = await listFlights(params);
  flightCache.set(cacheKey, { data: flights, timestamp: Date.now() });
  return flights;
};

// ✅ Implementar: Debounce para busca em tempo real
export const useDebouncedFlightSearch = () => {
  const [searchParams, setSearchParams] = useState<ListFlightsParams | null>(
    null,
  );
  const debouncedParams = useDebounce(searchParams, 800);

  return { searchParams: debouncedParams, setSearchParams };
};
```

### **4. Melhorias de Acessibilidade**

#### **ARIA Labels e Navegação por Teclado**

```tsx
// ❌ Atual: Acessibilidade básica
<button onClick={() => onBookFlight(flight)}>
  🎫 {t("flight.list.bookFlight")}
</button>

// ✅ Melhorar: ARIA completo
<button
  onClick={() => onBookFlight(flight)}
  aria-label={`Reservar voo ${flight.airline} de ${flight.origin} para ${flight.destination} por ${formatCurrency(flight.totalPrice)}`}
  aria-describedby={`flight-details-${flight.itineraryId}`}
  onKeyDown={handleKeyboardNavigation}
>
  🎫 {t("flight.list.bookFlight")}
</button>

// Navegação por teclado no carrossel
const handleCarouselKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      api?.scrollPrev();
      break;
    case 'ArrowRight':
      e.preventDefault();
      api?.scrollNext();
      break;
    case 'Enter':
    case ' ':
      if (focusedFlightId) {
        onBookFlight(flights.find(f => f.itineraryId === focusedFlightId));
      }
      break;
  }
};
```

---

## 📋 **PLANO DE IMPLEMENTAÇÃO DOS GAPS**

### **FASE 1: INFRAESTRUTURA (Semana 1-2)**

#### **1.1 Setup de Persistência (Prioridade: CRÍTICA)**

**Objetivo:** Implementar PostgreSQL com Prisma para persistir reservas

**Tasks:**

```bash
# 1. Instalar dependências
npm install prisma @prisma/client
npm install -D @types/pg

# 2. Configurar Prisma
npx prisma init
```

**Schema Prisma:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model FlightBooking {
  id            String   @id @default(cuid())
  pnr           String   @unique
  status        BookingStatus
  total         Decimal  @db.Decimal(10, 2)
  currency      String   @default("BRL")
  passengerName String   @map("passenger_name")
  passengerEmail String  @map("passenger_email")
  itineraryId   String   @map("itinerary_id")
  flightData    Json?    @map("flight_data") // Dados completos do voo
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  canceledAt    DateTime? @map("canceled_at")

  @@map("flight_bookings")
}

model HotelBooking {
  id             String   @id @default(cuid())
  reservationId  String   @unique @map("reservation_id")
  status         BookingStatus
  total          Decimal  @db.Decimal(10, 2)
  currency       String   @default("BRL")
  guestName      String   @map("guest_name")
  guestEmail     String   @map("guest_email")
  hotelId        String   @map("hotel_id")
  checkin        DateTime
  checkout       DateTime
  hotelData      Json?    @map("hotel_data")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  canceledAt     DateTime? @map("canceled_at")

  @@map("hotel_bookings")
}

enum BookingStatus {
  PENDING
  TICKETED
  BOOKED
  CANCELED
  REFUNDED
}
```

**Migration e Setup:**

```bash
# 3. Criar e aplicar migration
npx prisma migrate dev --name init

# 4. Gerar cliente
npx prisma generate
```

**Serviço de Persistência:**

```typescript
// src/services/booking-persistence.ts
import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingPersistenceService {
  static async createFlightBooking(data: {
    pnr: string;
    itineraryId: string;
    passengerName: string;
    passengerEmail: string;
    total: number;
    currency: string;
    flightData: any;
  }) {
    return prisma.flightBooking.create({
      data: {
        ...data,
        status: BookingStatus.TICKETED,
      },
    });
  }

  static async cancelFlightBooking(pnr: string) {
    return prisma.flightBooking.update({
      where: { pnr },
      data: {
        status: BookingStatus.CANCELED,
        canceledAt: new Date(),
      },
    });
  }

  static async findFlightBookingByPnr(pnr: string) {
    return prisma.flightBooking.findUnique({
      where: { pnr },
    });
  }
}
```

#### **1.2 Setup de Testes E2E (Prioridade: CRÍTICA)**

**Playwright Setup:**

```bash
# 1. Instalar Playwright
npm install -D @playwright/test
npx playwright install

# 2. Configurar
```

**Configuração Playwright:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Teste E2E Crítico:**

```typescript
// tests/e2e/flight-booking-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Flight Booking Flow", () => {
  test("should complete full booking and cancellation flow", async ({
    page,
  }) => {
    // 1. Navegar para o chat
    await page.goto("/");

    // 2. Buscar voos
    await page.fill(
      '[data-testid="chat-input"]',
      "CNF → SFO, ida 2025-10-01, volta 2025-10-10, 1 adulto",
    );
    await page.press('[data-testid="chat-input"]', "Enter");

    // 3. Aguardar resultados
    await expect(page.locator('[data-testid="flights-list"]')).toBeVisible({
      timeout: 10000,
    });

    // 4. Selecionar primeiro voo
    await page.click('[data-testid="book-flight-button"]');

    // 5. Preencher dados do passageiro
    await page.fill('[data-testid="passenger-name"]', "João Silva Santos");
    await page.fill('[data-testid="passenger-email"]', "joao@example.com");

    // 6. Confirmar reserva
    await page.click('[data-testid="confirm-booking"]');

    // 7. Verificar PNR gerado
    await expect(page.locator('[data-testid="booking-pnr"]')).toBeVisible();
    const pnr = await page.textContent('[data-testid="booking-pnr"]');
    expect(pnr).toMatch(/^BK\d+/);

    // 8. Cancelar reserva
    await page.fill('[data-testid="chat-input"]', `cancelar reserva ${pnr}`);
    await page.press('[data-testid="chat-input"]', "Enter");

    // 9. Verificar cancelamento
    await expect(
      page.locator('[data-testid="cancellation-confirmed"]'),
    ).toBeVisible();
  });

  test("should handle booking errors gracefully", async ({ page }) => {
    // Simular erro na API
    await page.route("**/api/flights/*/book", (route) => {
      route.fulfill({ status: 500, body: "Internal Server Error" });
    });

    // Tentar reservar
    await page.goto("/");
    // ... fluxo de busca e seleção

    // Verificar erro e retry
    await expect(page.locator('[data-testid="booking-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });
});
```

### **FASE 2: RESILIÊNCIA E UX (Semana 2-3)**

#### **2.1 Sistema de Resiliência (Prioridade: ALTA)**

**Middleware de Simulação:**

```typescript
// src/middleware/resilience-simulator.ts
export interface ResilienceConfig {
  latencyRange: [number, number];
  errorRate: number;
  enabledEndpoints: string[];
}

export const resilienceSimulator = (config: ResilienceConfig) => {
  return async (url: string, options: RequestInit) => {
    const isEnabledEndpoint = config.enabledEndpoints.some((endpoint) =>
      url.includes(endpoint),
    );

    if (isEnabledEndpoint) {
      // Simular latência
      const [minLatency, maxLatency] = config.latencyRange;
      const latency = Math.random() * (maxLatency - minLatency) + minLatency;
      await new Promise((resolve) => setTimeout(resolve, latency));

      // Simular falhas
      if (Math.random() < config.errorRate) {
        throw new Error("Simulated API Error");
      }
    }

    return fetch(url, options);
  };
};

// Configuração para o desafio
export const CHALLENGE_RESILIENCE_CONFIG: ResilienceConfig = {
  latencyRange: [300, 1200],
  errorRate: 0.15,
  enabledEndpoints: ["/book", "/cancel"],
};
```

**Toast System para Errors:**

```tsx
// src/components/toast/ToastProvider.tsx
export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove success toasts
    if (toast.type === "success") {
      setTimeout(() => removeToast(id), 3000);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

// Hook para usar toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
```

**Retry Logic com Exponential Backoff:**

```typescript
// src/utils/retry.ts
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 5000,
    exponentialBase = 2,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const delay = Math.min(
        baseDelay * Math.pow(exponentialBase, attempt - 1),
        maxDelay,
      );

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Uso no booking
export const bookFlightWithRetry = async (params: BookFlightParams) => {
  const { addToast } = useToast();

  try {
    return await withRetry(() => bookFlight(params), {
      maxAttempts: 3,
      baseDelay: 1000,
    });
  } catch (error) {
    addToast({
      type: "error",
      title: "Erro na Reserva",
      message: "Não foi possível completar sua reserva. Tente novamente.",
      action: {
        label: "Tentar Novamente",
        onClick: () => bookFlightWithRetry(params),
      },
    });
    throw error;
  }
};
```

#### **2.2 Loading Skeletons Avançados**

```tsx
// src/components/skeletons/FlightCardSkeleton.tsx
export const FlightCardSkeleton = () => (
  <div className="border rounded-lg p-2 bg-white animate-pulse">
    <div className="bg-gray-200 rounded-xl p-3 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-300 rounded"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-20 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
    {/* Mais elementos skeleton... */}
  </div>
);

// Hook para estado de loading
export const useLoadingState = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, execute };
};
```

### **FASE 3: FUNCIONALIDADES AVANÇADAS (Semana 3-4)**

#### **3.1 Implementação Completa de Hotéis**

**API Service para Hotéis:**

```typescript
// src/services/hotels-api.ts
export async function listHotels(params: ListHotelsParams): Promise<Hotel[]> {
  // Implementar integração real ou mock estruturado
  const response = await apiClient.get<ApiHotelsResponse>("/api/hotels", {
    city: params.city,
    checkin: params.checkin,
    checkout: params.checkout,
    rooms: params.rooms || 1,
  });

  return response.data.hotels.map(convertApiHotelToLegacy);
}

export async function bookHotel(
  params: BookHotelParams,
): Promise<HotelBookingResponse> {
  const booking = await BookingPersistenceService.createHotelBooking({
    reservationId: `HR${Date.now()}`,
    hotelId: params.hotelId,
    guestName: params.guest.fullName,
    guestEmail: params.guest.email,
    checkin: new Date(params.checkin),
    checkout: new Date(params.checkout),
    total: params.total,
    currency: "BRL",
    hotelData: params.hotelData,
  });

  return {
    reservationId: booking.reservationId,
    status: booking.status,
    total: Number(booking.total),
  };
}
```

#### **3.2 Melhorias de Internacionalização**

**Dicionário Expandido:**

```typescript
// src/i18n/translations.ts
export const translations = {
  "pt-BR": {
    // Geral
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.retry": "Tentar Novamente",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",

    // Voos
    "flight.search.title": "Busca de Voos",
    "flight.search.searching": "Buscando voos disponíveis...",
    "flight.list.found": "voos encontrados",
    "flight.booking.passenger.name": "Nome Completo",
    "flight.booking.passenger.email": "E-mail",
    "flight.booking.success": "Voo reservado com sucesso!",
    "flight.booking.error": "Erro ao reservar voo",
    "flight.booking.pnr": "Código da Reserva (PNR)",
    "flight.cancellation.success": "Reserva cancelada com sucesso",

    // Hotéis
    "hotel.search.title": "Busca de Hotéis",
    "hotel.booking.guest.name": "Nome do Hóspede",
    "hotel.booking.success": "Hotel reservado com sucesso!",

    // Erros e Validação
    "validation.name.required": "Nome completo é obrigatório",
    "validation.email.invalid": "E-mail inválido",
    "error.network": "Erro de conexão. Verifique sua internet.",
    "error.timeout": "Tempo limite excedido. Tente novamente.",
  },
  "en-US": {
    // English translations...
  },
};

// Formatação de moeda
export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string,
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Formatação de data
export const formatDate = (date: string | Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};
```

### **CRONOGRAMA DE IMPLEMENTAÇÃO**

| **Semana**   | **Foco**       | **Deliverables**                | **Esforço** |
| ------------ | -------------- | ------------------------------- | ----------- |
| **Semana 1** | Infraestrutura | Prisma + PostgreSQL, Migrations | 16h         |
| **Semana 2** | Testes E2E     | Playwright, Fluxos críticos     | 12h         |
| **Semana 3** | Resiliência    | Retry logic, Toasts, Simulação  | 10h         |
| **Semana 4** | Hotéis + I18n  | API hotéis, Traduções completas | 8h          |

### **MÉTRICAS DE SUCESSO**

#### **Cobertura de Testes:**

- [ ] 100% dos fluxos críticos cobertos por E2E
- [ ] Teste de resiliência (15% erro + retry)
- [ ] Teste de acessibilidade (ARIA, keyboard navigation)

#### **Performance:**

- [ ] Loading inicial < 2s
- [ ] Busca de voos < 3s (com cache)
- [ ] Booking completo < 5s
- [ ] Retry bem-sucedido em < 10s

#### **Qualidade:**

- [ ] TypeScript strict mode 100%
- [ ] ESLint zero warnings
- [ ] Lighthouse Score > 90 (Performance, Accessibility)

---

**Nota Final: 7.2/10** ⭐⭐⭐⭐
_"Implementação técnica sólida com lacunas em requisitos específicos"_
