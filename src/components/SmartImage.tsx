import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResSrc?: string; // Ссылка на сжатую копию (thumbnail)
  containerClassName?: string; // Стили для внешнего div
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  lowResSrc,
  alt = "",
  className,
  containerClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Сбрасываем состояние, если src меняется динамически
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", containerClassName)}
    >
      {/* 1. Слой: Заглушка (низкое качество или размытый оригинал) */}
      {/* Скрываем полностью только когда оригинал готов (isLoaded) */}
      {!isLoaded && (src || lowResSrc) && (
        <img
          src={lowResSrc || src}
          alt={alt}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover blur-lg scale-110 transition-opacity duration-500",
            className,
          )}
        />
      )}

      {/* 2. Слой: Оригинальное изображение */}
      <img
        {...props}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "relative h-full w-full object-cover transition-opacity duration-700 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
};
