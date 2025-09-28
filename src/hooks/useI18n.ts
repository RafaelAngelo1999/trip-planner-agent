// hooks/useI18n.ts
// Sistema i18n simplificado que usa contexto do LangGraph SDK
import { t, type Locale } from "../i18n";

// Extrai language do contexto de qualquer objeto/estado
export function extractLanguageFromContext(context: any): string | null {
  // Tenta várias possibilidades onde o language pode estar
  return (
    context?.input?.context?.language ||
    context?.context?.language ||
    context?.language ||
    null
  );
}

/**
 * Hook simplificado para i18n usando contexto do LangGraph SDK
 * @param language - Idioma extraído do contexto ("pt-BR" | "en-US")
 * @returns Objeto com função de tradução
 */
export function useI18n(language?: string | null) {
  // Define idioma padrão baseado no que foi extraído do contexto
  const locale: Locale = (language as Locale) || "en-US";

  // Função de tradução que usa o locale correto
  const translate = (key: string) => t(key, locale);

  return {
    t: translate,
    locale,
  };
}

// Alias para compatibilidade
export const useTranslation = useI18n;
