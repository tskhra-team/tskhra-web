import HistoryBreadcrumb from "@/Swapping/SwapCatalog/HistoryBreadcrumb";
import MainCatalogContent from "@/Swapping/SwapCatalog/MainCatalogContent";
import { SwapSearch } from "@/Swapping/SwapSearch";

export default function SwapCatalog() {
  return (
    <div className="px-20">
      <SwapSearch
        style={{ marginTop: "25px", padding: "0px" }}
        animation={false}
      />
      <HistoryBreadcrumb />
      <MainCatalogContent />
    </div>
  );
}
