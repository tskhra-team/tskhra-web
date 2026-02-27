import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createIndividualBusinessSchema,
  createServiceSchema,
  type IndividualBusinessFormData,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { useCategories } from "@/shared/categories/useCategories";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ServiceFormSkeleton from "./ServiceFormSkeleton";
import useCreaetIndividualBusiness from "./useCreateIndividualBusiness";
import useUploadPhotos from "./useUploadPhotos";
import WorkingSchedule from "./WorkingSchedule";

export default function IndividualBusinessForm() {
  const { t } = useTranslation(["categories", "booking"]);
  const { data: categories, isLoading } = useCategories("booking");
  const createBusiness = useCreaetIndividualBusiness();
  const uploadPhotos = useUploadPhotos();

  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
  });
  const [serviceError, setServiceError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IndividualBusinessFormData>({
    resolver: yupResolver(createIndividualBusinessSchema(t)) as any,
    defaultValues: {
      businessName: "",
      callType: undefined,
      city: "",
      address: "",
      description: "",
      images: {
        businessPhoto: [],
        galleryPhoto: [],
      },
      mainCategory: "",
      subCategory: "",
      workTimes: [],
      restTimes: [],
      services: [],
      info: {
        phoneNumber: "",
        facebookUrl: "",
        instagramUrl: "",
      },
    },
  });

  const callType = watch("callType");
  const mainCategory = watch("mainCategory");
  const services = watch("services");
  const selectedCategory = categories?.find((cat) => cat.name === mainCategory);

  const addService = async () => {
    setServiceError("");

    try {
      // Validate using the service schema
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
      // Display the first validation error
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

  const onSubmit = async (data: IndividualBusinessFormData) => {
    try {
      const result = await createBusiness.mutateAsync(data);
      // if (result.businessId && data.images) {
      //   await uploadPhotos.mutateAsync({
      //     businessId: result.businessId,
      //     data,
      //   });
      // }
      alert(t("booking:messages.successPublished"));
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("booking:messages.error"));
    }
  };

  const handleCategoryChange = (value: string) => {
    setValue("mainCategory", value);
    setValue("subCategory", "");
  };

  if (isLoading) {
    return <ServiceFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Business Name */}
      <div className="my-12">
        <Label className="block text-lg font-medium mb-2">
          {t("booking:form.businessName")}
        </Label>
        <Input {...register("businessName")} placeholder="" />
        {errors.businessName && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.businessName.message}
          </p>
        )}
      </div>

      {/* Call Type */}
      <div className="mb-12">
        <Label className="block text-lg font-medium mb-2">
          {t("booking:form.callTypeLabel")}
        </Label>
        <Controller
          name="callType"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={field.value === "outcall" ? "default" : "outline"}
                onClick={() => field.onChange("outcall")}
                className="flex-1"
              >
                {t("booking:form.callType.outcall")}
              </Button>
              <Button
                type="button"
                variant={field.value === "onsite" ? "default" : "outline"}
                onClick={() => field.onChange("onsite")}
                className="flex-1"
              >
                {t("booking:form.callType.onsite")}
              </Button>
              <Button
                type="button"
                variant={field.value === "both" ? "default" : "outline"}
                onClick={() => field.onChange("both")}
                className="flex-1"
              >
                {t("booking:form.callType.both")}
              </Button>
            </div>
          )}
        />
        {errors.callType && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.callType.message}
          </p>
        )}
      </div>

      {/* City and Address */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div>
          <Label className="block text-lg font-medium mb-2">{t("booking:form.city")}</Label>
          <Input {...register("city")} placeholder={t("booking:form.city")} />
          {errors.city && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label className="block text-lg font-medium mb-2">{t("booking:form.address")}</Label>
          <Input
            {...register("address")}
            disabled={callType === "outcall"}
            placeholder={t("booking:form.addressPlaceholder")}
          />

          {errors.address && callType !== "outcall" && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      {/* Detailed Description */}
      <div className="mb-12">
        <Label className="block text-lg font-medium mb-2">{t("booking:form.description")}</Label>
        <textarea
          {...register("description")}
          placeholder={t("booking:form.descriptionPlaceholder")}
          rows={6}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
        {errors.description && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Main Image */}
      <div className="mb-12">
        <Label className="block text-lg font-medium mb-2">
          {t("booking:form.mainImage")}
        </Label>
        <Controller
          name="images.businessPhoto"
          control={control}
          render={({ field }) => (
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              maxFiles={1}
            />
          )}
        />
        {errors.images?.businessPhoto && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.images.businessPhoto.message}
          </p>
        )}
      </div>

      {/* Gallery Images */}
      <div className="mb-14">
        <Label className="block text-lg font-medium mb-2 mt-4">
          {t("booking:form.galleryImages")}
        </Label>
        <Controller
          name="images.galleryPhoto"
          control={control}
          render={({ field }) => (
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              maxFiles={4}
            />
          )}
        />
        {errors.images?.galleryPhoto && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.images.galleryPhoto.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {t("booking:form.galleryHelp")}
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div>
          <Label className="block text-lg font-medium mb-2">
            {t("booking:form.category")}
          </Label>
          <Controller
            name="mainCategory"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  handleCategoryChange(value);
                  field.onChange(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("booking:form.category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => {
                    const translationKey = categoryNameToKey[category.name];
                    const displayName = translationKey
                      ? t(`categories:${translationKey}`)
                      : category.name;
                    return (
                      <SelectItem key={category.name} value={category.name}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mainCategory && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.mainCategory.message}
            </p>
          )}
        </div>

        <div>
          <Label className="block text-lg font-medium mb-2">
            {t("booking:form.subcategory")}
          </Label>
          <Controller
            name="subCategory"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!mainCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("booking:form.subcategory")} />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.childItems?.map((subcategory) => {
                    const translationKey = categoryNameToKey[subcategory.name];
                    const displayName = translationKey
                      ? t(`categories:${translationKey}`)
                      : subcategory.name;
                    return (
                      <SelectItem
                        key={subcategory.name}
                        value={subcategory.name}
                      >
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.subCategory && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.subCategory.message}
            </p>
          )}
        </div>
      </div>

      {/* Working Schedule */}
      <div className="mb-16">
        <Label className="block text-lg font-medium mb-4">
          {t("booking:form.workingSchedule")}
        </Label>
        <Controller
          name="workTimes"
          control={control}
          render={({ field: workField }) => (
            <Controller
              name="restTimes"
              control={control}
              render={({ field: restField }) => (
                <WorkingSchedule
                  workTimes={workField.value || []}
                  restTimes={restField.value || []}
                  onWorkTimesChange={workField.onChange}
                  onRestTimesChange={restField.onChange}
                  workTimesErrors={errors.workTimes}
                  restTimesErrors={errors.restTimes}
                />
              )}
            />
          )}
        />
        {errors.workTimes && !Array.isArray(errors.workTimes) && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.workTimes.message as string}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {t("booking:form.scheduleHelp")}
        </p>
      </div>

      {/* Services */}
      <div className="mb-16">
        <Label className="block text-lg font-medium mb-2">{t("booking:form.services")}</Label>

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
              <Label className="block text-xs font-medium mb-1">{t("booking:form.price")}</Label>
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
                    {service.price} ₾ • {service.duration} {t("booking:form.minutes")}
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

      {/* Contact Info */}
      <div>
        <Label className="block text-sm font-medium mb-2">{t("booking:form.phoneNumber")}</Label>
        <Input
          type="text"
          {...register("info.phoneNumber")}
          placeholder="+995511111111"
        />
        {errors.info?.phoneNumber && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.info.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium mb-2">Facebook URL</Label>
          <Input
            type="text"
            {...register("info.facebookUrl")}
            placeholder="https://facebook.com/yourpage"
          />
          {errors.info?.facebookUrl && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.info.facebookUrl.message}
            </p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">
            Instagram URL
          </Label>
          <Input
            type="text"
            {...register("info.instagramUrl")}
            placeholder="https://instagram.com/youraccount"
          />
          {errors.info?.instagramUrl && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.info.instagramUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={createBusiness.isPending || uploadPhotos.isPending}
          className="p-8 cursor-pointer"
        >
          {createBusiness.isPending || uploadPhotos.isPending
            ? t("booking:form.processing")
            : t("booking:form.addBusiness")}
        </Button>
      </div>
    </form>
  );
}
