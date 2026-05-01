import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getPlatformColors } from "@/shared/categories/platformColors";
import { useCategories } from "@/shared/categories/useCategories";
import useGetSubEcommerceCategories from "@/shared/api/useGetSubEcommerceCategories";
import type { EcommerceCategory } from "@/shared/api/useGetMainEcommerceCategories";
import { ChevronRight } from "lucide-react";

function CategoryGrid({
  categories,
  isLoading,
  onSelect,
  emptyMessage,
}: {
  categories: EcommerceCategory[] | undefined;
  isLoading: boolean;
  onSelect: (cat: EcommerceCategory) => void;
  emptyMessage: string;
}) {
  const colors = getPlatformColors("ecommerce");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse h-28 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <p className="text-sm text-slate-400">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: cat.image_url ? undefined : colors.active.background,
            }}
          >
            {cat.image_url && (
              <img
                src={cat.image_url}
                alt=""
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
              {cat.name}
            </span>
            {cat.product_count > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                {cat.product_count} products
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function EcommerceCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const subParam = searchParams.get("sub");
  const leafParam = searchParams.get("leaf");
  const { data: categories, isLoading } = useCategories("ecommerce");
  const { t: tEcom } = useTranslation("ecommerce");
  const navigate = useNavigate();
  const colors = getPlatformColors("ecommerce");

  // Level 1: find top-level category by slug
  const category = categories?.find(
    (cat) => (cat.url || cat.name.toLowerCase().replace(/\s+/g, "-")) === slug
  );

  // Level 2: fetch subcategories of the selected top-level category
  const { data: subcategories, isLoading: subsLoading } =
    useGetSubEcommerceCategories(category?.id ?? null);

  const activeSub = subParam
    ? subcategories?.find((s) => s.slug === subParam)
    : null;

  // Level 3: fetch leaf categories of the selected subcategory
  const { data: leafCategories, isLoading: leafLoading } =
    useGetSubEcommerceCategories(activeSub?.id ?? null);

  const activeLeaf = leafParam
    ? leafCategories?.find((l) => l.slug === leafParam)
    : null;

  if (isLoading) {
    return (
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
    );
  }

  if (!category) {
    return (
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
    );
  }

  // Determine the current heading
  const heading = activeLeaf?.name ?? activeSub?.name ?? category.name;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link to="/ecommerce" className="hover:text-slate-800 transition-colors">
            {tEcom("nav.products", { defaultValue: "Shop" })}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />

          {!activeSub ? (
            <span className="text-slate-800 font-medium">{category.name}</span>
          ) : (
            <>
              <Link
                to={`/ecommerce/category/${slug}`}
                className="hover:text-slate-800 transition-colors"
              >
                {category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />

              {!activeLeaf ? (
                <span className="text-slate-800 font-medium">{activeSub.name}</span>
              ) : (
                <>
                  <Link
                    to={`/ecommerce/category/${slug}?sub=${subParam}`}
                    className="hover:text-slate-800 transition-colors"
                  >
                    {activeSub.name}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-800 font-medium">{activeLeaf.name}</span>
                </>
              )}
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {(() => {
              const current = activeLeaf ?? activeSub ?? category;
              const imgUrl = "image_url" in current
                ? (current as EcommerceCategory).image_url
                : current.imageUrl ?? current.iconUrl;
              if (imgUrl) {
                return (
                  <img src={imgUrl} alt="" className="w-10 h-10 object-contain rounded-lg" />
                );
              }
              if ("icon" in current && current.icon) {
                const Icon = current.icon;
                return <Icon className="w-8 h-8" style={{ color: colors.active.icon }} />;
              }
              return null;
            })()}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{heading}</h1>
          </div>
        </div>

        {/* Content: show the appropriate level */}
        {activeLeaf ? (
          // Level 3 selected — products would go here
          <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              {activeLeaf.image_url && (
                <img src={activeLeaf.image_url} alt="" className="w-16 h-16 mx-auto object-contain" />
              )}
              <h3 className="text-lg font-semibold text-slate-800">{activeLeaf.name}</h3>
              {activeLeaf.product_count > 0 && (
                <p className="text-sm text-slate-500">
                  {activeLeaf.product_count} products
                </p>
              )}
              <p className="text-sm text-slate-500">
                {tEcom("categoryPage.noProductsYet", { defaultValue: "Products coming soon" })}
              </p>
            </div>
          </div>
        ) : activeSub ? (
          // Level 2 selected — show level 3 leaf categories
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {tEcom("categoryPage.browse", {
                category: activeSub.name,
                defaultValue: `Browse ${activeSub.name}`,
              })}
            </h2>
            <CategoryGrid
              categories={leafCategories}
              isLoading={leafLoading}
              onSelect={(leaf) =>
                navigate(`/ecommerce/category/${slug}?sub=${subParam}&leaf=${leaf.slug}`)
              }
              emptyMessage={tEcom("categoryPage.noSubcategories", {
                defaultValue: "No subcategories available",
              })}
            />
          </div>
        ) : (
          // Level 1 selected — show level 2 subcategories
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {tEcom("categoryPage.browse", {
                category: category.name,
                defaultValue: `Browse ${category.name}`,
              })}
            </h2>
            <CategoryGrid
              categories={subcategories}
              isLoading={subsLoading}
              onSelect={(sub) =>
                navigate(`/ecommerce/category/${slug}?sub=${sub.slug}`)
              }
              emptyMessage={tEcom("categoryPage.noSubcategories", {
                defaultValue: "No subcategories available",
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
