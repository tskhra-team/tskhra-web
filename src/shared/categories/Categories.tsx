import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryNav from "./CategoryNav";
import SubcategoryView from "./SubcategoryView";
import { categoryNameToKey } from "./categoryTranslations";
import type { Platform } from "./types";
import { useCategories } from "./useCategories";

export default function CategoriesLayout({ platform }: { platform: Platform }) {
  const { data, isLoading, error } = useCategories(platform);
  const { t } = useTranslation("categories");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeCategory = useMemo(() => activeIndex !== null ? data?.[activeIndex] : null, [data, activeIndex]);

  if (isLoading) return <div className="p-6 text-sm">Loading…</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error.message}</div>;
  if (!data || data.length === 0) return <div className="p-6 text-sm">No categories.</div>;

  const translationKey = activeCategory?.name ? categoryNameToKey[activeCategory.name] : null;
  const categoryDisplayName = translationKey ? t(translationKey) : activeCategory?.name;

  return (
    <div className="relative z-10" onMouseLeave={() => setActiveIndex(null)}>
      <CategoryNav
        categories={data}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />

      {activeCategory && (
        <div className="absolute left-full top-0 z-50 min-w-300 h-125 overflow-hidden rounded-2xl border bg-white p-10 shadow-2xl">
          <h3 className="mb-6 text-lg font-semibold">{categoryDisplayName}</h3>
          <SubcategoryView subcategories={activeCategory?.childItems} />
        </div>
      )}
    </div>
  );
}
