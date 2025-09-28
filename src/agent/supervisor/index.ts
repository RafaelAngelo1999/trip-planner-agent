import { StateGraph, START, END } from "@langchain/langgraph";
import { tripPlannerGraph } from "../trip-planner";
import { flightsGraph } from "../flights";
import { hotelsGraph } from "../hotels";
import {
  SupervisorAnnotation,
  SupervisorState,
  SupervisorZodConfiguration,
} from "./types";
import { generalInput } from "./nodes/general-input";
import { router } from "./nodes/router";
import { graph as writerAgentGraph } from "../writer-agent";

export const ALL_TOOL_DESCRIPTIONS = `- tripPlanner: helps the user plan their trip. it can suggest restaurants, and places to stay in any given location.
- flights: helps search, book, and cancel flight reservations for the user.
- hotels: helps search and find hotel accommodations for the user.
- writerAgent: can write a text document for the user. Only call this tool if they request a text document.`;

function handleRoute(
  state: SupervisorState,
): "flights" | "hotels" | "tripPlanner" | "generalInput" | "writerAgent" {
  return state.next;
}

const builder = new StateGraph(SupervisorAnnotation, SupervisorZodConfiguration)
  .addNode("router", router)
  .addNode("flights", flightsGraph)
  .addNode("hotels", hotelsGraph)
  .addNode("tripPlanner", tripPlannerGraph)
  .addNode("generalInput", generalInput)
  .addNode("writerAgent", writerAgentGraph)
  .addConditionalEdges("router", handleRoute, [
    "flights",
    "hotels",
    "tripPlanner",
    "generalInput",
    "writerAgent",
  ])
  .addEdge(START, "router")
  .addEdge("flights", END)
  .addEdge("hotels", END)
  .addEdge("tripPlanner", END)
  .addEdge("generalInput", END)
  .addEdge("writerAgent", END);

export const graph = builder.compile();
graph.name = "Generative UI Agent";
