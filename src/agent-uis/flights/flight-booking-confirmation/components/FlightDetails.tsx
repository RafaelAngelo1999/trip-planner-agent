import { Plane } from "lucide-react";
import { FlightData } from "../../../../hooks/useFlightLookup";

interface FlightDetailsProps {
  flightDetails: FlightData;
}

/**
 * Componente específico para exibir detalhes do voo no flight-booking-confirmation
 * Este componente permanece na pasta do feature pois é específico para confirmação de reserva
 */
export function FlightDetails({ flightDetails }: FlightDetailsProps) {
  // Verificação de segurança para prevenir erros de null/undefined
  if (
    !flightDetails ||
    !flightDetails.outbound ||
    flightDetails.outbound.length === 0
  ) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-gray-500 text-center">
          <Plane className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Detalhes do voo não disponíveis</p>
        </div>
      </div>
    );
  }

  const firstOutbound = flightDetails.outbound[0];
  const airline = flightDetails.airline || "Companhia Aérea";
  const from = firstOutbound?.from || "Origem";
  const to = firstOutbound?.to || "Destino";
  const flightNumber = firstOutbound?.flightNumber || "N/A";
  const depTime = firstOutbound?.depTime || "--:--";
  const arrTime = firstOutbound?.arrTime || "--:--";
  const totalPrice = flightDetails.totalPrice || 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-200/60">
      <h3
        className="font-bold text-blue-800 mb-3 flex items-center gap-2 text-sm truncate"
        title={`${airline} • ${from} → ${to}`}
      >
        <Plane className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {airline} • {from} → {to}
        </span>
      </h3>

      <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              {flightNumber}
            </div>
            <div className="text-xs text-gray-600">
              {depTime} - {arrTime}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-blue-600">
              R${" "}
              {totalPrice?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
