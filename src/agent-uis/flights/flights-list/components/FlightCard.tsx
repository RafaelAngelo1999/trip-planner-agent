import { Plane } from "lucide-react";
import { FlightItinerary, ListFlightsParams } from "../../../../agent/types";
import { PriceDisplay } from "../../../../components/shared";
import { FlightBadge } from "./FlightBadge";
import { FlightSegmentCard } from "./FlightSegmentCard";

interface FlightCardProps {
  flight: FlightItinerary;
  searchParams: ListFlightsParams;
  onBookFlight: (flight: FlightItinerary) => void;
  t: (key: string) => string;
}

/**
 * Card individual de cada voo no carrossel
 */
export function FlightCard({
  flight,
  searchParams,
  onBookFlight,
  t,
}: FlightCardProps) {
  return (
    <div className="border rounded-lg p-2 bg-white hover:shadow-md transition-shadow min-w-[320px] h-full">
      {/* Header do Card */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-3 mb-3 border border-slate-200/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-1.5 shadow-lg flex-shrink-0">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-bold text-slate-800 truncate"
                title={`✈️ ${flight.airline}`}
              >
                ✈️ {flight.airline}
              </h3>
              <p className="text-slate-500 text-xs font-medium truncate">
                {t("flight.list.airlineCompany")}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <PriceDisplay
              price={flight.totalPrice}
              currency={flight.currency}
              label={t("flight.list.totalValue")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Voo de Ida */}
        <div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-3 py-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1">
                <Plane className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  ✈️ {t("flight.list.outbound")}
                </h4>
                <p className="text-blue-100 text-xs font-medium">
                  {t("flight.list.departure")} {t("flight.list.to")}{" "}
                  {searchParams.destination}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {flight.outbound.map((segment, index) => (
              <FlightSegmentCard
                key={index}
                segment={segment}
                isReturn={false}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Voo de Volta */}
        {flight.inbound && flight.inbound.length > 0 && (
          <div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg px-3 py-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1">
                  <Plane className="h-3 w-3 text-white rotate-180" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    🔄 {t("flight.list.returnFlight")}
                  </h4>
                  <p className="text-purple-100 text-xs font-medium">
                    {t("flight.list.return")} {t("flight.list.to")}{" "}
                    {searchParams.origin}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {flight.inbound.map((segment, index) => (
                <FlightSegmentCard
                  key={index}
                  segment={segment}
                  isReturn={true}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Badges e Botão */}
      <div className="flex items-center gap-1.5 mt-3 mb-3">
        <FlightBadge
          type={flight.stops === 0 ? "direct" : "connections"}
          text={
            flight.stops === 0
              ? t("flight.list.directFlightLabel")
              : `${flight.stops} ${t("flight.list.connections")}${flight.stops > 1 ? t("flight.list.connectionsPlural") : ""}`
          }
        />
        <FlightBadge
          type={
            flight.baggageIncluded ? "baggage-included" : "baggage-not-included"
          }
          text={
            flight.baggageIncluded
              ? t("flight.list.baggageIncluded")
              : t("flight.list.baggageNotIncluded")
          }
        />
      </div>

      <button
        onClick={() => onBookFlight(flight)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0"
      >
        🎫 {t("flight.list.bookFlight")}
      </button>
    </div>
  );
}
