import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  count?: number;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
  showValue = false,
  count,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= Math.round(rating);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starIndex)}
              className={cn(
                "transition-colors duration-150",
                interactive
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-default",
              )}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-slate-300",
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-slate-500">({count})</span>
      )}
    </div>
  );
}
