import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CategoryNav from "./CategoryNav";
import SubcategoryView from "./SubcategoryView";
import { categoryNameToKey } from "./categoryTranslations";
import type { Platform } from "./types";
import { useCategories } from "./useCategories";

export default function CategoriesLayout({ platform }: { platform: Platform }) {
  const { data, isLoading, error } = useCategories(platform);
  const { t } = useTranslation("categories");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Sync activeIndex with URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && data) {
      const index = data.findIndex(cat => cat.name.toLowerCase() === categoryParam.toLowerCase());
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [searchParams, data]);

  const activeCategory = useMemo(() => activeIndex !== null ? data?.[activeIndex] : null, [data, activeIndex]);

  if (isLoading) return <div className="p-6 text-sm">Loading…</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error.message}</div>;
  if (!data || data.length === 0) return <div className="p-6 text-sm">No categories.</div>;

  const translationKey = activeCategory?.name ? categoryNameToKey[activeCategory.name] : null;
  const categoryDisplayName = translationKey ? t(translationKey) : activeCategory?.name;

  const handleSelectCategory = (index: number | null, categoryName?: string) => {
    setActiveIndex(index);
    if (index !== null && categoryName) {
      setSearchParams({ category: categoryName.toLowerCase() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="relative z-10" onMouseLeave={() => setActiveIndex(null)}>
      <CategoryNav
        categories={data}
        activeIndex={activeIndex}
        onSelect={handleSelectCategory}
        categoryDisplayName={categoryDisplayName}
      />

      {/* Desktop subcategory panel - hidden on mobile */}
      {activeCategory && (
        <div className="hidden lg:block absolute left-full top-0 z-50 min-w-300 h-125 overflow-hidden rounded-2xl border bg-white p-10 shadow-2xl">
          <h3 className="mb-6 text-lg font-semibold">{categoryDisplayName}</h3>
          <SubcategoryView subcategories={activeCategory?.childItems} />
        </div>
      )}
    </div>
  );
}
