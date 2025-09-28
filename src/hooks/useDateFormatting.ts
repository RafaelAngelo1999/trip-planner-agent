import { format } from "date-fns";
import { useMemo } from "react";

/**
 * Hook para formatação de datas
 */
export function useDateFormatting() {
  return useMemo(
    () => ({
      formatDate: (date: string | Date, pattern: string = "MMM dd, yyyy") => {
        try {
          const dateObj = typeof date === "string" ? new Date(date) : date;
          return format(dateObj, pattern);
        } catch (error) {
          console.error("Erro ao formatar data:", error);
          return date.toString();
        }
      },

      formatDateTime: (date: string | Date) => {
        try {
          const dateObj = typeof date === "string" ? new Date(date) : date;
          return format(dateObj, "MMM dd, yyyy 'at' HH:mm");
        } catch (error) {
          console.error("Erro ao formatar data e hora:", error);
          return date.toString();
        }
      },
    }),
    [],
  );
}
