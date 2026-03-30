import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useModal } from "@/context/ModalContext";
import {
  createServiceSchema,
  type ServiceType,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import useUpdateService from "@/features/my-businesses/Services/hooks/useUpdateService";
import type { UpdateBusinessProps } from "@/features/my-businesses/Services/MyServices";
import ServiceModalShell from "@/features/my-businesses/Services/ServiceModalShell";
import queryClient from "@/query/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircleAlert, CircleQuestionMark } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface CreateServiceModalProps {
  businessId: string;
  service: UpdateBusinessProps;
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
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createServiceSchema(t)),
    defaultValues: {
      isEnglish: service.name === service.nameKa ? false : true,
      nameKa: service.nameKa,
      name: service.name ?? "",
      price: service.price,
      duration: service.duration,
      description: service.description,
      descriptionKa: service.descriptionKa,
    },
  });

  const isEnglish = watch("isEnglish");

  const onSubmit = (data: ServiceType) => {
    if (!data.isEnglish) {
      data.name = "";
      data.description = "";
    }

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

            queryClient.invalidateQueries({
              queryKey: ["getMyServices", businessId],
            });
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
    <ServiceModalShell onClose={() => onShowUpdateModal(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-5 justify-start"
      >
        <div className="flex items-center justify-end text-center mt-2">
          <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger className="pr-2 md:pr-5 flex">
              <Label className="pr-2 ">{t("booking:form.addEnglish")}</Label>
              <CircleQuestionMark className="h-4 w-4" />
            </HoverCardTrigger>
            <HoverCardContent>
              <CircleAlert className="h-4 w-4 mb-2 font-semibold" />
              <span className="font-semibold text-sm">
                {t("booking:form.addEnglishDesc")}
              </span>
            </HoverCardContent>
          </HoverCard>
          <Controller
            name="isEnglish"
            control={control}
            render={({ field }) => (
              <Switch
                size="default"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="cursor-pointer"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col w-full gap-2">
            <Label>{t("dashboard:services.form.serviceName")}</Label>
            <Input
              placeholder={t("dashboard:services.form.serviceNamePlaceholder")}
              {...register("nameKa")}
            />
            {errors.nameKa && (
              <span className="text-red-500 text-sm">
                {errors.nameKa.message}
              </span>
            )}
          </div>

          {isEnglish && (
            <div className="flex flex-col w-full gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label>{t("booking:form.serviceNameEN")}</Label>
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
          )}

          <div className="flex gap-4">
            <div className="flex flex-col justify-between w-full gap-2">
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
              {...register("descriptionKa")}
            />
            {errors.descriptionKa && (
              <span className="text-red-500 text-sm">
                {errors.descriptionKa.message}
              </span>
            )}
          </div>

          {isEnglish && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label>{t("booking:form.serviceDescriptionEN")}</Label>
              <Input
                placeholder={t(
                  "dashboard:services.form.descriptionPlaceholder",
                )}
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
          )}
        </div>

        <Button type="submit" className="mt-5 cursor-pointer">
          {t("dashboard:services.form.update")}
        </Button>
      </form>
    </ServiceModalShell>
  );
}
