import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useModal } from "@/context/ModalContext";
import {
  createIndividualBusinessSchema,
  type IndividualBusinessFormData,
} from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import useGetCitites from "@/shared/api/useGetCities";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import { scrollToTop } from "@/utils";
import { getStatusConfig } from "@/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircleAlert, CircleQuestionMark } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ServiceFormSkeleton from "./ServiceFormSkeleton";
import useCreateIndividualBusiness from "./useCreateIndividualBusiness";
import useUploadBusinessPhotos from "./useUploadBusinessPhotos";
import WorkingSchedule from "./WorkingSchedule";

export default function IndividualBusinessForm() {
  const { t, i18n } = useTranslation(["booking", "modal"]);
  const navigate = useNavigate();

  const { mutate: createBusiness, isPending: isCreating } =
    useCreateIndividualBusiness();
  const { mutate: uploadPhotos, isPending: isUploading } =
    useUploadBusinessPhotos();
  const { data: cities, isLoading: isLoadingCities } = useGetCitites(
    i18n.language.toUpperCase(),
  );
  const { data: categories, isLoading: isLoadingSubCategories } =
    useGetSubBookingCategories(i18n.language.toUpperCase());

  const { showModal, closeModal } = useModal();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IndividualBusinessFormData>({
    resolver: yupResolver(createIndividualBusinessSchema(t)),
    defaultValues: {
      businessNameKa: "",
      businessName: "",
      isEnglish: false,
      cityId: "",
      addressDetailsKa: "",
      addressDetails: "",
      descriptionKa: "",
      description: "",
      images: {
        businessPhoto: [],
        galleryPhoto: [],
      },
      mainCategory: "",
      subCategoryId: "",
      workTimes: [],
      info: {
        phoneNumber: "",
        facebookUrl: "",
        instagramUrl: "",
      },
    },
  });

  const workTimesRef = useRef<HTMLDivElement>(null);
  const businessPhotoRef = useRef<HTMLDivElement>(null);
  const galleryPhotoRef = useRef<HTMLDivElement>(null);

  const onFormError = () => {
    if (errors.workTimes) {
      workTimesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.images?.businessPhoto) {
      businessPhotoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (errors.images?.galleryPhoto) {
      galleryPhotoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const callType = watch("callType");
  const mainCategory = watch("mainCategory");
  const isEnglish = watch("isEnglish");

  const onSubmit = (data: IndividualBusinessFormData) => {
    showModal(
      "pending",
      t("modal:titles.creatingBusiness"),
      t("modal:messages.pleaseWait"),
    );

    // Step 1: Create business
    const businessData = {
      businessName: data.businessName,
      businessNameKa: data.businessNameKa,
      callType: data.callType,
      cityId: Number(data.cityId),
      addressDetails: data.addressDetails,
      addressDetailsKa: data.addressDetailsKa,
      description: data.description,
      descriptionKa: data.descriptionKa,
      mainCategory: data.mainCategory,
      subcategoryId: Number(data.subCategoryId),
      workTimes: data.workTimes.map((t) => ({
        ...t,
        endTime: t.endTime === 0 ? 1440 : t.endTime,
      })),
      restTimes: data.restTimes?.map((t) => ({
        ...t,
        endTime: t.endTime === 0 ? 1440 : t.endTime,
      })),
      info: data.info,
    };

    createBusiness(businessData, {
      onSuccess: (result) => {
        // Step 2: Save businessId to localStorage
        const businessId = result.businessId;
        localStorage.setItem("businessId", businessId);

        // Update modal for uploading photos
        showModal(
          "pending",
          t("modal:titles.uploadingPhotos"),
          t("modal:messages.almostDone"),
        );

        // Step 3: Upload photos with businessId
        const allPhotos = [
          ...data.images.businessPhoto,
          ...data.images.galleryPhoto,
        ];

        uploadPhotos(
          { data: allPhotos, businessId },
          {
            onSuccess: () => {
              // Step 4: Show success and navigate
              closeModal();
              showModal(
                "success",
                t("modal:titles.congratulations"),
                t("modal:messages.businessCreatedSuccess"),
                t("modal:buttons.addServices"),
                () => {
                  scrollToTop();
                  navigate(
                    `/create-business?business=booking&type=individual&step=2&isEnglish=${data.isEnglish}`,
                  );
                },
              );
            },
            onError: () => {
              closeModal();
              showModal(
                "error",
                t("modal:titles.somethingWentWrong"),
                t("booking:messages.error"),
                t("modal:buttons.tryAgain"),
              );
            },
          },
        );
      },
      onError: (error) => {
        closeModal();
        const config = getStatusConfig(error.response?.data.statusCode, t);
        showModal("error", config.title, config.message);
      },
    });
  };

  const handleCategoryChange = (value: string) => {
    setValue("mainCategory", value);
    setValue("subCategoryId", "");
  };

  if (isLoadingSubCategories || isLoadingCities) {
    return <ServiceFormSkeleton />;
  }

  const selectedCategory = categories?.find(
    (cat) => String(cat.id) === mainCategory,
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onFormError)}
      className="max-w-6xl mx-auto space-y-6 pb-16 px-4"
    >
      {/* Basic Information Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight flex md:flex-row flex-col justify-between text-center">
            {t("booking:form.businesHeader")}
            <div className="flex items-center justify-center text-center mt-5">
              <HoverCard openDelay={100} closeDelay={200}>
                <HoverCardTrigger className="pr-5 flex ">
                  <Label className="pr-2 ">
                    {t("booking:form.addEnglish")}
                  </Label>
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
                  />
                )}
              />
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.subName")}
          </p>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              {t("booking:form.businessName")}
            </Label>
            <Input
              {...register("businessNameKa")}
              placeholder={t("booking:form.enterName")}
              className="h-11 transition-all"
            />
            {errors.businessNameKa && (
              <p className="text-xs text-red-500 font-medium">
                {errors.businessNameKa.message}
              </p>
            )}
          </div>

          {isEnglish && (
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                {t("booking:form.businessNameEN")}
              </Label>
              <Input
                {...register("businessName")}
                placeholder={t("booking:form.enterName")}
                className="h-11 transition-all"
              />
              {errors.businessName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.businessName.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("booking:form.callTypeLabel")}
            </Label>
            <Controller
              name="callType"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3 flex-col md:flex-row">
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
            {t("booking:form.location")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.subLocation")}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:justify-between md:flex-row gap-3 ">
            <div className="space-y-2.5 w-full">
              <Label className="text-sm font-medium">
                {t("booking:form.city")}
              </Label>
              <Controller
                name="cityId"
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
                        <SelectItem key={city.id} value={String(city.id)}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cityId && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.cityId.message}
                </p>
              )}
            </div>
            <div className="space-y-2.5 w-full">
              <Label className="text-sm font-medium">
                {t("booking:form.address")}
              </Label>
              <Input
                {...register("addressDetailsKa")}
                disabled={callType === "OUTCALL"}
                placeholder={t("booking:form.addressPlaceholder")}
                className="h-11 transition-all"
              />
              {errors.addressDetailsKa && callType !== "OUTCALL" && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.addressDetailsKa.message}
                </p>
              )}
            </div>

            {isEnglish && (
              <div className="space-y-2.5 w-full">
                <Label className="text-sm font-medium">
                  {t("booking:form.addressEN")}
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
            )}
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
            {t("booking:form.subDescription")}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-10">
          <div>
            <textarea
              {...register("descriptionKa")}
              placeholder={t("booking:form.descriptionPlaceholder")}
              rows={6}
              className="w-full rounded-lg border border-input bg-background/50 px-4 py-3.5 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 resize-none"
            />
            {errors.descriptionKa && (
              <p className="text-xs text-red-500 font-medium">
                {errors.descriptionKa.message}
              </p>
            )}
          </div>

          {isEnglish && (
            <div>
              <textarea
                {...register("description")}
                placeholder={`${t("booking:form.descriptionPlaceholderEN")}`}
                rows={6}
                className="w-full rounded-lg border border-input bg-background/50 px-4 py-3.5 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.categoryName")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.categoryNameSub")}
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
                    <SelectTrigger
                      ref={field.ref}
                      className="w-full h-11 transition-all"
                    >
                      <SelectValue placeholder={t("booking:form.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
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
                name="subCategoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!mainCategory}
                  >
                    <SelectTrigger
                      ref={field.ref}
                      className="w-full h-11 transition-all"
                    >
                      <SelectValue
                        placeholder={t("booking:form.subcategory")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.id}
                          value={String(subcategory.id)}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subCategoryId && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.subCategoryId.message}
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
            {t("booking:form.workingScheduleSub")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div ref={workTimesRef}>
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
          </div>
          <p className="text-xs text-muted-foreground">
            {t("booking:form.scheduleHelp")}
          </p>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t("booking:form.photos")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.photosSub")}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">
                {t("booking:form.mainImage")}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {t("booking:form.mainImageSub")}
              </p>
            </div>
            <div ref={businessPhotoRef}>
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
            </div>
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
            <div ref={galleryPhotoRef}>
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
            </div>
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
            {t("booking:form.contactInfo")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("booking:form.contactInfoSub")}
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
