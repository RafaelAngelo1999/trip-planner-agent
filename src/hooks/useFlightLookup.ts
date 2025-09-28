import { useState, useEffect } from "react";
import { getFlightDetails } from "../services/flights-api";

export interface FlightData {
  itineraryId: string;
  airline: string;
  outbound: Array<{
    carrier: string;
    flightNumber: string;
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    durationMin: number;
  }>;
  inbound: Array<{
    carrier: string;
    flightNumber: string;
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    durationMin: number;
  }>;
  stops: number;
  baggageIncluded: boolean;
  totalPrice: number;
  currency: string;
}

/**
 * Hook para buscar informações de voo por itineraryId
 * Agora usa a API real em vez de dados mock
 * @param itineraryId - ID do itinerário para buscar
 */
export function useFlightLookup(itineraryId?: string) {
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itineraryId) {
      setFlight(null);
      return;
    }

    let cancelled = false;

    const fetchFlight = async () => {
      setLoading(true);
      setError(null);

      try {
        const flightDetails = await getFlightDetails(itineraryId);

        if (!cancelled) {
          // Converte FlightItinerary para FlightData
          setFlight({
            itineraryId: flightDetails.itineraryId,
            airline: flightDetails.airline,
            outbound: flightDetails.outbound || [],
            inbound: flightDetails.inbound || [],
            stops: flightDetails.stops,
            baggageIncluded: flightDetails.baggageIncluded,
            totalPrice: flightDetails.totalPrice,
            currency: flightDetails.currency,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao buscar voo");
          setFlight(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFlight();

    return () => {
      cancelled = true;
    };
  }, [itineraryId]);

  return { flight, loading, error };
}
