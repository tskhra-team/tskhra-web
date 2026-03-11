import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import type { CategoryItem, Platform } from "./types";

interface SubcategoryGridProps {
  subcategories: CategoryItem[];
  platform: Platform;
  categorySlug: string;
}

export default function SubcategoryGrid({
  subcategories,
  platform,
  categorySlug,
}: SubcategoryGridProps) {
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform);

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        {t('noSubcategories', { defaultValue: 'No subcategories available.' })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {subcategories.map((subcategory, index) => {
        const translationKey = categoryNameToKey[subcategory.name];
        const displayName = translationKey ? t(translationKey) : subcategory.name;
        const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');

        return (
          <Link
            key={subcategory.name}
            to={`/${platform}/category/${categorySlug}?tab=${subcategorySlug}`}
            className="group rounded-xl bg-white p-4 transition-all duration-200 ease-in-out flex flex-col text-left cursor-pointer hover:shadow-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDelay: `${index * 30}ms`,
              animationFillMode: 'backwards',
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
              <div className="mb-3 flex-1 overflow-hidden rounded-lg bg-gray-100">
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
              <div className="mb-3 flex-1 flex items-center justify-center rounded-lg bg-gray-100 transition-transform duration-300 ease-in-out group-hover:scale-105 h-32">
                <img
                  src={subcategory.iconUrl}
                  alt=""
                  loading="lazy"
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
              </div>
            )}
            <h4
              className="text-sm font-medium transition-colors duration-200 text-center"
              style={{ color: colors.inactive.text }}
            >
              {displayName}
            </h4>
          </Link>
        );
      })}
    </div>
  );
}
