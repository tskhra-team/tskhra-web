import { useTranslation } from "react-i18next";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import SubcategoryView from "./SubcategoryView";
import type { CategoryItem, Platform } from "./types";

interface CategoryNavProps {
  categories: CategoryItem[];
  activeIndex: number | null;
  onSelect: (index: number | null, categoryName?: string) => void;
  categoryDisplayName?: string;
  platform?: Platform;
}

export default function CategoryNav({ categories, activeIndex, onSelect, categoryDisplayName, platform }: CategoryNavProps) {
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform);

  return (
    <nav className="w-full lg:w-64 lg:h-125 rounded-2xl border  p-4 lg:overflow-hidden">
      <ul className="space-y-1">
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey ? t(translationKey) : category.name;
          const isActive = index === activeIndex;

          return (
            <li key={category.name} className="lg:block ">
              <button
                onMouseEnter={() => onSelect(index)}
                onClick={() => onSelect(isActive ? null : index, category.name)}
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-between"
                style={
                  isActive
                    ? {
                        backgroundColor: colors.active.background,
                        color: colors.active.text,
                      }
                    : {
                        color: colors.inactive.text,
                      }
                }
                onMouseOver={(e) => !isActive && (e.currentTarget.style.backgroundColor = colors.inactive.hover)}
                onMouseOut={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="flex items-center gap-3 cursor-pointer">
                  {category.icon && (
                    <category.icon
                      className="w-5 h-5 transition-colors duration-200"
                      style={{ color: isActive ? colors.active.icon : colors.inactive.icon }}
                    />
                  )}
                  {displayName}
                </span>
                <svg
                  className={`lg:hidden w-5 h-5 transition-transform duration-200 ease-in-out ${isActive ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isActive && category.childItems && (
                <div className="lg:hidden mt-2 p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="mb-4 text-sm font-semibold">{categoryDisplayName}</h3>
                  <SubcategoryView subcategories={category.childItems} platform={platform} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
