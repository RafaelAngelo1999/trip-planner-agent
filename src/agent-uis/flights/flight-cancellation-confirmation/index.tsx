import "./index.css";
import { XCircle } from "lucide-react";
import { CancelFlightResponse } from "../../../agent/types";
import { useI18n, extractLanguageFromContext } from "../../../hooks/useI18n";
import { useDateFormatting } from "../../../hooks";
import {
  PNRDisplay,
  StatusBadge,
  RefundInfo,
} from "../../../components/shared";
import { CancellationHeader, ImportantNote } from "./components";
import {
  useStreamContext,
  type UIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { Message } from "@langchain/langgraph-sdk";

interface FlightCancellationConfirmationProps {
  toolCallId: string;
  cancellation: CancelFlightResponse;
}

export default function FlightCancellationConfirmation(
  props: FlightCancellationConfirmationProps,
) {
  const thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { ui: UIMessage | undefined } }
  >();
  const contextLanguage = extractLanguageFromContext(thread?.values);
  const { t } = useI18n(contextLanguage);
  const { formatDateTime } = useDateFormatting();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-2xl mx-auto overflow-hidden">
      {/* Header de Cancelamento usando componente */}
      <CancellationHeader t={t} />

      <div className="p-6 space-y-4">
        {/* PNR Display usando componente compartilhado */}
        <PNRDisplay
          pnr={props.cancellation.pnr}
          label={t("flight.booking.pnrCode")}
          className="mb-4"
        />

        {/* Status usando componente compartilhado */}
        <StatusBadge
          status="error"
          text={props.cancellation.status}
          description={`${t("flight.cancellation.cancelledOn")} ${formatDateTime(props.cancellation.canceledAt)}`}
          icon={XCircle}
          className="w-full"
        />

        {/* Informações de Reembolso usando componente compartilhado */}
        <RefundInfo
          amount={t("flight.cancellation.refundProcessing")}
          method={t("flight.cancellation.termsApply")}
          timeframe={t("flight.cancellation.emailConfirmation")}
        />

        {/* Nota Importante usando componente específico */}
        <ImportantNote message={t("flight.cancellation.refundNote")} />
      </div>
    </div>
  );
}
