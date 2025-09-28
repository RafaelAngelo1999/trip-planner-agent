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
import { Hotel, ListHotelsParams } from "../../../agent/types";
import { useI18n, extractLanguageFromContext } from "../../../hooks/useI18n";
import {
  EmptyHotelsState,
  HotelCard,
  HotelHeader,
  HotelSearchInfo,
  LoadingHotelsState,
} from "./components";

interface HotelsListProps {
  toolCallId: string;
  hotels: Hotel[];
  searchParams: ListHotelsParams;
}

export default function HotelsList(props: HotelsListProps) {
  const _thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { ui: UIMessage | undefined } }
  >();
  const contextLanguage = extractLanguageFromContext(_thread?.values);
  const { t } = useI18n(contextLanguage);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Mostra resultados após um pequeno delay para melhor UX
    const timer = setTimeout(() => setShowResults(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const calculateNights = () => {
    const checkinDate = new Date(props.searchParams.checkin);
    const checkoutDate = new Date(props.searchParams.checkout);
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleClose = () => {
    setShowResults(false);
  };

  if (!showResults) {
    return (
      <LoadingHotelsState
        city={props.searchParams.city}
        contextLanguage={contextLanguage || undefined}
        t={t}
      />
    );
  }

  const nights = calculateNights();

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-7xl mx-auto overflow-hidden">
      {/* Header usando componente */}
      <HotelHeader
        city={props.searchParams.city}
        hotelsCount={props.hotels.length}
        onClose={handleClose}
        t={t}
      />

      <div className="p-2">
        <HotelSearchInfo
          searchParams={props.searchParams}
          nights={nights}
          t={t}
        />

        {props.hotels.length === 0 ? (
          <EmptyHotelsState
            city={props.searchParams.city}
            contextLanguage={contextLanguage || undefined}
            t={t}
          />
        ) : (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {props.hotels.map((hotel) => (
                <CarouselItem
                  key={hotel.hotelId}
                  className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-[31%]"
                >
                  <HotelCard hotel={hotel} nights={nights} t={t} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/90 backdrop-blur-sm border-2 border-blue-200 text-blue-600 hover:bg-blue-50 shadow-lg" />
            <CarouselNext className="right-2 bg-white/90 backdrop-blur-sm border-2 border-blue-200 text-blue-600 hover:bg-blue-50 shadow-lg" />
          </Carousel>
        )}
      </div>
    </div>
  );
}
