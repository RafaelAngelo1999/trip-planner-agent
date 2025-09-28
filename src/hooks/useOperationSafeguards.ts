/**
 * Utilitários para prevenir excesso de operações
 */

import { useRef, useCallback } from "react";

/**
 * Hook de debounce para prevenir múltiplas execuções
 */
export const useDebounce = (delay: number = 500) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (fn: (...args: any[]) => any, ...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debounce, cancel };
};

/**
 * Hook para throttle de operações (máximo uma por período)
 */
export const useThrottle = (delay: number = 1000) => {
  const lastExecuted = useRef<number>(0);

  const throttle = useCallback(
    (fn: (...args: any[]) => any, ...args: any[]) => {
      const now = Date.now();

      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        return fn(...args);
      }

      console.warn("Operação throttled, aguarde antes de tentar novamente");
      return null;
    },
    [delay],
  );

  return { throttle };
};

/**
 * Hook para controle de operações em batch
 * Evita múltiplas execuções da mesma operação
 */
export const useOperationControl = () => {
  const activeOperations = useRef<Set<string>>(new Set());

  const startOperation = useCallback((operationId: string) => {
    if (activeOperations.current.has(operationId)) {
      console.warn(`Operação ${operationId} já está em andamento`);
      return false;
    }

    activeOperations.current.add(operationId);
    return true;
  }, []);

  const endOperation = useCallback((operationId: string) => {
    activeOperations.current.delete(operationId);
  }, []);

  const isOperationActive = useCallback((operationId: string) => {
    return activeOperations.current.has(operationId);
  }, []);

  return {
    startOperation,
    endOperation,
    isOperationActive,
    getActiveOperations: () => Array.from(activeOperations.current),
  };
};

/**
 * Hook combinado para controle completo de operações
 */
export const useOperationSafeguards = (options?: {
  debounceDelay?: number;
  throttleDelay?: number;
}) => {
  const { debounceDelay = 500, throttleDelay = 1000 } = options || {};

  const { debounce, cancel: cancelDebounce } = useDebounce(debounceDelay);
  const { throttle } = useThrottle(throttleDelay);
  const operationControl = useOperationControl();

  const safeExecute = useCallback(
    (operationId: string, fn: (...args: any[]) => any, ...args: any[]) => {
      // Verificar se operação já está ativa
      if (operationControl.isOperationActive(operationId)) {
        console.warn(`Operação ${operationId} bloqueada - já em andamento`);
        return null;
      }

      // Marcar operação como ativa
      if (!operationControl.startOperation(operationId)) {
        return null;
      }

      // Executar com throttle
      const result = throttle(() => {
        try {
          return fn(...args);
        } finally {
          // Garantir que operação seja marcada como finalizada
          setTimeout(() => {
            operationControl.endOperation(operationId);
          }, 100);
        }
      });

      // Se throttle bloqueou, liberar operação
      if (result === null) {
        operationControl.endOperation(operationId);
      }

      return result;
    },
    [throttle, operationControl],
  );

  return {
    debounce,
    throttle,
    safeExecute,
    cancelDebounce,
    ...operationControl,
  };
};
