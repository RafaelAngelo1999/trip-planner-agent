import { HotelsState, HotelsUpdate } from "../types";
import { ChatOpenAI } from "@langchain/openai";
import { typedUi } from "@langchain/langgraph-sdk/react-ui/server";
import type ComponentMap from "../../../agent-uis/index";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { findToolCall } from "../../find-tool-call";
import { listHotels } from "../utils/hotels-tools";
import { listHotelsSchema } from "../../schemas/hotels";

const HOTEL_TOOLS = [
  {
    name: "list-hotels",
    description: "Search available hotels based on provided parameters",
    schema: listHotelsSchema,
  },
];

export async function callHotelTools(
  state: HotelsState,
  config: LangGraphRunnableConfig,
): Promise<HotelsUpdate> {
  const ui = typedUi<typeof ComponentMap>(config);

  const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 }).bindTools(
    HOTEL_TOOLS,
  );

  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are an AI assistant that helps users with hotel bookings. Use the user's most recent messages to contextually generate a response and call the appropriate tools based on the extracted parameters.",
    },
    ...state.messages,
  ]);

  const listHotelsToolCall = response.tool_calls?.find(
    findToolCall("list-hotels")<typeof listHotelsSchema>,
  );

  if (!listHotelsToolCall) {
    return { messages: [response] };
  }

  try {
    if (!state.hotelSearchParams) {
      throw new Error("Search parameters were not extracted");
    }

    const hotels = await listHotels(state.hotelSearchParams);

    ui.push(
      {
        name: "hotels-list",
        props: {
          toolCallId: listHotelsToolCall.id ?? "",
          hotels,
          searchParams: state.hotelSearchParams,
        },
      },
      { message: response },
    );

    return {
      messages: [response],
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
