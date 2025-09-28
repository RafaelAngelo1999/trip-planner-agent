import { Annotation } from "@langchain/langgraph";
import { GenerativeUIAnnotation, ListHotelsParams } from "../types";

export const HotelsAnnotation = Annotation.Root({
  messages: GenerativeUIAnnotation.spec.messages,
  ui: GenerativeUIAnnotation.spec.ui,
  timestamp: GenerativeUIAnnotation.spec.timestamp,
  hotelSearchParams: Annotation<ListHotelsParams | undefined>(),
});

export type HotelsState = typeof HotelsAnnotation.State;
export type HotelsUpdate = typeof HotelsAnnotation.Update;
