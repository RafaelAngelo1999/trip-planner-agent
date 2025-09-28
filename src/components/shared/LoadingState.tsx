import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: {
    spinner: "w-4 h-4",
    text: "text-sm",
  },
  md: {
    spinner: "w-6 h-6",
    text: "text-base",
  },
  lg: {
    spinner: "w-8 h-8",
    text: "text-lg",
  },
};

/**
 * Componente para exibir estado de carregamento
 */
export function LoadingState({
  message = "Carregando...",
  size = "md",
  className = "",
}: LoadingStateProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2
        className={`animate-spin ${config.spinner}`}
        aria-hidden="true"
      />
      <span className={`text-gray-600 ${config.text}`}>{message}</span>
    </div>
  );
}
