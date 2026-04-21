import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function CardImageSlider({
  images,
  alt,
  noPhotoLabel = "No photo",
  objectFit = "cover",
}: {
  images: string[];
  alt: string;
  noPhotoLabel?: string;
  objectFit?: "cover" | "contain";
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">{noPhotoLabel}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={images[activeIdx]}
            alt={`${alt} ${activeIdx + 1}`}
            className={`w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((p) => (p <= 0 ? images.length - 1 : p - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-swap-primary/40 hover:bg-swap-primary/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx((p) => (p >= images.length - 1 ? 0 : p + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-swap-primary/40 hover:bg-swap-primary/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(i);
                }}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIdx
                    ? "w-4 h-1.5 bg-swap-primary"
                    : "w-1.5 h-1.5 bg-swap-secondary"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
