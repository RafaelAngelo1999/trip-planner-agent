import { useState } from "react";
import { Plane, ChevronDown } from "lucide-react";

const formatTime = (time: string) => {
  return time.replace(/\+\d+$/, "");
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

interface FlightSegmentCardProps {
  segment: any;
  isReturn?: boolean;
  t: (key: string) => string;
}

/**
 * Componente específico para exibir segmentos de voo com detalhes expansíveis
 */
export function FlightSegmentCard({
  segment,
  isReturn = false,
  t,
}: FlightSegmentCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-slate-200/60 hover:border-blue-300/60 hover:shadow-md transition-all duration-300">
      {/* Informações principais sempre visíveis */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`bg-gradient-to-r ${isReturn ? "from-purple-400 to-purple-600" : "from-blue-400 to-blue-600"} rounded-full p-2 shadow-md`}
            >
              <Plane
                className={`h-4 w-4 text-white ${isReturn ? "rotate-180" : ""}`}
              />
            </div>
            <div>
              <div className="font-bold text-base text-slate-800">
                {segment.carrier} {segment.flightNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${isReturn ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {isReturn
                    ? `🔄 ${t("flight.list.return")}`
                    : `✈️ ${t("flight.list.outbound")}`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-base font-bold ${isReturn ? "text-purple-600" : "text-blue-600"}`}
            >
              {formatDuration(segment.durationMin)}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
              {t("flight.list.duration")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-slate-800">
              {formatTime(segment.depTime)}
            </div>
            <div className="text-sm font-semibold text-slate-600 mt-1">
              {segment.from}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              {t("flight.list.departure")}
            </div>
          </div>

          <div className="flex-1 mx-6 relative">
            <div className="h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-slate-300 rounded-full relative">
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {t("flight.list.directFlight")}
              </div>
            </div>
          </div>

          <div className="text-center flex-1">
            <div className="text-lg font-bold text-slate-800">
              {formatTime(segment.arrTime)}
            </div>
            <div className="text-sm font-semibold text-slate-600 mt-1">
              {segment.to}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              {t("flight.list.arrival")}
            </div>
          </div>
        </div>
      </div>

      {/* Botão para expandir detalhes */}
      <div className="border-t border-slate-200/60">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50/50 transition-colors duration-200"
        >
          <span className="text-sm font-semibold text-slate-600">
            {showDetails
              ? t("flight.list.hideDetails")
              : t("flight.list.showDetails")}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              showDetails ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Detalhes completos no accordion */}
      {showDetails && (
        <div className="px-5 pb-5 border-t border-slate-200/60 bg-slate-50/30">
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Informações de Voo */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  ✈️ {t("flight.list.flightInfo")}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {t("flight.list.airline")}:
                    </span>
                    <span
                      className="text-xs font-semibold text-slate-700 truncate max-w-[120px]"
                      title={segment.carrier}
                    >
                      {segment.carrier}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {t("flight.list.flightNumber")}:
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {segment.flightNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {t("flight.list.totalDuration")}:
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatDuration(segment.durationMin)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações de Aeroportos */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  🏢 {t("flight.list.airports")}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {t("flight.list.origin")}:
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {segment.from}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {t("flight.list.destination")}:
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {segment.to}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Horários Detalhados */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                🕒 {t("flight.list.detailedSchedule")}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-3 border border-slate-200/60">
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-800">
                      {formatTime(segment.depTime)}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 mt-1">
                      {t("flight.list.departure")} - {segment.from}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t("flight.list.localTime")}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-200/60">
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-800">
                      {formatTime(segment.arrTime)}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 mt-1">
                      {t("flight.list.arrival")} - {segment.to}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t("flight.list.localTime")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200/60">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                ℹ️ {t("flight.list.additionalInfo")}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    {t("flight.list.flightType")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isReturn
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isReturn
                      ? `🔄 ${t("flight.list.return")}`
                      : `✈️ ${t("flight.list.outbound")}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    {t("common.status")}:
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    🟢 {t("common.available")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
