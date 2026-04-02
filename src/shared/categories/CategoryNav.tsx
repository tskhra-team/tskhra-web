import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "./categoryTranslations";
import { getPlatformColors } from "./platformColors";
import SubcategoryView from "./SubcategoryView";
import type { CategoryItem, Platform } from "./types";

interface CategoryNavProps {
  categories: CategoryItem[];
  activeIndex: number | null;
  onSelect: (index: number | null, itemElement?: HTMLElement) => void;
  categoryDisplayName?: string;
  platform?: Platform;
  onCategoryClick?: () => void;
}

export default function CategoryNav({
  categories,
  activeIndex,
  onSelect,
  categoryDisplayName,
  platform,
  onCategoryClick,
}: CategoryNavProps) {
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform);
  const [, setSearchParams] = useSearchParams();
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [categories, checkScroll]);

  const scroll = (direction: "up" | "down") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 200;
    el.scrollBy({
      top: direction === "down" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <nav className="w-full xl:w-64 rounded-2xl border p-4">
      {/* Scroll Up Arrow */}
      <button
        onClick={() => scroll("up")}
        className={`w-full py-2 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 cursor-pointer ${canScrollUp ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ color: colors.inactive.text }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <ul
        ref={scrollRef}
        onScroll={checkScroll}
        className="space-y-1 overflow-y-auto scrollbar-hide"
        style={{ maxHeight: "468px" }}
      >
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey
            ? t(translationKey)
            : category.name;
          const isActive = index === activeIndex;

          const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");
          const categoryUrl = platform
            ? `/${platform}/category/${categorySlug}`
            : "#";

          return (
            <li key={category.name} className="xl:block ">
              {/* Desktop: Hover to show dropdown, Click to navigate */}
              <Link
                to={categoryUrl}
                onMouseEnter={(e) => onSelect(index, e.currentTarget)}
                onClick={(e) => {
                  e.preventDefault();

                  if (window.innerWidth < 1280) {
                    // On mobile, toggle accordion
                    onSelect(isActive ? null : index, e.currentTarget);
                  } else {
                    // On desktop, filter by category in the catalog
                    setSearchParams({ category: categorySlug });
                    // Close the subcategory panel
                    if (onCategoryClick) {
                      onCategoryClick();
                    }
                    // Scroll to catalog
                    setTimeout(() => {
                      const catalogElement =
                        document.querySelector("[data-catalog]");
                      if (catalogElement) {
                        catalogElement.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100);
                  }
                }}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-between ${isActive ? "shadow-sm" : ""}`}
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
                onMouseOver={(e) =>
                  !isActive &&
                  (e.currentTarget.style.backgroundColor =
                    colors.inactive.hover)
                }
                onMouseOut={(e) =>
                  !isActive &&
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span className="flex items-center gap-3 cursor-pointer">
                  {category.iconUrl ? (
                    <img
                      src={category.iconUrl}
                      alt=""
                      className="w-5 h-5 transition-all duration-200 object-contain"
                      style={{
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />
                  ) : category.icon ? (
                    <category.icon
                      className="w-5 h-5 transition-colors duration-200"
                      style={{
                        color: isActive
                          ? colors.active.icon
                          : colors.inactive.icon,
                      }}
                    />
                  ) : null}
                  {displayName}
                </span>
                <svg
                  className={`xl:hidden w-5 h-5 transition-transform duration-200 ease-in-out ${isActive ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
              {/* Accordion content with smooth height animation */}
              {category.childItems && (
                <div
                  className="xl:hidden overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out grid"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                  }}
                >
                  <div className="min-h-0">
                    <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                      <h3
                        className="mb-4 text-sm font-semibold"
                        style={{ color: colors.active.text }}
                      >
                        {categoryDisplayName}
                      </h3>
                      <SubcategoryView
                        subcategories={category.childItems}
                        platform={platform}
                        categorySlug={categorySlug}
                      />
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Scroll Down Arrow */}
      <button
        onClick={() => scroll("down")}
        className={`w-full py-2 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 cursor-pointer ${canScrollDown ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ color: colors.inactive.text }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </nav>
  );
}
