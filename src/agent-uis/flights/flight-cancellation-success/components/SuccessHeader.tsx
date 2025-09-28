import { CheckCircle, X } from "lucide-react";

interface SuccessHeaderProps {
  onClose: () => void;
  t: (key: string) => string;
}

/**
 * Header de sucesso do cancelamento
 */
export function SuccessHeader({ onClose, t }: SuccessHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              ✅ {t("flight.cancellation.confirmed")}
            </h1>
            <p className="text-green-100 text-xs mt-1 font-medium">
              {t("flight.cancellation.success")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-xl backdrop-blur-sm"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
