import { useTranslation } from "react-i18next";
import type { CategoryItem } from "./types";
import { categoryNameToKey } from "./categoryTranslations";
import SubcategoryView from "./SubcategoryView";

interface CategoryNavProps {
  categories: CategoryItem[];
  activeIndex: number | null;
  onSelect: (index: number | null, categoryName?: string) => void;
  categoryDisplayName?: string;
}

export default function CategoryNav({ categories, activeIndex, onSelect, categoryDisplayName }: CategoryNavProps) {
  const { t } = useTranslation("categories");

  return (
    <nav className="w-full lg:w-64 lg:h-125 rounded-2xl border bg-white p-4 lg:overflow-hidden">
      <ul className="space-y-1">
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey ? t(translationKey) : category.name;
          const isActive = index === activeIndex;

          return (
            <li key={category.name} className="lg:block">
              <button
                onMouseEnter={() => onSelect(index)}
                onClick={() => onSelect(isActive ? null : index, category.name)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{displayName}</span>
                <svg
                  className={`lg:hidden w-5 h-5 transition-transform ${isActive ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isActive && category.childItems && (
                <div className="lg:hidden mt-2 p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-4 text-sm font-semibold">{categoryDisplayName}</h3>
                  <SubcategoryView subcategories={category.childItems} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
