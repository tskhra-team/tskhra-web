import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import { useCategories } from "@/shared/categories/useCategories";
import type { CategoryItem } from "@/shared/categories/types";
import { ChevronRight, ArrowRight, Heart } from "lucide-react";
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import { MOCK_PRODUCTS, STORE_COLORS } from "./ProductCatalog";

export default function EcommerceCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("sub");
  const { data: categories, isLoading } = useCategories("ecommerce");
  const { t } = useTranslation("categories");
  const { t: tEcom } = useTranslation("ecommerce");
  const navigate = useNavigate();
  const colors = getPlatformColors("ecommerce");
  const { isFavorite, toggleFavorite } = useEcommerceFavorites();

  // Find the category by slug
  const category = categories?.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  // Find active subcategory if selected
  const activeSubcategory = subcategoryParam
    ? category?.childItems?.find(
        (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === subcategoryParam
      )
    : null;

  const getCategoryDisplayName = (cat: CategoryItem) => {
    const key = categoryNameToKey[cat.name];
    return key ? t(key) : cat.name;
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-slate-200 rounded-lg" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">
              {tEcom("categoryPage.categoryNotFound")}
            </h1>
            <Link
              to="/ecommerce"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: colors.active.icon }}
            >
              {tEcom("categoryPage.backToShop")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const categoryName = getCategoryDisplayName(category);

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link
              to="/ecommerce"
              className="hover:text-slate-800 transition-colors"
            >
              {tEcom("nav.products", { defaultValue: "Shop" })}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {activeSubcategory ? (
              <>
                <Link
                  to={`/ecommerce/category/${slug}`}
                  className="hover:text-slate-800 transition-colors"
                >
                  {categoryName}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-800 font-medium">
                  {getCategoryDisplayName(activeSubcategory)}
                </span>
              </>
            ) : (
              <span className="text-slate-800 font-medium">{categoryName}</span>
            )}
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              {category.iconUrl ? (
                <img
                  src={category.iconUrl}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
              ) : category.icon ? (
                <category.icon
                  className="w-8 h-8"
                  style={{ color: colors.active.icon }}
                />
              ) : null}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {activeSubcategory
                  ? getCategoryDisplayName(activeSubcategory)
                  : categoryName}
              </h1>
            </div>
            {activeSubcategory && (
              <p className="text-sm text-slate-500">
                {categoryName} / {getCategoryDisplayName(activeSubcategory)}
              </p>
            )}
          </div>

          {/* Subcategories Grid (shown when no subcategory is selected) */}
          {!activeSubcategory &&
            category.childItems &&
            category.childItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  {tEcom("categoryPage.browse", { category: categoryName })}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {category.childItems.map((sub) => {
                    const subSlug = sub.name
                      .toLowerCase()
                      .replace(/\s+/g, "-");
                    const subName = getCategoryDisplayName(sub);

                    return (
                      <button
                        key={sub.name}
                        onClick={() =>
                          navigate(
                            `/ecommerce/category/${slug}?sub=${subSlug}`
                          )
                        }
                        className="group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                          style={{
                            backgroundColor: colors.active.background,
                          }}
                        >
                          {sub.iconUrl ? (
                            <img
                              src={sub.iconUrl}
                              alt=""
                              className="w-6 h-6 object-contain"
                            />
                          ) : sub.icon ? (
                            <sub.icon
                              className="w-5 h-5 transition-colors duration-300"
                              style={{ color: colors.active.icon }}
                            />
                          ) : null}
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          {subName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Products grid */}
          {(() => {
            const categoryProducts = activeSubcategory
              ? MOCK_PRODUCTS.filter(
                  (p) => p.subcategory.toLowerCase() === activeSubcategory.name.toLowerCase()
                )
              : MOCK_PRODUCTS.filter(
                  (p) => p.category.toLowerCase() === category.name.toLowerCase()
                );
            return categoryProducts.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {tEcom("categoryPage.productsFound", { count: categoryProducts.length })}
                  </p>
                  <Link
                    to={`/ecommerce/catalog?category=${encodeURIComponent(
                      categoryProducts[0].category
                    )}`}
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ color: colors.active.icon }}
                  >
                    {tEcom("categoryPage.viewAllInCatalog")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categoryProducts.map((product) => (
                    <Link
                      to={`/ecommerce/product/${product.id}`}
                      key={product.id}
                      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span
                          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: STORE_COLORS[product.store].bg,
                            color: STORE_COLORS[product.store].text,
                          }}
                        >
                          {product.store}
                        </span>
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-slate-700">
                          {tEcom(`catalog.condition${product.condition.replace(/\s/g, "")}`)}
                        </span>
                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite(product.id)
                                ? "fill-rose-500 text-rose-500"
                                : "text-slate-400 hover:text-rose-400"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-base font-bold text-slate-900 mt-1">
                          {product.price}₾
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{ backgroundColor: colors.active.background }}
                  >
                    {category.icon && (
                      <category.icon
                        className="w-7 h-7"
                        style={{ color: colors.active.icon }}
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {activeSubcategory
                      ? getCategoryDisplayName(activeSubcategory)
                      : categoryName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {tEcom("categoryPage.noProductsYet")}
                  </p>
                  <Link
                    to="/ecommerce/catalog"
                    className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: colors.active.icon }}
                  >
                    {tEcom("categoryPage.browseCatalog")}
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
