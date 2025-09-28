import { Hotel, ListHotelsParams } from "../../types";

// Simulated hotels database
const HOTELS_DATABASE: Hotel[] = [
  // Hotéis em Belo Horizonte
  {
    hotelId: "bh-001",
    name: "Tryp by Wyndham Belo Horizonte Savassi",
    nightly: 280.0,
    total: 560.0, // 2 nights (28/09 - 30/09)
    rating: 4.6,
    policy: "Cancelamento gratuito até 24h antes - Café da manhã incluído",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    hotelId: "bh-002",
    name: "Radisson Blu Belo Horizonte",
    nightly: 320.0,
    total: 640.0,
    rating: 4.5,
    policy: "Cancelamento gratuito até 48h antes",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
  },
  {
    hotelId: "bh-003",
    name: "Holiday Inn Express Belo Horizonte Afonso Pena",
    nightly: 195.0,
    total: 390.0,
    rating: 4.2,
    policy: "Cancelamento gratuito até 24h antes - Café da manhã incluído",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
  {
    hotelId: "bh-004",
    name: "Mercure Belo Horizonte Vila da Serra",
    nightly: 380.0,
    total: 760.0,
    rating: 4.7,
    policy: "Cancelamento gratuito até 72h antes",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  },
  {
    hotelId: "bh-005",
    name: "ibis Belo Horizonte Liberdade",
    nightly: 140.0,
    total: 280.0,
    rating: 3.9,
    policy: "Cancelamento gratuito até 18h do dia da chegada",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
  },
  {
    hotelId: "bh-006",
    name: "Hotel Fasano Belo Horizonte",
    nightly: 650.0,
    total: 1300.0,
    rating: 4.9,
    policy: "Não reembolsável - Serviço de concierge 24h",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
  },
  {
    hotelId: "bh-007",
    name: "Quality Hotel Afonso Pena",
    nightly: 165.0,
    total: 330.0,
    rating: 4.1,
    policy: "Cancelamento gratuito até 24h antes",
    currency: "BRL",
    city: "Belo Horizonte",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  // Hotéis em San Francisco (mantidos para compatibilidade)
  {
    hotelId: "sfo-001",
    name: "Grand Hyatt San Francisco",
    nightly: 350.0,
    total: 3150.0, // 9 nights
    rating: 4.5,
    policy: "Cancelamento gratuito até 24h antes",
    currency: "USD",
    city: "San Francisco",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    hotelId: "sfo-002",
    name: "Hotel Zephyr San Francisco",
    nightly: 280.0,
    total: 2520.0,
    rating: 4.2,
    policy: "Cancelamento gratuito até 48h antes",
    currency: "USD",
    city: "San Francisco",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400",
  },
  {
    hotelId: "sfo-003",
    name: "The Ritz-Carlton San Francisco",
    nightly: 650.0,
    total: 5850.0,
    rating: 4.8,
    policy: "Não reembolsável",
    currency: "USD",
    city: "San Francisco",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
];

/**
 * Calcula o número de noites entre check-in e check-out
 */
function calculateNights(checkin: string, checkout: string): number {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Lista hotéis disponíveis baseado nos critérios de busca
 */
export async function listHotels(params: ListHotelsParams): Promise<Hotel[]> {
  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 600));

  const nights = calculateNights(params.checkin, params.checkout);
  let results = [...HOTELS_DATABASE];

  // Filtra por cidade (case insensitive)
  results = results.filter(
    (hotel) =>
      hotel.city.toLowerCase().includes(params.city.toLowerCase()) ||
      params.city.toLowerCase().includes(hotel.city.toLowerCase()),
  );

  // Recalcula total baseado no número de noites reais
  results = results.map((hotel) => ({
    ...hotel,
    total: hotel.nightly * nights,
  }));

  // Filtra apenas hotéis com café da manhã se solicitado
  if (params.withBreakfast) {
    results = results.filter(
      (hotel) =>
        hotel.policy.toLowerCase().includes("café da manhã") ||
        hotel.policy.toLowerCase().includes("breakfast"),
    );
  }

  // Filtra apenas hotéis com cancelamento grátis se solicitado
  if (params.refundableOnly) {
    results = results.filter(
      (hotel) =>
        hotel.policy.toLowerCase().includes("cancelamento gratuito") ||
        hotel.policy.toLowerCase().includes("free cancellation"),
    );
  }

  // Ordena por rating decrescente
  results = results.sort((a, b) => b.rating - a.rating);

  return results;
}
