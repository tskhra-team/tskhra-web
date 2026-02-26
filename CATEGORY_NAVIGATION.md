# Category Navigation System

## Overview
A three-level navigation system for browsing services by categories and subcategories.

## URL Structure

```
/:platform/category/:categorySlug                    → Category page with all subcategories
/:platform/category/:categorySlug/:subcategorySlug   → Subcategory page with filtered services
```

### Examples:
- `/booking/category/photography` → Shows all Photography subcategories
- `/booking/category/photography/wedding` → Shows all Wedding photography services
- `/ecommerce/category/electronics/smartphones` → Shows all smartphone products

## Pages

### 1. CategoryPage ([CategoryPage.tsx](src/pages/CategoryPage.tsx))
- **Purpose**: Display all subcategories for a selected category
- **URL**: `/:platform/category/:categorySlug`
- **Features**:
  - Breadcrumb navigation
  - Grid of subcategory cards with images/icons
  - Hover effects with platform-specific colors
  - Responsive design (2-4 columns)

### 2. SubcategoryPage ([SubcategoryPage.tsx](src/pages/SubcategoryPage.tsx))
- **Purpose**: Display all services for a specific subcategory
- **URL**: `/:platform/category/:categorySlug/:subcategorySlug`
- **Features**:
  - Breadcrumb navigation (Platform → Category → Subcategory)
  - Service cards with images, pricing, location
  - Empty state with back button
  - Click to view service details

## Components

### SubcategoryGrid ([SubcategoryGrid.tsx](src/shared/categories/SubcategoryGrid.tsx))
- Renders a grid of subcategory cards
- Each card links to the subcategory page
- Platform-specific hover colors
- Animated entrance

### SubcategoryView ([SubcategoryView.tsx](src/shared/categories/SubcategoryView.tsx))
- Used in mobile accordion view and desktop hover panel
- Similar to SubcategoryGrid but used in different contexts
- Links to subcategory pages

### CategoryNav ([CategoryNav.tsx](src/shared/categories/CategoryNav.tsx))
- Desktop: Hover shows subcategory panel, click navigates to category page
- Mobile: Accordion-style dropdown with subcategories
- Links to category pages

## Navigation Flow

### Desktop Experience:
1. **Hover** on category → See subcategory panel
2. **Click** category → Go to category page with all subcategories
3. **Click** subcategory (from panel or category page) → Go to subcategory page with services
4. **Click** service → Go to service detail page

### Mobile Experience:
1. **Click** category → Expand accordion to show subcategories
2. **Click** category again → Navigate to category page
3. **Click** subcategory → Go to subcategory page with services
4. **Click** service → Go to service detail page

## Slug Generation

Categories and subcategories use URL-friendly slugs:
- Spaces are replaced with hyphens: `"Wedding Photography"` → `"wedding-photography"`
- Lowercase: `"Photography"` → `"photography"`

```typescript
const slug = name.toLowerCase().replace(/\s+/g, '-');
```

## Data Filtering

### Services are filtered by subcategoryId:
```typescript
const filteredServices = mockServices.filter(
  (service) => service.subcategoryId?.toLowerCase() === subcategory.name.toLowerCase()
);
```

### Mock data structure:
```typescript
{
  id: "1",
  title: "ქორწილის ფოტოგრაფია",
  categoryId: "Photography",
  subcategoryId: "Wedding",  // Used for filtering
  ...
}
```

## Translations

Category and subcategory names are translated using:
- `categoryTranslations.ts` - Maps category names to translation keys
- Translation files in `locales/` folders
- Falls back to original name if translation not found

## Platform Colors

Each platform has custom color schemes:
- **Booking**: Blue tones
- **Ecommerce**: Purple tones
- **Swapping**: Orange tones

Colors defined in [platformColors.ts](src/shared/categories/platformColors.ts)

## Future Enhancements

- [ ] API integration for dynamic service filtering
- [ ] Pagination for large service lists
- [ ] Filters (price, location, rating)
- [ ] Search within category/subcategory
- [ ] SEO optimization with meta tags
