import { CheckCircle } from "lucide-react";

interface MinimalSuccessStateProps {
  t: (key: string) => string;
}

/**
 * Estado minimalista quando componente é fechado
 */
export function MinimalSuccessState({ t }: MinimalSuccessStateProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-4 text-green-600">
        <div className="relative">
          <CheckCircle className="h-8 w-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <div>
          <div className="text-xl font-bold">
            {t("flight.cancellation.completed")}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {t("flight.cancellation.success")}
          </div>
        </div>
      </div>
    </div>
  );
}
