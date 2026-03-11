import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CategoryNav from "./CategoryNav";
import CategorySkeleton from "./CategorySkeleton";
import SubcategoryView from "./SubcategoryView";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import type { Platform } from "./types";
import { useCategories } from "./useCategories";

export default function CategoriesLayout({ platform }: { platform: Platform }) {
  const { data, isLoading, error } = useCategories(platform);
  const { t } = useTranslation("categories");
  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const colors = getPlatformColors(platform);

  // Sync activeIndex with URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && data) {
      const index = data.findIndex(
        (cat) => cat.name.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [searchParams, data]);

  const activeCategory = useMemo(
    () => (activeIndex !== null ? data?.[activeIndex] : null),
    [data, activeIndex],
  );

  if (isLoading) return <CategorySkeleton />;
  if (error)
    return <div className="p-6 text-sm text-red-600">{error.message}</div>;
  if (!data || data.length === 0)
    return <div className="p-6 text-sm">No categories.</div>;

  const translationKey = activeCategory?.name
    ? categoryNameToKey[activeCategory.name]
    : null;
  const categoryDisplayName = translationKey
    ? t(translationKey)
    : activeCategory?.name;

  const handleSelectCategory = (
    index: number | null,
  ) => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // On mobile, just toggle accordion - don't set search params yet
      setActiveIndex(index);
    } else {
      // On desktop, set activeIndex for hover effect
      setActiveIndex(index);
    }
  };

  return (
    <div
      className="relative left-1 sm:left-2 lg:left-10 z-50"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <CategoryNav
        categories={data}
        activeIndex={activeIndex}
        onSelect={handleSelectCategory}
        categoryDisplayName={categoryDisplayName}
        platform={platform}
      />

      {/* Desktop subcategory panel - hidden on mobile */}
      {activeCategory && (
        <div
          className="hidden lg:block absolute left-full top-0 min-w-175 h-126 overflow-hidden rounded-2xl border p-6 shadow-2xl xl:min-w-250 animate-in fade-in slide-in-from-left-4 duration-200"
          style={{
            backgroundColor: colors.subcategoryPanel.background,
            zIndex: 9999,
          }}
        >
          <h3 className="mb-6 text-lg font-semibold text-white transition-opacity duration-300">
            {categoryDisplayName}
          </h3>
          <SubcategoryView
            subcategories={activeCategory?.childItems}
            platform={platform}
            categorySlug={activeCategory?.name.toLowerCase().replace(/\s+/g, '-')}
            onSubcategorySelect={() => setActiveIndex(null)}
          />
        </div>
      )}
    </div>
  );
}
