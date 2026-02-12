import { useTranslation } from "react-i18next";
import type { CategoryItem } from "./types";
import { categoryNameToKey } from "./categoryTranslations";

interface CategoryNavProps {
  categories: CategoryItem[];
  activeIndex: number | null;
  onSelect: (index: number | null, categoryName?: string) => void;
}

export default function CategoryNav({ categories, activeIndex, onSelect }: CategoryNavProps) {
  const { t } = useTranslation("categories");

  return (
    <nav className="w-64 h-125 rounded-2xl border bg-white p-4 overflow-hidden">
      <ul className="space-y-1">
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey ? t(translationKey) : category.name;

          return (
            <li key={category.name}>
              <button
                onMouseEnter={() => onSelect(index)}
                onClick={() => onSelect(index, category.name)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  index === activeIndex
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {displayName}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
