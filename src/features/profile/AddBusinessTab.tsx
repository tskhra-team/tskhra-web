import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { scrollToTop } from "@/utils";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AddBusinessTab() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const { data: profile } = useGetProfile();
  const { showModal } = useModal();

  const handleAddBusiness = () => {
    if (!profile?.status) {
      showModal(
        "error",
        "You aren't verified!",
        "To create a business you need to verify",
        "Close",
        () => {},
        "Go to verifications",
        () => {
          window.open("/verification", "_blank");
        },
      );
    } else {
      scrollToTop();
      navigate("/create-business");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="text-center mb-6">
            <div className="p-6 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-full w-fit mx-auto mb-4">
              <Building2 className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
              {t("addBusiness.title")}
            </h2>
            <p className="text-slate-500 leading-relaxed">
              {t("addBusiness.description")}
            </p>
          </div>
          <Button
            onClick={handleAddBusiness}
            className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md"
          >
            {t("addBusiness.button")}
          </Button>
        </div>
      </div>
    </>
  );
}
