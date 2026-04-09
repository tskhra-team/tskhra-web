import { Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const MOCK_RECENT = [
  {
    id: 1,
    name: "Vintage Camera Collection",
    price: 249.99,
    image: "https://picsum.photos/seed/camera/400/400",
    seller: "PhotoVintage",
    minutesAgo: 12,
  },
  {
    id: 2,
    name: "Handmade Ceramic Vase",
    price: 34.99,
    image: "https://picsum.photos/seed/vase/400/400",
    seller: "ArtisanCraft",
    minutesAgo: 25,
  },
  {
    id: 3,
    name: "Mechanical Keyboard RGB",
    price: 149.99,
    image: "https://picsum.photos/seed/keyboard/400/400",
    seller: "TechGear",
    minutesAgo: 38,
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 39.99,
    image: "https://picsum.photos/seed/yoga/400/400",
    seller: "FitLife",
    minutesAgo: 45,
  },
  {
    id: 5,
    name: "Organic Tea Set",
    price: 28.99,
    image: "https://picsum.photos/seed/tea/400/400",
    seller: "NaturalGoods",
    minutesAgo: 60,
  },
  {
    id: 6,
    name: "Canvas Art Print",
    price: 59.99,
    image: "https://picsum.photos/seed/art/400/400",
    seller: "GalleryOne",
    minutesAgo: 90,
  },
  {
    id: 7,
    name: "Bamboo Desk Organizer",
    price: 24.99,
    image: "https://picsum.photos/seed/bamboo/400/400",
    seller: "EcoHome",
    minutesAgo: 120,
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    price: 19.99,
    image: "https://picsum.photos/seed/bottle/400/400",
    seller: "HydroLife",
    minutesAgo: 180,
  },
];

function formatTime(
  minutes: number,
  t: ReturnType<typeof useTranslation>["t"]
) {
  if (minutes < 60) return t("recent.timeAgo.minutes", { count: minutes });
  if (minutes < 1440)
    return t("recent.timeAgo.hours", { count: Math.floor(minutes / 60) });
  return t("recent.timeAgo.days", { count: Math.floor(minutes / 1440) });
}

export default function RecentlyAdded() {
  const { t } = useTranslation("ecommerce");

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-14 bg-[#f8f8fa]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#0f0f2d] text-white text-xs font-semibold uppercase tracking-wider mb-3">
              {t("recent.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f0f2d] tracking-tight">
              {t("recent.title")}
            </h2>
          </div>

          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0f0f2d]/15 text-[#0f0f2d] text-sm font-semibold hover:bg-[#0f0f2d] hover:text-white transition-colors duration-200 group">
            {t("recent.viewAll")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_RECENT.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Time badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-[#0f0f2d]/80 backdrop-blur-sm text-white rounded-full text-[11px] font-medium">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.minutesAgo, t)}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-[#0f0f2d] text-sm truncate">
                {item.name}
              </h3>
              <p className="text-[#0f0f2d]/50 text-xs mt-0.5">@{item.seller}</p>
              <p className="text-[#0f0f2d] font-bold text-base mt-1">
                {item.price}$
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
