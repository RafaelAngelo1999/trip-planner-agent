interface PriceDisplayProps {
  price: number;
  currency: string;
  label?: string;
  className?: string;
}

/**
 * Componente compartilhado para exibir preços de forma consistente
 */
export function PriceDisplay({
  price,
  currency,
  label,
  className = "",
}: PriceDisplayProps) {
  const formattedPrice = price?.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  return (
    <div className={`text-right ${className}`}>
      <div className="text-sm font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
        R$ {formattedPrice}
      </div>
      {label && (
        <div className="text-xs text-slate-500 font-bold truncate">
          💰 {label}
        </div>
      )}
    </div>
  );
}
