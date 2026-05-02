import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getPlatformColors } from "@/shared/categories/platformColors";
import { useCategories } from "@/shared/categories/useCategories";
import useGetSubEcommerceCategories from "@/shared/api/useGetSubEcommerceCategories";
import useGetEcommerceProducts from "@/shared/api/useGetEcommerceProducts";
import type { EcommerceProduct } from "@/shared/api/useGetEcommerceProducts";
import useGetEcommerceFilters from "@/shared/api/useGetEcommerceFilters";
import type { EcommerceCategory } from "@/shared/api/useGetMainEcommerceCategories";
import { ChevronRight, SlidersHorizontal, X, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
] as const;

function ProductCard({ product }: { product: EcommerceProduct }) {
  return (
    <Link
      to={`/ecommerce/product/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.stock_quantity <= 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-50/90 backdrop-blur-sm text-[11px] font-medium text-red-600">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-3.5">
        {product.brand && (
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-semibold text-slate-900 text-sm truncate">
          {product.title}
        </h3>
        <p className="text-base font-bold text-slate-900 mt-1.5">
          {product.price.toFixed(2)}₾
        </p>
      </div>
    </Link>
  );
}

function ProductCatalog({
  categoryId,
  subcategories,
  defaultSubcategory,
}: {
  categoryId: number;
  subcategories?: EcommerceCategory[];
  defaultSubcategory?: number | null;
}) {
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");

  const initialSubcategory =
    defaultSubcategory ?? (subcategories && subcategories.length > 0 ? subcategories[0].id : null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    initialSubcategory
  );
  const catalogRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStock, setInStock] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number[]>>({});
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const activeCategoryId = selectedSubcategory ?? categoryId;

  const allSelectedOptionIds = Object.values(selectedOptions).flat();

  const { data: filtersData } = useGetEcommerceFilters(
    {
      category_id: activeCategoryId,
      min_price: priceMin ? Number(priceMin) : null,
      max_price: priceMax ? Number(priceMax) : null,
      in_stock: inStock,
    },
    activeCategoryId != null
  );

  const goToPage = (newPage: number) => {
    setPage(newPage);
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { data, isLoading } = useGetEcommerceProducts({
    category_id: activeCategoryId,
    page,
    limit: 20,
    sort_by: sortBy,
    min_price: priceMin ? Number(priceMin) : null,
    max_price: priceMax ? Number(priceMax) : null,
    in_stock: inStock,
    option_ids: allSelectedOptionIds.length > 0 ? allSelectedOptionIds : undefined,
    brand_ids: selectedBrands.length > 0 ? selectedBrands : undefined,
  });

  const totalPages = data?.total_pages ?? 1;

  const activeFilterCount =
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (!inStock ? 1 : 0) +
    allSelectedOptionIds.length +
    selectedBrands.length;

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setInStock(true);
    setSortBy("popular");
    setSelectedOptions({});
    setSelectedBrands([]);
    setPage(1);
  };

  const toggleOption = (fieldId: number, optionId: number) => {
    setSelectedOptions((prev) => {
      const current = prev[fieldId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      if (next.length === 0) {
        const { [fieldId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [fieldId]: next };
    });
    setPage(1);
  };

  const toggleBrand = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.sortBy", { defaultValue: "Sort by" })}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`catalog.sort_${opt.value}`, { defaultValue: opt.label })}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.priceRange", { defaultValue: "Price Range" })}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t("catalog.priceMin", { defaultValue: "Min" })}
            value={priceMin}
            min={0}
            onChange={(e) => {
              setPriceMin(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          />
          <span className="text-slate-400 text-sm">–</span>
          <input
            type="number"
            placeholder={t("catalog.priceMax", { defaultValue: "Max" })}
            value={priceMax}
            min={0}
            onChange={(e) => {
              setPriceMax(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          />
        </div>
      </div>

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <Checkbox
            checked={inStock}
            onCheckedChange={(checked) => {
              setInStock(!!checked);
              setPage(1);
            }}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900">
            {t("catalog.inStockOnly", { defaultValue: "In stock only" })}
          </span>
        </label>
      </div>

      {/* Dynamic filters */}
      {filtersData?.filters.map((group) =>
        group.fields.map((field) => {
          const VISIBLE_COUNT = 5;
          const isExpanded = expandedFields.has(`field-${field.field_id}`);
          const visibleOptions = isExpanded
            ? field.options
            : field.options.slice(0, VISIBLE_COUNT);
          const hasMore = field.options.length > VISIBLE_COUNT;

          return (
            <div key={field.field_id}>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">
                {field.field_name}
              </h3>
              <div className="space-y-2">
                {visibleOptions.map((option) => (
                  <label
                    key={option.option_id}
                    className={`flex items-center gap-2.5 cursor-pointer group ${
                      option.product_count === 0 ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    <Checkbox
                      checked={(selectedOptions[field.field_id] ?? []).includes(option.option_id)}
                      onCheckedChange={() => toggleOption(field.field_id, option.option_id)}
                      disabled={option.product_count === 0}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                      {option.option_value}
                    </span>
                    <span className="text-xs text-slate-400">{option.product_count}</span>
                  </label>
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={() =>
                    setExpandedFields((prev) => {
                      const next = new Set(prev);
                      const key = `field-${field.field_id}`;
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    })
                  }
                  className="mt-2 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {isExpanded
                    ? t("catalog.showLess", { defaultValue: "Show less" })
                    : t("catalog.showMore", {
                        count: field.options.length - VISIBLE_COUNT,
                        defaultValue: `Show ${field.options.length - VISIBLE_COUNT} more`,
                      })}
                </button>
              )}
            </div>
          );
        })
      )}

      {/* Brands */}
      {filtersData?.brands && filtersData.brands.length > 0 && (() => {
        const VISIBLE_COUNT = 5;
        const isExpanded = expandedFields.has("brands");
        const visibleBrands = isExpanded
          ? filtersData.brands
          : filtersData.brands.slice(0, VISIBLE_COUNT);
        const hasMore = filtersData.brands.length > VISIBLE_COUNT;

        return (
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              {t("catalog.brands", { defaultValue: "Brands" })}
            </h3>
            <div className="space-y-2">
              {visibleBrands.map((brand) => (
                <label
                  key={brand.id}
                  className={`flex items-center gap-2.5 cursor-pointer group ${
                    brand.product_count === 0 ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <Checkbox
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                    disabled={brand.product_count === 0}
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                    {brand.name}
                  </span>
                  {brand.product_count != null && (
                    <span className="text-xs text-slate-400">{brand.product_count}</span>
                  )}
                </label>
              ))}
            </div>
            {hasMore && (
              <button
                onClick={() =>
                  setExpandedFields((prev) => {
                    const next = new Set(prev);
                    if (next.has("brands")) next.delete("brands");
                    else next.add("brands");
                    return next;
                  })
                }
                className="mt-2 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                {isExpanded
                  ? t("catalog.showLess", { defaultValue: "Show less" })
                  : t("catalog.showMore", {
                      count: filtersData.brands.length - VISIBLE_COUNT,
                      defaultValue: `Show ${filtersData.brands.length - VISIBLE_COUNT} more`,
                    })}
              </button>
            )}
          </div>
        );
      })()}

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full text-sm font-medium text-red-500 hover:text-red-600 transition-colors py-2"
        >
          {t("catalog.clearFilters", { defaultValue: "Clear all filters" })}
        </button>
      )}
    </div>
  );

  return (
    <div ref={catalogRef}>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t("catalog.filters", { defaultValue: "Filters" })}
        {activeFilterCount > 0 && (
          <span
            className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: colors.active.icon }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              {t("catalog.filters", { defaultValue: "Filters" })}
            </h2>
            {filterContent}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("catalog.filters", { defaultValue: "Filters" })}
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Subcategory chips */}
          {subcategories && subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubcategory(sub.id);
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={
                    selectedSubcategory === sub.id
                      ? { backgroundColor: colors.active.icon, color: "#fff" }
                      : { backgroundColor: "#F1F5F9", color: "#475569" }
                  }
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <p className="text-sm text-slate-500 mb-4">
            {data
              ? t("catalog.showing", {
                  count: data.total,
                  defaultValue: `${data.total} products found`,
                })
              : ""}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-slate-200 aspect-3/4" />
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <div className="max-w-sm mx-auto space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-800">
                  {t("catalog.noResults", { defaultValue: "No products found" })}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("catalog.noResultsHint", {
                    defaultValue: "Try adjusting your filters.",
                  })}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: colors.active.icon }}
                  >
                    {t("catalog.clearFilters", { defaultValue: "Clear all filters" })}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => goToPage(Math.max(1, page - 1))}
                          className={
                            page <= 1
                              ? "pointer-events-none opacity-40"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pg, i) =>
                        pg === "ellipsis" ? (
                          <PaginationItem key={`e-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={pg}>
                            <PaginationLink
                              isActive={page === pg}
                              onClick={() => goToPage(pg as number)}
                              className="cursor-pointer"
                            >
                              {pg}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => goToPage(Math.min(totalPages, page + 1))}
                          className={
                            page >= totalPages
                              ? "pointer-events-none opacity-40"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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

  const [showAllProducts, setShowAllProducts] = useState(false);

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
          <ProductCatalog
            key={`leaf-${activeLeaf.id}`}
            categoryId={activeSub!.id}
            subcategories={leafCategories}
            defaultSubcategory={activeLeaf.id}
          />
        ) : showAllProducts && category.id ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setShowAllProducts(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                ← {tEcom("categoryPage.backToCategories", { defaultValue: "Back to categories" })}
              </button>
            </div>
            <ProductCatalog
              key={`all-${activeSub?.id ?? "root"}`}
              categoryId={category.id}
              subcategories={subcategories}
              defaultSubcategory={activeSub?.id}
            />
          </>
        ) : activeSub ? (
          activeSub.has_subcategories ? (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {tEcom("categoryPage.browse", {
                    category: activeSub.name,
                    defaultValue: `Browse ${activeSub.name}`,
                  })}
                </h2>
                <button
                  onClick={() => setShowAllProducts(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.active.icon }}
                >
                  {tEcom("categoryPage.allProducts", { defaultValue: "All Products" })}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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
            <ProductCatalog
              key={`sub-${activeSub.id}`}
              categoryId={category.id!}
              subcategories={subcategories}
              defaultSubcategory={activeSub.id}
            />
          )
        ) : (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {tEcom("categoryPage.browse", {
                  category: category.name,
                  defaultValue: `Browse ${category.name}`,
                })}
              </h2>
              {category.id && (
                <button
                  onClick={() => setShowAllProducts(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.active.icon }}
                >
                  {tEcom("categoryPage.allProducts", { defaultValue: "All Products" })}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
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
