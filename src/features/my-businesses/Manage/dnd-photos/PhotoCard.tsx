import { Trash2 } from "lucide-react";

interface PhotoCardProps {
  url: string;
  index?: number;
  isDragging?: boolean;
  onRemove?: () => void;
  showBadge?: boolean;
  label?: string;
}

export const PhotoCard = ({
  url,
  index,
  isDragging,
  onRemove,
  showBadge,
  label,
}: PhotoCardProps) => (
  <div
    className={`group relative w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm transition-all ${
      isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"
    }`}
  >
    <img src={url} alt="" className="w-full h-full object-cover" />

    {onRemove && (
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}

    {showBadge && typeof index === "number" && (
      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
        #{index + 1}
      </span>
    )}

    {label && (
      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
        {label}
      </span>
    )}
  </div>
);
