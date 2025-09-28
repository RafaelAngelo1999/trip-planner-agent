import { MapPin } from "lucide-react";

interface EmptyHotelsStateProps {
  city: string;
  contextLanguage?: string;
  t: (key: string) => string;
}

/**
 * Estado vazio quando não há hotéis encontrados
 */
export function EmptyHotelsState({
  city,
  contextLanguage,
  t,
}: EmptyHotelsStateProps) {
  return (
    <div className="text-center py-16 px-8">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-blue-200/50">
        <MapPin className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {contextLanguage === "pt-BR"
          ? "Nenhum hotel encontrado"
          : "No hotels found"}
      </h3>
      <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
        {t("hotels.list.noHotelsFound")}{" "}
        {contextLanguage === "pt-BR" ? "em" : "in"}{" "}
        <span className="font-semibold text-blue-600">{city}</span>{" "}
        {contextLanguage === "pt-BR"
          ? "para as datas selecionadas."
          : "for the selected dates."}
      </p>
      <div className="mt-6 text-sm text-gray-500">
        {contextLanguage === "pt-BR"
          ? "Tente ajustar suas datas ou escolher outra cidade"
          : "Try adjusting your dates or choosing another city"}
      </div>
    </div>
  );
}
