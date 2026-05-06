import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import { Package } from "lucide-react";

export default function ChainLinkNode({
  name,
  category,
  value,
  image,
}: {
  name: string;
  category: string;
  value: number | null;
  image?: string;
}) {
  return (
    <div className="shrink-0 w-36 rounded-xl border-2 bg-white overflow-hidden border-gray-200">
      <div className="h-20 w-full overflow-hidden bg-gray-50">
        {image ? (
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>

      <div className="p-2">
        <p className="text-xs font-semibold text-swap-text line-clamp-1">
          {name}
        </p>
        <p className="text-[10px] text-swap-text2 line-clamp-1 mt-0.5">
          {category}
        </p>
        {value != null && (
          <p className="text-[10px] font-bold mt-1 text-swap-magic-mid">
            {value} ₾
          </p>
        )}
      </div>
    </div>
  );
}
