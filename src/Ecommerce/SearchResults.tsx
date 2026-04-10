import { useState, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
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
import { Switch } from "@/components/ui/switch";
import { getPlatformColors } from "@/shared/categories/platformColors";
import { STORE_COLORS, type Store, type Condition, type Category } from "./ProductCatalog";
import { useProductSearch, type SortOption } from "./hooks/useProductSearch";

// ── Constants ─────────────────────────────────────────────────────────

const ALL_STORES: Store[] = ["Alta", "Elit", "Informal"];
const ALL_CATEGORIES: Category[] = [
  "Electronics",
  "Fashion & Clothing",
  "Home & Garden",
  "Books & Media",
  "Sports & Outdoors",
];
const ALL_CONDITIONS: Condition[] = ["New", "Like New", "Used"];

const SORT_OPTIONS: { value: SortOption; labelKey: string; defaultLabel: string }[] = [
  { value: "newest", labelKey: "search.sortNewest", defaultLabel: "Newest" },
  { value: "price-low-high", labelKey: "search.sortPriceLow", defaultLabel: "Price: Low to High" },
  { value: "price-high-low", labelKey: "search.sortPriceHigh", defaultLabel: "Price: High to Low" },
  { value: "most-popular", labelKey: "search.sortPopular", defaultLabel: "Most Popular" },
];

const PRICE_MIN = 0;
const PRICE_MAX = 5000;
const PRICE_STEP = 50;
const ITEMS_PER_PAGE = 8;

// ── Component ─────────────────────────────────────────────────────────

export default function SearchResults() {
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Read URL params ───────────────────────────────────────────────
  const query = searchParams.get("q") || "";
  const sort = (searchParams.get("sort") as SortOption) || "newest";

  const urlCategories = searchParams.getAll("category") as Category[];
  const urlConditions = searchParams.getAll("condition") as Condition[];
  const urlStores = searchParams.getAll("store") as Store[];
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");
  const urlBoosted = searchParams.get("boosted") === "true";

  // ── Local filter state (synced to URL on change) ──────────────────
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    urlCategories.filter((c) => ALL_CATEGORIES.includes(c))
  );
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>(
    urlConditions.filter((c) => ALL_CONDITIONS.includes(c))
  );
  const [selectedStores, setSelectedStores] = useState<Store[]>(
    urlStores.filter((s) => ALL_STORES.includes(s))
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice ? Math.max(PRICE_MIN, Number(urlMinPrice)) : PRICE_MIN,
    urlMaxPrice ? Math.min(PRICE_MAX, Number(urlMaxPrice)) : PRICE_MAX,
  ]);
  const [onlyBoosted, setOnlyBoosted] = useState(urlBoosted);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // ── URL sync helper ───────────────────────────────────────────────
  const syncUrl = useCallback(
    (overrides: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams();
      if (query) next.set("q", query);

      const newSort = overrides.sort !== undefined ? overrides.sort : sort;
      if (newSort && newSort !== "newest") next.set("sort", newSort as string);

      const cats = overrides.category !== undefined
        ? (overrides.category as string[])
        : selectedCategories;
      (cats as string[]).forEach((c) => next.append("category", c));

      const conds = overrides.condition !== undefined
        ? (overrides.condition as string[])
        : selectedConditions;
      (conds as string[]).forEach((c) => next.append("condition", c));

      const stores = overrides.store !== undefined
        ? (overrides.store as string[])
        : selectedStores;
      (stores as string[]).forEach((s) => next.append("store", s));

      const min = overrides.minPrice !== undefined ? overrides.minPrice : (priceRange[0] > PRICE_MIN ? String(priceRange[0]) : null);
      const max = overrides.maxPrice !== undefined ? overrides.maxPrice : (priceRange[1] < PRICE_MAX ? String(priceRange[1]) : null);
      if (min) next.set("minPrice", min as string);
      if (max) next.set("maxPrice", max as string);

      const boosted = overrides.boosted !== undefined ? overrides.boosted === "true" : onlyBoosted;
      if (boosted) next.set("boosted", "true");

      setSearchParams(next, { replace: true });
    },
    [query, sort, selectedCategories, selectedConditions, selectedStores, priceRange, onlyBoosted, setSearchParams]
  );

  // ── Toggle helpers ────────────────────────────────────────────────
  const toggleFilter = <T extends string>(arr: T[], item: T, setter: (v: T[]) => void, paramKey: string) => {
    const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    setter(next);
    setCurrentPage(1);
    syncUrl({ [paramKey]: next });
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "category":
        { const next = selectedCategories.filter((c) => c !== value);
        setSelectedCategories(next);
        syncUrl({ category: next }); }
        break;
      case "condition":
        { const next = selectedConditions.filter((c) => c !== value);
        setSelectedConditions(next);
        syncUrl({ condition: next }); }
        break;
      case "store":
        { const next = selectedStores.filter((s) => s !== value);
        setSelectedStores(next);
        syncUrl({ store: next }); }
        break;
      case "price":
        setPriceRange([PRICE_MIN, PRICE_MAX]);
        syncUrl({ minPrice: null, maxPrice: null });
        break;
      case "boosted":
        setOnlyBoosted(false);
        syncUrl({ boosted: "false" });
        break;
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedStores([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setOnlyBoosted(false);
    setCurrentPage(1);
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setSearchParams(next, { replace: true });
  };

  // ── Search ────────────────────────────────────────────────────────
  const { products: filtered, total } = useProductSearch({
    query,
    sort,
    categories: selectedCategories,
    conditions: selectedConditions,
    stores: selectedStores,
    minPrice: priceRange[0] > PRICE_MIN ? priceRange[0] : null,
    maxPrice: priceRange[1] < PRICE_MAX ? priceRange[1] : null,
    onlyBoosted,
  });

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Active filter chips ───────────────────────────────────────────
  const activeFilters = useMemo(() => {
    const chips: { type: string; value: string; label: string }[] = [];
    selectedCategories.forEach((c) => chips.push({ type: "category", value: c, label: c }));
    selectedConditions.forEach((c) => chips.push({ type: "condition", value: c, label: c }));
    selectedStores.forEach((s) => chips.push({ type: "store", value: s, label: s }));
    if (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) {
      chips.push({ type: "price", value: "price", label: `${priceRange[0]}₾ – ${priceRange[1]}₾` });
    }
    if (onlyBoosted) {
      chips.push({ type: "boosted", value: "boosted", label: t("search.boostedOnly", { defaultValue: "Boosted only" }) });
    }
    return chips;
  }, [selectedCategories, selectedConditions, selectedStores, priceRange, onlyBoosted, t]);

  // ── Pagination range ──────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  // ── Sort handler ──────────────────────────────────────────────────
  const handleSort = (value: SortOption) => {
    setSortOpen(false);
    setCurrentPage(1);
    syncUrl({ sort: value === "newest" ? null : value });
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.defaultLabel || "Newest";

  // ── Price range handlers ──────────────────────────────────────────
  const handlePriceMinChange = (val: number) => {
    const next: [number, number] = [Math.min(val, priceRange[1] - PRICE_STEP), priceRange[1]];
    setPriceRange(next);
  };

  const handlePriceMaxChange = (val: number) => {
    const next: [number, number] = [priceRange[0], Math.max(val, priceRange[0] + PRICE_STEP)];
    setPriceRange(next);
  };

  const handlePriceCommit = () => {
    setCurrentPage(1);
    syncUrl({
      minPrice: priceRange[0] > PRICE_MIN ? String(priceRange[0]) : null,
      maxPrice: priceRange[1] < PRICE_MAX ? String(priceRange[1]) : null,
    });
  };

  // ── Filter sidebar content ────────────────────────────────────────

  const filterContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.category", { defaultValue: "Category" })}
        </h3>
        <div className="space-y-2">
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleFilter(selectedCategories, cat, setSelectedCategories, "category")}
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range slider */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.priceRange", { defaultValue: "Price Range" })}
        </h3>
        <div className="px-1">
          {/* Dual range slider */}
          <div className="relative h-6 mb-2">
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-slate-200 rounded-full" />
            {/* Active track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
              style={{
                backgroundColor: colors.active.icon,
                left: `${((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                right: `${100 - ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange[0]}
              onChange={(e) => handlePriceMinChange(Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
            />
            {/* Max thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange[1]}
              onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
              onMouseUp={handlePriceCommit}
              onTouchEnd={handlePriceCommit}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{priceRange[0]}₾</span>
            <span>{priceRange[1]}₾</span>
          </div>
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.condition", { defaultValue: "Condition" })}
        </h3>
        <div className="space-y-2">
          {ALL_CONDITIONS.map((cond) => (
            <label key={cond} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedConditions.includes(cond)}
                onCheckedChange={() => toggleFilter(selectedConditions, cond, setSelectedConditions, "condition")}
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Store */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.store", { defaultValue: "Store" })}
        </h3>
        <div className="space-y-2">
          {ALL_STORES.map((store) => (
            <label key={store} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedStores.includes(store)}
                onCheckedChange={() => toggleFilter(selectedStores, store, setSelectedStores, "store")}
              />
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 group-hover:text-slate-900">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STORE_COLORS[store].text }}
                />
                {store}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Boosted only */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              {t("search.boostedOnly", { defaultValue: "Boosted only" })}
            </span>
          </div>
          <Switch
            checked={onlyBoosted}
            onCheckedChange={(checked) => {
              setOnlyBoosted(checked);
              setCurrentPage(1);
              syncUrl({ boosted: checked ? "true" : "false" });
            }}
          />
        </label>
      </div>

      {/* Clear all */}
      {activeFilters.length > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full text-sm font-medium text-red-500 hover:text-red-600 transition-colors py-2"
        >
          {t("catalog.clearFilters", { defaultValue: "Clear all filters" })}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/ecommerce" className="hover:text-slate-800 transition-colors">
            {t("nav.products", { defaultValue: "Shop" })}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">
            {t("search.title", { defaultValue: "Search Results" })}
          </span>
        </nav>

        {/* Page header */}
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
            {t("search.resultCount", {
              count: total,
              defaultValue: `${total} products found`,
            })}
          </p>
        </div>

        {/* Sort + filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t("search.sortBy", { defaultValue: "Sort by" })}: {currentSortLabel}
              <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-lg z-50 py-1">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === option.value
                          ? "font-semibold text-slate-900 bg-slate-50"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t(option.labelKey, { defaultValue: option.defaultLabel })}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("catalog.filters", { defaultValue: "Filters" })}
            {activeFilters.length > 0 && (
              <span
                className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold text-white"
                style={{ backgroundColor: colors.active.icon }}
              >
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((chip) => (
              <span
                key={`${chip.type}-${chip.value}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-700"
              >
                {chip.label}
                <button
                  onClick={() => removeFilter(chip.type, chip.value)}
                  className="p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t("search.clearAll", { defaultValue: "Clear all" })}
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* ── Desktop sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                {t("catalog.filters", { defaultValue: "Filters" })}
              </h2>
              {filterContent}
            </div>
          </aside>

          {/* ── Mobile filter drawer ────────────────────────────── */}
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

          {/* ── Product grid ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {total === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="max-w-sm mx-auto space-y-3">
                  <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
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
                          defaultValue: "Try adjusting your filters to see more products.",
                        })}
                  </p>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
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
                  {paginated.map((product) => (
                    <Link
                      to={`/ecommerce/product/${product.id}`}
                      key={product.id}
                      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Store badge */}
                        <span
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: STORE_COLORS[product.store].bg,
                            color: STORE_COLORS[product.store].text,
                          }}
                        >
                          {product.store}
                        </span>
                        {/* Condition badge */}
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-slate-700">
                          {product.condition}
                        </span>
                        {/* Boosted badge */}
                        {product.boosted && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-[#0f0f2d] text-white rounded-full text-[10px] font-semibold">
                            <Sparkles className="w-3 h-3" />
                            {t("featured.boosted", { defaultValue: "Boosted" })}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3.5">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {product.category}
                        </p>
                        <p className="text-base font-bold text-slate-900 mt-1.5">
                          {product.price}₾
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {getPageNumbers().map((page, i) =>
                          page === "ellipsis" ? (
                            <PaginationItem key={`e-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={
                              currentPage === totalPages
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
