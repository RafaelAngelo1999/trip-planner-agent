import { X, Plane, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { ListFlightsParams } from "../../../../agent/types";

interface FlightHeaderProps {
  searchParams: ListFlightsParams;
  flightsCount: number;
  onClose: () => void;
  t: (key: string) => string;
}

/**
 * Header premium do componente FlightsList
 */
export function FlightHeader({
  searchParams,
  flightsCount,
  onClose,
  t,
}: FlightHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {searchParams.origin} → {searchParams.destination}
            </h1>
            <p className="text-blue-100 text-xs mt-1 font-medium">
              {flightsCount}{" "}
              {flightsCount === 1
                ? t("flight.list.flightFound")
                : t("flight.list.flightsFound")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-2xl backdrop-blur-sm"
        >
          <X className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}

interface FlightInfoBadgesProps {
  searchParams: ListFlightsParams;
  t: (key: string) => string;
}

/**
 * Badges informativos sobre a pesquisa de voos
 */
export function FlightInfoBadges({ searchParams, t }: FlightInfoBadgesProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-blue-300/50">
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          👥 {searchParams.adults}{" "}
          {searchParams.adults === 1
            ? t("flight.list.passenger")
            : t("flight.list.passengers")}
        </span>
      </div>
      <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-emerald-300/50">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          📅 {format(new Date(searchParams.departDate), "dd/MM/yyyy")}
          {searchParams.returnDate &&
            ` - ${format(new Date(searchParams.returnDate), "dd/MM/yyyy")}`}
        </span>
      </div>
    </div>
  );
}
