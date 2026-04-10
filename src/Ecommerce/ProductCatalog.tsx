import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
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

// ── Types ──────────────────────────────────────────────────────────────

export type Store = "Alta" | "Elit" | "Informal";
export type Condition = "New" | "Like New" | "Used";
export type Category =
  | "Electronics"
  | "Fashion & Clothing"
  | "Home & Garden"
  | "Books & Media"
  | "Sports & Outdoors";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  store: Store;
  condition: Condition;
  category: Category;
  subcategory: string;
}

// ── Store badge colors ─────────────────────────────────────────────────

export const STORE_COLORS: Record<Store, { bg: string; text: string }> = {
  Alta: { bg: "#DBEAFE", text: "#1E40AF" },
  Elit: { bg: "#FEF3C7", text: "#92400E" },
  Informal: { bg: "#D1FAE5", text: "#065F46" },
};

// ── Mock products (25) ─────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  // ── Electronics ──
  { id: 1, name: "Samsung Galaxy S24 Ultra", price: 3499, image: "https://picsum.photos/seed/galaxy24/400/400", store: "Alta", condition: "New", category: "Electronics", subcategory: "Phones & Tablets" },
  { id: 2, name: "Apple iPhone 15 Pro Max", price: 4299, image: "https://picsum.photos/seed/iphone15/400/400", store: "Elit", condition: "New", category: "Electronics", subcategory: "Phones & Tablets" },
  { id: 3, name: "iPad Pro 12.9\" M2", price: 3899, image: "https://picsum.photos/seed/ipadpro/400/400", store: "Alta", condition: "Like New", category: "Electronics", subcategory: "Phones & Tablets" },
  { id: 4, name: "MacBook Air M3", price: 4999, image: "https://picsum.photos/seed/macbookm3/400/400", store: "Alta", condition: "New", category: "Electronics", subcategory: "Laptops & Computers" },
  { id: 5, name: "Kindle Paperwhite 2024", price: 399, image: "https://picsum.photos/seed/kindle24/400/400", store: "Elit", condition: "New", category: "Electronics", subcategory: "Laptops & Computers" },
  { id: 6, name: "Samsung 55\" OLED TV", price: 3299, image: "https://picsum.photos/seed/oledtv/400/400", store: "Elit", condition: "New", category: "Electronics", subcategory: "TV & Audio" },
  { id: 7, name: "Sony WH-1000XM5 Headphones", price: 899, image: "https://picsum.photos/seed/sonyxm5/400/400", store: "Alta", condition: "New", category: "Electronics", subcategory: "TV & Audio" },
  { id: 8, name: "Canon EOS R50 Camera", price: 2199, image: "https://picsum.photos/seed/canonr50/400/400", store: "Elit", condition: "New", category: "Electronics", subcategory: "Cameras & Photo" },
  { id: 9, name: "PlayStation 5 Slim", price: 1599, image: "https://picsum.photos/seed/ps5slim/400/400", store: "Informal", condition: "Like New", category: "Electronics", subcategory: "Gaming Consoles" },
  { id: 10, name: "USB-C Charging Hub 7-in-1", price: 89, image: "https://picsum.photos/seed/usbhub/400/400", store: "Informal", condition: "New", category: "Electronics", subcategory: "Accessories" },
  // ── Fashion & Clothing ──
  { id: 11, name: "Levi's 501 Original Jeans", price: 189, image: "https://picsum.photos/seed/levis501/400/400", store: "Informal", condition: "Like New", category: "Fashion & Clothing", subcategory: "Men's Clothing" },
  { id: 12, name: "The North Face Jacket", price: 599, image: "https://picsum.photos/seed/northface/400/400", store: "Informal", condition: "Used", category: "Fashion & Clothing", subcategory: "Men's Clothing" },
  { id: 13, name: "Zara Oversized Blazer", price: 219, image: "https://picsum.photos/seed/blazer/400/400", store: "Elit", condition: "New", category: "Fashion & Clothing", subcategory: "Women's Clothing" },
  { id: 14, name: "H&M Summer Dress", price: 129, image: "https://picsum.photos/seed/dress/400/400", store: "Alta", condition: "New", category: "Fashion & Clothing", subcategory: "Women's Clothing" },
  { id: 15, name: "Nike Air Max 90", price: 389, image: "https://picsum.photos/seed/airmax90/400/400", store: "Informal", condition: "Like New", category: "Fashion & Clothing", subcategory: "Shoes" },
  { id: 16, name: "Adidas Ultraboost 23", price: 449, image: "https://picsum.photos/seed/ultraboost/400/400", store: "Elit", condition: "New", category: "Fashion & Clothing", subcategory: "Shoes" },
  { id: 17, name: "Leather Crossbody Bag", price: 179, image: "https://picsum.photos/seed/crossbody/400/400", store: "Alta", condition: "New", category: "Fashion & Clothing", subcategory: "Bags & Accessories" },
  // ── Home & Garden ──
  { id: 18, name: "IKEA KALLAX Shelf Unit", price: 199, image: "https://picsum.photos/seed/kallax/400/400", store: "Informal", condition: "Used", category: "Home & Garden", subcategory: "Furniture" },
  { id: 19, name: "Philips Air Fryer XXL", price: 449, image: "https://picsum.photos/seed/airfryer/400/400", store: "Alta", condition: "New", category: "Home & Garden", subcategory: "Kitchen & Dining" },
  { id: 20, name: "Dyson V15 Vacuum", price: 1899, image: "https://picsum.photos/seed/dysonv15/400/400", store: "Elit", condition: "New", category: "Home & Garden", subcategory: "Home Decor" },
  { id: 21, name: "Bosch Drill Set 18V", price: 349, image: "https://picsum.photos/seed/boschdrill/400/400", store: "Informal", condition: "Like New", category: "Home & Garden", subcategory: "Garden & Outdoor" },
  { id: 22, name: "Cotton Bedding Set King", price: 159, image: "https://picsum.photos/seed/bedding/400/400", store: "Alta", condition: "New", category: "Home & Garden", subcategory: "Bedding & Bath" },
  // ── Books & Media ──
  { id: 23, name: "Harry Potter Box Set", price: 129, image: "https://picsum.photos/seed/hpbooks/400/400", store: "Informal", condition: "Like New", category: "Books & Media", subcategory: "Fiction" },
  { id: 24, name: "Sapiens by Yuval Harari", price: 39, image: "https://picsum.photos/seed/sapiens/400/400", store: "Elit", condition: "New", category: "Books & Media", subcategory: "Non-Fiction" },
  { id: 25, name: "Vinyl Record Collection (Jazz)", price: 249, image: "https://picsum.photos/seed/vinyl/400/400", store: "Alta", condition: "Used", category: "Books & Media", subcategory: "Movies & Music" },
  // ── Sports & Outdoors ──
  { id: 26, name: "Wilson Pro Tennis Racket", price: 299, image: "https://picsum.photos/seed/tennisracket/400/400", store: "Alta", condition: "Used", category: "Sports & Outdoors", subcategory: "Sports Equipment" },
  { id: 27, name: "Yoga Mat Premium Cork", price: 89, image: "https://picsum.photos/seed/yogamat/400/400", store: "Informal", condition: "New", category: "Sports & Outdoors", subcategory: "Exercise & Fitness" },
  { id: 28, name: "Camping Tent 4-Person", price: 379, image: "https://picsum.photos/seed/tent/400/400", store: "Elit", condition: "New", category: "Sports & Outdoors", subcategory: "Camping & Hiking" },
  { id: 29, name: "Mountain Bike 29\"", price: 1299, image: "https://picsum.photos/seed/mtbike/400/400", store: "Informal", condition: "Like New", category: "Sports & Outdoors", subcategory: "Cycling" },
  { id: 30, name: "Hiking Backpack 65L", price: 199, image: "https://picsum.photos/seed/hikebag/400/400", store: "Alta", condition: "New", category: "Sports & Outdoors", subcategory: "Outdoor Gear" },
];

const ALL_STORES: Store[] = ["Alta", "Elit", "Informal"];
const ALL_CATEGORIES: Category[] = [
  "Electronics",
  "Fashion & Clothing",
  "Home & Garden",
  "Books & Media",
  "Sports & Outdoors",
];
const ALL_CONDITIONS: Condition[] = ["New", "Like New", "Used"];

const ITEMS_PER_PAGE = 8;

// ── Component ──────────────────────────────────────────────────────────

export default function ProductCatalog() {
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const [searchParams] = useSearchParams();

  // Read initial category from URL (?category=Electronics)
  const urlCategory = searchParams.get("category") as Category | null;
  const initialCategories = urlCategory && ALL_CATEGORIES.includes(urlCategory) ? [urlCategory] : [];

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialCategories);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle helpers
  const toggleFilter = <T,>(arr: T[], item: T, setter: (v: T[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
    setCurrentPage(1);
  };

  // Filtered products
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (selectedStores.length && !selectedStores.includes(p.store))
        return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category))
        return false;
      if (selectedConditions.length && !selectedConditions.includes(p.condition))
        return false;
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      return true;
    });
  }, [search, selectedStores, selectedCategories, selectedConditions, priceMin, priceMax]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    selectedStores.length +
    selectedCategories.length +
    selectedConditions.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const clearFilters = () => {
    setSelectedStores([]);
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceMin("");
    setPriceMax("");
    setSearch("");
    setCurrentPage(1);
  };

  // Pagination range
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

  // ── Filter sidebar content (shared between desktop & mobile) ───────

  const filterContent = (
    <div className="space-y-6">
      {/* Store filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.store", { defaultValue: "Store" })}
        </h3>
        <div className="space-y-2">
          {ALL_STORES.map((store) => (
            <label
              key={store}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={selectedStores.includes(store)}
                onCheckedChange={() =>
                  toggleFilter(selectedStores, store, setSelectedStores)
                }
              />
              <span
                className="inline-flex items-center gap-1.5 text-sm text-slate-700 group-hover:text-slate-900"
              >
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

      {/* Category filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.category", { defaultValue: "Category" })}
        </h3>
        <div className="space-y-2">
          {ALL_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() =>
                  toggleFilter(selectedCategories, cat, setSelectedCategories)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.condition", { defaultValue: "Condition" })}
        </h3>
        <div className="space-y-2">
          {ALL_CONDITIONS.map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={selectedConditions.includes(cond)}
                onCheckedChange={() =>
                  toggleFilter(selectedConditions, cond, setSelectedConditions)
                }
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {cond}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          {t("catalog.priceRange", { defaultValue: "Price Range" })}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => {
              setPriceMin(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          />
          <span className="text-slate-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => {
              setPriceMax(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
          />
        </div>
      </div>

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
            {t("catalog.title", { defaultValue: "Product Catalog" })}
          </span>
        </nav>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t("catalog.title", { defaultValue: "Product Catalog" })}
          </h1>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("catalog.searchPlaceholder", {
                defaultValue: "Search products...",
              })}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-shadow"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
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
            {/* Results count */}
            <p className="text-sm text-slate-500 mb-4">
              {t("catalog.showing", {
                count: filtered.length,
                defaultValue: `${filtered.length} products found`,
              })}
            </p>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="max-w-sm mx-auto space-y-3">
                  <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {t("catalog.noResults", {
                      defaultValue: "No products found",
                    })}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("catalog.noResultsHint", {
                      defaultValue:
                        "Try adjusting your filters or search terms.",
                    })}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: colors.active.icon }}
                  >
                    {t("catalog.clearFilters", {
                      defaultValue: "Clear all filters",
                    })}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map((product) => (
                    <div
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
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
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
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(totalPages, p + 1)
                              )
                            }
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
