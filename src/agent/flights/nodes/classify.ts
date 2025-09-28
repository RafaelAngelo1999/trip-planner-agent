import { ChatOpenAI } from "@langchain/openai";
import { FlightsState, FlightsUpdate } from "../types";
import { formatMessages } from "../../utils/format-messages";

export async function classifyFlightIntent(
  state: FlightsState,
): Promise<FlightsUpdate> {
  const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

  const prompt = `You are a specialized AI assistant for flight intent classification with expertise in natural language understanding and travel domain knowledge.

Your role is to analyze the user's most recent message in the conversation context and accurately determine their primary flight-related intention.

INTENT CATEGORIES:

1. "search" - User wants to SEARCH/FIND flights
   Examples: 
   - "I want to find flights from New York to London"
   - "Show me available flights for next week"
   - "Search for cheap flights to Paris"
   - "What flights are available from CNF to GRU?"
   - "I need to travel from São Paulo to Miami"

2. "book" - User wants to BOOK/PURCHASE a specific flight
   Examples:
   - "I want to reserve this flight"
   - "Book flight CNF-GRU-001"
   - "I'll take the Latam flight for $450"
   - "Reserve this ticket for me"
   - "Purchase the 6:30 AM departure"

3. "cancel" - User wants to CANCEL an existing reservation
   Examples:
   - "Cancel my reservation"
   - "I need to cancel flight PNR ABC123"
   - "Cancel my booking"
   - "I want to cancel my trip"
   - "Remove my reservation with PNR XYZ789"

CLASSIFICATION RULES:
- Respond with ONLY ONE WORD: "search", "book", or "cancel"
- Consider the full conversation context, not just individual keywords
- If intent is ambiguous or unclear, default to "search"
- Pay attention to specific flight codes, PNR numbers, or price references for booking/cancellation
- Look for action words like "find", "book", "cancel", "reserve", "purchase"

Conversation History:
${formatMessages(state.messages)}`;

  const response = await llm.invoke([{ role: "system", content: prompt }]);

  const intent = response.content?.toString().toLowerCase().trim();
  const validIntents = ["search", "book", "cancel"];
  const finalIntent = validIntents.includes(intent || "")
    ? (intent as "search" | "book" | "cancel")
    : "search";

  return {
    intent: finalIntent,
  };
}
