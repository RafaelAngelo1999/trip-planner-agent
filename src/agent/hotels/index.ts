import { StateGraph, START, END } from "@langchain/langgraph";
import { HotelsAnnotation, HotelsState } from "./types";
import { extractHotelSearch } from "./nodes/extraction";
import { callHotelTools } from "./nodes/tools";

function routeAfterExtraction(state: HotelsState): "callTools" | typeof END {
  // Se não temos parâmetros de busca, significa que faltam campos obrigatórios
  if (!state.hotelSearchParams) {
    return END;
  }

  return "callTools";
}

const builder = new StateGraph(HotelsAnnotation)
  .addNode("extraction", extractHotelSearch)
  .addNode("callTools", callHotelTools)
  .addEdge(START, "extraction")
  .addConditionalEdges("extraction", routeAfterExtraction, ["callTools", END])
  .addEdge("callTools", END);

export const hotelsGraph = builder.compile();
