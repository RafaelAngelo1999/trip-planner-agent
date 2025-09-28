/**
 * Serviço de Voos - Integração com API Real
 * Substitui os mocks antigos por chamadas reais à API
 */

import { apiClient } from "./api-client";
import { withResilienceAndRetry } from "../utils/resilience";
import {
  ApiFlightsResponse,
  ApiFlightResponse,
  ApiBookingResponse,
  ApiBookingDetailResponse,
  ApiCancellationRequest,
  ApiCancellationResponse,
  ApiFlightSearchParams,
  convertApiFlightToItinerary,
  convertApiBookingToResponse,
  convertBookingParamsToApiRequest,
} from "./api-types";

import {
  FlightItinerary,
  ListFlightsParams,
  BookFlightParams,
  BookFlightResponse,
  CancelFlightParams,
  CancelFlightResponse,
} from "../agent/types";

/**
 * Lista voos disponíveis baseado nos critérios de busca
 * Substitui a função listFlights do flights-tools.ts
 */
export async function listFlights(
  params: ListFlightsParams,
): Promise<FlightItinerary[]> {
  try {
    // Converte parâmetros do formato legado para o formato da API
    const apiParams: ApiFlightSearchParams = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departDate, // Mapeamento correto
      page: 1,
      limit: 50, // Pegar mais resultados para poder aplicar filtros
    };

    // Chamada para a API real
    const response = await apiClient.get<ApiFlightsResponse>(
      "/api/flights",
      apiParams,
    );

    // Converte os voos da API para o formato legado
    let flights = response.data.flights.map(convertApiFlightToItinerary);

    // Aplica filtros legados que não estão disponíveis na API
    if (params.directOnly) {
      flights = flights.filter((flight) => flight.stops === 0);
    }

    if (params.withBaggage) {
      flights = flights.filter((flight) => flight.baggageIncluded);
    }

    if (params.cheapestOnly) {
      flights = flights.sort((a, b) => a.totalPrice - b.totalPrice).slice(0, 2);
    }

    return flights;
  } catch (error) {
    console.error("Erro ao buscar voos:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao buscar voos",
    );
  }
}

/**
 * Reserva um voo baseado no itinerário selecionado
 * Substitui a função bookFlight do flights-tools.ts
 */
const _bookFlightCore = async (
  params: BookFlightParams,
): Promise<BookFlightResponse> => {
  // Converte parâmetros para o formato da API
  const apiRequest = convertBookingParamsToApiRequest(params);

  console.log("🔍 Booking request:", {
    flightId: params.itineraryId,
    request: apiRequest,
  });

  // Chamada para a API real
  const response = await apiClient.post<any>(
    `/api/flights/${params.itineraryId}/book`,
    apiRequest,
  );

  console.log("📋 Booking response:", JSON.stringify(response, null, 2));

  // Verifica se a resposta tem a estrutura esperada
  if (!response) {
    throw new Error("Resposta da API está vazia");
  }

  // Log detalhado para debug
  console.log("🔍 Estrutura da resposta:", {
    hasBooking: !!response.booking,
    hasDataBooking: !!response.data?.booking,
    hasSuccess: !!response.success,
    hasData: !!response.data,
    responseKeys: Object.keys(response),
    dataKeys: response.data ? Object.keys(response.data) : null,
  });

  // Diferentes estruturas possíveis da API
  let bookingData;
  if (response.booking) {
    console.log("📦 Usando response.booking");
    bookingData = response.booking;
  } else if (response.data?.booking) {
    console.log("📦 Usando response.data.booking");
    bookingData = response.data.booking;
  } else if (response.success && response.data) {
    console.log("📦 Usando response.data (success=true)");
    bookingData = response.data;
  } else {
    console.log("📦 Usando response diretamente");
    bookingData = response;
  }

  console.log("🎯 BookingData final:", JSON.stringify(bookingData, null, 2));

  // Converte resposta da API para o formato legado
  return convertApiBookingToResponse(bookingData);
};

// Função pública com resiliência aplicada
export async function bookFlight(
  params: BookFlightParams,
): Promise<BookFlightResponse> {
  return withResilienceAndRetry(() => _bookFlightCore(params), "bookFlight", {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
  });
}

/**
 * Cancela uma reserva de voo baseado no código PNR
 * Substitui a função cancelFlight do flights-tools.ts
 */
const _cancelFlightCore = async (
  params: CancelFlightParams,
): Promise<CancelFlightResponse> => {
  // Primeiro, precisamos encontrar a reserva pelo PNR
  // Como a API usa ID interno, vamos assumir que PNR = booking ID por enquanto
  const bookingId = params.pnr;

  // Dados do cancelamento
  const cancellationRequest: ApiCancellationRequest = {
    reason: "Cancelamento solicitado pelo usuário",
    refundMethod: "original_payment",
  };

  // Chamada para a API real
  await apiClient.put<ApiCancellationResponse>(
    `/api/bookings/${bookingId}/cancel`,
    cancellationRequest,
  );

  // Retorna resposta no formato legado
  return {
    pnr: params.pnr,
    status: "CANCELED",
    canceledAt: new Date().toISOString(),
  };
};

// Função pública com resiliência aplicada
export async function cancelFlight(
  params: CancelFlightParams,
): Promise<CancelFlightResponse> {
  return withResilienceAndRetry(
    () => _cancelFlightCore(params),
    "cancelFlight",
    {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
    },
  );
}

/**
 * Busca detalhes de um voo específico
 * Função adicional que pode ser útil
 */
export async function getFlightDetails(
  flightId: string,
): Promise<FlightItinerary> {
  try {
    const response = await apiClient.get<ApiFlightResponse>(
      `/api/flights/${flightId}`,
    );
    return convertApiFlightToItinerary(response.flight);
  } catch (error) {
    console.error("Erro ao buscar detalhes do voo:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao buscar detalhes do voo",
    );
  }
}

/**
 * Busca detalhes de uma reserva específica
 * Função adicional que pode ser útil
 */
export async function getBookingDetails(
  bookingId: string,
): Promise<BookFlightResponse> {
  try {
    const response = await apiClient.get<ApiBookingDetailResponse>(
      `/api/bookings/${bookingId}`,
    );
    console.log("📋 Booking detail response:", response);
    return convertApiBookingToResponse(response.booking);
  } catch (error) {
    console.error("Erro ao buscar detalhes da reserva:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao buscar detalhes da reserva",
    );
  }
}

/**
 * Testa a conectividade com a API
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await apiClient.get("/health");
    return response.status === "OK";
  } catch (error) {
    console.error("Erro ao testar conexão com API:", error);
    return false;
  }
}
