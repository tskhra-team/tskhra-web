import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import type { CategoryItem, Platform } from "./types";

interface SubcategoryViewProps {
  subcategories?: CategoryItem[];
  platform?: Platform;
  categorySlug?: string;
  onSubcategorySelect?: () => void;
}

export default function SubcategoryView({ subcategories, platform, categorySlug, onSubcategorySelect }: SubcategoryViewProps) {
  const { t } = useTranslation("categories");
  const [searchParams, setSearchParams] = useSearchParams();
  const colors = getPlatformColors(platform);

  if (!subcategories || subcategories.length === 0) {
    return <div className="text-sm text-gray-500">No subcategories available.</div>;
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    const subcategorySlug = subcategoryName.toLowerCase().replace(/\s+/g, '-');
    setSearchParams({
      category: categorySlug || '',
      subcategory: subcategorySlug
    });

    // Close the panel on desktop after selection
    if (onSubcategorySelect) {
      onSubcategorySelect();
    }

    // Scroll to catalog on desktop (on mobile it's handled in Booking.tsx)
    if (window.innerWidth >= 1024) {
      setTimeout(() => {
        const catalogElement = document.querySelector('[data-catalog]');
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {subcategories.map((subcategory, index) => {
        const translationKey = categoryNameToKey[subcategory.name];
        const displayName = translationKey ? t(translationKey) : subcategory.name;
        const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
        const isActive = searchParams.get('subcategory') === subcategorySlug;

        return (
          <div
            key={subcategory.name}
            onClick={() => handleSubcategoryClick(subcategory.name)}
            className="group relative rounded-2xl bg-white p-4 sm:p-5 transition-all duration-500 ease-out flex flex-col text-left cursor-pointer hover:shadow-2xl animate-in fade-in slide-in-from-bottom-2 border overflow-hidden"
            style={{
              borderColor: isActive ? colors.active.icon : 'rgba(255, 255, 255, 0.4)',
              backgroundColor: isActive ? colors.active.background : 'rgba(255, 255, 255, 0.98)',
              animationDelay: `${index * 40}ms`,
              animationFillMode: 'backwards',
              transform: isActive ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
              boxShadow: isActive ? '0 10px 40px -10px rgba(0,0,0,0.3)' : '0 2px 8px -2px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = colors.active.background;
                e.currentTarget.style.borderColor = colors.active.icon;
                e.currentTarget.style.transform = 'scale(1.08) translateY(-8px) rotate(1deg)';
                e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(0,0,0,0.4)';
                const heading = e.currentTarget.querySelector('h4');
                if (heading instanceof HTMLElement) {
                  heading.style.color = colors.active.text;
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(0,0,0,0.1)';
                const heading = e.currentTarget.querySelector('h4');
                if (heading instanceof HTMLElement) {
                  heading.style.color = colors.inactive.text;
                }
              }
            }}
          >
            {/* Decorative corner accent */}
            <div
              className="absolute top-0 right-0 w-12 h-12 opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150"
              style={{
                background: `radial-gradient(circle at top right, ${colors.active.icon} 0%, transparent 70%)`
              }}
            />
            {/* Animated border shine effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, transparent 0%, ${colors.active.icon}15 50%, transparent 100%)`,
                animation: 'shimmer 2s ease-in-out infinite'
              }}
            />
            {subcategory.imageUrl && (
              <div className="relative mb-3 sm:mb-4 flex-1 overflow-hidden rounded-xl shadow-lg">
                <div
                  className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10"
                />
                <img
                  src={subcategory.imageUrl}
                  alt={displayName}
                  loading="lazy"
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-2 brightness-95 group-hover:brightness-110"
                />
              </div>
            )}
            {subcategory.iconUrl && !subcategory.imageUrl && (
              <div className="relative mb-3 sm:mb-4 flex-1 flex items-center justify-center rounded-xl bg-linear-to-br from-gray-50 to-gray-100 p-6 transition-all duration-700 ease-out group-hover:from-white group-hover:to-gray-50 shadow-inner">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${colors.active.icon} 0%, transparent 70%)`
                  }}
                />
                <img
                  src={subcategory.iconUrl}
                  alt=""
                  loading="lazy"
                  width={64}
                  height={64}
                  className="h-12 w-12 sm:h-16 sm:w-16 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 relative z-10 drop-shadow-md"
                />
              </div>
            )}
            <h4
              className="text-xs sm:text-sm font-semibold transition-all duration-300 relative z-10 tracking-wide"
              style={{ color: isActive ? colors.active.text : colors.inactive.text }}
            >
              {displayName}
            </h4>
            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${colors.active.icon} 50%, transparent 100%)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
