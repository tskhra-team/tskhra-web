import type { CategoryItem, Platform } from "./types";
import { getCategoryIcon } from "./categoryIconMapping";

/**
 * Transform API category data to CategoryItem structure
 * @param mainCategories - Array of main category names from API
 * @param subCategories - Record mapping main category names to subcategory arrays
 * @param platform - The platform (booking, ecommerce, swapping)
 * @returns Array of CategoryItem with proper structure
 */
export function transformApiCategories(
  mainCategories: string[],
  subCategories: Record<string, string[]>,
  platform: Platform
): CategoryItem[] {
  return mainCategories.map((categoryName) => {
    const childCategoryNames = subCategories[categoryName] || [];

    return {
      name: categoryName,
      icon: getCategoryIcon(categoryName, platform),
      platforms: [platform],
      childItems: childCategoryNames.map((subCategoryName) => ({
        name: subCategoryName,
        icon: getCategoryIcon(subCategoryName, platform),
        platforms: [platform],
      })),
    };
  });
}
