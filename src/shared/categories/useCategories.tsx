import { useQuery } from "@tanstack/react-query";
import { mockCategories } from "./mockData";
import type { CategoryItem, Platform } from "./types";
import useGetMainBookingCategories from "@/shared/api/useGetMainBookingCategories";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { transformApiCategories } from "./transformApiCategories";
import { useMemo } from "react";

function filterByPlatform(items: CategoryItem[], platform: Platform): CategoryItem[] {
  return items
    .filter((x) => !x.platforms || x.platforms.includes(platform))
    .map((x) => ({
      ...x,
      childItems: x.childItems ? filterByPlatform(x.childItems, platform) : [],
    }));
}

// Mock function that simulates API call (used for ecommerce and swapping temporarily)
async function fetchMockCategories(): Promise<CategoryItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCategories;
}

export function useCategories(platform: Platform) {
  // For booking platform, use real API data
  if (platform === "booking") {
    const { data: mainCategories, isLoading: isLoadingMain, error: errorMain } = useGetMainBookingCategories();
    const { data: subCategories, isLoading: isLoadingSub, error: errorSub } = useGetSubBookingCategories();

    const transformedData = useMemo(() => {
      if (mainCategories && subCategories) {
        return transformApiCategories(mainCategories, subCategories, platform);
      }
      return [];
    }, [mainCategories, subCategories, platform]);

    return {
      data: transformedData,
      isLoading: isLoadingMain || isLoadingSub,
      error: errorMain || errorSub,
    };
  }

  // For ecommerce and swapping, use mock data temporarily
  return useQuery({
    queryKey: ["categories", platform],
    queryFn: fetchMockCategories,
    staleTime: 1000 * 60 * 10, // 10 min
    select: (data) => filterByPlatform(data, platform),
  });
}
