import { useState } from "react";

/**
 * Hook para gerenciar a funcionalidade de copiar texto para clipboard
 * @param resetDelay - Tempo em ms para resetar o estado de "copiado" (padrão: 2000ms)
 */
export function useClipboard(resetDelay: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (err) {
      console.error("Erro ao copiar texto:", err);
      return false;
    }
  };

  return { copied, copyToClipboard };
}
