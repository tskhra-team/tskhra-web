import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import useDeleteBusiness from "@/features/my-businesses/Manage/useDeleteBusiness";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import queryClient from "@/query/queryClient";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ManageBusinessProps = {
  currentBusiness?: MyBusinessResponse;
};

export default function Manage({ currentBusiness }: ManageBusinessProps) {
  const { mutate: deleteBusiness } = useDeleteBusiness();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const { t } = useTranslation(["dashboard", "modal"]);

  const handleClick = (businessId: string | undefined) => {
    if (!businessId) return;

    showModal(
      "warning",
      `${t("manage.deleteBusiness")} ${currentBusiness?.businessName}`,
      t("modal:messages.deleteBusinessWarn"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.delete"),
      () => {
        deleteBusiness(businessId, {
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
    <div className=" flex gap-8 justify-center items-center mt-10">
      {t("manage.deleteBusiness")} {currentBusiness?.businessName}?
      <Button
        variant="ghost"
        className="text-red-700 cursor-pointer"
        onClick={() => handleClick(currentBusiness?.businessId)}
      >
        {t("manage.deleteBtn")}
      </Button>
    </div>
  );
}
