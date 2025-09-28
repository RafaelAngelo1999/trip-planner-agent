import { MapPin } from "lucide-react";

interface LoadingHotelsStateProps {
  city: string;
  contextLanguage?: string;
  t: (key: string) => string;
}

/**
 * Estado de carregamento da busca de hotéis
 */
export function LoadingHotelsState({
  city,
  contextLanguage,
  t,
}: LoadingHotelsStateProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-4 text-blue-600">
        <div className="relative">
          <MapPin className="h-8 w-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>
        <div>
          <div className="text-xl font-bold">
            {t("common.loading")} {t("hotels.list.hotelsIn").toLowerCase()}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {contextLanguage === "pt-BR"
              ? `Buscando as melhores opções em ${city}`
              : `Searching best options in ${city}`}
          </div>
        </div>
      </div>
    </div>
  );
}
