import { Star } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Hotel } from "../../../../agent/types";
import { StarRating } from "./StarRating";
import { HotelPricing } from "./HotelPricing";
import { HotelPolicyTags } from "./HotelPolicyTags";

interface HotelCardProps {
  hotel: Hotel;
  nights: number;
  t: (key: string) => string;
}

/**
 * Card individual de hotel
 */
export function HotelCard({ hotel, nights, t }: HotelCardProps) {
  return (
    <div className="border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:-translate-y-1">
      {hotel.image && (
        <div className="w-full h-48 bg-gray-200 relative">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-gray-700">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight">
            {hotel.name}
          </h3>
          <div className="flex items-center justify-between">
            <StarRating rating={Math.floor(hotel.rating)} />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {hotel.rating.toFixed(1)}/5.0
            </span>
          </div>
        </div>

        <HotelPricing
          nightly={hotel.nightly}
          total={hotel.total}
          currency={hotel.currency}
          nights={nights}
          t={t}
        />

        <HotelPolicyTags policy={hotel.policy} t={t} />

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          disabled
        >
          {t("hotels.list.viewDetails")}
        </Button>
      </div>
    </div>
  );
}
