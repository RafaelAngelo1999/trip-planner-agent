interface HotelPolicyTagsProps {
  policy: string;
  t: (key: string) => string;
}

// Função simplificada para verificar se tem cancelamento gratuito
const hasFreeCancellation = (policy: string) => {
  return (
    policy.toLowerCase().includes("cancelamento gratuito") ||
    policy.toLowerCase().includes("free cancellation")
  );
};

// Função para verificar se o hotel tem café da manhã
const hasBreakfast = (policy: string) => {
  return (
    policy.toLowerCase().includes("café da manhã") ||
    policy.toLowerCase().includes("breakfast")
  );
};

/**
 * Tags e políticas do hotel
 */
export function HotelPolicyTags({ policy, t }: HotelPolicyTagsProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {hasBreakfast(policy) && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200 shadow-sm">
            ☕ {t("hotels.list.breakfast")}
          </div>
        )}

        {hasFreeCancellation(policy) && (
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-200 shadow-sm">
            🔄 {t("hotels.list.freeCancellation")}
          </div>
        )}
      </div>

      {/* Política completa colapsada */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-medium">
          {t("hotels.list.viewFullPolicy")}
        </summary>
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-md p-3 border-l-2 border-gray-200">
          {policy}
        </div>
      </details>
    </div>
  );
}
