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
import { useModal } from "@/context/ModalContext";
import {
  createIndividualBusinessSchema,
  type IndividualBusinessFormData,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { useCategories } from "@/shared/categories/useCategories";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ServiceFormSkeleton from "./ServiceFormSkeleton";
import useCreateIndividualBusiness from "./useCreateIndividualBusiness";
import useUploadBusinessPhotos from "./useUploadBusinessPhotos";
import WorkingSchedule from "./WorkingSchedule";

export default function IndividualBusinessForm() {
  const { t } = useTranslation(["categories", "booking"]);
  const { data: categories, isLoading } = useCategories("booking");
  const navigate = useNavigate();

  const { mutate: createBusiness, isPending: isCreating } =
    useCreateIndividualBusiness();
  const { mutate: uploadPhotos, isPending: isUploading } =
    useUploadBusinessPhotos();

  const { showModal, closeModal } = useModal();

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
      addressDetails: "",
      description: "",
      images: {
        businessPhoto: [],
        galleryPhoto: [],
      },
      mainCategory: "",
      subCategory: "",
      workTimes: [],
      restTimes: [],
      info: {
        phoneNumber: "",
        facebookUrl: "",
        instagramUrl: "",
      },
    },
  });

  const callType = watch("callType");
  const mainCategory = watch("mainCategory");
  const selectedCategory = categories?.find((cat) => cat.name === mainCategory);

  const onSubmit = (data: IndividualBusinessFormData) => {
    // Show loading modal
    showModal("pending", "Uploading photos...", "Please wait");

    // Step 1: Upload photos
    const allPhotos = [
      ...data.images.businessPhoto,
      ...data.images.galleryPhoto,
    ];

    uploadPhotos(allPhotos, {
      onSuccess: (photoResult) => {
        // Update modal for creating business
        showModal("pending", "Creating business...", "Almost done");

        // Step 2: Create business with photo IDs
        const businessData = {
          businessName: data.businessName,
          callType: data.callType,
          city: data.city,
          addressDetails: data.addressDetails,
          description: data.description,
          mainCategory: data.mainCategory,
          category: data.subCategory,
          workTimes: data.workTimes,
          restTimes: data.restTimes,
          info: data.info,
          mainPhotoId: photoResult.mainPhotoId,
          galleryPhotoIds: photoResult.galleryPhotoIds,
        };

        createBusiness(businessData as any, {
          onSuccess: (result) => {
            // Step 3: Save businessId to localStorage and navigate to step 2
            closeModal();
            localStorage.setItem("businessId", result.businessId);
            showModal(
              "success",
              "Congratulations!",
              "Your business was successfully created, go and add your services!",
              "Add services",
              () => {
                navigate(
                  "/create-business?business=booking&type=individual&step=2",
                );
              },
            );
          },
          onError: () => {
            closeModal();
            showModal(
              "error",
              "Something went worng",
              t("booking:messages.error"),
              "Try again",
            );
          },
        });
      },
      onError: () => {
        closeModal();
        showModal(
          "error",
          "Something went wrong",
          t("booking:messages.error"),
          "Try again",
        );
      },
    });
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
          <Label className="block text-lg font-medium mb-2">
            {t("booking:form.city")}
          </Label>
          <Input {...register("city")} placeholder={t("booking:form.city")} />
          {errors.city && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label className="block text-lg font-medium mb-2">
            {t("booking:form.address")}
          </Label>
          <Input
            {...register("addressDetails")}
            disabled={callType === "outcall"}
            placeholder={t("booking:form.addressPlaceholder")}
          />

          {errors.addressDetails && callType !== "outcall" && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.addressDetails.message}
            </p>
          )}
        </div>
      </div>

      {/* Detailed Description */}
      <div className="mb-12">
        <Label className="block text-lg font-medium mb-2">
          {t("booking:form.description")}
        </Label>
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
            {Array.isArray(errors.images.businessPhoto)
              ? errors.images.businessPhoto.find((err) => err?.message)?.message
              : errors.images.businessPhoto.message}
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
            {Array.isArray(errors.images.galleryPhoto)
              ? errors.images.galleryPhoto.find((err) => err?.message)?.message
              : errors.images.galleryPhoto.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {t("booking:form.galleryHelp")}
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div>
          <Label className="block text-sm font-medium mb-2">
            {t("booking:form.phoneNumber")}
          </Label>
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
          disabled={isCreating || isUploading}
          className="p-8 cursor-pointer"
        >
          {isCreating || isUploading
            ? t("booking:form.processing")
            : t("booking:form.nextStep")}
        </Button>
      </div>
    </form>
  );
}
