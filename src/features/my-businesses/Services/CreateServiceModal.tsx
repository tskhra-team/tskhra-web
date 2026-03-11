import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/context/ModalContext";
import {
  createServiceSchema,
  type ServiceType,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import useCreateBusinessService from "@/features/business-creation/booking-business/useCreateBusinessService";
import queryClient from "@/query/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreateServiceModalProps {
  businessId: string;
  onShowCreateModal: (show: boolean) => void;
}

export default function CreateServiceModal({
  businessId,
  onShowCreateModal,
}: CreateServiceModalProps) {
  const { t } = useTranslation("booking");
  const { mutate: createBusinessService } = useCreateBusinessService();
  const { showModal } = useModal();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createServiceSchema(t)),
  });

  const onSubmit = (data: ServiceType) => {
    const services = [data];

    (showModal(
      "pending",
      "Adding service",
      "Please wait, adding your service...",
    ),
      createBusinessService(
        { businessId, services },
        {
          onSuccess: () => {
            showModal(
              "success",
              "Suceess",
              "Service was created successfully",
              "Great",
              () => {
                onShowCreateModal(false);
              },
            );

            queryClient.invalidateQueries({ queryKey: ["getMyServices"] });
          },

          onError: () =>
            showModal(
              "error",
              "Something went wrong",
              "Service did't created, plase try again",
            ),
        },
      ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white relative rounded-2xl shadow-2xl p-8 w-180 max-w-[90vw] flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
        <X
          onClick={() => onShowCreateModal(false)}
          className="cursor-pointer top-0 right-0 h-5 w-5 absolute m-5"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-10 justify-start"
        >
          <div className="flex gap-7">
            <div className="flex flex-col w-full gap-2">
              <Label>Service Name</Label>
              <Input placeholder="Example: Haircut" {...register("name")} />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label>Price(₾)</Label>
              <Input
                type="number"
                placeholder="0.00"
                step={0.01}
                {...register("price")}
              />
              {errors.price && (
                <span className="text-red-500 text-sm">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label>Duration(minutes)</Label>
              <Input
                type="number"
                placeholder="30"
                step={5}
                {...register("duration")}
              />
              {errors.duration && (
                <span className="text-red-500 text-sm">
                  {errors.duration.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description(optional)</Label>
            <Input {...register("description")} />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <Button type="submit" className="mt-5 cursor-pointer">
            Add service
          </Button>
        </form>
      </div>
    </div>
  );
}
