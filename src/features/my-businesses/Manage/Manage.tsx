import { Button } from "@/components/ui/button";
import { useModal } from "@/context/ModalContext";
import useDeleteBusiness from "@/features/my-businesses/Manage/useDeleteBusiness";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import queryClient from "@/query/queryClient";
import { useNavigate } from "react-router-dom";

type ManageBusinessProps = {
  currentBusiness?: MyBusinessResponse;
};

export default function Manage({ currentBusiness }: ManageBusinessProps) {
  const { mutate: deleteBusiness } = useDeleteBusiness();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const handleClick = (businessId: string | undefined) => {
    if (!businessId) return;

    showModal(
      "warning",
      `Delete ${currentBusiness?.businessName}`,
      "Are you sure you want to delete this business",
      "Close",
      () => {},
      "Delete",
      () => {
        deleteBusiness(businessId, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["getMyBusinesses"],
            });

            showModal(
              "success",
              "Success",
              "This business was successfully delete",
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
    <div>
      Delete this business {currentBusiness?.businessName}?
      <Button
        className="text-red-700"
        onClick={() => handleClick(currentBusiness?.businessId)}
      >
        Delete
      </Button>
    </div>
  );
}
