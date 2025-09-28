// Implementação interna do sistema i18n
// Este arquivo contém a lógica principal e não deve ser importado diretamente
// Use o index.ts como ponto de entrada

export type Locale = "pt-BR" | "en-US";

export interface TranslationKeys {
  flight: {
    booking: {
      confirmation: string;
      success: string;
      pnr: string;
      pnrCode: string;
      passenger: string;
      email: string;
      itinerary: string;
      cancel: string;
      cancelConfirmation: string;
      cancelRequest: string;
      confirmed: string;
      guaranteed: string;
      copyPNR: string;
      copied: string;
      bookedOn: string;
      totalValue: string;
      pnrNote: string;
      bookingRequestMessage: string;
    };
    list: {
      outbound: string;
      return: string;
      duration: string;
      departure: string;
      arrival: string;
      directFlight: string;
      hideDetails: string;
      showDetails: string;
      flightInfo: string;
      detailedSchedule: string;
      additionalInfo: string;
      localTime: string;
      flightType: string;
      directFlightLabel: string;
      selectFlight: string;
      priceFrom: string;
      noFlightsFound: string;
      connections: string;
      connectionsPlural: string;
      searchingFlights: string;
      analyzingBest: string;
      flightsFound: string;
      flightFound: string;
      passenger: string;
      passengers: string;
      airline: string;
      flightNumber: string;
      totalDuration: string;
      airports: string;
      origin: string;
      destination: string;
      bookFlight: string;
      confirmBooking: string;
      passengerName: string;
      passengerEmail: string;
      enterFullName: string;
      enterValidEmail: string;
      bookingConfirmation: string;
      flightDetails: string;
      passengerInfo: string;
      name: string;
      email: string;
      nameRequired: string;
      emailRequired: string;
      cancel: string;
      confirm: string;
      close: string;
      fullNameRequired: string;
      enterFullNameError: string;
      enterValidEmailError: string;
      bookingMessage: string;
      airlineCompany: string;
      totalValue: string;
      to: string;
      returnFlight: string;
      selectedFlight: string;
      passengerData: string;
      baggageIncluded: string;
      baggageNotIncluded: string;
      baggage: string;
      noBaggage: string;
      direct: string;
      stop: string;
      stops: string;
      itineraryDetails: string;
      viewSchedulesInfo: string;
      importantNote: string;
    };
    search: {
      origin: string;
      destination: string;
      departDate: string;
      returnDate: string;
      passengers: string;
      searchFlights: string;
      noFlights: string;
    };
    cancellation: {
      title: string;
      success: string;
      confirmed: string;
      refundInfo: string;
      processingTime: string;
      customerService: string;
      close: string;
      continue: string;
      newSearch: string;
      cancelledOn: string;
      refund: string;
      refundProcessing: string;
      termsApply: string;
      emailConfirmation: string;
      refundNote: string;
      thankYou: string;
      completed: string;
      bookingStatus: string;
      importantInfo: string;
      keepPNR: string;
      forTracking: string;
      reservationCancelled: string;
      cancelled: string;
    };
    errors: {
      missingOrigin: string;
      missingDestination: string;
      missingParams: string;
      bookingFailed: string;
      cancellationFailed: string;
    };
  };
  hotels: {
    list: {
      selectHotel: string;
      checkIn: string;
      checkOut: string;
      guests: string;
      rating: string;
      pricePerNight: string;
      totalPrice: string;
      amenities: string;
      location: string;
      reviews: string;
      availability: string;
      noHotelsFound: string;
      hotelsIn: string;
      room: string;
      rooms: string;
      night: string;
      nights: string;
      viewDetails: string;
      // Tags
      breakfast: string;
      freeCancellation: string;
      viewFullPolicy: string;
      searchingHotels: string;
      hotelsFound: string;
      hotelFound: string;
      bookHotel: string;
    };
    booking: {
      confirmation: string;
      success: string;
      confirmed: string;
      guaranteed: string;
      bookingId: string;
      copyBookingId: string;
      copied: string;
      bookedOn: string;
      hotelDetails: string;
      guestInfo: string;
      stayDetails: string;
      checkInDate: string;
      checkOutDate: string;
      numberOfNights: string;
      numberOfGuests: string;
      roomType: string;
      totalAmount: string;
      guestName: string;
      guestEmail: string;
      bookingNote: string;
      bookingRequestMessage: string;
      enterGuestName: string;
      enterGuestEmail: string;
      guestNameRequired: string;
      guestEmailRequired: string;
      passengerData: string;
    };
    cancellation: {
      title: string;
      success: string;
      confirmed: string;
      refundInfo: string;
      processingTime: string;
      customerService: string;
      close: string;
      continue: string;
      newSearch: string;
      cancelledOn: string;
      refund: string;
      refundProcessing: string;
      termsApply: string;
      emailConfirmation: string;
      refundNote: string;
      thankYou: string;
      completed: string;
      bookingStatus: string;
      importantInfo: string;
      keepBookingId: string;
      forTracking: string;
      reservationCancelled: string;
      cancelled: string;
      cancelRequest: string;
      cancelConfirmation: string;
    };
    errors: {
      bookingFailed: string;
      cancellationFailed: string;
      hotelNotFound: string;
      invalidBookingId: string;
    };
  };
  common: {
    loading: string;
    error: string;
    success: string;
    confirm: string;
    cancel: string;
    close: string;
    copy: string;
    copied: string;
    status: string;
    available: string;
  };
}

import { ptBR } from "./translations/pt-BR";
import { enUS } from "./translations/en-US";

const translations = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

// Função principal de tradução
export function t(key: string, locale: Locale = "pt-BR"): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} for locale ${locale}`);
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}
