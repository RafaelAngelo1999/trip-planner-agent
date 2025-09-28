import { Annotation } from "@langchain/langgraph";
import {
  GenerativeUIAnnotation,
  FlightSearchExtraction,
  FlightBookingExtraction,
  FlightCancellationExtraction,
  ListFlightsParams,
} from "../types";
import { Locale } from "../../i18n/core";

export const FlightsAnnotation = Annotation.Root({
  messages: GenerativeUIAnnotation.spec.messages,
  ui: GenerativeUIAnnotation.spec.ui,
  timestamp: GenerativeUIAnnotation.spec.timestamp,
  flightSearchParams: Annotation<ListFlightsParams | undefined>(),
  flightBookingParams: Annotation<FlightBookingExtraction | undefined>(),
  flightCancellationParams: Annotation<
    FlightCancellationExtraction | undefined
  >(),
  intent: Annotation<"search" | "book" | "cancel" | undefined>(),
  locale: Annotation<Locale>(),
});

export type FlightsState = typeof FlightsAnnotation.State;
export type FlightsUpdate = typeof FlightsAnnotation.Update;
