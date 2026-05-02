import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import { useCategories } from "@/shared/categories/useCategories";
import useGetSubEcommerceCategories from "@/shared/api/useGetSubEcommerceCategories";
import type { EcommerceCategory } from "@/shared/api/useGetMainEcommerceCategories";

export default function CategoryMegaMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: categories, isLoading } = useCategories("ecommerce");
  const { t } = useTranslation("categories");
  const { t: tEcom } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();
  const closeTimeoutRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories?.[activeIndex];

  const { data: subcategories, isLoading: subsLoading } =
    useGetSubEcommerceCategories(activeCategory?.id ?? null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 150);
  }, [onClose]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const getCategorySlug = (cat: { url?: string; name: string }) =>
    cat.url || cat.name.toLowerCase().replace(/\s+/g, "-");

  const handleCategoryClick = (cat: { url?: string; name: string }) => {
    navigate(`/ecommerce/category/${getCategorySlug(cat)}`);
    window.scrollTo(0, 0);
    onClose();
  };

  const handleSubcategoryClick = (
    parentCat: { url?: string; name: string },
    sub: EcommerceCategory
  ) => {
    navigate(
      `/ecommerce/category/${getCategorySlug(parentCat)}?sub=${sub.slug}`
    );
    window.scrollTo(0, 0);
    onClose();
  };

  if (!isOpen || isLoading || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-1 duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Desktop: side-by-side panels */}
      <div className="hidden md:flex container mx-auto min-h-85 max-h-[70vh]">
        {/* Left panel - Main categories */}
        <div className="w-64 shrink-0 border-r border-slate-100 overflow-y-auto py-2">
          {categories.map((category, index) => {
            const translationKey = categoryNameToKey[category.name];
            const displayName = translationKey
              ? t(translationKey)
              : category.name;
            const isActive = index === activeIndex;

            return (
              <button
                key={category.name}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleCategoryClick(category)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-colors duration-150 cursor-pointer"
                style={{
                  backgroundColor: isActive
                    ? colors.active.background
                    : "transparent",
                  color: isActive ? colors.active.text : colors.inactive.text,
                  borderRight: isActive
                    ? `3px solid ${colors.active.icon}`
                    : "3px solid transparent",
                }}
              >
                {category.iconUrl ? (
                  <img
                    src={category.iconUrl}
                    alt=""
                    className="w-5 h-5 object-contain shrink-0"
                    style={{ opacity: isActive ? 1 : 0.5 }}
                  />
                ) : category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt=""
                    className="w-5 h-5 object-contain shrink-0"
                    style={{ opacity: isActive ? 1 : 0.5 }}
                  />
                ) : category.icon ? (
                  <category.icon
                    className="w-5 h-5 shrink-0"
                    style={{
                      color: isActive
                        ? colors.active.icon
                        : colors.inactive.icon,
                    }}
                  />
                ) : null}
                <span className="truncate">{displayName}</span>
                <svg
                  className="w-4 h-4 ml-auto shrink-0 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Right panel - Subcategories */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeCategory && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <h3
                  className="text-lg font-bold"
                  style={{ color: colors.active.text }}
                >
                  {(() => {
                    const key = categoryNameToKey[activeCategory.name];
                    return key ? t(key) : activeCategory.name;
                  })()}
                </h3>
                <button
                  onClick={() => handleCategoryClick(activeCategory)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-150 hover:opacity-80 cursor-pointer"
                  style={{
                    backgroundColor: colors.active.background,
                    color: colors.active.text,
                  }}
                >
                  {tEcom("categories.viewAll")}
                </button>
              </div>

              {subsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-10 bg-slate-100 rounded-xl"
                    />
                  ))}
                </div>
              ) : subcategories && subcategories.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() =>
                        handleSubcategoryClick(activeCategory, sub)
                      }
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 hover:shadow-md cursor-pointer border border-transparent hover:border-slate-100"
                      style={{ color: colors.inactive.text }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.active.background;
                        e.currentTarget.style.color = colors.active.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.inactive.text;
                      }}
                    >
                      {sub.image_url ? (
                        <img
                          src={sub.image_url}
                          alt=""
                          className="w-5 h-5 object-contain shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: colors.active.icon,
                            opacity: 0.4,
                          }}
                        />
                      )}
                      <span className="font-medium">{sub.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  {t("noSubcategories", {
                    defaultValue: "No subcategories available",
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: accordion-style list */}
      <div className="md:hidden max-h-[70vh] overflow-y-auto py-2">
        {categories.map((category, index) => {
          const translationKey = categoryNameToKey[category.name];
          const displayName = translationKey
            ? t(translationKey)
            : category.name;
          const isActive = index === activeIndex;

          return (
            <div key={category.name}>
              <button
                onClick={() => setActiveIndex(isActive ? -1 : index)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium transition-colors duration-150 cursor-pointer"
                style={{
                  backgroundColor: isActive
                    ? colors.active.background
                    : "transparent",
                  color: isActive ? colors.active.text : colors.inactive.text,
                }}
              >
                {category.iconUrl ? (
                  <img
                    src={category.iconUrl}
                    alt=""
                    className="w-5 h-5 object-contain shrink-0"
                    style={{ opacity: isActive ? 1 : 0.5 }}
                  />
                ) : category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt=""
                    className="w-5 h-5 object-contain shrink-0"
                    style={{ opacity: isActive ? 1 : 0.5 }}
                  />
                ) : category.icon ? (
                  <category.icon
                    className="w-5 h-5 shrink-0"
                    style={{
                      color: isActive
                        ? colors.active.icon
                        : colors.inactive.icon,
                    }}
                  />
                ) : null}
                <span className="truncate">{displayName}</span>
                <svg
                  className={`w-4 h-4 ml-auto shrink-0 opacity-40 transition-transform duration-200 ${isActive ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {isActive && (
                <div className="px-4 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colors.active.text }}
                    >
                      {displayName}
                    </span>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-150 hover:opacity-80 cursor-pointer"
                      style={{
                        backgroundColor: colors.active.background,
                        color: colors.active.text,
                      }}
                    >
                      {tEcom("categories.viewAll")}
                    </button>
                  </div>
                  {subsLoading ? (
                    <div className="grid grid-cols-1 gap-0.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse h-8 bg-slate-100 rounded-lg"
                        />
                      ))}
                    </div>
                  ) : subcategories && subcategories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-0.5">
                      {subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() =>
                            handleSubcategoryClick(category, sub)
                          }
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm transition-colors duration-150 cursor-pointer"
                          style={{ color: colors.inactive.text }}
                        >
                          {sub.image_url ? (
                            <img
                              src={sub.image_url}
                              alt=""
                              className="w-4 h-4 object-contain shrink-0 opacity-60"
                            />
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: colors.active.icon,
                                opacity: 0.4,
                              }}
                            />
                          )}
                          <span className="font-medium">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 px-4 py-2">
                      {t("noSubcategories", {
                        defaultValue: "No subcategories available",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
