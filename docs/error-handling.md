# 🔧 Error Handling & Resilience

## Visão Geral

O sistema implementa **resiliência por design** com simulação realística de falhas, retry automático, graceful degradation e feedback claro ao usuário. O objetivo é demonstrar como sistemas reais lidam com a instabilidade inerente de APIs externas.

## 🎯 Estratégia de Simulação

### API Simulator Service
```typescript
// Simula comportamento realístico de APIs externas
class APISimulator {
  private config = {
    baseLatency: 300,      // Latência mínima
    maxLatency: 1200,      // Latência máxima  
    errorRate: 0.15,       // 15% de chance de erro
    timeoutRate: 0.05,     // 5% de chance de timeout
    partialErrorRate: 0.08 // 8% de chance de dados parciais
  };

  async simulate<T>(operation: () => Promise<T>, type: OperationType): Promise<T> {
    // 1. Simular latência variável
    const latency = this.calculateLatency(type);
    await this.delay(latency);

    // 2. Simular falhas aleatórias
    if (this.shouldFail()) {
      throw this.generateRandomError();
    }

    // 3. Simular timeout
    if (this.shouldTimeout()) {
      throw new TimeoutError('Request timed out');
    }

    // 4. Executar operação real
    const result = await operation();

    // 5. Simular dados parciais/corrompidos
    if (this.shouldReturnPartialData()) {
      return this.corruptData(result);
    }

    return result;
  }
}
```

### Latency Patterns (Implementado em resilience.ts)
```typescript
// Configuração de latência implementada
const DEFAULT_RESILIENCE_CONFIG = {
  latencyRange: [300, 1200], // Latência variável conforme desafio
  errorRate: 0.15,           // 15% de falha simulada
  // Aplicado em operações de booking/cancellation
};
```

## 🔄 Retry Logic

### Exponential Backoff Strategy
```typescript
class RetryManager {
  private readonly DEFAULT_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000,      // 1s initial delay
    maxDelay: 8000,       // 8s maximum delay
    exponentialBase: 2,   // Exponential multiplier
    jitter: true          // Add randomization to prevent thundering herd
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = this.DEFAULT_CONFIG
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Não fazer retry em erros não recuperáveis
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        // Última tentativa - lançar erro
        if (attempt > config.maxRetries) {
          throw new MaxRetriesExceededError(lastError, attempt - 1);
        }

        // Calcular delay com backoff exponencial
        const delay = this.calculateDelay(attempt, config);
        await this.delay(delay);

        // Log attempt para debugging
        console.warn(`Retry attempt ${attempt} for operation after ${delay}ms delay`, error);
      }
    }

    throw lastError;
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay = config.baseDelay * Math.pow(config.exponentialBase, attempt - 1);
    
    // Cap no delay máximo
    delay = Math.min(delay, config.maxDelay);
    
    // Adicionar jitter para evitar thundering herd
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5); // ±50% randomization
    }
    
    return delay;
  }
}
```

### Error Classification
```typescript
// Categoriza erros para determinar estratégia de retry
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',         // Retry ✅
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',         // Retry ✅
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',   // Retry com delay maior ✅
  VALIDATION_ERROR = 'VALIDATION_ERROR',   // Não retry ❌
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR', // Não retry ❌
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',     // Não retry ❌
  SERVER_ERROR = 'SERVER_ERROR'            // Retry ✅
}

const isRetryableError = (error: Error): boolean => {
  const retryableErrors = [
    ErrorType.NETWORK_ERROR,
    ErrorType.TIMEOUT_ERROR,
    ErrorType.RATE_LIMIT_ERROR,
    ErrorType.SERVER_ERROR
  ];
  
  return retryableErrors.includes(error.type);
};
```

## 🎨 UI Feedback System

### Loading States Progression
```typescript
// Loading states que evoluem com o tempo
const LoadingStateManager = {
  stages: [
    { duration: 0, message: 'Searching flights...', skeleton: 'minimal' },
    { duration: 2000, message: 'Checking availability...', skeleton: 'partial' },  
    { duration: 4000, message: 'Comparing prices...', skeleton: 'detailed' },
    { duration: 8000, message: 'This is taking longer than usual...', skeleton: 'detailed', warning: true }
  ],

  getStateForDuration(elapsed: number) {
    // Encontra o stage apropriado baseado no tempo decorrido
    const stage = this.stages
      .reverse()
      .find(s => elapsed >= s.duration) || this.stages[0];
    
    return {
      ...stage,
      elapsed,
      showRetry: elapsed > 8000 // Mostra botão retry após 8s
    };
  }
};

// Hook para gerenciar loading progressivo
const useProgressiveLoading = (isLoading: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    if (!isLoading) {
      setElapsed(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  return LoadingStateManager.getStateForDuration(elapsed);
};
```

### Skeleton Components
```typescript
// Skeletons adaptativos baseados no contexto
const FlightsSkeleton: FC<{ stage: 'minimal' | 'partial' | 'detailed' }> = ({ stage }) => {
  const skeletonCount = {
    minimal: 3,    // Poucos placeholders
    partial: 6,    // Quantidade média
    detailed: 9    // Muitos placeholders para mostrar que está trabalhando
  }[stage];

  const showDetails = stage !== 'minimal';

  return (
    <div className="flights-skeleton">
      {Array.from({ length: skeletonCount }, (_, i) => (
        <div key={i} className="flight-card-skeleton" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="skeleton-line title" />
          <div className="skeleton-line subtitle" />
          
          {showDetails && (
            <>
              <div className="skeleton-line content" />
              <div className="skeleton-line content short" />
            </>
          )}
          
          <div className="skeleton-button" />
        </div>
      ))}
    </div>
  );
};
```

### 🔄 Próximo Passo - Error Toast System

**⚠️ REMOVIDO**: Sistema de toast foi removido (ver TOAST_REMOVAL_SUMMARY.md)

**Planejado para reimplementação**:
```typescript
// TODO: Sistema simples de toast para error feedback
// - Notificações de erro/sucesso
// - Retry action buttons
// - Auto-dismiss configurável
// - Integração com resilience.ts
```
```

## � Próximos Passos - Circuit Breaker Pattern

### Planejado (Não Implementado)
```typescript
// TODO: Implementar Circuit Breaker para fault tolerance
// - Prevenir cascading failures
// - Estado OPEN/CLOSED/HALF_OPEN
// - Threshold configurável
// - Reset automático após timeout
```
```

## � Próximos Passos - Error Monitoring

### Planejado (Não Implementado)
```typescript
// TODO: Sistema de analytics de erro
// - Tracking de error rates
// - Métricas de retry success
// - Dashboard de monitoramento
// - Alertas automáticos
// - Integração com Sentry/DataDog
```
```

## 🔄 Graceful Degradation

### Fallback Strategies
```typescript
// Estratégias de degradação quando APIs falham
class ServiceDegradation {
  
  // Fallback: usar cache quando API falha
  async getFlightsWithFallback(params: FlightSearchParams): Promise<FlightResult> {
    try {
      return await this.api.searchFlights(params);
    } catch (error) {
      console.warn('Flight API failed, using cache fallback:', error);
      
      const cachedResults = await this.cache.get(params);
      if (cachedResults) {
        return {
          ...cachedResults,
          fromCache: true,
          warning: 'Showing cached results due to service issues'
        };
      }

      // Se cache também falha, mostrar resultados simulados
      return this.generateFallbackFlights(params);
    }
  }

  // Fallback: mostrar UI parcial quando dados incompletos
  handlePartialData<T>(data: Partial<T>, requiredFields: (keyof T)[]): T | PartialResult<T> {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length === 0) {
      return data as T;
    }

    // Retornar dados parciais com metadata sobre o que está faltando
    return {
      data: data as Partial<T>,
      missing: missingFields,
      type: 'partial',
      canProceed: missingFields.length < requiredFields.length / 2 // Pode prosseguir se >50% dos dados estão OK
    };
  }
}
```

## 🎯 User Experience Patterns

### Progressive Enhancement
```typescript
// UX que melhora progressivamente conforme dados chegam
const useProgressiveDataLoading = <T>(fetcher: () => Promise<T>) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
    stage: 'initial' | 'partial' | 'complete';
  }>({
    data: null,
    loading: false,
    error: null,
    stage: 'initial'
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null, stage: 'initial' }));

    try {
      // Primeiro: mostrar loading skeleton
      setState(prev => ({ ...prev, stage: 'partial' }));

      // Executar fetch com retry automático
      const result = await retryManager.executeWithRetry(fetcher);
      
      setState({
        data: result,
        loading: false,
        error: null,
        stage: 'complete'
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error,
        stage: 'initial'
      }));

      // Mostrar toast error com retry
      toastManager.showAPIError(error, execute);
    }
  };

  return { ...state, execute, retry: execute };
};
```

### Contextual Help
```typescript
// Help contextual baseado no tipo de erro
const ErrorHelpProvider = {
  getHelpContent(error: Error, context: string): HelpContent {
    const helpMap = {
      NETWORK_ERROR: {
        title: 'Connection Issue',
        message: 'Check your internet connection and try again.',
        actions: [
          { label: 'Retry', action: 'retry' },
          { label: 'Check Status', action: 'open_status_page' }
        ]
      },
      VALIDATION_ERROR: {
        title: 'Invalid Input',
        message: 'Please check the highlighted fields and try again.',
        actions: [
          { label: 'Fix Fields', action: 'focus_first_error' }
        ]
      },
      TIMEOUT_ERROR: {
        title: 'Request Timeout',
        message: 'The server is taking longer than usual. This might be temporary.',
        actions: [
          { label: 'Try Again', action: 'retry' },
          { label: 'Simplify Search', action: 'suggest_simpler_params' }
        ]
      }
    };

    return helpMap[error.type] || {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      actions: [{ label: 'Retry', action: 'retry' }]
    };
  }
};
```

## 📈 Resilience Metrics

### Performance Monitoring
```typescript
// Métricas de resiliência do sistema
interface ResilienceMetrics {
  // Success rates
  overallSuccessRate: number;      // 85% target
  apiSuccessRate: number;          // 90% target  
  retrySuccessRate: number;        // 70% target

  // Performance
  averageLatency: number;          // <800ms target
  p95Latency: number;              // <1200ms target
  timeoutRate: number;             // <5% target

  // User experience
  userRetryRate: number;           // <20% target (usuários clicando retry)
  abandonnmentRate: number;        // <15% target
  errorRecoveryTime: number;       // <3s target
}

// Coletado automaticamente durante uso
const metricsCollector = {
  recordLatency: (operation: string, duration: number) => {},
  recordSuccess: (operation: string) => {},
  recordError: (operation: string, error: Error) => {},
  recordRetry: (operation: string, attempt: number) => {},
  recordUserAction: (action: string) => {}
};
```

---

**Próximo**: [Limitations & Roadmap](./limitations-roadmap.md) - O que ficou de fora do MVP e próximos passos planejados.