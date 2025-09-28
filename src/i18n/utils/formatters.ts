/**
 * Utilitários de Formatação para I18n
 *
 * Funções para formatar moeda, data, números etc. de acordo com o locale
 */

import type { Locale } from "../core";

/**
 * Formatar moeda baseada no locale
 */
export const formatCurrency = (
  amount: number,
  currency: string,
  locale: Locale = "en-US",
): string => {
  // Mapear locale para formato Intl
  const intlLocale = locale === "pt-BR" ? "pt-BR" : "en-US";

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback se currency não for suportada
    console.warn(`Currency ${currency} not supported, using USD`);
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }
};

/**
 * Formatar data baseada no locale
 */
export const formatDate = (
  date: string | Date,
  locale: Locale = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string => {
  const intlLocale = locale === "pt-BR" ? "pt-BR" : "en-US";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const finalOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(intlLocale, finalOptions).format(
    new Date(date),
  );
};

/**
 * Formatar data e hora baseada no locale
 */
export const formatDateTime = (
  date: string | Date,
  locale: Locale = "en-US",
): string => {
  return formatDate(date, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatar números baseado no locale
 */
export const formatNumber = (
  number: number,
  locale: Locale = "en-US",
  options?: Intl.NumberFormatOptions,
): string => {
  const intlLocale = locale === "pt-BR" ? "pt-BR" : "en-US";

  return new Intl.NumberFormat(intlLocale, options).format(number);
};

/**
 * Formatar duração em minutos para texto legível
 */
export const formatDuration = (
  minutes: number,
  locale: Locale = "en-US",
): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (locale === "pt-BR") {
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  } else {
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }
};

/**
 * Formatar lista de itens com conectores apropriados
 */
export const formatList = (
  items: string[],
  locale: Locale = "en-US",
): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) {
    const connector = locale === "pt-BR" ? " e " : " and ";
    return items.join(connector);
  }

  const connector = locale === "pt-BR" ? " e " : ", and ";
  const last = items.pop()!;
  return items.join(", ") + connector + last;
};

/**
 * Formatar distância baseada no locale
 */
export const formatDistance = (
  distance: number,
  unit: "km" | "mi" = "km",
  locale: Locale = "en-US",
): string => {
  const formattedDistance = formatNumber(distance, locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return `${formattedDistance} ${unit}`;
};

/**
 * Formatar porcentagem
 */
export const formatPercentage = (
  value: number,
  locale: Locale = "en-US",
): string => {
  const intlLocale = locale === "pt-BR" ? "pt-BR" : "en-US";

  return new Intl.NumberFormat(intlLocale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
