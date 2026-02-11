import { useTranslation } from "react-i18next";
import type { CategoryItem } from "./types";
import { categoryNameToKey } from "./categoryTranslations";

interface SubcategoryViewProps {
  subcategories?: CategoryItem[];
}

export default function SubcategoryView({ subcategories }: SubcategoryViewProps) {
  const { t } = useTranslation("categories");

  if (!subcategories || subcategories.length === 0) {
    return <div className="text-sm text-gray-500">No subcategories available.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {subcategories.map((subcategory) => {
        const translationKey = categoryNameToKey[subcategory.name];
        const displayName = translationKey ? t(translationKey) : subcategory.name;

        return (
          <a
            key={subcategory.name}
            href={subcategory.url || "#"}
            className="group rounded-xl border bg-white p-4 transition-all hover:shadow-md h-50 flex flex-col"
          >
            {subcategory.imageUrl && (
              <div className="mb-3 flex-1 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={subcategory.imageUrl}
                  alt={displayName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            {subcategory.iconUrl && !subcategory.imageUrl && (
              <div className="mb-3 flex-1 flex items-center justify-center rounded-lg bg-gray-100">
                <img src={subcategory.iconUrl} alt="" className="h-16 w-16" />
              </div>
            )}
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
              {displayName}
            </h4>
          </a>
        );
      })}
    </div>
  );
}
