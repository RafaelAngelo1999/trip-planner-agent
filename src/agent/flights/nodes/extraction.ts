import { v4 as uuidv4 } from "uuid";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ToolMessage } from "@langchain/langgraph-sdk";
import { formatMessages } from "../../utils/format-messages";
import { FlightsState, FlightsUpdate } from "../types";
import {
  flightSearchExtractionSchema,
  flightBookingExtractionSchema,
  flightCancellationExtractionSchema,
} from "../../schemas/flights";

const DO_NOT_RENDER_ID_PREFIX = "internal:";

function calculateDates(
  departDate: string | undefined,
  returnDate: string | undefined,
): { departDate: string; returnDate?: string } {
  const now = new Date();

  if (!departDate && !returnDate) {
    // Ambas indefinidas: 4 semanas no futuro para ida
    const depart = new Date(now);
    depart.setDate(depart.getDate() + 28); // 4 semanas
    const return_ = new Date(now);
    return_.setDate(return_.getDate() + 35); // 5 semanas (1 semana de viagem)
    return {
      departDate: depart.toISOString().split("T")[0],
      returnDate: return_.toISOString().split("T")[0],
    };
  }

  if (departDate && !returnDate) {
    // Outbound only defined: return is 7 days later
    const depart = new Date(departDate);
    const return_ = new Date(depart);
    return_.setDate(return_.getDate() + 7);
    return {
      departDate,
      returnDate: return_.toISOString().split("T")[0],
    };
  }

  if (!departDate && returnDate) {
    // Return only defined: departure is 7 days earlier
    const return_ = new Date(returnDate);
    const depart = new Date(return_);
    depart.setDate(depart.getDate() - 7);
    return {
      departDate: depart.toISOString().split("T")[0],
      returnDate,
    };
  }

  // Both defined: use as they are
  return {
    departDate: departDate!,
    returnDate,
  };
}

export async function extractFlightSearch(
  state: FlightsState,
): Promise<FlightsUpdate> {
  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 })
    .bindTools([
      {
        name: "extract_flight_search",
        description:
          "Extracts flight search parameters from user conversation with intelligent defaults and validation.",
        schema: flightSearchExtractionSchema,
      },
    ])
    .withConfig({ tags: ["langsmith:nostream"] });

  const prompt = `You are an expert AI assistant specialized in flight booking and parameter extraction with deep understanding of travel industry standards.

TASK: Extract comprehensive flight search parameters from user conversation with intelligent interpretation and validation.

REQUIRED PARAMETERS TO EXTRACT:
- origin: Origin airport code (REQUIRED)
  * MUST convert city names to 3-letter IATA airport codes
  * Examples: "Belo Horizonte" → "CNF", "São Paulo" → "GRU", "New York" → "JFK"
  * Common conversions: Rio de Janeiro→GIG, San Francisco→SFO, Los Angeles→LAX, Miami→MIA
  
- destination: Destination airport code (REQUIRED)  
  * MUST convert city names to 3-letter IATA airport codes
  * Same conversion rules as origin
  * Always return the official IATA code, not city names

OPTIONAL PARAMETERS TO EXTRACT:
- departDate: Departure date in YYYY-MM-DD format
  * Parse natural language: "next week", "tomorrow", "December 15th"
  * Convert relative dates to absolute dates
  
- returnDate: Return date in YYYY-MM-DD format (for round-trip flights)
  * Only extract if user mentions return/round-trip travel
  
- adults: Number of adult passengers (default: 1)
  * Parse: "for two people", "3 passengers", "family of 4"
  
- directOnly: Boolean - user preference for direct flights only
  * Keywords: "direct", "non-stop", "no connections", "straight flight"
  
- withBaggage: Boolean - user wants flights with baggage included
  * Keywords: "with luggage", "baggage included", "checked bags"
  
- cheapestOnly: Boolean - user wants only the cheapest options
  * Keywords: "cheapest", "lowest price", "budget", "economical"

EXTRACTION GUIDELINES:
- Analyze the COMPLETE conversation history for context
- DO NOT invent or assume information not provided by the user
- If origin AND destination are NOT specified, respond with a request for these mandatory fields
- Use this exact format: "Please specify both origin and destination cities for your flight search."
- Extract only what the user explicitly mentioned
- Leave optional fields empty if not specified
- Be intelligent about date parsing and location recognition

AIRPORT CODE CONVERSION RULES:
- ALWAYS convert city names to official 3-letter IATA codes
- Common Brazilian airports: Belo Horizonte→CNF, São Paulo→GRU, Rio de Janeiro→GIG, Santos Dumont→SDU
- Common International airports: New York→JFK, San Francisco→SFO, Los Angeles→LAX, Miami→MIA, Houston→IAH
- If you receive an airport code already, keep it as is
- If uncertain about a code, use your knowledge of major airports worldwide

Conversation History Analysis:
${formatMessages(state.messages)}`;

  const humanMessage = `Complete conversation context for parameter extraction:\n${formatMessages(state.messages)}`;

  const response = await model.invoke([
    { role: "system", content: prompt },
    { role: "human", content: humanMessage },
  ]);

  const toolCall = response.tool_calls?.[0];
  if (!toolCall) {
    // If response has any tool_calls, we must create corresponding tool messages
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolMessages = response.tool_calls.map((tc) => ({
        type: "tool" as const,
        id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
        tool_call_id: tc.id ?? "",
        content: "Tool call processed - no extraction needed",
      }));
      return {
        messages: [response, ...toolMessages],
      };
    }
    return {
      messages: [response],
    };
  }

  const extractedDetails = toolCall.args as z.infer<
    typeof flightSearchExtractionSchema
  >;

  // Validate required fields
  if (!extractedDetails.origin || !extractedDetails.destination) {
    const extractToolResponse: ToolMessage = {
      type: "tool",
      id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
      tool_call_id: toolCall.id ?? "",
      content:
        "Origin and destination cities were not specified in the request",
    };

    return {
      messages: [response, extractToolResponse],
    };
  }

  const { departDate, returnDate } = calculateDates(
    extractedDetails.departDate,
    extractedDetails.returnDate,
  );

  const flightSearchDetailsWithDefaults = {
    origin: extractedDetails.origin, // IA já converteu para código IATA
    destination: extractedDetails.destination, // IA já converteu para código IATA
    departDate,
    returnDate,
    adults: extractedDetails.adults || 1,
    directOnly: extractedDetails.directOnly || false,
    withBaggage: extractedDetails.withBaggage || false,
    cheapestOnly: extractedDetails.cheapestOnly || false,
  };

  const extractToolResponse: ToolMessage = {
    type: "tool",
    id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
    tool_call_id: toolCall.id ?? "",
    content: "Flight search parameters successfully extracted and validated",
  };

  return {
    flightSearchParams: flightSearchDetailsWithDefaults,
    messages: [response, extractToolResponse],
  };
}

export async function extractFlightBooking(
  state: FlightsState,
): Promise<FlightsUpdate> {
  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 })
    .bindTools([
      {
        name: "extract_flight_booking",
        description:
          "Extracts flight booking parameters from the user's conversation.",
        schema: flightBookingExtractionSchema,
      },
    ])
    .withConfig({ tags: ["langsmith:nostream"] });

  const prompt = `You are an AI assistant specialized in flight booking. The user wants to book a specific flight.
Extract the following required information from the user's conversation:

REQUIRED PARAMETERS:
- itineraryId: The unique identifier of the flight itinerary to be booked
  * Should be extracted from previous flight search results shown to the user
  * Usually appears when user selects a specific flight from search results
  * Format: typically alphanumeric string (e.g., "FLT-ABC123", "ITIN-789")

- fullName: Complete passenger name for the booking
  * Must include first name and last name
  * Should match official travel document format
  * Examples: "John Smith", "Maria Silva Santos", "Jean-Pierre Dubois"

- email: Valid email address for booking confirmation
  * Required for sending booking confirmation and tickets
  * Must be in valid email format (user@domain.com)
  * Will be used for future booking management

EXTRACTION GUIDELINES:
1. Analyze the COMPLETE conversation history to find all required information
2. Look for flight selection context (which specific flight the user chose)
3. Check for passenger details provided in current or previous messages
4. Validate that all three parameters are present and properly formatted

VALIDATION RULES:
- Never invent or assume missing information
- If any required parameter is missing, do not extract - instead respond asking for it
- Ensure itineraryId corresponds to a flight shown in previous search results
- Verify email format is valid before extraction
- Confirm fullName contains both first and last name components

If any required information is missing, respond with a helpful message requesting the specific missing details.
Example: "To complete your flight booking, I need your full name and email address. Please provide these details."`;

  const humanMessage = `Here is the complete conversation so far:\n${formatMessages(state.messages)}`;

  const response = await model.invoke([
    { role: "system", content: prompt },
    { role: "human", content: humanMessage },
  ]);

  const toolCall = response.tool_calls?.[0];
  if (!toolCall) {
    // If response has any tool_calls, we must create corresponding tool messages
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolMessages = response.tool_calls.map((tc) => ({
        type: "tool" as const,
        id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
        tool_call_id: tc.id ?? "",
        content: "Tool call processed - no extraction needed",
      }));
      return {
        messages: [response, ...toolMessages],
      };
    }
    return {
      messages: [response],
    };
  }

  const extractedDetails = toolCall.args as z.infer<
    typeof flightBookingExtractionSchema
  >;

  const extractToolResponse: ToolMessage = {
    type: "tool",
    id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
    tool_call_id: toolCall.id ?? "",
    content: "Flight booking parameters successfully extracted and validated",
  };

  return {
    flightBookingParams: extractedDetails,
    messages: [response, extractToolResponse],
  };
}

export async function extractFlightCancellation(
  state: FlightsState,
): Promise<FlightsUpdate> {
  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 })
    .bindTools([
      {
        name: "extract_flight_cancellation",
        description:
          "Extracts flight cancellation parameters from the user's conversation.",
        schema: flightCancellationExtractionSchema,
      },
    ])
    .withConfig({ tags: ["langsmith:nostream"] });

  const prompt = `You are an AI assistant specialized in flight cancellations. The user wants to cancel a flight booking.
Extract the following required information from the user's conversation:

REQUIRED PARAMETER:
- pnr: The PNR (Passenger Name Record) code of the booking to be cancelled
  * Also known as booking reference, confirmation code, or reservation code
  * Usually alphanumeric, typically 6 characters (e.g., "ABC123", "XYZ789")
  * May appear in various formats: with or without hyphens/spaces
  * Examples: "ABCD12", "AB-123C", "PNR123", "CONF456"

EXTRACTION GUIDELINES:
1. Analyze the COMPLETE conversation history to find the PNR code
2. Look for booking confirmation messages or previous booking references
3. Check if the user mentioned a confirmation code, booking reference, or PNR
4. The PNR might be provided in the current message or found in booking confirmations

PNR IDENTIFICATION PATTERNS:
- Direct mention: "My PNR is ABC123" or "Cancel booking ABC123"
- From booking confirmation: Previous booking confirmations in the conversation
- Indirect reference: "Cancel my flight" (look for PNR in booking history)
- Format variations: Handle spaces, hyphens, and different case formats

VALIDATION RULES:
- Never invent or generate a PNR code
- If no PNR is found in the conversation, do not extract - ask for it instead
- Ensure the PNR format appears valid (alphanumeric, appropriate length)
- Confirm the PNR corresponds to an existing booking context in the conversation

If the PNR is not provided or cannot be found, respond asking for this information.
Example: "To cancel your flight booking, I need your PNR (booking confirmation code). Please provide your 6-character booking reference."`;

  const humanMessage = `Here is the complete conversation so far:\n${formatMessages(state.messages)}`;

  const response = await model.invoke([
    { role: "system", content: prompt },
    { role: "human", content: humanMessage },
  ]);

  const toolCall = response.tool_calls?.[0];
  if (!toolCall) {
    // If response has any tool_calls, we must create corresponding tool messages
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolMessages = response.tool_calls.map((tc) => ({
        type: "tool" as const,
        id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
        tool_call_id: tc.id ?? "",
        content: "Tool call processed - no extraction needed",
      }));
      return {
        messages: [response, ...toolMessages],
      };
    }
    return {
      messages: [response],
    };
  }

  const extractedDetails = toolCall.args as z.infer<
    typeof flightCancellationExtractionSchema
  >;

  const extractToolResponse: ToolMessage = {
    type: "tool",
    id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
    tool_call_id: toolCall.id ?? "",
    content:
      "Flight cancellation parameters successfully extracted and validated",
  };

  return {
    flightCancellationParams: extractedDetails,
    messages: [response, extractToolResponse],
  };
}
