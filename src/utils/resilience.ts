/**
 * Middleware de Simulação de Resiliência
 *
 * Simula condições reais de produção:
 * - Latência variável (300-1200ms)
 * - Taxa de erro ~15% em operações críticas
 * - Retry automático com exponential backoff
 */

export interface ResilienceConfig {
  latencyRange: [number, number];
  errorRate: number;
  enabledEndpoints: string[];
  retryAttempts: number;
  baseRetryDelay: number;
}

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
}

/**
 * Configuração padrão para o desafio técnico
 */
export const DEFAULT_RESILIENCE_CONFIG: ResilienceConfig = {
  latencyRange: [300, 1200],
  errorRate: 0.15, // 15% de falha
  enabledEndpoints: ["/book", "/cancel", "booking", "cancellation"],
  retryAttempts: 3,
  baseRetryDelay: 1000,
};

/**
 * Simula latência de rede variável
 */
export const simulateLatency = async (
  config: ResilienceConfig,
): Promise<void> => {
  const [min, max] = config.latencyRange;
  const latency = Math.random() * (max - min) + min;

  console.log(`🕐 Simulando latência: ${Math.round(latency)}ms`);

  return new Promise((resolve) => setTimeout(resolve, latency));
};

/**
 * Simula falhas de rede/API aleatórias
 */
export const simulateRandomFailure = (config: ResilienceConfig): void => {
  if (Math.random() < config.errorRate) {
    const errorMessages = [
      "Network timeout occurred",
      "Service temporarily unavailable",
      "Internal server error",
      "Rate limit exceeded",
      "Database connection failed",
    ];

    const randomError =
      errorMessages[Math.floor(Math.random() * errorMessages.length)];
    console.error(`❌ Simulando falha: ${randomError}`);

    throw new Error(`Simulated API Error: ${randomError}`);
  }
};

/**
 * Middleware de resiliência para operações críticas
 */
export const withResilience = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  config: ResilienceConfig = DEFAULT_RESILIENCE_CONFIG,
): Promise<T> => {
  const isEnabledOperation = config.enabledEndpoints.some((endpoint) =>
    operationName.toLowerCase().includes(endpoint.toLowerCase()),
  );

  if (!isEnabledOperation) {
    return operation();
  }

  console.log(`🛡️ Aplicando resiliência para: ${operationName}`);

  // Simular latência
  await simulateLatency(config);

  // Simular falha (se aplicável)
  simulateRandomFailure(config);

  // Executar operação
  return operation();
};

/**
 * Sistema de retry com exponential backoff
 */
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
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      console.log(`🔄 Tentativa ${attempt}/${maxAttempts}`);

      const result = await fn();

      if (attempt > 1) {
        console.log(`✅ Sucesso na tentativa ${attempt}`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`❌ Tentativa ${attempt} falhou:`, lastError.message);

      if (attempt === maxAttempts) {
        console.error(`💥 Todas as ${maxAttempts} tentativas falharam`);
        throw lastError;
      }

      // Calcular delay com exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(exponentialBase, attempt - 1),
        maxDelay,
      );

      console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      attempt++;
    }
  }

  throw lastError!;
};

/**
 * Combina resiliência + retry para operações críticas
 */
export const withResilienceAndRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  retryOptions?: RetryOptions,
  resilienceConfig?: ResilienceConfig,
): Promise<T> => {
  return withRetry(
    () => withResilience(operation, operationName, resilienceConfig),
    retryOptions,
  );
};

/**
 * Hook para aplicar resiliência em componentes React
 */
export const useResilience = (config?: Partial<ResilienceConfig>) => {
  const finalConfig = { ...DEFAULT_RESILIENCE_CONFIG, ...config };

  const executeWithResilience = async <T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<T> => {
    return withResilienceAndRetry(
      operation,
      operationName,
      {
        maxAttempts: finalConfig.retryAttempts,
        baseDelay: finalConfig.baseRetryDelay,
      },
      finalConfig,
    );
  };

  return { executeWithResilience, config: finalConfig };
};
