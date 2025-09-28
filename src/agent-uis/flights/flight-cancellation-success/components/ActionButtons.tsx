import { Button } from "../../../../components/ui/button";

interface ActionButtonsProps {
  onContinue: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

/**
 * Componente específico para os botões de ação do flight-cancellation-success
 * Este componente permanece na pasta do feature pois é específico para este fluxo
 */
export function ActionButtons({ onContinue, onClose, t }: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onContinue}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-lg"
      >
        ✨ {t("flight.cancellation.continue")}
      </Button>
      <Button
        onClick={onClose}
        variant="outline"
        className="flex-1 py-4 text-lg font-semibold rounded-xl hover:bg-slate-50 border-slate-300"
      >
        {t("flight.cancellation.close")}
      </Button>
    </div>
  );
}
