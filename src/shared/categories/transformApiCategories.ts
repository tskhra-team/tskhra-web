import type { CategoryItem, Platform } from "./types";
import { getCategoryIcon } from "./categoryIconMapping";
import { getCategoryIconFilename } from "./categoryIconFileMapping";

const ICON_BASE_URL = "http://10.227.164.247:9000/ui-assets";

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
    const iconFilename = getCategoryIconFilename(categoryName);

    return {
      name: categoryName,
      icon: getCategoryIcon(categoryName, platform),
      iconUrl: iconFilename ? `${ICON_BASE_URL}/${iconFilename}` : undefined,
      platforms: [platform],
      childItems: childCategoryNames.map((subCategoryName) => ({
        name: subCategoryName,
        icon: getCategoryIcon(subCategoryName, platform),
        platforms: [platform],
      })),
    };
  });
}
