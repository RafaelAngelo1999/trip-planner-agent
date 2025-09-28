interface RefundInfoProps {
  amount: string;
  method?: string;
  timeframe?: string;
  className?: string;
}

/**
 * Componente para exibir informações de reembolso
 */
export function RefundInfo({
  amount,
  method = "cartão de crédito original",
  timeframe = "5-7 dias úteis",
  className = "",
}: RefundInfoProps) {
  return (
    <div
      className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}
    >
      <h3 className="font-medium text-green-800 mb-2">
        Informações do Reembolso
      </h3>
      <div className="space-y-2 text-sm text-green-700">
        <p>
          <span className="font-medium">Valor:</span> {amount}
        </p>
        <p>
          <span className="font-medium">Método:</span> {method}
        </p>
        <p>
          <span className="font-medium">Prazo:</span> {timeframe}
        </p>
      </div>
    </div>
  );
}
