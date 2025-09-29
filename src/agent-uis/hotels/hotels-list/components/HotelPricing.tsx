interface HotelPricingProps {
  nightly: number;
  total: number;
  currency: string;
  nights: number;
  t: (key: string) => string;
}

/**
 * Componente para exibir preços do hotel
 */
export function HotelPricing({
  nightly,
  total,
  currency,
  nights,
  t,
}: HotelPricingProps) {
  // Função para formatar preço baseado na moeda
  const formatPrice = (price: number, currency: string) => {
    if (currency === "BRL") {
      return price?.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {t("hotels.list.pricePerNight")}
        </span>
        <span className="text-lg font-semibold">
          {currency === "BRL" ? "R$ " : currency + " "}
          {formatPrice(nightly, currency)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {t("hotels.list.totalPrice")} ({nights}{" "}
          {nights === 1 ? t("hotels.list.night") : t("hotels.list.nights")})
        </span>
        <span className="text-xl font-bold text-blue-600">
          {currency === "BRL" ? "R$ " : currency + " "}
          {formatPrice(total, currency)}
        </span>
      </div>
    </div>
  );
}
