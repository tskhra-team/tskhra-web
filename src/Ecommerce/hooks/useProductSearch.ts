import { useMemo } from "react";
import {
  MOCK_PRODUCTS,
  type Product,
  type Store,
  type Condition,
} from "../ProductCatalog";

export type SortOption = "newest" | "price-low-high" | "price-high-low" | "most-popular";

export interface SearchParams {
  query: string;
  sort: SortOption;
  categories: string[];
  conditions: Condition[];
  stores: Store[];
  minPrice: number | null;
  maxPrice: number | null;
  onlyBoosted: boolean;
}

export interface SearchResult {
  products: Product[];
  total: number;
  isLoading: boolean;
}

export function useProductSearch(params: SearchParams): SearchResult {
  const { query, sort, categories, conditions, stores, minPrice, maxPrice, onlyBoosted } = params;

  const products = useMemo(() => {
    let results = MOCK_PRODUCTS.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (conditions.length && !conditions.includes(p.condition)) return false;
      if (stores.length && !stores.includes(p.store)) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (onlyBoosted && !p.boosted) return false;
      return true;
    });

    switch (sort) {
      case "price-low-high":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "most-popular":
        // Mock: boosted items first, then by id desc
        results = [...results].sort((a, b) => {
          if (a.boosted && !b.boosted) return -1;
          if (!a.boosted && b.boosted) return 1;
          return b.id - a.id;
        });
        break;
      case "newest":
      default:
        // Keep original order (newest = highest id first for mock)
        results = [...results].sort((a, b) => b.id - a.id);
        break;
    }

    return results;
  }, [query, sort, categories, conditions, stores, minPrice, maxPrice, onlyBoosted]);

  return {
    products,
    total: products.length,
    isLoading: false,
  };
}
