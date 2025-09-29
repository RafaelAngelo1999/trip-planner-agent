import { v4 as uuidv4 } from "uuid";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { formatMessages } from "../../utils/format-messages";
import { HotelsState, HotelsUpdate } from "../types";
import { hotelSearchExtractionSchema } from "../../schemas/hotels";

const DO_NOT_RENDER_ID_PREFIX = "internal:";

function calculateDates(
  checkin: string | undefined,
  checkout: string | undefined,
): { checkin: string; checkout: string } {
  const now = new Date();

  if (!checkin && !checkout) {
    // Ambas indefinidas: 4 semanas no futuro para check-in
    const checkinDate = new Date(now);
    checkinDate.setDate(checkinDate.getDate() + 28); // 4 semanas
    const checkoutDate = new Date(now);
    checkoutDate.setDate(checkoutDate.getDate() + 35); // 5 semanas (7 dias de estadia)
    return {
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
    };
  }

  if (checkin && !checkout) {
    // Apenas check-in definido: checkout é 7 dias depois
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + 7);
    return {
      checkin,
      checkout: checkoutDate.toISOString().split("T")[0],
    };
  }

  if (!checkin && checkout) {
    // Apenas checkout definido: checkin é 7 dias antes
    const checkoutDate = new Date(checkout);
    const checkinDate = new Date(checkoutDate);
    checkinDate.setDate(checkinDate.getDate() - 7);
    return {
      checkin: checkinDate.toISOString().split("T")[0],
      checkout,
    };
  }

  // Ambas definidas: usar como estão
  return {
    checkin: checkin!,
    checkout: checkout!,
  };
}

export async function extractHotelSearch(
  state: HotelsState,
): Promise<HotelsUpdate> {
  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 })
    .bindTools([
      {
        name: "extract_hotel_search",
        description: "Extract hotel search parameters from user conversation.",
        schema: hotelSearchExtractionSchema,
      },
    ])
    .withConfig({ tags: ["langsmith:nostream"] });

  const prompt = `You are an AI assistant for hotel booking. The user wants to search for hotels.
Extract the following information from the user's request:
- city - City where to search for hotels
- checkin - Check-in date in YYYY-MM-DD format (optional)
- checkout - Check-out date in YYYY-MM-DD format (optional)
- rooms - Number of desired rooms (optional, default 1)
- withBreakfast - If they want to include breakfast (optional)
- refundableOnly - If they want only hotels with free cancellation (optional)

You have access to the COMPLETE CONVERSATION HISTORY. Use these messages to extract the necessary information.

DO NOT make up information. If the user has NOT specified the city, respond with a request to specify this mandatory information.
It should be a single sentence, like "Please specify the city where you would like to stay".

Extract only what was specified by the user. It's ok to leave fields blank if the user didn't specify them.`;

  const humanMessage = `Here is the complete conversation so far:\n${formatMessages(state.messages)}`;

  const response = await model.invoke([
    { role: "system", content: prompt },
    { role: "human", content: humanMessage },
  ]);

  const toolCall = response.tool_calls?.[0];
  if (!toolCall || !toolCall.args.city) {
    return { messages: [response] };
  }

  const details = toolCall.args as z.infer<typeof hotelSearchExtractionSchema>;
  const { checkin, checkout } = calculateDates(
    details.checkin,
    details.checkout,
  );

  return {
    hotelSearchParams: {
      city: details.city,
      checkin,
      checkout,
      rooms: details.rooms || 1,
      withBreakfast: details.withBreakfast || false,
      refundableOnly: details.refundableOnly || false,
    },
    messages: [
      response,
      {
        type: "tool",
        id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
        tool_call_id: toolCall.id ?? "",
        content: "Hotel search parameters extracted successfully",
      },
    ],
  };
}
