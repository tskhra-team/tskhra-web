import { useQuery } from "@tanstack/react-query";
import { mockCategories } from "./mockData";
import type { CategoryItem, Platform } from "./types";

function filterByPlatform(items: CategoryItem[], platform: Platform): CategoryItem[] {
  return items
    .filter((x) => !x.platforms || x.platforms.includes(platform))
    .map((x) => ({
      ...x,
      childItems: x.childItems ? filterByPlatform(x.childItems, platform) : [],
    }));
}

// Mock function that simulates API call
async function fetchCategories(): Promise<CategoryItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCategories;
}

export function useCategories(platform: Platform) {
  return useQuery({
    queryKey: ["categories", platform],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 min
    select: (data) => filterByPlatform(data, platform),
  });
}
