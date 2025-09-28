import { MessagesAnnotation, Annotation } from "@langchain/langgraph";
import {
  RemoveUIMessage,
  UIMessage,
  uiMessageReducer,
} from "@langchain/langgraph-sdk/react-ui/server";
import { z } from "zod";

// Importando schemas
import {
  flightSegmentSchema,
  flightItinerarySchema,
  bookFlightResponseSchema,
  cancelFlightResponseSchema,
  listFlightsSchema,
  bookFlightSchema,
  cancelFlightSchema,
  flightSearchExtractionSchema,
  flightBookingExtractionSchema,
  flightCancellationExtractionSchema,
} from "./schemas/flights";

import {
  hotelSchema,
  listHotelsSchema,
  hotelSearchExtractionSchema,
} from "./schemas/hotels";

export const GenerativeUIAnnotation = Annotation.Root({
  messages: MessagesAnnotation.spec["messages"],
  ui: Annotation<
    UIMessage[],
    UIMessage | RemoveUIMessage | (UIMessage | RemoveUIMessage)[]
  >({ default: () => [], reducer: uiMessageReducer }),
  context: Annotation<Record<string, unknown> | undefined>,
  timestamp: Annotation<number>,
  next: Annotation<
    "tripPlanner" | "flights" | "hotels" | "generalInput" | "writerAgent"
  >(),
});

export type GenerativeUIState = typeof GenerativeUIAnnotation.State;

// Tipos derivados dos schemas Zod - Flights
export type FlightSegment = z.infer<typeof flightSegmentSchema>;
export type FlightItinerary = z.infer<typeof flightItinerarySchema>;
export type BookFlightResponse = z.infer<typeof bookFlightResponseSchema>;
export type CancelFlightResponse = z.infer<typeof cancelFlightResponseSchema>;
export type ListFlightsParams = z.infer<typeof listFlightsSchema>;
export type BookFlightParams = z.infer<typeof bookFlightSchema>;
export type CancelFlightParams = z.infer<typeof cancelFlightSchema>;
export type FlightSearchExtraction = z.infer<
  typeof flightSearchExtractionSchema
>;
export type FlightBookingExtraction = z.infer<
  typeof flightBookingExtractionSchema
>;
export type FlightCancellationExtraction = z.infer<
  typeof flightCancellationExtractionSchema
>;

// Tipos derivados dos schemas Zod - Hotels
export type Hotel = z.infer<typeof hotelSchema>;
export type ListHotelsParams = z.infer<typeof listHotelsSchema>;
export type HotelSearchExtraction = z.infer<typeof hotelSearchExtractionSchema>;

// Tipos existentes mantidos para compatibilidade
export type Accommodation = {
  id: string;
  name: string;
  price: number;
  rating: number;
  city: string;
  image: string;
};

// Tipos legados (removidos pois agora usamos os derivados do Zod)
// export type FlightSegment = ...
// export type FlightResult = ...
// export type Hotel = ...
