import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/context/ModalContext";
import {
  createServiceSchema,
  createServicesFormSchema,
  type ServiceType,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import queryClient from "@/query/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useCreateBusinessService from "./useCreateBusinessService";

export default function ServiceForm() {
  const { t } = useTranslation(["booking", "modal"]);
  const navigate = useNavigate();
  const { mutate: createBusinessService, isPending } =
    useCreateBusinessService();
  const { showModal, closeModal } = useModal();

  const [newService, setNewService] = useState({
    name: "",
    nameEn: "",
    price: 0,
    duration: 0,
    description: "",
    descriptionEn: "",
  });
  const [serviceError, setServiceError] = useState("");

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createServicesFormSchema(t)) as any,
    defaultValues: {
      services: [] as ServiceType[],
    },
  });

  const services = watch("services");

  const addService = async () => {
    setServiceError("");

    try {
      await createServiceSchema(t).validate(newService, { abortEarly: false });

      const currentServices = services || [];
      setValue("services", [
        ...currentServices,
        {
          name: newService.name,
          price: newService.price,
          duration: newService.duration,
          description: newService.description,
        },
      ]);

      setNewService({
        name: "",
        nameEn: "",
        price: 0,
        duration: 0,
        description: "",
        descriptionEn: "",
      });
    } catch (error: any) {
      if (error.errors && error.errors.length > 0) {
        setServiceError(error.errors[0]);
      } else {
        setServiceError(error.message);
      }
    }
  };

  const removeService = (index: number) => {
    const currentServices = services || [];
    setValue(
      "services",
      currentServices.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: { services: ServiceType[] }) => {
    const businessId = localStorage.getItem("businessId");

    if (!businessId) {
      showModal(
        "error",
        t("modal:titles.cantFindBusiness"),
        t("modal:messages.businessNotFound"),
        t("modal:buttons.goBack"),
        () => {
          navigate("/create-business?business=booking&type=individual&step=1");
        },
      );
      return;
    }

    showModal(
      "pending",
      t("modal:titles.addingServices"),
      t("modal:messages.pleaseWait"),
    );

    createBusinessService(
      { businessId, services: data.services },
      {
        onSuccess: () => {
          localStorage.removeItem("businessId");
          showModal(
            "success",
            t("modal:titles.success"),
            t("modal:messages.servicesAddedSuccess"),
            t("modal:buttons.goToHome"),
            () => {
              queryClient.invalidateQueries({
                queryKey: ["getMyBusinesses"],
              });
              navigate("/my-businesses");
            },
          );
        },
        onError: () => {
          closeModal();
          showModal(
            "error",
            t("modal:titles.error"),
            t("booking:messages.error"),
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-6 pb-16 px-4"
    >
      {/* Add Service Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.addService")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.addServiceSub")}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.serviceName")}
              </Label>
              <Input
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder={t("booking:form.serviceNamePlaceholder")}
                className="h-11 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.serviceNameEN")}
              </Label>
              <Input
                value={newService.nameEn}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder={t("booking:form.serviceNamePlaceholder")}
                className="h-11 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.price")}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={newService.price || ""}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    price: Number(e.target.value),
                  })
                }
                placeholder={t("booking:form.pricePlaceholder")}
                className="h-11 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.duration")}
              </Label>
              <Input
                type="number"
                step="5"
                min="5"
                value={newService.duration || ""}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    duration: Number(e.target.value),
                  })
                }
                placeholder={t("booking:form.durationPlaceholder")}
                className="h-11 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              {t("booking:form.serviceDescription")}
            </Label>
            <Input
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder={t("booking:form.serviceDescriptionPlaceholder")}
              className="h-11 transition-all"
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              {t("booking:form.serviceDescriptionEN")}
            </Label>
            <Input
              value={newService.descriptionEn}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder={t("booking:form.serviceDescriptionPlaceholder")}
              className="h-11 transition-all"
            />
          </div>
          <Button
            type="button"
            onClick={addService}
            className="w-full h-11 font-medium transition-all"
            variant="outline"
          >
            {t("booking:form.addService")}
          </Button>

          {serviceError && (
            <p className="text-sm text-red-500 font-medium text-center bg-red-50 p-3 rounded-lg">
              {serviceError}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Services List Card */}
      {services && services.length > 0 && (
        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6 space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {t("booking:form.services")} ({services.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("booking:form.servicesHelp")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group flex items-start justify-between p-5 border border-border/50 rounded-lg bg-background/50 hover:border-border hover:shadow-md transition-all"
                >
                  <div className="flex-1 space-y-1.5">
                    <p className="font-semibold text-base">{service.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">
                        {service.price} ₾
                      </span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>
                        {service.duration} {t("booking:form.minutes")}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    {t("booking:form.delete")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {errors.services &&
        !Array.isArray(errors.services) &&
        services.length === 0 && (
          <p className="text-sm text-red-500 font-medium bg-red-50 p-4 rounded-lg text-center">
            {errors.services.message as string}
          </p>
        )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending || !services || services.length === 0}
          size="lg"
          className="px-16 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {isPending ? t("booking:form.processing") : t("booking:form.submit")}
        </Button>
      </div>
    </form>
  );
}
