import { XCircle } from "lucide-react";

interface CancelButtonProps {
  onCancel: () => void;
  pnr: string;
  t: (key: string) => string;
}

/**
 * Botão de cancelamento da reserva
 */
export function CancelButton({ onCancel, pnr, t }: CancelButtonProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-sm flex items-center justify-center gap-2"
        aria-label={`${t("flight.booking.cancel")} - PNR: ${pnr}`}
      >
        <XCircle className="h-4 w-4" aria-hidden="true" />
        {t("flight.booking.cancel")}
      </button>
    </div>
  );
}
