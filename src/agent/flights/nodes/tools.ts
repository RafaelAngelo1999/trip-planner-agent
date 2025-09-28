import { FlightsState, FlightsUpdate } from "../types";
import { ChatOpenAI } from "@langchain/openai";
import { typedUi } from "@langchain/langgraph-sdk/react-ui/server";
import type ComponentMap from "../../../agent-uis/index";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { findToolCall } from "../../find-tool-call";
import { listFlights, bookFlight, cancelFlight } from "../utils/flights-tools";
import {
  listFlightsSchema,
  bookFlightSchema,
  cancelFlightSchema,
} from "../../schemas/flights";

const FLIGHT_TOOLS = [
  {
    name: "list-flights",
    description: "Search for available flights based on provided parameters",
    schema: listFlightsSchema,
  },
  {
    name: "book-flight",
    description: "Book a flight based on the selected itinerary",
    schema: bookFlightSchema,
  },
  {
    name: "cancel-flight",
    description: "Cancel a flight booking based on the PNR code",
    schema: cancelFlightSchema,
  },
];

export async function callFlightTools(
  state: FlightsState,
  config: LangGraphRunnableConfig,
): Promise<FlightsUpdate> {
  const ui = typedUi<typeof ComponentMap>(config);

  const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 }).bindTools(
    FLIGHT_TOOLS,
  );

  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are an AI assistant that helps users with flight bookings. Use the user's most recent messages to contextually generate a response and call the appropriate tools based on the extracted parameters.",
    },
    ...state.messages,
  ]);

  const listFlightsToolCall = response.tool_calls?.find(
    findToolCall("list-flights")<typeof listFlightsSchema>,
  );
  const bookFlightToolCall = response.tool_calls?.find(
    findToolCall("book-flight")<typeof bookFlightSchema>,
  );
  const cancelFlightToolCall = response.tool_calls?.find(
    findToolCall("cancel-flight")<typeof cancelFlightSchema>,
  );

  if (!listFlightsToolCall && !bookFlightToolCall && !cancelFlightToolCall) {
    // If response has any tool_calls, we must create corresponding tool messages
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolMessages = response.tool_calls.map((tc) => ({
        type: "tool" as const,
        id: `internal:${Date.now()}-${Math.random()}`,
        tool_call_id: tc.id ?? "",
        content: "Tool call processed - no matching flight tool",
      }));
      return { messages: [response, ...toolMessages] };
    }
    return { messages: [response] };
  }

  try {
    if (listFlightsToolCall) {
      if (!state.flightSearchParams) {
        throw new Error("Flight search parameters were not extracted");
      }

      const flights = await listFlights(state.flightSearchParams);

      ui.push(
        {
          name: "flights-list",
          props: {
            toolCallId: listFlightsToolCall.id ?? "",
            flights,
            searchParams: state.flightSearchParams,
          },
        },
        { message: response },
      );
    }

    if (bookFlightToolCall) {
      if (!state.flightBookingParams) {
        throw new Error("Flight booking parameters were not extracted");
      }

      const booking = await bookFlight({
        itineraryId: state.flightBookingParams.itineraryId,
        passenger: {
          fullName: state.flightBookingParams.fullName,
          email: state.flightBookingParams.email,
        },
      });

      ui.push(
        {
          name: "flight-booking-confirmation",
          props: {
            toolCallId: bookFlightToolCall.id ?? "",
            booking,
          },
        },
        { message: response },
      );
    }

    if (cancelFlightToolCall) {
      if (!state.flightCancellationParams) {
        throw new Error("Flight cancellation parameters were not extracted");
      }

      const cancellation = await cancelFlight({
        pnr: state.flightCancellationParams.pnr,
      });

      ui.push(
        {
          name: "flight-cancellation-confirmation",
          props: {
            toolCallId: cancelFlightToolCall.id ?? "",
            cancellation,
          },
        },
        { message: response },
      );
    }

    // Create tool messages for all successful tool calls
    const toolMessages =
      response.tool_calls?.map((tc) => ({
        type: "tool" as const,
        id: `internal:${Date.now()}-${Math.random()}`,
        tool_call_id: tc.id ?? "",
        content: `Tool ${tc.name} executed successfully`,
      })) || [];

    return {
      messages: [response, ...toolMessages],
      ui: ui.items,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      messages: [
        response,
        {
          type: "tool",
          id: response.tool_calls?.[0]?.id ?? "",
          tool_call_id: response.tool_calls?.[0]?.id ?? "",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}
