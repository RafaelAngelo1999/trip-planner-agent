import { User, Mail } from "lucide-react";

interface PassengerInfoProps {
  passenger: {
    fullName: string;
    email: string;
  };
  t: (key: string) => string;
}

/**
 * Componente específico para exibir informações do passageiro
 * Este componente permanece na pasta do feature pois é específico para confirmação de reserva
 */
export function PassengerInfo({ passenger, t }: PassengerInfoProps) {
  return (
    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        {t("flight.booking.passenger")}
      </h3>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-blue-500" />
          <span className="font-medium text-sm">{passenger.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 text-blue-500" />
          <span className="text-gray-600 text-sm">{passenger.email}</span>
        </div>
      </div>
    </div>
  );
}
