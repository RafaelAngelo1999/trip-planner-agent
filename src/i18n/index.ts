// Ponto de entrada principal do sistema i18n
// Sistema simplificado que usa contexto do LangGraph SDK

// Exportar apenas o necessário
export type { Locale, TranslationKeys } from "./core";
export { t } from "./core";

// Traduções (caso sejam necessárias diretamente)
export { ptBR } from "./translations/pt-BR";
export { enUS } from "./translations/en-US";

// Funções utilitárias para formatação
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
} from "./utils/formatters";
