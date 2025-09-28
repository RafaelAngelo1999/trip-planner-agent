import { CheckCircle } from "lucide-react";

interface BookingHeaderProps {
  t: (key: string) => string;
}

/**
 * Header de confirmação de reserva de voo
 */
export function BookingHeader({ t }: BookingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {t("flight.booking.confirmed")}
          </h1>
          <p className="text-blue-100 text-sm mt-0.5 font-medium">
            {t("flight.booking.guaranteed")}
          </p>
        </div>
      </div>
    </div>
  );
}
