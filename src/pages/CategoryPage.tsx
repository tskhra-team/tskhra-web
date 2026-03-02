import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/shared/categories/useCategories";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { getPlatformColors } from "@/shared/categories/platformColors";
import type { Platform } from "@/shared/categories/types";
import SubcategoryGrid from "@/shared/categories/SubcategoryGrid";
import Loader from "@/components/Loader";

export default function CategoryPage() {
  const { platform, categorySlug } = useParams<{ platform: Platform; categorySlug: string }>();
  const { data: categories, isLoading, error } = useCategories(platform as Platform);
  const { t } = useTranslation("categories");
  const colors = getPlatformColors(platform as Platform);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 text-sm text-red-600">{error.message}</div>
      </div>
    );
  }

  // Find the category by slug
  const category = categories?.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  if (!category) {
    return <Navigate to={`/${platform}`} replace />;
  }

  const translationKey = categoryNameToKey[category.name];
  const categoryDisplayName = translationKey ? t(translationKey) : category.name;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.active.text }}>
          {categoryDisplayName}
        </h1>
        <p className="text-muted-foreground">
          {t('selectSubcategory', { defaultValue: 'Select a subcategory to view available services' })}
        </p>
      </div>

      {/* Subcategories Grid */}
      {category.childItems && category.childItems.length > 0 ? (
        <SubcategoryGrid
          subcategories={category.childItems}
          platform={platform as Platform}
          categorySlug={categorySlug!}
        />
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          {t('noSubcategories', { defaultValue: 'No subcategories available.' })}
        </div>
      )}
    </div>
  );
}
