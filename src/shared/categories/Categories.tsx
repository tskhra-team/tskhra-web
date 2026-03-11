import { useEffect, useMemo, useRef, useState } from "react";
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
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const closeTimeoutRef = useRef<number | null>(null);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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
      // On desktop, set activeIndex for hover effect only if hover is enabled
      if (hoverEnabled) {
        setActiveIndex(index);
      }
    }
  };

  const handleSubcategorySelected = () => {
    // Temporarily disable hover and close panel
    setHoverEnabled(false);
    setActiveIndex(null);

    // Re-enable hover after a short delay (gives time for mouse to move away)
    setTimeout(() => {
      setHoverEnabled(true);
    }, 800);
  };

  return (
    <div
      className="relative left-1 sm:left-2 lg:left-10 z-50"
      onMouseLeave={() => {
        if (hoverEnabled) {
          // Delay closing to allow mouse to move to subcategory panel
          closeTimeoutRef.current = window.setTimeout(() => {
            setActiveIndex(null);
          }, 200);
        }
      }}
      onMouseEnter={() => {
        // Cancel delayed close if mouse re-enters
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }}
    >
      <CategoryNav
        categories={data}
        activeIndex={activeIndex}
        onSelect={handleSelectCategory}
        categoryDisplayName={categoryDisplayName}
        platform={platform}
      />

      {/* Desktop subcategory panel - hidden on mobile */}
      {activeCategory && hoverEnabled && (
        <div
          className="hidden lg:block absolute left-full top-0 min-w-175 h-126 overflow-hidden rounded-2xl border p-6 shadow-2xl xl:min-w-250 animate-in fade-in slide-in-from-left-4 duration-200"
          style={{
            backgroundColor: colors.subcategoryPanel.background,
            zIndex: 9999,
          }}
          onMouseEnter={() => {
            // Cancel any pending close timeout
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Close panel when leaving the subcategory panel area
            if (hoverEnabled) {
              setActiveIndex(null);
            }
          }}
        >
          <h3 className="mb-6 text-lg font-semibold text-white transition-opacity duration-300">
            {categoryDisplayName}
          </h3>
          <SubcategoryView
            subcategories={activeCategory?.childItems}
            platform={platform}
            categorySlug={activeCategory?.name.toLowerCase().replace(/\s+/g, '-')}
            onSubcategorySelect={handleSubcategorySelected}
          />
        </div>
      )}
    </div>
  );
}
