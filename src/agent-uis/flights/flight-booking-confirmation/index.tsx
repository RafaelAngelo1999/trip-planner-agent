import "./index.css";
import { CheckCircle } from "lucide-react";
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";
import { Message } from "@langchain/langgraph-sdk";
import { BookFlightResponse } from "../../../agent/types";
import { useI18n, extractLanguageFromContext } from "../../../hooks/useI18n";
import { useFlightLookup, useDateFormatting } from "../../../hooks";
import { PNRDisplay, StatusBadge } from "../../../components/shared";
import {
  BookingHeader,
  CancelButton,
  FlightDetails,
  PassengerInfo,
  TotalValueDisplay,
} from "./components";
import { ImportantNote } from "../flight-cancellation-confirmation/components";

interface FlightBookingConfirmationProps {
  toolCallId: string;
  booking: BookFlightResponse;
}

export default function FlightBookingConfirmation(
  props: FlightBookingConfirmationProps,
) {
  const thread = useStreamContext<
    { messages: Message[] },
    { MetaType: undefined }
  >();
  const contextLanguage = extractLanguageFromContext(thread?.values);
  const { t } = useI18n(contextLanguage);
  const { formatDateTime } = useDateFormatting();

  // Buscar informações do voo reservado usando o hook
  const flightDetails = useFlightLookup(props.booking.itineraryId);

  const handleCancelFlight = () => {
    const message = `${t("flight.booking.cancelRequest")} ${t("flight.booking.pnrCode")}: ${props.booking.pnr}`;

    thread.submit(
      {},
      {
        command: {
          update: {
            messages: [
              {
                type: "human",
                content: message,
              },
            ],
          },
          goto: "flights",
        },
      },
    );
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-slate-200/60 max-w-2xl mx-auto overflow-hidden booking-confirmation"
      role="main"
      aria-label={t("flight.booking.confirmed")}
    >
      {/* Header de Sucesso usando componente */}
      <BookingHeader t={t} />

      <div className="p-6 space-y-4">
        {/* PNR Display usando componente compartilhado */}
        <PNRDisplay
          pnr={props.booking.pnr}
          label={t("flight.booking.pnrCode")}
          className="mb-4"
        />

        {/* Status usando componente compartilhado */}
        <StatusBadge
          status="success"
          text={props.booking.status}
          description={`${t("flight.booking.bookedOn")} ${formatDateTime(props.booking.createdAt)}`}
          icon={CheckCircle}
          className="w-full"
        />

        {/* Detalhes do Voo usando componente específico */}
        {flightDetails && <FlightDetails flightDetails={flightDetails} />}

        {/* Informações do Passageiro usando componente específico */}
        <PassengerInfo passenger={props.booking.passenger} t={t} />

        {/* Valor Total usando componente */}
        <TotalValueDisplay total={props.booking.total} t={t} />

        {/* Botão de Cancelamento usando componente */}
        <CancelButton
          onCancel={handleCancelFlight}
          pnr={props.booking.pnr}
          t={t}
        />

        {/* Nota Importante usando componente específico */}
        <ImportantNote message={t("flight.booking.pnrNote")} />
      </div>
    </div>
  );
}
