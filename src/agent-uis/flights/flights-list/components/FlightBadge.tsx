interface FlightBadgeProps {
  type: "direct" | "connections" | "baggage-included" | "baggage-not-included";
  stops?: number;
  text: string;
}

/**
 * Componente específico para badges de informações de voo
 */
export function FlightBadge({ type, text }: FlightBadgeProps) {
  const getBadgeStyles = () => {
    switch (type) {
      case "direct":
        return "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300/50";
      case "connections":
        return "bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border-orange-300/50";
      case "baggage-included":
        return "bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 border-blue-300/50";
      case "baggage-not-included":
        return "bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300/50";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "direct":
        return "🎯";
      case "connections":
        return "🔄";
      case "baggage-included":
        return "🧳";
      case "baggage-not-included":
        return "⚠️";
      default:
        return "";
    }
  };

  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md border ${getBadgeStyles()}`}
    >
      {getIcon()} {text}
    </div>
  );
}
