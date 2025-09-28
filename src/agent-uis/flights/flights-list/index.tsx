import "./index.css";
import {
  useStreamContext,
  type UIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { Message } from "@langchain/langgraph-sdk";
import { FlightItinerary, ListFlightsParams } from "../../../agent/types";
import { useI18n, extractLanguageFromContext } from "../../../hooks/useI18n";
import { LoadingState } from "../../../components/shared";
import {
  BookingModal,
  EmptyFlights,
  FlightCard,
  FlightHeader,
  FlightInfoBadges,
} from "./components";

interface FlightsListProps {
  toolCallId: string;
  flights: FlightItinerary[];
  searchParams: ListFlightsParams;
}

export default function FlightsList(props: FlightsListProps) {
  const thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { ui: UIMessage | undefined } }
  >();

  const contextLanguage = extractLanguageFromContext(thread?.values);
  const { t } = useI18n(contextLanguage);
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightItinerary | null>(
    null,
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [passengerData, setPassengerData] = useState({ name: "", email: "" });

  useEffect(() => {
    // Mostra resultados após um pequeno delay para melhor UX
    const timer = setTimeout(() => setShowResults(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBookFlight = (flight: FlightItinerary) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedFlight || !passengerData.name || !passengerData.email) return;

    // Get the booking message template and replace variables
    const messageTemplate = t("flight.booking.bookingRequestMessage");
    const formattedPrice = selectedFlight.totalPrice.toLocaleString(
      contextLanguage === "pt-BR" ? "pt-BR" : "en-US",
      { minimumFractionDigits: 2 },
    );

    const message = messageTemplate
      .replace("{{itineraryId}}", selectedFlight.itineraryId)
      .replace("{{airline}}", selectedFlight.airline)
      .replace("{{price}}", formattedPrice)
      .replace("{{name}}", passengerData.name)
      .replace("{{email}}", passengerData.email);

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

    setShowBookingModal(false);
    setSelectedFlight(null);
    setPassengerData({ name: "", email: "" });
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedFlight(null);
    setPassengerData({ name: "", email: "" });
  };

  const handleClose = () => {
    setShowResults(false);
  };

  if (!showResults) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-5xl mx-auto">
        <LoadingState message={t("flight.list.searchingFlights")} size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-7xl mx-auto overflow-hidden">
      {/* Header Premium */}
      <FlightHeader
        searchParams={props.searchParams}
        flightsCount={props.flights.length}
        onClose={handleClose}
        t={t}
      />

      <div className="p-4">
        <FlightInfoBadges searchParams={props.searchParams} t={t} />

        {props.flights.length === 0 ? (
          <EmptyFlights t={t} />
        ) : (
          <div className="relative">
            <Carousel className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="gap-4 ml-0">
                {props.flights.map((flight) => (
                  <CarouselItem
                    key={flight.itineraryId}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-0"
                  >
                    <div className="h-full px-2">
                      <FlightCard
                        flight={flight}
                        searchParams={props.searchParams}
                        onBookFlight={handleBookFlight}
                        t={t}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 -translate-y-1/2 top-1/2" />
              <CarouselNext className="right-2 -translate-y-1/2 top-1/2" />
            </Carousel>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Reserva */}
      {showBookingModal && selectedFlight && (
        <BookingModal
          selectedFlight={selectedFlight}
          searchParams={props.searchParams}
          passengerData={passengerData}
          onPassengerDataChange={setPassengerData}
          onConfirm={handleConfirmBooking}
          onClose={handleCloseModal}
          t={t}
        />
      )}
    </div>
  );
}
