import { Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ListHotelsParams } from "../../../../agent/types";

interface HotelSearchInfoProps {
  searchParams: ListHotelsParams;
  nights: number;
  t: (key: string) => string;
}

/**
 * Badges informativos sobre a pesquisa de hotéis
 */
export function HotelSearchInfo({
  searchParams,
  nights,
  t,
}: HotelSearchInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-emerald-300/50">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {format(new Date(searchParams.checkin), "dd/MM")} -{" "}
          {format(new Date(searchParams.checkout), "dd/MM")}
        </span>
      </div>
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-blue-300/50">
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          {searchParams.rooms}{" "}
          {searchParams.rooms === 1
            ? t("hotels.list.room")
            : t("hotels.list.rooms")}
        </span>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border border-purple-300/50">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          {nights}{" "}
          {nights === 1 ? t("hotels.list.night") : t("hotels.list.nights")}
        </span>
      </div>
    </div>
  );
}
