import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createServiceSchema,
  createServicesFormSchema,
  type ServiceType,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useCreateBusinessService from "./useCreateBusinessService";

export default function ServiceForm() {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();
  const createBusinessService = useCreateBusinessService();

  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
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

      setNewService({ name: "", price: 0, duration: 0, description: "" });
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

  const onSubmit = async (data: { services: ServiceType[] }) => {
    try {
      const businessId = localStorage.getItem("businessId");

      if (!businessId) {
        alert(t("booking:messages.businessIdNotFound"));
        navigate("/create-business?business=booking&type=individual&step=1");
        return;
      }

      await createBusinessService.mutateAsync({
        businessId,
        services: data.services,
      });

      localStorage.removeItem("businessId");
      alert(t("booking:messages.successPublished"));
      navigate("/");
    } catch (error) {
      console.error("Error submitting services:", error);
      alert(t("booking:messages.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Services */}
      <div className="mb-16">
        <Label className="block text-lg font-medium mb-2">
          {t("booking:form.services")}
        </Label>

        {/* Add Service Form */}
        <div className="border rounded-md p-4 mb-4 space-y-3 bg-muted/20">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="block text-xs font-medium mb-1">
                {t("booking:form.serviceName")}
              </Label>
              <Input
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder={t("booking:form.serviceNamePlaceholder")}
              />
            </div>
            <div>
              <Label className="block text-xs font-medium mb-1">
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
              />
            </div>
            <div>
              <Label className="block text-xs font-medium mb-1">
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
              />
            </div>
          </div>
          <div>
            <Label className="block text-xs font-medium mb-1">
              {t("booking:form.serviceDescription")}
            </Label>
            <Input
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder={t("booking:form.serviceDescriptionPlaceholder")}
            />
          </div>
          <Button
            type="button"
            onClick={addService}
            className="w-full"
            variant="outline"
          >
            {t("booking:form.addService")}
          </Button>

          {serviceError && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {serviceError}
            </p>
          )}
        </div>

        {/* Services List */}
        {services && services.length > 0 && (
          <div className="space-y-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex-1">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-gray-600">
                    {service.price} ₾ • {service.duration}{" "}
                    {t("booking:form.minutes")}
                  </p>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {service.description}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t("booking:form.delete")}
                </Button>
              </div>
            ))}
          </div>
        )}

        {errors.services &&
          !Array.isArray(errors.services) &&
          services.length === 0 && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.services.message as string}
            </p>
          )}
        <p className="text-xs text-gray-500 mt-1">
          {t("booking:form.servicesHelp")}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={createBusinessService.isPending}
          className="p-8 cursor-pointer"
        >
          {createBusinessService.isPending
            ? t("booking:form.processing")
            : t("booking:form.addBusiness")}
        </Button>
      </div>
    </form>
  );
}
