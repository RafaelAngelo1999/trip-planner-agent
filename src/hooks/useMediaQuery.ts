import { useState, useEffect } from "react";

/**
 * Hook personalizado para consultas de mídia
 * @param query - String da consulta de mídia (ex: "(min-width: 768px)")
 * @returns boolean - true se a consulta corresponder
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Definir o valor inicial
    setMatches(mediaQuery.matches);

    // Criar função de callback para mudanças
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar listener
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
