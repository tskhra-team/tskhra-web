import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/context/ModalContext";
import {
  createServiceSchema,
  type ServiceType,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import type { ServiceResponse } from "@/features/my-businesses/Services/hooks/useGetMyServices";
import useUpdateService from "@/features/my-businesses/Services/hooks/useUpdateService";
import queryClient from "@/query/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreateServiceModalProps {
  businessId: string;
  service: ServiceResponse;
  onShowUpdateModal: (show: boolean) => void;
}

export default function UpdateServiceModal({
  businessId,
  service,
  onShowUpdateModal,
}: CreateServiceModalProps) {
  const { t } = useTranslation(["dashboard", "booking", "modal"]);
  const { mutate: updateService } = useUpdateService();
  const { showModal } = useModal();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createServiceSchema(t)),
    defaultValues: {
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
    },
  });

  const onSubmit = (data: ServiceType) => {
    (showModal(
      "pending",
      t("modal:titles.updatingService"),
      t("modal:messages.updatingServiceWait"),
    ),
      updateService(
        { businessId, service: data, serviceId: service.id },
        {
          onSuccess: () => {
            showModal(
              "success",
              t("modal:titles.success"),
              t("modal:messages.serviceUpdatedSuccess"),
              t("modal:buttons.great"),
              () => {
                onShowUpdateModal(false);
              },
            );

            queryClient.invalidateQueries({ queryKey: ["getMyServices"] });
          },

          onError: () =>
            showModal(
              "error",
              t("modal:titles.somethingWentWrong"),
              t("modal:messages.serviceDidntUpdated"),
            ),
        },
      ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white relative rounded-2xl shadow-2xl p-8 w-180 max-w-[90vw] flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 h-auto">
        <X
          onClick={() => onShowUpdateModal(false)}
          className="cursor-pointer top-0 right-0 h-5 w-5 absolute m-5"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-10 justify-start"
        >
          <div className="flex lg:gap-7 lg:flex-row flex-col gap-6">
            <div className="flex flex-col w-full gap-2">
              <Label>{t("dashboard:services.form.serviceName")}</Label>
              <Input
                placeholder={t(
                  "dashboard:services.form.serviceNamePlaceholder",
                )}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-full gap-2">
              <Label>{t("dashboard:services.form.price")}</Label>
              <Input
                type="number"
                placeholder={t("dashboard:services.form.pricePlaceholder")}
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
              <Label>{t("dashboard:services.form.duration")}</Label>
              <Input
                type="number"
                placeholder={t("dashboard:services.form.durationPlaceholder")}
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
            <Label>{t("dashboard:services.form.description")}</Label>
            <Input
              placeholder={t("dashboard:services.form.descriptionPlaceholder")}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <Button type="submit" className="mt-5 cursor-pointer">
            {t("dashboard:services.form.update")}
          </Button>
        </form>
      </div>
    </div>
  );
}
