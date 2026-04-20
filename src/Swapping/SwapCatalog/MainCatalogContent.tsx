import FilterSwapCatalog from "@/Swapping/SwapCatalog/FilterSwapCatalog";
import SwapCatalogCards from "@/Swapping/SwapCatalog/SwapCatalogCards";

export default function MainCatalogContent() {
  return (
    <div className="flex gap-8 mb-10 flex-col lg:flex-row">
      <FilterSwapCatalog />
      <SwapCatalogCards />
    </div>
  );
}
