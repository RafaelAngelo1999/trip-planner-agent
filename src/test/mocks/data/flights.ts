import { BookFlightResponse, FlightItinerary } from "../../../agent/types";

export const mockFlightItinerary: FlightItinerary = {
  itineraryId: "flight-123",
  airline: "LATAM",
  outbound: [
    {
      carrier: "LATAM",
      flightNumber: "LA8084",
      from: "GRU",
      to: "JFK",
      depTime: "2024-01-15T08:00:00Z",
      arrTime: "2024-01-15T18:00:00Z",
      durationMin: 600,
    },
  ],
  stops: 0,
  baggageIncluded: true,
  totalPrice: 1500.0,
  currency: "BRL",
};

export const mockBooking: BookFlightResponse = {
  itineraryId: "flight-123",
  pnr: "ABC123",
  status: "TICKETED",
  passenger: {
    fullName: "João Silva",
    email: "joao.silva@email.com",
  },
  total: 1500.0,
  createdAt: "2024-01-15T10:30:00Z",
};
