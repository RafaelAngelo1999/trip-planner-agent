/**
 * API de Hotéis com Mock Estruturado
 *
 * Sistema completo para busca, reserva e cancelamento de hotéis
 * com simulação de condições reais e integração com resiliência
 */

import { withResilienceAndRetry } from "../utils/resilience";
import { Hotel, ListHotelsParams } from "../agent/types";

// Tipos adicionais para booking (não existem nos schemas originais)
export interface BookHotelParams {
  hotelId: string;
  checkin: string;
  checkout: string;
  rooms: number;
  guest: {
    fullName: string;
    email: string;
    phone?: string;
  };
  specialRequests?: string;
}

export interface HotelBookingResponse {
  reservationId: string;
  status: "BOOKED" | "PENDING" | "CANCELED" | "CONFIRMED";
  total: number;
  currency: string;
  checkin: string;
  checkout: string;
  nights: number;
  guest: {
    fullName: string;
    email: string;
    phone?: string;
  };
  hotel: {
    name: string;
    city: string;
  };
  bookingDate: string;
  cancellationPolicy: string;
}

export interface CancelHotelParams {
  reservationId: string;
  reason?: string;
}

export interface CancelHotelResponse {
  reservationId: string;
  status: "CANCELED";
  refundAmount?: number;
  refundMethod?: string;
  canceledAt: string;
}

/**
 * Base de dados mock estruturada de hotéis
 * Usando apenas campos compatíveis com o schema existente
 */
const MOCK_HOTELS_DB: Hotel[] = [
  // São Francisco (SFO)
  {
    hotelId: "sfo-001",
    name: "The St. Regis San Francisco",
    city: "San Francisco",
    rating: 4.8,
    nightly: 450.0,
    total: 4500.0, // 10 nights
    currency: "USD",
    policy: "Free cancellation until 48h before check-in",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  },
  {
    hotelId: "sfo-002",
    name: "Hotel Zephyr San Francisco",
    city: "San Francisco",
    rating: 4.5,
    nightly: 320.0,
    total: 3200.0,
    currency: "USD",
    policy: "Free cancellation until 24h before check-in - Breakfast included",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
  },
  {
    hotelId: "sfo-003",
    name: "Hyatt Regency San Francisco",
    city: "San Francisco",
    rating: 4.3,
    nightly: 280.0,
    total: 2800.0,
    currency: "USD",
    policy: "Free cancellation until 72h before check-in - Breakfast included",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
  },
  // Belo Horizonte (CNF)
  {
    hotelId: "bh-001",
    name: "Tryp by Wyndham Belo Horizonte Savassi",
    city: "Belo Horizonte",
    rating: 4.6,
    nightly: 280.0,
    total: 2520.0, // 9 nights (2025-10-01 to 2025-10-10)
    currency: "BRL",
    policy: "Cancelamento gratuito até 24h antes - Café da manhã incluído",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
  },
  {
    hotelId: "bh-002",
    name: "Radisson Blu Belo Horizonte",
    city: "Belo Horizonte",
    rating: 4.5,
    nightly: 320.0,
    total: 2880.0,
    currency: "BRL",
    policy: "Cancelamento gratuito até 48h antes",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
  },
  // Hotéis adicionais para demonstrar variedade
  {
    hotelId: "sfo-004",
    name: "Marriott San Francisco",
    city: "San Francisco",
    rating: 4.2,
    nightly: 380.0,
    total: 3800.0,
    currency: "USD",
    policy: "Free cancellation until 24h before check-in",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
  },
  {
    hotelId: "bh-003",
    name: "Holiday Inn Express Belo Horizonte",
    city: "Belo Horizonte",
    rating: 4.2,
    nightly: 195.0,
    total: 1755.0,
    currency: "BRL",
    policy: "Cancelamento gratuito até 24h antes - Café da manhã incluído",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
  },
];

/**
 * Simula busca de hotéis com filtros
 */
export const listHotels = async (
  params: ListHotelsParams,
): Promise<Hotel[]> => {
  return withResilienceAndRetry(
    async () => {
      console.log("🏨 Buscando hotéis:", params);

      // Filtrar por cidade
      let hotels = MOCK_HOTELS_DB.filter((hotel) =>
        hotel.city.toLowerCase().includes(params.city.toLowerCase()),
      );

      // Aplicar filtros opcionais
      if (params.withBreakfast) {
        // Filtrar hotéis que incluem café da manhã (check na policy)
        hotels = hotels.filter(
          (hotel) =>
            hotel.policy.toLowerCase().includes("breakfast") ||
            hotel.policy.toLowerCase().includes("manhã"),
        );
      }

      if (params.refundableOnly) {
        // Filtrar apenas hotéis com cancelamento gratuito
        hotels = hotels.filter(
          (hotel) =>
            hotel.policy.toLowerCase().includes("free cancellation") ||
            hotel.policy.toLowerCase().includes("cancelamento gratuito"),
        );
      }

      // Recalcular total baseado nas datas
      if (params.checkin && params.checkout) {
        const checkinDate = new Date(params.checkin);
        const checkoutDate = new Date(params.checkout);
        const nights = Math.ceil(
          (checkoutDate.getTime() - checkinDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        hotels = hotels.map((hotel) => ({
          ...hotel,
          total: hotel.nightly * nights * params.rooms,
        }));
      }

      // Ordenar por rating (melhor primeiro)
      hotels.sort((a, b) => b.rating - a.rating);

      console.log(`✅ Encontrados ${hotels.length} hotéis`);
      return hotels;
    },
    "hotel-search",
    { maxAttempts: 2, baseDelay: 500 },
  );
};

/**
 * Simula reserva de hotel
 */
export const bookHotel = async (
  params: BookHotelParams,
): Promise<HotelBookingResponse> => {
  return withResilienceAndRetry(
    async () => {
      console.log("🏨 Reservando hotel:", params);

      // Encontrar hotel
      const hotel = MOCK_HOTELS_DB.find((h) => h.hotelId === params.hotelId);
      if (!hotel) {
        throw new Error(`Hotel ${params.hotelId} não encontrado`);
      }

      // Calcular total
      const checkinDate = new Date(params.checkin);
      const checkoutDate = new Date(params.checkout);
      const nights = Math.ceil(
        (checkoutDate.getTime() - checkinDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const total = hotel.nightly * nights * params.rooms;

      // Gerar reserva
      const reservation: HotelBookingResponse = {
        reservationId: `HR${Date.now()}${Math.floor(Math.random() * 1000)}`,
        status: "BOOKED",
        total,
        currency: hotel.currency,
        checkin: params.checkin,
        checkout: params.checkout,
        nights,
        guest: params.guest,
        hotel: {
          name: hotel.name,
          city: hotel.city,
        },
        bookingDate: new Date().toISOString(),
        cancellationPolicy: hotel.policy,
      };

      console.log("✅ Hotel reservado:", reservation.reservationId);
      return reservation;
    },
    "hotel-booking",
    { maxAttempts: 3, baseDelay: 1000 },
  );
};

/**
 * Simula cancelamento de hotel
 */
export const cancelHotel = async (
  params: CancelHotelParams,
): Promise<CancelHotelResponse> => {
  return withResilienceAndRetry(
    async () => {
      console.log("🏨 Cancelando hotel:", params.reservationId);

      // Simular validação da reserva
      if (!params.reservationId.startsWith("HR")) {
        throw new Error("ID de reserva inválido");
      }

      const cancellation: CancelHotelResponse = {
        reservationId: params.reservationId,
        status: "CANCELED",
        refundAmount: Math.floor(Math.random() * 2000) + 500, // Simular reembolso
        refundMethod: "original_payment",
        canceledAt: new Date().toISOString(),
      };

      console.log("✅ Hotel cancelado:", cancellation);
      return cancellation;
    },
    "hotel-cancellation",
    { maxAttempts: 2, baseDelay: 750 },
  );
};

/**
 * Busca detalhes de um hotel específico
 */
export const getHotelDetails = async (hotelId: string): Promise<Hotel> => {
  return withResilienceAndRetry(
    async () => {
      const hotel = MOCK_HOTELS_DB.find((h) => h.hotelId === hotelId);
      if (!hotel) {
        throw new Error(`Hotel ${hotelId} não encontrado`);
      }
      return hotel;
    },
    "hotel-details",
    { maxAttempts: 2, baseDelay: 300 },
  );
};

/**
 * Busca hotéis com ordenação simples
 */
export const searchHotelsSorted = async (
  params: ListHotelsParams,
  sortBy?: "price" | "rating",
): Promise<Hotel[]> => {
  return withResilienceAndRetry(
    async () => {
      const hotels = await listHotels(params);

      // Ordenar
      switch (sortBy) {
        case "price":
          hotels.sort((a, b) => a.nightly - b.nightly);
          break;
        case "rating":
          hotels.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Manter ordenação por rating
          break;
      }

      return hotels;
    },
    "hotel-search-sorted",
    { maxAttempts: 2, baseDelay: 600 },
  );
};
