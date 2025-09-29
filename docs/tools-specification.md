# 🛠️ Tools Specification

## Visão Geral

O sistema implementa **6 tools principais** com validação Zod runtime, simulação de latência realística e error handling robusto. Todas as tools seguem o padrão de entrada/saída tipada e retornam dados structured + UI components.

## ✈️ Flight Tools

### `listFlights`

**Descrição**: Busca voos disponíveis entre aeroportos com filtros avançados.

**Schema de Input**:
```typescript
const FlightSearchSchema = z.object({
  origin: z.string().min(3).max(4), // IATA codes
  destination: z.string().min(3).max(4),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.number().int().min(1).max(9).default(1),
  class: z.enum(['economy', 'business', 'first']).default('economy')
});
```

**Exemplo de Chamada**:
```javascript
await listFlights({
  origin: "CNF",
  destination: "SFO", 
  departureDate: "2025-10-01",
  returnDate: "2025-10-10",
  passengers: 2,
  class: "economy"
});
```

**Output Structure**:
```typescript
interface FlightSearchResult {
  flights: Flight[];
  searchId: string;
  totalResults: number;
  ui: {
    component: 'FlightsList';
    props: {
      flights: Flight[];
      onBook: (flightId: string) => void;
      loading: boolean;
    };
  };
}

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: string; 
    time: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  aircraft: string;
  price: {
    amount: number;
    currency: 'BRL' | 'USD';
  };
  availability: {
    economy: number;
    business: number;
    first: number;
  };
}
```

**Comportamento**:
- ⏱️ **Latência**: 400-800ms simulada
- 📊 **Success Rate**: ~85% (15% erro simulado)
- 🔄 **Retry**: Automático com backoff exponencial
- 💾 **Caching**: 5min cache por combinação origem/destino/data

### `bookFlight`

**Schema de Input**:
```typescript
const FlightBookingSchema = z.object({
  flightId: z.string().uuid(),
  passenger: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    passport: z.string().optional()
  }),
  paymentMethod: z.object({
    type: z.enum(['credit_card', 'debit_card', 'pix']),
    cardNumber: z.string().regex(/^\d{16}$/),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
    cvv: z.string().regex(/^\d{3,4}$/)
  })
});
```

**Output Structure**:
```typescript
interface BookingResult {
  pnr: string; // Localizador da reserva
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  booking: {
    id: string;
    flight: Flight;
    passenger: Passenger;
    totalPrice: number;
    fees: BookingFee[];
    eTicket: string; // URL do bilhete
  };
  ui: {
    component: 'BookingConfirmation';
    props: {
      pnr: string;
      booking: BookingDetails;
      onCancel: () => void;
    };
  };
}
```

### `cancelFlight`

**Schema de Input**:
```typescript
const FlightCancelSchema = z.object({
  pnr: z.string().min(6).max(6),
  reason: z.enum([
    'PASSENGER_REQUEST', 
    'SCHEDULE_CHANGE', 
    'WEATHER', 
    'OTHER'
  ]).optional()
});
```

**Output**: Status de cancelamento + políticas de reembolso + UI de confirmação.

## 🏨 Hotel Tools

### `listHotels`

**Schema de Input**:
```typescript
const HotelSearchSchema = z.object({
  location: z.string().min(2), // Cidade ou coordenadas
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.object({
    adults: z.number().int().min(1).max(8),
    children: z.number().int().min(0).max(4).default(0)
  }),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional()
  }).optional(),
  amenities: z.array(z.enum([
    'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 
    'Parking', 'PetFriendly', 'BusinessCenter'
  ])).optional()
});
```

**Output Structure**:
```typescript
interface Hotel {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number; // 1-5 stars
  reviewScore: number; // 0-10
  reviewCount: number;
  images: string[];
  amenities: string[];
  rooms: Room[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: boolean;
  };
  pricePerNight: {
    amount: number;
    currency: string;
  };
}
```

### `bookHotel` & `cancelHotel`

Seguem estrutura similar aos flight tools com schemas específicos para dados hoteleiros.

## 🎯 Tool Execution Pipeline

### 1. **Input Validation**
```typescript
const executeTool = async (toolName: string, input: unknown) => {
  // Zod validation
  const schema = getToolSchema(toolName);
  const validatedInput = schema.parse(input);
  
  // Business rules validation
  await validateBusinessRules(toolName, validatedInput);
  
  return await callToolImplementation(toolName, validatedInput);
};
```

### 2. **API Simulation Layer**
```typescript
const simulateAPICall = async <T>(
  operation: () => Promise<T>,
  config: SimulationConfig
): Promise<T> => {
  // Simulate network latency
  await delay(config.latency.min, config.latency.max);
  
  // Simulate random failures
  if (Math.random() < config.errorRate) {
    throw new APISimulationError('Simulated network failure');
  }
  
  return await operation();
};

// Configuration per tool
const TOOL_CONFIGS = {
  listFlights: { latency: { min: 400, max: 800 }, errorRate: 0.10 },
  bookFlight: { latency: { min: 800, max: 1500 }, errorRate: 0.15 },
  listHotels: { latency: { min: 300, max: 600 }, errorRate: 0.08 }
};
```

### 3. **Response Formatting**
```typescript
const formatToolResponse = (toolName: string, data: any, error?: Error) => {
  return {
    tool: toolName,
    success: !error,
    data: error ? null : data,
    error: error?.message,
    ui: generateUIComponent(toolName, data, error),
    timestamp: new Date().toISOString()
  };
};
```

## 🔧 Error Handling Strategies

### Error Types
```typescript
enum ToolErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',     // Zod schema violation
  BUSINESS_RULE_ERROR = 'BUSINESS_RULE_ERROR', // Domain rules
  NETWORK_ERROR = 'NETWORK_ERROR',           // Simulated API failures
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',           // Request timeout
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'      // Too many requests
}
```

### Retry Logic
```typescript
const executeWithRetry = async (tool: Tool, input: any, maxRetries = 3) => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await tool.execute(input);
    } catch (error) {
      lastError = error;
      
      // Don't retry validation errors
      if (error.type === 'VALIDATION_ERROR') {
        throw error;
      }
      
      // Exponential backoff
      if (attempt < maxRetries) {
        await delay(Math.pow(2, attempt) * 1000);
      }
    }
  }
  
  throw new MaxRetriesExceededError(lastError);
};
```

### User Feedback
- 🔄 **Loading States**: Skeleton UI durante execução
- ⚠️ **Error Toast**: Notificação amigável para falhas
- 🎯 **Retry Button**: Permite re-executar tool manual
- 📊 **Progress Indicator**: Para tools de longa duração

## 🎨 UI Component Generation

### Dynamic Component Props
```typescript
const generateFlightUI = (
  flights: Flight[], 
  searchParams: FlightSearchParams,
  onBook: BookingCallback
) => {
  return {
    type: 'react',
    component: 'FlightsList',
    props: {
      flights,
      searchParams,
      onBook,
      loading: false,
      error: null,
      // Event handlers
      onSort: (field: string) => handleSort(field),
      onFilter: (filters: FlightFilters) => handleFilter(filters)
    },
    // CSS classes for styling
    className: 'flights-container',
    // Accessibility props
    ariaLabel: `${flights.length} flights found from ${searchParams.origin} to ${searchParams.destination}`
  };
};
```

### Real-time Updates
```typescript
// Streaming updates for long-running searches
const streamFlightResults = async function* (searchParams: FlightSearchParams) {
  yield { type: 'loading', message: 'Searching flights...' };
  
  const partialResults = await getPartialFlights(searchParams);
  yield { 
    type: 'partial', 
    data: partialResults,
    ui: generateFlightUI(partialResults, searchParams, handleBooking)
  };
  
  const fullResults = await getFullFlights(searchParams);
  yield { 
    type: 'complete',
    data: fullResults,
    ui: generateFlightUI(fullResults, searchParams, handleBooking)
  };
};
```

## 📊 Performance Metrics

### Performance Notes
- **Latência**: Simulada via resilience.ts (300-1200ms)
- **Success Rate**: ~85% com 15% erro simulado
- **Resource Usage**: Otimizado para desenvolvimento local
- **Network**: Simulado, sem requests externos reais

---

**Próximo**: [Generative UI Components](./generative-ui-components.md) - Documentação detalhada dos componentes React gerados dinamicamente.