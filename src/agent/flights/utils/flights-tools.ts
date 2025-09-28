import {
  FlightItinerary,
  ListFlightsParams,
  BookFlightParams,
  BookFlightResponse,
  CancelFlightParams,
  CancelFlightResponse,
} from "../../types";

import {
  listFlights as apiListFlights,
  bookFlight as apiBookFlight,
  cancelFlight as apiCancelFlight,
} from "../../../services/flights-api";

/**
 * Lists available flights based on search criteria
 * Agora usa a API real em vez de dados mock
 */
export async function listFlights(
  params: ListFlightsParams,
): Promise<FlightItinerary[]> {
  return apiListFlights(params);
}

/**
 * Books a flight based on the selected itinerary
 * Agora usa a API real em vez de dados mock
 */
export async function bookFlight(
  params: BookFlightParams,
): Promise<BookFlightResponse> {
  return apiBookFlight(params);
}

/**
 * Cancels a flight booking based on the PNR code
 * Agora usa a API real em vez de dados mock
 */
export async function cancelFlight(
  params: CancelFlightParams,
): Promise<CancelFlightResponse> {
  return apiCancelFlight(params);
}
