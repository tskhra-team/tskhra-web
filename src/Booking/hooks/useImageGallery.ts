import { useState } from "react";

export const useImageGallery = (images: string[]) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
    }
  };

  return {
    currentImageIndex,
    handleImageClick,
  };
};
