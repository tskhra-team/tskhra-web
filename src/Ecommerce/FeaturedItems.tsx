import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MOCK_FEATURED = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: 129.99,
    image: "https://picsum.photos/seed/headphones/400/400",
    boosted: true,
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    price: 299.99,
    image: "https://picsum.photos/seed/watch/400/400",
    boosted: true,
  },
  {
    id: 3,
    name: "Leather Backpack",
    price: 89.99,
    image: "https://picsum.photos/seed/backpack/400/400",
    boosted: false,
  },
  {
    id: 4,
    name: "Running Shoes Ultra",
    price: 159.99,
    image: "https://picsum.photos/seed/shoes/400/400",
    boosted: true,
  },
  {
    id: 5,
    name: "Portable Speaker",
    price: 79.99,
    image: "https://picsum.photos/seed/speaker/400/400",
    boosted: false,
  },
  {
    id: 6,
    name: "Ceramic Coffee Set",
    price: 49.99,
    image: "https://picsum.photos/seed/coffee/400/400",
    boosted: true,
  },
  {
    id: 7,
    name: "Fitness Tracker Band",
    price: 69.99,
    image: "https://picsum.photos/seed/fitness/400/400",
    boosted: false,
  },
  {
    id: 8,
    name: "Desk Lamp Modern",
    price: 44.99,
    image: "https://picsum.photos/seed/lamp/400/400",
    boosted: false,
  },
];

export default function FeaturedItems() {
  const { t } = useTranslation("ecommerce");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-14">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#0f0f2d] text-white text-xs font-semibold uppercase tracking-wider mb-3">
              {t("featured.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f0f2d] tracking-tight">
              {t("featured.title")}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-[#0f0f2d]/15 hover:bg-[#0f0f2d] hover:text-white transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-[#0f0f2d]/15 hover:bg-[#0f0f2d] hover:text-white transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {MOCK_FEATURED.map((item) => (
            <div
              key={item.id}
              className="group min-w-55 sm:min-w-65 cursor-pointer snap-start"
            >
              {/* Image */}
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#f5f5f7] mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.boosted && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#0f0f2d] text-white rounded-full text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {t("featured.boosted")}
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-[#0f0f2d] text-sm truncate">
                {item.name}
              </h3>
              <p className="text-[#0f0f2d] font-bold text-base mt-0.5">
                {item.price}$
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
