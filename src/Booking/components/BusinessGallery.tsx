import { SmartImage } from "@/components/SmartImage";

type BusinessGalleryProps = {
  allImages: string[];
  currentImageIndex: number;
  businessName: string;
  onImageClick: (index: number) => void;
};

export default function BusinessGallery({
  allImages,
  currentImageIndex,
  businessName,
  onImageClick,
}: BusinessGalleryProps) {
  return (
    <>
      {/* Main Image Display */}
      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/50">
        <SmartImage
          src={allImages[currentImageIndex]}
          alt={businessName}
          containerClassName="aspect-video w-full rounded-lg"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((url: string, index: number) => (
            <div
              key={index}
              onClick={() => onImageClick(index)}
              className={`aspect-video overflow-hidden rounded-xl shadow-md transition-all duration-300 cursor-pointer group ${
                currentImageIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-1 ring-border/50 hover:ring-primary/50"
              }`}
            >
              <SmartImage
                src={url}
                alt={`Gallery ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                containerClassName="aspect-video w-full rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
