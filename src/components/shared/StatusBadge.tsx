import { ComponentType } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  LucideProps,
} from "lucide-react";

export type StatusType = "success" | "error" | "pending" | "warning";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  description?: string;
  icon?: ComponentType<LucideProps>;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    iconColor: "text-green-600",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    iconColor: "text-red-600",
  },
  pending: {
    icon: Clock,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    iconColor: "text-yellow-600",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    iconColor: "text-orange-600",
  },
};

/**
 * Componente para exibir status com ícone e cores apropriadas
 */
export function StatusBadge({
  status,
  text,
  description,
  icon,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = icon || config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${className}`}
    >
      <IconComponent
        size={20}
        className={config.iconColor}
        aria-hidden="true"
      />
      <div>
        <span className={`font-medium ${config.textColor}`}>{text}</span>
        {description && (
          <p className={`text-sm ${config.textColor} opacity-80`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
