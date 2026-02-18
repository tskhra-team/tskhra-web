import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import type { CategoryItem, Platform } from "./types";

interface SubcategoryViewProps {
  subcategories?: CategoryItem[];
  platform?: Platform;
}

export default function SubcategoryView({ subcategories, platform }: SubcategoryViewProps) {
  const { t } = useTranslation("categories");
  const [searchParams, setSearchParams] = useSearchParams();
  const colors = getPlatformColors(platform);

  if (!subcategories || subcategories.length === 0) {
    return <div className="text-sm text-gray-500">No subcategories available.</div>;
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    const category = searchParams.get("category");
    if (category) {
      setSearchParams({ category, subcategory: subcategoryName.toLowerCase() });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {subcategories.map((subcategory, index) => {
        const translationKey = categoryNameToKey[subcategory.name];
        const displayName = translationKey ? t(translationKey) : subcategory.name;

        return (
          <button
            key={subcategory.name}
            onClick={() => handleSubcategoryClick(subcategory.name)}
            className="group rounded-xl bg-white p-3 sm:p-4 transition-all duration-200 ease-in-out flex flex-col text-left cursor-pointer hover:shadow-lg animate-in fade-in slide-in-from-bottom-2"
            style={{
              borderColor: '#E5E7EB',
              animationDelay: `${index * 30}ms`,
              animationFillMode: 'backwards'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.active.background;
              e.currentTarget.style.borderColor = colors.active.icon;
              const heading = e.currentTarget.querySelector('h4');
              if (heading instanceof HTMLElement) {
                heading.style.color = colors.active.text;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#E5E7EB';
              const heading = e.currentTarget.querySelector('h4');
              if (heading instanceof HTMLElement) {
                heading.style.color = colors.inactive.text;
              }
            }}
          >
            {subcategory.imageUrl && (
              <div className="mb-2 sm:mb-3 flex-1 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={subcategory.imageUrl}
                  alt={displayName}
                  loading="lazy"
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            )}
            {subcategory.iconUrl && !subcategory.imageUrl && (
              <div className="mb-2 sm:mb-3 flex-1 flex items-center justify-center rounded-lg bg-gray-100 transition-transform duration-300 ease-in-out group-hover:scale-105">
                <img
                  src={subcategory.iconUrl}
                  alt=""
                  loading="lazy"
                  width={64}
                  height={64}
                  className="h-12 w-12 sm:h-16 sm:w-16"
                />
              </div>
            )}
            <h4
              className="text-xs sm:text-sm font-medium transition-colors duration-200"
              style={{ color: colors.inactive.text }}
            >
              {displayName}
            </h4>
          </button>
        );
      })}
    </div>
  );
}
