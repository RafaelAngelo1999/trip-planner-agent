import { X, MapPin } from "lucide-react";

interface HotelHeaderProps {
  city: string;
  hotelsCount: number;
  onClose: () => void;
  t: (key: string) => string;
}

/**
 * Header premium da listagem de hotéis
 */
export function HotelHeader({
  city,
  hotelsCount,
  onClose,
  t,
}: HotelHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {t("hotels.list.hotelsIn")} {city}
            </h1>
            <p className="text-blue-100 text-xs mt-1 font-medium">
              {hotelsCount} {hotelsCount === 1 ? "hotel" : "hotéis"} encontrados
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-all duration-200 p-3 hover:bg-white/10 rounded-2xl backdrop-blur-sm"
        >
          <X className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
