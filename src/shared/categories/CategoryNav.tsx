import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import SubcategoryView from "./SubcategoryView";
import type { CategoryItem, Platform } from "./types";

interface CategoryNavProps {
  categories: CategoryItem[];
  activeIndex: number | null;
  onSelect: (index: number | null) => void;
  categoryDisplayName?: string;
  platform?: Platform;
}

export default function CategoryNav({ categories, activeIndex, onSelect, categoryDisplayName, platform }: CategoryNavProps) {
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform);
  const [, setSearchParams] = useSearchParams();

  return (
    <nav className="w-full lg:w-64 rounded-2xl border p-4">
      <ul className="space-y-1">
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey ? t(translationKey) : category.name;
          const isActive = index === activeIndex;

          const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
          const categoryUrl = platform ? `/${platform}/category/${categorySlug}` : '#';

          return (
            <li key={category.name} className="lg:block ">
              {/* Desktop: Hover to show dropdown, Click to navigate */}
              <Link
                to={categoryUrl}
                onMouseEnter={() => onSelect(index)}
                onClick={(e) => {
                  e.preventDefault();

                  if (window.innerWidth < 1024) {
                    // On mobile, toggle accordion
                    onSelect(isActive ? null : index);
                  } else {
                    // On desktop, filter by category in the catalog
                    setSearchParams({ category: categorySlug });
                  }
                }}
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
              </Link>
              {isActive && category.childItems && (
                <div className="lg:hidden mt-2 p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="mb-4 text-sm font-semibold">{categoryDisplayName}</h3>
                  <SubcategoryView subcategories={category.childItems} platform={platform} categorySlug={categorySlug} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
