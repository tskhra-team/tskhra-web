import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { Loader2, Plus, Store } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useGetSellerProfiles from "./hooks/useGetSellerProfiles";
import RegisterSellerForm from "./RegisterSellerForm";
import SellerProfileCard from "./SellerProfileCard";

export default function SellerProfilesTab() {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { data: profile } = useGetProfile();
  const { data, isLoading, error } = useGetSellerProfiles();
  const [showForm, setShowForm] = useState(false);

  const handleRegister = () => {
    if (!profile?.status) {
      showModal(
        "error",
        t("sellerProfiles.errors.notVerifiedTitle"),
        t("sellerProfiles.errors.notVerifiedMessage"),
        t("sellerProfiles.errors.close"),
        () => {},
        t("sellerProfiles.errors.goToVerify"),
        () => {
          navigate("/verification");
        },
      );
      return;
    }
    setShowForm(true);
  };

  if (showForm) {
    return <RegisterSellerForm onBack={() => setShowForm(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const sellers = Array.isArray(data) ? data : data?.sellers || [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {t("sellerProfiles.title")}
        </h2>
        <Button onClick={handleRegister} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          {t("sellerProfiles.addNew")}
        </Button>
      </div>

      {sellers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="p-6 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
            <Store className="w-16 h-16 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {t("sellerProfiles.emptyTitle")}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {t("sellerProfiles.emptyDescription")}
          </p>
          <Button onClick={handleRegister} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            {t("sellerProfiles.registerFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <SellerProfileCard key={seller.supplier_id} profile={seller} />
          ))}
        </div>
      )}
    </div>
  );
}
