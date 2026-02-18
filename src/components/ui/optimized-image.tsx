import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

const aspectRatioClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className = "",
  aspectRatio,
  fallbackSrc = "/default-image.png",
  showPlaceholder = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const containerClass = aspectRatio
    ? `${aspectRatioClasses[aspectRatio]} relative overflow-hidden`
    : "relative";

  return (
    <div className={containerClass}>
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      />
    </div>
  );
}
