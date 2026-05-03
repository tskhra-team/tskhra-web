import { Button } from "@/components/ui/button";
import { Loader2, Package, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useDeleteDraft from "./hooks/useDeleteDraft";
import useDeleteProduct from "./hooks/useDeleteProduct";
import useGetMyProducts from "./hooks/useGetMyProducts";
import useGetSellerProfiles from "./hooks/useGetSellerProfiles";
import VendorProductCard from "./VendorProductCard";

export default function MyProductsTab() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  const { data: sellerData } = useGetSellerProfiles();
  const sellers = Array.isArray(sellerData)
    ? sellerData
    : sellerData?.sellers || [];
  const activeSeller = sellers.find((s) => s.status === "ACTIVE");

  const { data, isLoading } = useGetMyProducts(activeSeller?.supplier_id);
  const deleteMutation = useDeleteProduct();
  const deleteDraftMutation = useDeleteDraft();

  if (!activeSeller) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="p-6 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
            <Package className="w-16 h-16 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {t("myProducts.noSellerTitle")}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {t("myProducts.noSellerDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const liveProducts = data?.live_products || [];
  const drafts = data?.drafts || [];
  const hasProducts = liveProducts.length > 0 || drafts.length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {t("myProducts.title")}
        </h2>
        <Button
          onClick={() => navigate("/create-business?business=ecommerce")}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("myProducts.addProduct")}
        </Button>
      </div>

      {!hasProducts ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="p-6 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
            <Package className="w-16 h-16 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {t("myProducts.emptyTitle")}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {t("myProducts.emptyDescription")}
          </p>
          <Button
            onClick={() => navigate("/create-business?business=ecommerce")}
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("myProducts.addFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {drafts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                {t("myProducts.draftsSection")}
              </h3>
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <VendorProductCard
                    key={draft.task_id}
                    title={draft.title || t("myProducts.untitled")}
                    price={draft.price || 0}
                    imageUrl={draft.cover_image_url}
                    status={draft.status === "PENDING" ? "pending" : "draft"}
                    onDelete={() =>
                      deleteDraftMutation.mutate({
                        supplierId: activeSeller.supplier_id,
                        taskId: draft.task_id,
                      })
                    }
                    isDeleting={deleteDraftMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}

          {liveProducts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                {t("myProducts.liveSection")}
              </h3>
              <div className="space-y-3">
                {liveProducts.map((product) => (
                  <VendorProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    imageUrl={product.cover_image_url}
                    status="live"
                    onDelete={() =>
                      deleteMutation.mutate({
                        supplierId: activeSeller.supplier_id,
                        productId: product.id,
                      })
                    }
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
