import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import type { CategoryItem, Platform } from "./types";

interface SubcategoryViewProps {
  subcategories?: CategoryItem[];
  platform?: Platform;
  categorySlug?: string;
  categoryId?: number;
  onSubcategorySelect?: () => void;
  level?: number;
}

export default function SubcategoryView({ subcategories, platform, categorySlug, categoryId, onSubcategorySelect, level = 0 }: SubcategoryViewProps) {
  const { t } = useTranslation("categories");
  const [searchParams, setSearchParams] = useSearchParams();
  const colors = getPlatformColors(platform);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  if (!subcategories || subcategories.length === 0) {
    return <div className="text-sm text-gray-500">No subcategories available.</div>;
  }

  const handleSubcategoryClick = (subcategory: CategoryItem) => {
    // If it has children, toggle expansion instead of filtering
    if (subcategory.childItems && subcategory.childItems.length > 0) {
      setExpandedSubcategory(expandedSubcategory === subcategory.name ? null : subcategory.name);
      return;
    }

    // Otherwise, apply filter using IDs for language-independent matching
    setSearchParams({
      category: String(categoryId || ''),
      subcategory: String(subcategory.id || '')
    });

    // Close the panel on desktop after selection
    if (onSubcategorySelect) {
      onSubcategorySelect();
    }

    // Scroll to catalog on desktop (on mobile it's handled in Booking.tsx)
    if (window.innerWidth >= 1280) {
      setTimeout(() => {
        const catalogElement = document.querySelector('[data-catalog]');
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const gridCols = level === 0 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  const hasChildren = (item: CategoryItem) => item.childItems && item.childItems.length > 0;

  return (
    <div className="space-y-4">
      <div className={`grid ${gridCols} gap-2 sm:gap-3 xl:gap-4`}>
        {subcategories.map((subcategory, index) => {
          const translationKey = categoryNameToKey[subcategory.name];
          const displayName = translationKey ? t(translationKey) : subcategory.name;
          const isActive = searchParams.get('subcategory') === String(subcategory.id);
          const isExpanded = expandedSubcategory === subcategory.name;
          const hasSubItems = hasChildren(subcategory);

          return (
            <div key={subcategory.name} className="space-y-2">
              <div
                onClick={() => handleSubcategoryClick(subcategory)}
                className="group relative rounded-2xl bg-white px-2 py-2 sm:px-3 sm:py-3 min-h-28 transition-all duration-500 ease-out flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-2xl animate-in fade-in slide-in-from-bottom-2 border overflow-hidden"
                style={{
                  borderColor: isActive || isExpanded ? colors.active.icon : 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: isActive || isExpanded ? colors.active.background : 'rgba(255, 255, 255, 0.98)',
                  animationDelay: `${index * 40}ms`,
                  animationFillMode: 'backwards',
                  boxShadow: isActive || isExpanded ? '0 4px 16px -4px rgba(0,0,0,0.2)' : '0 1px 4px -1px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isExpanded) {
                    e.currentTarget.style.backgroundColor = colors.active.background;
                    e.currentTarget.style.borderColor = colors.active.icon;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(0,0,0,0.2)';
                    const heading = e.currentTarget.querySelector('h4');
                    if (heading instanceof HTMLElement) {
                      heading.style.color = colors.active.text;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isExpanded) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 4px -1px rgba(0,0,0,0.08)';
                    const heading = e.currentTarget.querySelector('h4');
                    if (heading instanceof HTMLElement) {
                      heading.style.color = colors.inactive.text;
                    }
                  }
                }}
              >
                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-12 h-12 opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150"
                  style={{
                    background: `radial-gradient(circle at top right, ${colors.active.icon} 0%, transparent 70%)`
                  }}
                />
                {/* Animated border shine effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, transparent 0%, ${colors.active.icon}15 50%, transparent 100%)`,
                    animation: 'shimmer 2s ease-in-out infinite'
                  }}
                />
                <div className="flex flex-col items-center gap-1.5">
                  {subcategory.imageUrl && (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-xl shadow-lg shrink-0">
                      <div
                        className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10"
                      />
                      <img
                        src={subcategory.imageUrl}
                        alt={displayName}
                        loading="lazy"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 brightness-95 group-hover:brightness-110"
                      />
                    </div>
                  )}
                  {subcategory.iconUrl && !subcategory.imageUrl && (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-linear-to-br from-gray-50 to-gray-100 transition-all duration-700 ease-out group-hover:from-white group-hover:to-gray-50 shadow-inner shrink-0">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle, ${colors.active.icon} 0%, transparent 70%)`
                        }}
                      />
                      <img
                        src={subcategory.iconUrl}
                        alt=""
                        loading="lazy"
                        width={32}
                        height={32}
                        className="h-6 w-6 sm:h-8 sm:w-8 transition-all duration-700 group-hover:scale-110 relative z-10 drop-shadow-md"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <h4
                      className="text-[10px] sm:text-[11px] xl:text-xs font-semibold transition-all duration-300 relative z-10 leading-tight break-normal whitespace-normal"
                      style={{ color: isActive || isExpanded ? colors.active.text : colors.inactive.text }}
                    >
                      {displayName}
                    </h4>
                    {hasSubItems && (
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: isActive || isExpanded ? colors.active.text : colors.inactive.text }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colors.active.icon} 50%, transparent 100%)`
                  }}
                />
              </div>

              {/* Nested subcategories with smooth height animation */}
              {hasSubItems && (
                <div
                  className="overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out grid"
                  style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <div
                      className="ml-2 sm:ml-4 pl-2 sm:pl-4 mt-2 border-l-2"
                      style={{ borderColor: colors.active.icon }}
                    >
                      <SubcategoryView
                        subcategories={subcategory.childItems}
                        platform={platform}
                        categorySlug={categorySlug}
                        onSubcategorySelect={onSubcategorySelect}
                        level={level + 1}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
