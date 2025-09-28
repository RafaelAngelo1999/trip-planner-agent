import { Plane } from "lucide-react";

interface EmptyFlightsProps {
  t: (key: string) => string;
}

/**
 * Estado vazio quando não há voos encontrados
 */
export function EmptyFlights({ t }: EmptyFlightsProps) {
  return (
    <div className="text-center py-8">
      <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">{t("flight.list.noFlightsFound")}</p>
    </div>
  );
}
