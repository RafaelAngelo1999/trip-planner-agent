interface ImportantNoteProps {
  message: string;
  className?: string;
}

/**
 * Componente específico para notas importantes nos componentes de voo
 * Este componente permanece na pasta do feature pois é específico para confirmações de voo
 */
export function ImportantNote({ message, className = "" }: ImportantNoteProps) {
  return (
    <div
      className={`bg-blue-50/30 border border-blue-200/50 rounded-xl p-3 ${className}`}
    >
      <p className="text-xs text-blue-700 text-center">📝 {message}</p>
    </div>
  );
}
