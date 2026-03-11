import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import useGetCitites from "@/shared/api/useGetCities";
import useGetMainBookingCategories from "@/shared/api/useGetMainBookingCategories";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { scrollToTop } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ServiceFormSkeleton from "./ServiceFormSkeleton";
import useCreateIndividualBusiness from "./useCreateIndividualBusiness";
import useUploadBusinessPhotos from "./useUploadBusinessPhotos";
import WorkingSchedule from "./WorkingSchedule";

export default function IndividualBusinessForm() {
  const { t } = useTranslation(["booking"]);
  const navigate = useNavigate();

  const { mutate: createBusiness, isPending: isCreating } =
    useCreateIndividualBusiness();
  const { mutate: uploadPhotos, isPending: isUploading } =
    useUploadBusinessPhotos();
  const { data: cities, isLoading: isLoadingCities } = useGetCitites();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetMainBookingCategories();
  const { data: subCategories, isLoading: isLoadingSubCategories } =
    useGetSubBookingCategories();

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
          subCategory: data.subCategory,
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
                scrollToTop();
              },
            );
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

  if (isLoadingCategories || isLoadingSubCategories || isLoadingCities) {
    return <ServiceFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-6 pb-16 px-4"
    >
      {/* Basic Information Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.businessName")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Basic information about your business
          </p>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              {t("booking:form.businessName")}
            </Label>
            <Input
              {...register("businessName")}
              placeholder="Enter your business name"
              className="h-11 transition-all"
            />
            {errors.businessName && (
              <p className="text-xs text-red-500 font-medium">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("booking:form.callTypeLabel")}
            </Label>
            <Controller
              name="callType"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={field.value === "OUTCALL" ? "default" : "outline"}
                    onClick={() => field.onChange("OUTCALL")}
                    className="flex-1 h-11 transition-all"
                  >
                    {t("booking:form.callType.outcall")}
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "ONSITE" ? "default" : "outline"}
                    onClick={() => field.onChange("ONSITE")}
                    className="flex-1 h-11 transition-all"
                  >
                    {t("booking:form.callType.onsite")}
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === "BOTH" ? "default" : "outline"}
                    onClick={() => field.onChange("BOTH")}
                    className="flex-1 h-11 transition-all"
                  >
                    {t("booking:form.callType.both")}
                  </Button>
                </div>
              )}
            />
            {errors.callType && (
              <p className="text-xs text-red-500 font-medium">
                {errors.callType.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Location
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Where can clients find you
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.city")}
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full h-11 transition-all"
                      style={{ height: "44px" }}
                    >
                      <SelectValue placeholder={t("booking:form.city")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.address")}
              </Label>
              <Input
                {...register("addressDetails")}
                disabled={callType === "OUTCALL"}
                placeholder={t("booking:form.addressPlaceholder")}
                className="h-11 transition-all"
              />
              {errors.addressDetails && callType !== "OUTCALL" && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.addressDetails.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.description")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe your services and what makes your business unique
          </p>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <textarea
            {...register("description")}
            placeholder={t("booking:form.descriptionPlaceholder")}
            rows={6}
            className="w-full rounded-lg border border-input bg-background/50 px-4 py-3.5 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Category Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Categories
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Help clients find your business
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
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
                    <SelectTrigger className="w-full h-11 transition-all">
                      <SelectValue placeholder={t("booking:form.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.mainCategory && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.mainCategory.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
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
                    <SelectTrigger className="w-full h-11 transition-all">
                      <SelectValue
                        placeholder={t("booking:form.subcategory")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategory &&
                        subCategories?.[mainCategory]?.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subCategory && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.subCategory.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Schedule Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.workingSchedule")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set your availability for bookings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <p className="text-xs text-red-500 font-medium">
              {errors.workTimes.message as string}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {t("booking:form.scheduleHelp")}
          </p>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Photos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Showcase your business with high-quality images
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">
                {t("booking:form.mainImage")}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                This will be the main photo displayed on your profile
              </p>
            </div>
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
              <p className="text-xs text-red-500 font-medium">
                {Array.isArray(errors.images.businessPhoto)
                  ? errors.images.businessPhoto.find((err) => err?.message)
                      ?.message
                  : errors.images.businessPhoto.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">
                {t("booking:form.galleryImages")}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {t("booking:form.galleryHelp")}
              </p>
            </div>
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
              <p className="text-xs text-red-500 font-medium">
                {Array.isArray(errors.images.galleryPhoto)
                  ? errors.images.galleryPhoto.find((err) => err?.message)
                      ?.message
                  : errors.images.galleryPhoto.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Contact Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How can clients reach you
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.phoneNumber")}
              </Label>
              <Input
                type="text"
                {...register("info.phoneNumber")}
                placeholder="+995511111111"
                className="h-11 transition-all"
              />
              {errors.info?.phoneNumber && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.info.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Facebook URL</Label>
              <Input
                type="text"
                {...register("info.facebookUrl")}
                placeholder="https://facebook.com/yourpage"
                className="h-11 transition-all"
              />
              {errors.info?.facebookUrl && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.info.facebookUrl.message}
                </p>
              )}
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Instagram URL</Label>
              <Input
                type="text"
                {...register("info.instagramUrl")}
                placeholder="https://instagram.com/youraccount"
                className="h-11 transition-all"
              />
              {errors.info?.instagramUrl && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.info.instagramUrl.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isCreating || isUploading}
          size="lg"
          className="px-16 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {isCreating || isUploading
            ? t("booking:form.processing")
            : t("booking:form.nextStep")}
        </Button>
      </div>
    </form>
  );
}
