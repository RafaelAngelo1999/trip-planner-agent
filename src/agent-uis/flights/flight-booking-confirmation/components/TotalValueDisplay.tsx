interface TotalValueDisplayProps {
  total: number;
  t: (key: string) => string;
}

/**
 * Exibição do valor total da reserva
 */
export function TotalValueDisplay({ total, t }: TotalValueDisplayProps) {
  return (
    <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
      <div className="text-xs text-blue-700 mb-1">
        {t("flight.booking.totalValue")}
      </div>
      <div className="text-lg font-bold text-blue-800">
        R${" "}
        {total.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
