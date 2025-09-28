import { Button } from "../../../../components/ui/button";

interface BookingModalButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isDisabled: boolean;
  t: (key: string) => string;
}

/**
 * Componente específico para os botões do modal de booking
 */
export function BookingModalButtons({
  onCancel,
  onConfirm,
  isDisabled,
  t,
}: BookingModalButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onCancel}
        variant="outline"
        className="flex-1 py-3 text-sm font-semibold rounded-xl border-slate-300 hover:bg-slate-50"
      >
        {t("flight.list.cancel")}
      </Button>
      <Button
        onClick={onConfirm}
        disabled={isDisabled}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        ✈️ {t("flight.list.confirm")}
      </Button>
    </div>
  );
}
