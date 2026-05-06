import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronRight,
  Search,
  SearchX,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { getPlatformColors } from "@/shared/categories/platformColors";
import useSearchEcommerceProducts from "@/shared/api/useSearchEcommerceProducts";
import useGetEcommerceFilters from "@/shared/api/useGetEcommerceFilters";
import type { EcommerceProduct } from "@/shared/api/useGetEcommerceProducts";

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
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
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

export default function SearchResults() {
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const [searchParams] = useSearchParams();
  const catalogRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q") || "";

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStock, setInStock] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number[]>
  >({});
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const allSelectedOptionIds = Object.values(selectedOptions).flat();

  const { data: filtersData } = useGetEcommerceFilters({
    min_price: priceMin ? Number(priceMin) : null,
    max_price: priceMax ? Number(priceMax) : null,
    in_stock: inStock,
  });

  const { data, isLoading } = useSearchEcommerceProducts({
    q: query,
    page,
    limit: 20,
    sort_by: sortBy,
    min_price: priceMin ? Number(priceMin) : null,
    max_price: priceMax ? Number(priceMax) : null,
    in_stock: inStock,
    option_ids:
      allSelectedOptionIds.length > 0 ? allSelectedOptionIds : undefined,
    brand_ids: selectedBrands.length > 0 ? selectedBrands : undefined,
  });

  const totalPages = data?.total_pages ?? 1;

  const activeFilterCount =
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (!inStock ? 1 : 0) +
    allSelectedOptionIds.length +
    selectedBrands.length;

  const goToPage = (newPage: number) => {
    setPage(newPage);
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                      option.product_count === 0
                        ? "opacity-40 pointer-events-none"
                        : ""
                    }`}
                  >
                    <Checkbox
                      checked={(
                        selectedOptions[field.field_id] ?? []
                      ).includes(option.option_id)}
                      onCheckedChange={() =>
                        toggleOption(field.field_id, option.option_id)
                      }
                      disabled={option.product_count === 0}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                      {option.option_value}
                    </span>
                    <span className="text-xs text-slate-400">
                      {option.product_count}
                    </span>
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
      {filtersData?.brands &&
        filtersData.brands.length > 0 &&
        (() => {
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
                    key={brand.brand_id}
                    className={`flex items-center gap-2.5 cursor-pointer group ${
                      brand.product_count === 0
                        ? "opacity-40 pointer-events-none"
                        : ""
                    }`}
                  >
                    <Checkbox
                      checked={selectedBrands.includes(brand.brand_id)}
                      onCheckedChange={() => toggleBrand(brand.brand_id)}
                      disabled={brand.product_count === 0}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                      {brand.brand_name}
                    </span>
                    {brand.product_count != null && (
                      <span className="text-xs text-slate-400">
                        {brand.product_count}
                      </span>
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={catalogRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link
            to="/ecommerce"
            className="hover:text-slate-800 transition-colors"
          >
            {t("nav.products", { defaultValue: "Shop" })}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">
            {t("search.title", { defaultValue: "Search Results" })}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {query
              ? t("search.resultsFor", {
                  query,
                  defaultValue: `Results for "${query}"`,
                })
              : t("search.allProducts", { defaultValue: "All Products" })}
          </h1>
          <p className="text-sm text-slate-500">
            {data
              ? t("search.resultCount", {
                  count: data.total,
                  defaultValue: `${data.total} products found`,
                })
              : ""}
          </p>
        </div>

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
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl bg-slate-200 aspect-3/4"
                  />
                ))}
              </div>
            ) : !data || data.items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="max-w-sm mx-auto space-y-3">
                  {query ? (
                    <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
                  ) : (
                    <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  )}
                  <h3 className="text-lg font-semibold text-slate-800">
                    {t("search.noResults", { defaultValue: "No results found" })}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {query
                      ? t("search.noResultsHintQuery", {
                          query,
                          defaultValue: `We couldn't find anything for "${query}". Try different keywords or adjust your filters.`,
                        })
                      : t("search.noResultsHint", {
                          defaultValue:
                            "Try adjusting your filters to see more products.",
                        })}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: colors.active.icon }}
                    >
                      {t("catalog.clearFilters", {
                        defaultValue: "Clear all filters",
                      })}
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
                            onClick={() =>
                              goToPage(Math.min(totalPages, page + 1))
                            }
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
    </div>
  );
}
