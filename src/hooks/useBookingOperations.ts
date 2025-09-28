/**
 * Hook para operações de booking com resiliência
 * Versão simplificada sem sistema de toast
 */

import { useState } from "react";
import { bookFlight, cancelFlight } from "../services/flights-api";
import { bookHotel, cancelHotel } from "../services/hotels-api";
import { BookFlightParams, CancelFlightParams } from "../agent/types";
import { BookHotelParams, CancelHotelParams } from "../services/hotels-api";

interface BookingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook que gerencia operações de booking com resiliência básica
 */
export const useBookingOperations = () => {
  const [flightBookingState, setFlightBookingState] = useState<BookingState>({
    isLoading: false,
    error: null,
  });

  const [hotelBookingState, setHotelBookingState] = useState<BookingState>({
    isLoading: false,
    error: null,
  });

  /**
   * Booking de voo simples
   */
  const handleFlightBooking = async (params: BookFlightParams) => {
    if (flightBookingState.isLoading) {
      console.warn("Booking já em andamento, ignorando chamada duplicada");
      return;
    }

    setFlightBookingState({ isLoading: true, error: null });

    try {
      console.log("Iniciando booking de voo...", params);
      const result = await bookFlight(params);
      console.log("Voo reservado com sucesso:", result.pnr);

      setFlightBookingState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no booking de voo:", errorMessage);

      setFlightBookingState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  /**
   * Cancelamento de voo simples
   */
  const handleFlightCancellation = async (params: CancelFlightParams) => {
    if (flightBookingState.isLoading) {
      console.warn("Operação já em andamento, ignorando chamada duplicada");
      return;
    }

    setFlightBookingState({ isLoading: true, error: null });

    try {
      console.log("Iniciando cancelamento de voo...", params);
      const result = await cancelFlight(params);
      console.log("Voo cancelado com sucesso:", params.pnr);

      setFlightBookingState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no cancelamento de voo:", errorMessage);

      setFlightBookingState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  /**
   * Booking de hotel simples
   */
  const handleHotelBooking = async (params: BookHotelParams) => {
    if (hotelBookingState.isLoading) {
      console.warn(
        "Booking de hotel já em andamento, ignorando chamada duplicada",
      );
      return;
    }

    setHotelBookingState({ isLoading: true, error: null });

    try {
      console.log("Iniciando booking de hotel...", params);
      const result = await bookHotel(params);
      console.log("Hotel reservado com sucesso:", result.reservationId);

      setHotelBookingState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erg desconhecido";
      console.error("Erro no booking de hotel:", errorMessage);

      setHotelBookingState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  /**
   * Cancelamento de hotel simples
   */
  const handleHotelCancellation = async (params: CancelHotelParams) => {
    if (hotelBookingState.isLoading) {
      console.warn(
        "Operação de hotel já em andamento, ignorando chamada duplicada",
      );
      return;
    }

    setHotelBookingState({ isLoading: true, error: null });

    try {
      console.log("Iniciando cancelamento de hotel...", params);
      const result = await cancelHotel(params);
      console.log("Hotel cancelado com sucesso:", params.reservationId);

      setHotelBookingState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no cancelamento de hotel:", errorMessage);

      setHotelBookingState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    // Estados
    flightBookingState,
    hotelBookingState,

    // Operações de voo
    handleFlightBooking,
    handleFlightCancellation,

    // Operações de hotel
    handleHotelBooking,
    handleHotelCancellation,
  };
};
