import { Copy } from "lucide-react";
import { useClipboard } from "../../hooks";

interface PNRDisplayProps {
  pnr: string;
  label?: string;
  className?: string;
}

/**
 * Componente para exibir PNR com funcionalidade de cópia
 */
export function PNRDisplay({
  pnr,
  label = "PNR",
  className = "",
}: PNRDisplayProps) {
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(pnr);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${className}`}
    >
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-mono text-lg font-bold">{pnr}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        aria-label={`Copiar ${label} ${pnr}`}
      >
        <Copy size={16} />
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
