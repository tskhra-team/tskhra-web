import { useQuery } from "@tanstack/react-query";
import { mockCategories } from "./mockData";
import type { CategoryItem, Platform } from "./types";
import useGetSubBookingCategories, { type Category } from "@/shared/api/useGetSubBookingCategories";
import useGetMainEcommerceCategories, { type EcommerceCategory } from "@/shared/api/useGetMainEcommerceCategories";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getCategoryIcon } from "./categoryIconMapping";

function filterByPlatform(items: CategoryItem[], platform: Platform): CategoryItem[] {
  return items
    .filter((x) => !x.platforms || x.platforms.includes(platform))
    .map((x) => ({
      ...x,
      childItems: x.childItems ? filterByPlatform(x.childItems, platform) : [],
    }));
}

function transformCategories(categories: Category[], platform: Platform): CategoryItem[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: getCategoryIcon(cat.name, platform),
    iconUrl: cat.iconUrl || undefined,
    platforms: [platform],
    childItems: cat.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      icon: getCategoryIcon(sub.name, platform),
      iconUrl: sub.iconUrl || undefined,
      platforms: [platform],
    })),
  }));
}

function transformEcommerceCategories(categories: EcommerceCategory[]): CategoryItem[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    url: cat.slug,
    icon: getCategoryIcon(cat.name, "ecommerce"),
    imageUrl: cat.image_url || undefined,
    platforms: ["ecommerce" as Platform],
  }));
}

// Mock function that simulates API call (used for swapping temporarily)
async function fetchMockCategories(): Promise<CategoryItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCategories;
}

export function useCategories(platform: Platform) {
  // For booking platform, use real API data
  if (platform === "booking") {
    const { i18n } = useTranslation();
    const lang = i18n.language?.toUpperCase() || "KA";
    const { data: categories, isLoading, error } = useGetSubBookingCategories(lang);

    const transformedData = useMemo(() => {
      if (categories) {
        return transformCategories(categories, platform);
      }
      return [];
    }, [categories, platform]);

    return {
      data: transformedData,
      isLoading,
      error,
    };
  }

  // For ecommerce platform, use Python API
  if (platform === "ecommerce") {
    const { data: categories, isLoading, error } = useGetMainEcommerceCategories();

    const transformedData = useMemo(() => {
      if (categories) {
        return transformEcommerceCategories(categories);
      }
      return [];
    }, [categories]);

    return {
      data: transformedData,
      isLoading,
      error,
    };
  }

  // For swapping, use mock data temporarily
  return useQuery({
    queryKey: ["categories", platform],
    queryFn: fetchMockCategories,
    staleTime: 1000 * 60 * 10, // 10 min
    select: (data) => filterByPlatform(data, platform),
  });
}
