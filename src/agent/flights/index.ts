import { StateGraph, START, END } from "@langchain/langgraph";
import { FlightsAnnotation, FlightsState } from "./types";
import {
  extractFlightSearch,
  extractFlightBooking,
  extractFlightCancellation,
} from "./nodes/extraction";
import { callFlightTools } from "./nodes/tools";
import { classifyFlightIntent } from "./nodes/classify";

function routeStart(state: FlightsState): "classify" | "extractSearch" {
  // ALWAYS start with classification to determine user intent
  // Classification will decide if it's search, book or cancel
  return "classify";
}

function routeAfterClassifying(
  state: FlightsState,
): "extractSearch" | "extractBooking" | "extractCancellation" {
  const intent = state.intent;

  switch (intent) {
    case "search":
      return "extractSearch";
    case "book":
      return "extractBooking";
    case "cancel":
      return "extractCancellation";
    default:
      return "extractSearch";
  }
}

function routeAfterSearchExtraction(
  state: FlightsState,
): "callTools" | typeof END {
  // If we don't have search parameters, it means required fields are missing
  if (!state.flightSearchParams) {
    return END;
  }

  return "callTools";
}

function routeAfterBookingExtraction(
  state: FlightsState,
): "callTools" | typeof END {
  // If we don't have booking parameters, it means required fields are missing
  if (!state.flightBookingParams) {
    return END;
  }

  return "callTools";
}

function routeAfterCancellationExtraction(
  state: FlightsState,
): "callTools" | typeof END {
  // If we don't have cancellation parameters, it means required fields are missing
  if (!state.flightCancellationParams) {
    return END;
  }

  return "callTools";
}

const builder = new StateGraph(FlightsAnnotation)
  .addNode("classify", classifyFlightIntent)
  .addNode("extractSearch", extractFlightSearch)
  .addNode("extractBooking", extractFlightBooking)
  .addNode("extractCancellation", extractFlightCancellation)
  .addNode("callTools", callFlightTools)
  .addConditionalEdges(START, routeStart, ["classify", "extractSearch"])
  .addConditionalEdges("classify", routeAfterClassifying, [
    "extractSearch",
    "extractBooking",
    "extractCancellation",
  ])
  .addConditionalEdges("extractSearch", routeAfterSearchExtraction, [
    "callTools",
    END,
  ])
  .addConditionalEdges("extractBooking", routeAfterBookingExtraction, [
    "callTools",
    END,
  ])
  .addConditionalEdges(
    "extractCancellation",
    routeAfterCancellationExtraction,
    ["callTools", END],
  )
  .addEdge("callTools", END);

export const flightsGraph = builder.compile();
