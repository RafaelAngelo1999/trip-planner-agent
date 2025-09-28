import "./index.css";
import {
  useStreamContext,
  type UIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Message } from "@langchain/langgraph-sdk";
import { CancelFlightResponse } from "../../../agent/types";
import { useI18n, extractLanguageFromContext } from "../../../hooks/useI18n";
import { StatusBadge, PNRDisplay } from "../../../components/shared";
import { ImportantNote } from "../flight-cancellation-confirmation/components";
import {
  ActionButtons,
  MinimalSuccessState,
  SuccessHeader,
} from "./components";

interface FlightCancellationSuccessProps {
  toolCallId: string;
  cancellation: CancelFlightResponse;
}

export default function FlightCancellationSuccess(
  props: FlightCancellationSuccessProps,
) {
  const thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { ui: UIMessage | undefined } }
  >();
  const contextLanguage = extractLanguageFromContext(thread?.values);
  const { t } = useI18n(contextLanguage);
  const [showDetails, setShowDetails] = useState(true);

  const handleClose = () => {
    setShowDetails(false);
  };

  const handleContinue = () => {
    thread.submit(
      {},
      {
        command: {
          update: {
            messages: [
              {
                type: "human",
                content: t("flight.cancellation.thankYou"),
              },
            ],
          },
          goto: "generalInput",
        },
      },
    );
    setShowDetails(false);
  };

  if (!showDetails) {
    return <MinimalSuccessState t={t} />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-6xl mx-auto overflow-hidden">
      {/* Header usando componente */}
      <SuccessHeader onClose={handleClose} t={t} />

      <div className="p-6 space-y-6">
        {/* PNR Display usando componente compartilhado */}
        <PNRDisplay pnr={props.cancellation.pnr} label="PNR" className="mb-4" />

        {/* Status usando componente compartilhado */}
        <StatusBadge
          status="success"
          text={t("flight.cancellation.cancelled")}
          description={t("flight.cancellation.reservationCancelled")}
          icon={CheckCircle}
          className="w-full"
        />

        {/* Alerta Importante usando componente compartilhado */}
        <ImportantNote
          message={`${t("flight.cancellation.keepPNR")} ${props.cancellation.pnr} ${t("flight.cancellation.forTracking")}`}
        />

        {/* Botões de Ação usando componente específico */}
        <ActionButtons
          onContinue={handleContinue}
          onClose={handleClose}
          t={t}
        />
      </div>
    </div>
  );
}
