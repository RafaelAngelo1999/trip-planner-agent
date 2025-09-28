import { useState } from "react";
import { X, Plane, ChevronDown } from "lucide-react";
import { FlightItinerary, ListFlightsParams } from "../../../../agent/types";
import { BookingModalButtons } from "./BookingModalButtons";

const formatTime = (time: string) => {
  return time.replace(/\+\d+$/, "");
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

interface BookingModalProps {
  selectedFlight: FlightItinerary;
  searchParams: ListFlightsParams;
  passengerData: { name: string; email: string };
  onPassengerDataChange: (data: { name: string; email: string }) => void;
  onConfirm: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

/**
 * Modal de confirmação de reserva de voo
 */
export function BookingModal({
  selectedFlight,
  searchParams,
  passengerData,
  onPassengerDataChange,
  onConfirm,
  onClose,
  t,
}: BookingModalProps) {
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Função de validação de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função de validação de nome
  const validateName = (name: string) => {
    return name.trim().length >= 2 && name.trim().split(" ").length >= 2;
  };

  const handleNameChange = (value: string) => {
    onPassengerDataChange({ ...passengerData, name: value });
    if (value && !validateName(value)) {
      setNameError(t("flight.list.enterFullNameError"));
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (value: string) => {
    onPassengerDataChange({ ...passengerData, email: value });
    if (value && !validateEmail(value)) {
      setEmailError("Digite um email válido");
    } else {
      setEmailError("");
    }
  };

  const isFormValid =
    passengerData.name &&
    passengerData.email &&
    validateName(passengerData.name) &&
    validateEmail(passengerData.email) &&
    nameError === "" &&
    emailError === "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t("flight.list.bookingConfirmation")}
                </h2>
                <p className="text-blue-100 text-sm mt-0.5 font-medium">
                  {t("flight.list.confirmBooking")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-xl backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Seção Principal do Voo */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-6 border border-blue-200/60">
            {/* Badge do voo */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md border border-blue-200/60">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {t("flight.list.selectedFlight")}
                </span>
              </div>
            </div>

            {/* Info principal do voo */}
            <div className="mb-4">
              <div
                className="text-base font-bold text-slate-800 mb-2 truncate"
                title={`✈️ ${selectedFlight.airline}`}
              >
                ✈️ {selectedFlight.airline}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {searchParams.origin} → {searchParams.destination}
              </div>

              {/* Preço centralizado customizado para o modal */}
              <div className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
                  R${" "}
                  {selectedFlight.totalPrice.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  💰 {t("flight.list.to")} {searchParams.adults}{" "}
                  {searchParams.adults === 1
                    ? t("flight.list.passenger")
                    : t("flight.list.passengers")}{" "}
                  ({selectedFlight.currency})
                </div>
              </div>
            </div>

            {/* Tags compactas centralizadas */}
            <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  selectedFlight.stops === 0
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-orange-100 text-orange-800 border border-orange-200"
                }`}
              >
                {selectedFlight.stops === 0
                  ? `🎯 ${t("flight.list.direct")}`
                  : `🔄 ${selectedFlight.stops} ${selectedFlight.stops === 1 ? t("flight.list.stop") : t("flight.list.stops")}`}
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  selectedFlight.baggageIncluded
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {selectedFlight.baggageIncluded
                  ? `🧳 ${t("flight.list.baggage")}`
                  : `⚠️ ${t("flight.list.noBaggage")}`}
              </div>
            </div>
          </div>

          {/* Accordion - Detalhes dos Voos (Compacto) */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setShowFlightDetails(!showFlightDetails)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-1.5">
                  <Plane className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    📋 {t("flight.list.itineraryDetails")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t("flight.list.viewSchedulesInfo")}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  showFlightDetails ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFlightDetails && (
              <div className="px-3 pb-3 space-y-3 border-t border-slate-200/60 bg-slate-50/30">
                {/* Voo de Ida - Versão Compacta */}
                <div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-3 py-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 rounded-full p-1">
                        <Plane className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          ✈️ Voo de Ida
                        </h4>
                        <p className="text-blue-100 text-xs">
                          {searchParams.origin} → {searchParams.destination}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedFlight.outbound.map((segment, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-3 border border-slate-200/60"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded-full p-1">
                              <Plane className="h-3 w-3 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">
                                {segment.carrier} {segment.flightNumber}
                              </div>
                              <div className="text-xs text-slate-600">
                                {formatTime(segment.depTime)} -{" "}
                                {formatTime(segment.arrTime)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-600 font-bold">
                              {formatDuration(segment.durationMin)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {segment.from} → {segment.to}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voo de Volta - Versão Compacta */}
                {selectedFlight.inbound &&
                  selectedFlight.inbound.length > 0 && (
                    <div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl px-3 py-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 rounded-full p-1">
                            <Plane className="h-3 w-3 text-white rotate-180" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">
                              🔄 {t("flight.list.returnFlight")}
                            </h4>
                            <p className="text-purple-100 text-xs">
                              {searchParams.destination} → {searchParams.origin}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {selectedFlight.inbound.map((segment, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-3 border border-slate-200/60"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="bg-purple-100 rounded-full p-1">
                                  <Plane className="h-3 w-3 text-purple-600 rotate-180" />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-slate-800">
                                    {segment.carrier} {segment.flightNumber}
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    {formatTime(segment.depTime)} -{" "}
                                    {formatTime(segment.arrTime)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-purple-600 font-bold">
                                  {formatDuration(segment.durationMin)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {segment.from} → {segment.to}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Formulário de Dados do Passageiro */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm">
              👤 {t("flight.list.passengerData")}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  {t("flight.list.fullNameRequired")}
                </label>
                <input
                  type="text"
                  value={passengerData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                    nameError
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  }`}
                  placeholder="Ex: João Silva Santos"
                  required
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  value={passengerData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                    emailError
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  }`}
                  placeholder="Ex: joao.silva@email.com"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {emailError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nota Importante */}
          <div className="bg-blue-50/30 border border-blue-200/50 rounded-xl p-3">
            <p className="text-xs text-blue-700 text-center">
              📝 {t("flight.list.importantNote")}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2">
            <BookingModalButtons
              onCancel={onClose}
              onConfirm={onConfirm}
              isDisabled={!isFormValid}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
