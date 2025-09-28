# Plano de Implementação - Trip Planner

## 🎯 Roadmap Detalhado

### 🚀 Fase 1: Flight Search System (Prioridade Máxima)

#### 1.1 Backend - Flight Search Tool

**Localização**: `agent/src/agent/trip-planner/tools/`

```typescript
// flight-search.ts
interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  directOnly?: boolean;
  withBaggage?: boolean;
  cheapestOnly?: boolean;
}

const searchFlights = async (params: FlightSearchParams) => {
  // Mock implementation com dados realistas
  // Simular latência (300-1200ms)
  // 15% chance de erro para testar resiliência
};
```

#### 1.2 Frontend - Flight Results Component

**Localização**: `chat-frontend/src/components/agent-ui/flight/`

```typescript
// FlightResults.tsx
interface FlightResultsProps {
  flights: FlightResult[];
  searchParams: FlightSearchParams;
  loading?: boolean;
  error?: string;
  onBookFlight: (itineraryId: string) => void;
  onRetry: () => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({ ... }) => {
  return (
    <div className="flight-results">
      {flights.map(flight => (
        <FlightCard
          key={flight.itineraryId}
          flight={flight}
          onBook={onBookFlight}
        />
      ))}
    </div>
  );
};
```

#### 1.3 Integration Flow

1. Usuário: "CNF → SFO, ida 2025-10-01, volta 2025-10-10, 1 adulto"
2. Agent parse natural language → `searchFlights` tool
3. Tool retorna dados mock + UI component
4. Frontend renderiza `FlightResults` com cards interativos
5. Cards mostram: airline, times, price, "Reservar" button

### 🏗️ Fase 2: Booking System & Database

#### 2.1 Database Setup

**Tecnologia**: Prisma + PostgreSQL (ou SQLite para dev)

```prisma
// prisma/schema.prisma
model FlightBooking {
  id            String   @id @default(cuid())
  pnr           String   @unique
  status        BookingStatus
  total         Decimal
  currency      String   @default("USD")
  passengerName String
  passengerEmail String
  itineraryId   String
  createdAt     DateTime @default(now())
}

enum BookingStatus {
  TICKETED
  CANCELED
}
```

#### 2.2 Booking Tools

```typescript
// book-flight.ts
const bookFlight = async ({
  itineraryId,
  passenger
}: BookFlightParams) => {
  // Generate unique PNR
  const pnr = generatePNR();

  // Simulate booking API call
  await simulateBookingLatency();

  // 15% error simulation
  if (Math.random() < 0.15) {
    throw new Error("Booking failed - please try again");
  }

  // Save to database
  const booking = await prisma.flightBooking.create({
    data: { pnr, status: 'TICKETED', ... }
  });

  return { pnr, status: 'TICKETED', total: booking.total };
};
```

#### 2.3 Booking UI Components

```typescript
// FlightBookingForm.tsx
interface BookingFormProps {
  itineraryId: string;
  flightDetails: FlightResult;
  onSubmit: (passenger: PassengerData) => void;
  loading?: boolean;
  error?: string;
}

// FlightBookingConfirmation.tsx
interface BookingConfirmationProps {
  pnr: string;
  status: string;
  total: number;
  passengerName: string;
  flightDetails: FlightResult;
}
```

### 🏨 Fase 3: Hotel System (Desejável)

#### 3.1 Hotel Search

```typescript
// hotel-search.ts
const searchHotels = async ({
  city,
  checkin,
  checkout,
  rooms = 1,
  withBreakfast = false,
  refundableOnly = false,
}: HotelSearchParams) => {
  // Mock hotel data
  return hotelResults;
};
```

#### 3.2 Hotel Components

- `HotelResults.tsx`: Cards com nome, rating, preço, políticas
- `HotelBookingForm.tsx`: Formulário de reserva
- `HotelBookingConfirmation.tsx`: Confirmação com reservationId

### 🛡️ Fase 4: Resiliência & Error Handling

#### 4.1 Error Simulation

```typescript
// utils/resilience.ts
export const simulateLatency = () => {
  const delay = Math.random() * (1200 - 300) + 300; // 300-1200ms
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const simulateFailure = (failureRate = 0.15) => {
  if (Math.random() < failureRate) {
    throw new Error("Service temporarily unavailable");
  }
};
```

#### 4.2 UI Error States

```typescript
// ErrorBoundary for booking components
// Toast notifications for transient errors
// Retry buttons with exponential backoff
// Loading skeletons during retry attempts
```

### 🧪 Fase 5: Testes

#### 5.1 Unit Tests (Vitest)

```typescript
// FlightResults.test.tsx
describe("FlightResults Component", () => {
  it("renders flight cards correctly", () => {
    // Test component rendering
  });

  it("shows loading skeleton when loading", () => {
    // Test loading state
  });

  it("displays error message and retry button on error", () => {
    // Test error state
  });
});
```

#### 5.2 E2E Tests (Playwright)

```typescript
// e2e/flight-booking.spec.ts
test("complete flight booking flow", async ({ page }) => {
  // 1. Search flights
  await page.fill(
    "[data-testid=chat-input]",
    "CNF → SFO, ida 2025-10-01, volta 2025-10-10, 1 adulto",
  );
  await page.click("[data-testid=send-button]");

  // 2. Wait for results
  await page.waitForSelector("[data-testid=flight-card]");

  // 3. Book flight
  await page.click("[data-testid=book-button]");
  await page.fill("[data-testid=passenger-name]", "John Doe");
  await page.fill("[data-testid=passenger-email]", "john@example.com");
  await page.click("[data-testid=confirm-booking]");

  // 4. Verify confirmation
  await expect(page.locator("[data-testid=pnr]")).toBeVisible();

  // 5. Cancel booking
  await page.fill("[data-testid=pnr-input]", pnr);
  await page.click("[data-testid=cancel-booking]");

  // 6. Verify cancellation
  await expect(page.locator("text=CANCELED")).toBeVisible();
});
```

## 📋 Checklist de Implementação

### ✅ Base Infrastructure (Concluído)

- [x] Chat interface with streaming
- [x] Generative UI system
- [x] Message deduplication
- [x] Error handling framework
- [x] Loading states
- [x] i18n setup

### 🔄 Flight System (Em Progresso)

- [ ] Flight search tool implementation
- [ ] Mock flight data generation
- [ ] FlightResults UI component
- [ ] FlightCard subcomponent
- [ ] Search parameters validation
- [ ] Error simulation in search

### ⏳ Booking System (Pendente)

- [ ] Database schema setup (Prisma)
- [ ] PNR generation utility
- [ ] Flight booking tool
- [ ] Booking form component
- [ ] Confirmation component
- [ ] Cancellation tool & UI

### ⏳ Hotel System (Desejável)

- [ ] Hotel search tool
- [ ] Hotel results UI components
- [ ] Hotel booking system
- [ ] Hotel cancellation

### ⏳ Quality Assurance (Pendente)

- [ ] Unit tests for components
- [ ] E2E test for complete flow
- [ ] Error simulation testing
- [ ] Accessibility audit
- [ ] Security review (XSS prevention)

## 🎨 Design System

### Color Palette

```css
:root {
  --primary-flight: #2563eb;
  --primary-hotel: #059669;
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --loading: #6b7280;
}
```

### Component States

- **Default**: Normal state
- **Loading**: Skeleton + spinner
- **Error**: Red border + retry button
- **Success**: Green confirmation
- **Disabled**: Grayed out during processing

## 🔐 Security Considerations

### Input Validation

```typescript
// Validate dates, emails, names
const validatePassenger = (data: PassengerData) => {
  const schema = z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
  });
  return schema.parse(data);
};
```

### XSS Prevention

```typescript
// Sanitize LLM responses before rendering
import DOMPurify from "dompurify";

const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content);
};
```

## 📊 Performance Metrics

### Target Metrics

- **Time to Interactive**: < 3s
- **Search Response**: < 2s (with simulated latency)
- **Booking Confirmation**: < 1s
- **Error Recovery**: < 5s with retry

### Monitoring Points

- LangGraph response times
- Database query performance
- Component render times
- Error rates and recovery

## 🚦 Risk Mitigation

### High Risk

1. **LangGraph Integration**: Complex streaming + UI components

   - **Mitigation**: Extensive testing, fallback mechanisms

2. **Database Consistency**: Concurrent bookings, PNR uniqueness
   - **Mitigation**: Database constraints, transaction locks

### Medium Risk

3. **Mock Data Quality**: Realistic flight/hotel data

   - **Mitigation**: Use real API response formats

4. **Error Simulation**: Consistent 15% failure rate
   - **Mitigation**: Configurable failure rates, proper randomization

### Low Risk

5. **UI Responsiveness**: Complex flight cards
   - **Mitigation**: Progressive enhancement, skeleton states

## 📈 Success Metrics

### Functional Requirements

- [ ] Flight search returns valid results
- [ ] Booking generates unique PNR
- [ ] Cancellation updates status correctly
- [ ] Error simulation works consistently

### Non-Functional Requirements

- [ ] All components have loading states
- [ ] Error messages are user-friendly
- [ ] Retry mechanisms work reliably
- [ ] Accessibility score > 90 (Lighthouse)

### User Experience

- [ ] Natural language understanding works
- [ ] UI feels responsive during operations
- [ ] Error recovery is intuitive
- [ ] Confirmation details are complete

---

_Última atualização: 27 de setembro de 2025_
