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

  const handleCategorySelected = () => {
    // Close panel when category is clicked
    setHoverEnabled(false);
    setActiveIndex(null);

    // Re-enable hover after a short delay
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
        onCategoryClick={handleCategorySelected}
      />

      {/* Desktop subcategory panel - hidden on mobile */}
      {activeCategory && hoverEnabled && (
        <div
          className="hidden lg:block absolute left-full ml-2 min-w-175 max-w-200 xl:min-w-200 xl:max-w-225 rounded-3xl border-2 p-6 xl:p-8 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-left-6 duration-400 backdrop-blur-md"
          style={{
            background: `linear-gradient(145deg, ${colors.subcategoryPanel.background}f5 0%, ${colors.subcategoryPanel.background}e8 50%, ${colors.subcategoryPanel.background}dd 100%)`,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            boxShadow: `
              0 25px 80px -20px rgba(0,0,0,0.4),
              0 0 0 1px rgba(255,255,255,0.1) inset,
              0 2px 4px rgba(255,255,255,0.1) inset
            `,
            zIndex: 9999,
            ...(activeIndex !== null && activeIndex >= Math.floor(data.length / 2)
              ? { bottom: `${(data.length - 1 - activeIndex) * 48}px` }
              : { top: `${(activeIndex || 0) * 48}px` }),
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
          {/* Decorative top glow */}
          <div
            className="absolute top-0 left-0 right-0 h-32 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top, rgba(255,255,255,0.3) 0%, transparent 70%)`
            }}
          />

          <h3 className="mb-8 text-2xl font-bold text-white transition-all duration-300 flex items-center gap-3 relative z-10">
            <span className="flex flex-col gap-1">
              <span className="w-1.5 h-8 bg-white rounded-full shadow-lg"></span>
              <span className="w-1 h-4 bg-white/60 rounded-full"></span>
            </span>
            <span className="drop-shadow-lg">{categoryDisplayName}</span>
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
