/**
 * Tipos para integração com a API real do Trip Planner Backend
 * Base: https://trip-planner-backend-three.vercel.app
 */

// ===== FLIGHT API TYPES =====

export interface ApiFlight {
  id: string;
  flight_number: string; // snake_case na API real
  airline: string;
  origin: string;
  destination: string;
  departure_time: string; // snake_case e ISO 8601
  arrival_time: string; // snake_case e ISO 8601
  price: number;
  currency: string;
  duration: string;
  available_seats: number; // snake_case na API real
  total_seats: number;
  aircraft: string;
  stops: number;
  stop_cities?: string[];
  baggage_included: boolean;
  meal_included: boolean;
  refundable: boolean;
  booking_class: string;
  status?:
    | "SCHEDULED"
    | "DELAYED"
    | "CANCELLED"
    | "BOARDING"
    | "DEPARTED"
    | "ARRIVED";
}

export interface ApiFlightsResponse {
  success: boolean;
  data: {
    flights: ApiFlight[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
}

export interface ApiFlightResponse {
  flight: ApiFlight;
}

// ===== BOOKING API TYPES =====

export interface ApiBookingPassenger {
  name: string;
  email: string;
  phone: string;
  document: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface ApiBookingPreferences {
  seatType?: "window" | "aisle" | "middle";
  meal?: "regular" | "vegetarian" | "vegan" | "halal";
  baggage?: "carry-on" | "checked" | "extra";
}

export interface ApiEmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface ApiBookingRequest {
  passenger: ApiBookingPassenger;
  preferences?: ApiBookingPreferences;
  emergencyContact?: ApiEmergencyContact;
}

export interface ApiBooking {
  id: string;
  bookingReference: string;
  status: "CONFIRMED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
  flightId: string;
  passenger: ApiBookingPassenger;
  flight: {
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  };
  preferences?: ApiBookingPreferences;
  totalPrice: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refund?: {
    amount: number;
    currency: string;
    method: string;
    processingTime: string;
    fees: number;
  };
  policies?: {
    cancellation: string;
    changes: string;
  };
}

export interface ApiBookingResponse {
  booking: ApiBooking;
  message: string;
}

export interface ApiBookingDetailResponse {
  booking: ApiBooking;
}

// ===== CANCELLATION API TYPES =====

export interface ApiCancellationRequest {
  reason?: string;
  refundMethod?: "original_payment" | "credit" | "voucher";
}

export interface ApiCancellationResponse {
  booking: ApiBooking;
  message: string;
}

// ===== SEARCH PARAMETERS =====

export interface ApiFlightSearchParams {
  origin?: string;
  destination?: string;
  departureDate?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}

// ===== CONVERSION HELPERS =====

/**
 * Converte ApiFlight para FlightItinerary (formato legado)
 */
export function convertApiFlightToItinerary(
  apiFlight: ApiFlight,
): import("../agent/types").FlightItinerary {
  return {
    itineraryId: apiFlight?.id,
    airline: apiFlight?.airline,
    outbound: [
      {
        carrier: apiFlight?.airline.substring(0, 2).toUpperCase(),
        flightNumber: apiFlight?.flight_number,
        from: apiFlight?.origin,
        to: apiFlight?.destination,
        depTime: new Date(apiFlight?.departure_time).toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
        arrTime: new Date(apiFlight?.arrival_time).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        durationMin: parseDurationToMinutes(apiFlight?.duration),
      },
    ],
    inbound: [], // Assumindo voos só de ida por enquanto
    stops: apiFlight.stops,
    baggageIncluded: apiFlight.baggage_included,
    totalPrice: apiFlight.price,
    currency: apiFlight.currency,
  };
}

/**
 * Converte ApiBooking para BookFlightResponse (formato legado)
 */
export function convertApiBookingToResponse(
  apiBooking: ApiBooking | any,
): import("../agent/types").BookFlightResponse {
  console.log(
    "🔧 ConvertApiBookingToResponse input:",
    JSON.stringify(apiBooking, null, 2),
  );

  if (!apiBooking) {
    throw new Error("Resposta de booking inválida: dados não encontrados");
  }

  // Tenta diferentes campos possíveis para o booking reference
  const bookingRef =
    apiBooking.bookingReference ||
    apiBooking.booking_reference ||
    apiBooking.reference ||
    apiBooking.confirmation_code ||
    apiBooking.pnr ||
    apiBooking.id;

  console.log("🎫 Booking reference encontrado:", bookingRef);
  console.log("🔍 Campos disponíveis:", Object.keys(apiBooking));

  if (!bookingRef) {
    throw new Error(
      `Resposta de booking inválida: nenhum campo de referência encontrado. Campos disponíveis: ${Object.keys(apiBooking).join(", ")}`,
    );
  }

  const result = {
    pnr: bookingRef,
    status: "TICKETED" as const,
    total:
      apiBooking.totalPrice || apiBooking.total_price || apiBooking.total || 0,
    passenger: {
      fullName:
        apiBooking.passenger?.name || apiBooking.passenger?.fullName || "",
      email: apiBooking.passenger?.email || "",
    },
    itineraryId:
      apiBooking.flightId ||
      apiBooking.flight_id ||
      apiBooking.flight?.id ||
      "",
    createdAt:
      apiBooking.createdAt || apiBooking.created_at || new Date().toISOString(),
  };

  console.log(
    "✅ Resultado final da conversão:",
    JSON.stringify(result, null, 2),
  );
  return result;
}

/**
 * Converte BookFlightParams para ApiBookingRequest
 */
export function convertBookingParamsToApiRequest(
  params: import("../agent/types").BookFlightParams,
): ApiBookingRequest {
  return {
    passenger: {
      name: params.passenger.fullName,
      email: params.passenger.email,
      phone: "+5511999999999", // Valor padrão - seria necessário capturar do usuário
      document: "000.000.000-00", // Valor padrão - seria necessário capturar do usuário
    },
  };
}

/**
 * Converte duração de string para minutos
 */
function parseDurationToMinutes(duration: string): number {
  if (!duration) return 120;

  const match = duration.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0") || 0;
  const minutes = parseInt(match[2] || "0") || 0;

  return hours * 60 + minutes;
}

// ===== ERROR TYPES =====

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}
