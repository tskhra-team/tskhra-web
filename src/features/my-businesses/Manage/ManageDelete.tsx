import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import useDeleteBusiness from "@/features/my-businesses/Manage/useDeleteBusiness";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import queryClient from "@/query/queryClient";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ManageBusinessProps = {
  currentBusiness?: MyBusinessResponse;
};

export default function ManageDelete({ currentBusiness }: ManageBusinessProps) {
  const { mutate: deleteBusiness } = useDeleteBusiness();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboard", "modal"]);

  const handleClick = () => {
    if (!currentBusiness?.businessId) return;

    showModal(
      "warning",
      `${t("manage.deleteBusiness")} ${currentBusiness.businessName}`,
      t("modal:messages.deleteBusinessWarn"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.delete"),
      () => {
        deleteBusiness(currentBusiness.businessId, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["getMyBusinesses"],
            });

            showModal(
              "success",
              t("modal:titles.successful"),
              t("modal:messages.deleteBusinessSuccess"),
            );

            navigate("/my-businesses");
          },
          onError: () => {
            showModal(
              "error",
              "Business did't deleted!",
              "Something went wrong, plese try again",
            );
          },
        });
      },
    );
  };

  return (
    <div className="mt-10 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-red-100 p-2.5">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-red-900">
              {t("manage.deleteBusiness")}
            </h3>
            <p className="text-sm text-red-700/80">
              {t("modal:messages.deleteBusinessWarn")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 cursor-pointer"
            onClick={handleClick}
          >
            <Trash2 className="h-4 w-4" />
            {t("manage.deleteBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
