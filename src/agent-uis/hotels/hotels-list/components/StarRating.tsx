import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  showNumeric?: boolean;
}

/**
 * Componente de avaliação por estrelas para hotéis
 */
export function StarRating({ rating, showNumeric = false }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${
          i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />,
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">{stars}</div>
      {showNumeric && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {rating.toFixed(1)}/5.0
        </span>
      )}
    </div>
  );
}
