import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import useGetCitites from "@/shared/api/useGetCities";
import useGetSubBookingCategories from "@/shared/api/useGetSubBookingCategories";
import {
  createPostItem,
  type CreatePostItemPostData,
} from "@/Swapping/PostItems/PostItemsSchema";
import useCreatePost from "@/Swapping/PostItems/useCreatePost";
import useUploadItemPhotos from "@/Swapping/PostItems/useUploadItemPhotos";
import { scrollToTop } from "@/utils";
import { getStatusConfig } from "@/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, CheckIcon } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function PostItem() {
  const { t, i18n } = useTranslation(["swapping", "booking", "modal"]);
  const { data: categories } = useGetSubBookingCategories(
    i18n.language.toUpperCase(),
  );
  const { data: cities } = useGetCitites(i18n.language.toUpperCase());
  const { mutate: createPost } = useCreatePost();
  const { mutate: uploadItemPhotos } = useUploadItemPhotos();
  const { showModal, closeModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromTradeOffer =
    (location.state as { from?: string } | null)?.from === "trade-offer";

  const tradeRangeOptions = useMemo(
    () => [
      {
        value: "CITY_WIDE",
        label: t("swapping:postItem.tradeRangeCityWide"),
        activeClass: "bg-blue-800 hover:bg-blue-900 text-white border-blue-800",
      },
      {
        value: "COUNTRY_WIDE",
        label: t("swapping:postItem.tradeRangeCountryWide"),
        activeClass:
          "bg-green-800 hover:bg-green-900 text-white border-green-800",
      },
    ],
    [t],
  );

  const conditionOptions = useMemo(
    () => [
      {
        value: "NEW",
        label: t("swapping:postItem.conditionNew"),
        activeClass:
          "bg-green-800 hover:bg-green-900 text-white border-green-800",
      },
      {
        value: "LIKE_NEW",
        label: t("swapping:postItem.conditionGood"),
        activeClass: "bg-blue-800 hover:bg-blue-900 text-white border-blue-800",
      },
      {
        value: "USED",
        label: t("swapping:postItem.conditionFair"),
        activeClass:
          "bg-orange-700 hover:bg-orange-800 text-white border-orange-700",
      },
      {
        value: "DAMAGED",
        label: t("swapping:postItem.conditionPoor"),
        activeClass: "bg-red-800 hover:bg-red-900 text-white border-red-800",
      },
    ],
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<CreatePostItemPostData>({
    resolver: yupResolver(createPostItem(t)),
  });

  const category = watch("categoryId");

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
    setValue("subCategoryId", "");
  };

  const selectedCategory = categories?.find(
    (cat) => String(cat.id) === category,
  );

  const onSubmit = (data: CreatePostItemPostData) => {
    showModal(
      "pending",
      t("modal:titles.creatingPost"),
      t("modal:messages.pleaseWait"),
    );

    createPost(data, {
      onSuccess: (result) => {
        const postId = result.itemId;

        // Update modal for uploading photos
        showModal(
          "pending",
          t("modal:titles.uploadingPhotos"),
          t("modal:messages.almostDone"),
        );

        const allPhotos = [...data.photos];

        uploadItemPhotos(
          { data: allPhotos, postId },
          {
            onSuccess: () => {
              closeModal();
              showModal(
                "success",
                t("modal:titles.congratulations"),
                t("modal:messages.postCreatedSuccess"),
                t("modal:buttons.see"),
                () => {
                  scrollToTop();
                  navigate(
                    cameFromTradeOffer
                      ? `/swapping/trade-offer`
                      : `/swapping/my-items`,
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

  return (
    <div className="min-h-screen bg-swap-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="link"
          className="mb-10"
          onClick={() =>
            navigate((cameFromTradeOffer ? "/swapping/trade-offer" : -1) as any)
          }
        >
          <ArrowLeft />
          {t("swapping:postItem.back")}
        </Button>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">
            {t("swapping:postItem.pageTitle")}
          </h1>

          <p className="text-muted-foreground">
            {t("swapping:postItem.pageSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-none shadow-sm py-0">
            <CardHeader className="border-b border-border pt-7 bg-swap-secondary/30 h-full rounded-t-xl">
              <CardTitle className="text-xl">
                {t("swapping:postItem.basicInfo")}
              </CardTitle>
              <CardDescription>
                {t("swapping:postItem.basicInfoSub")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Item Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t("swapping:postItem.title")} *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder={t("swapping:postItem.titlePlaceholder")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>
              {/* Item Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("swapping:postItem.description")} *
                </Label>
                <textarea
                  className="w-full rounded-lg border border-input bg-background/50 px-4 py-3.5 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 resize-none"
                  id="description"
                  {...register("description")}
                  placeholder={t("swapping:postItem.descriptionPlaceholder")}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
              {/* Estimated Value and City */}
              <div className="space-y-2 flex flex-col md:flex-row gap-2">
                {/* <div className="w-full space-y-2">
                  <Label htmlFor="estimatedValue">
                    {t("swapping:postItem.estimatedValue")} *
                  </Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    step="any"
                    {...register("estimatedValue")}
                    placeholder="0.00"
                  />
                  {errors.estimatedValue && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.estimatedValue.message}
                    </p>
                  )}
                </div> */}

                <div className="w-full space-y-2">
                  <Label htmlFor="cityId">{t("booking:form.city")}</Label>
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                    <p className="text-sm text-red-600 font-medium">
                      {errors.cityId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("swapping:postItem.tradeRange")} *</Label>
                <Controller
                  name="tradeRange"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-3 flex-col md:flex-row">
                      {tradeRangeOptions.map((option) => {
                        const isSelected = field.value === option.value;

                        return (
                          <Button
                            key={option.value}
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange(option.value)}
                            className={`flex-1 h-11 transition-all ${
                              isSelected
                                ? option.activeClass
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.tradeRange && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.tradeRange.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Condition */}
          <Card className="border-none shadow-sm py-0">
            <CardHeader className="border-b border-border pt-7 bg-swap-secondary/30 rounded-t-xl">
              <CardTitle className="text-xl">
                {t("swapping:postItem.categoryCondition")}
              </CardTitle>
              <CardDescription>
                {t("swapping:postItem.categoryConditionSub")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {/* Category */}
                  <Label htmlFor="category">
                    {t("swapping:postItem.category")} *
                  </Label>
                  <Controller
                    name="categoryId"
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
                          <SelectValue
                            placeholder={t("swapping:postItem.category")}
                          />
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
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Sub Category */}
                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    {t("swapping:postItem.subcategory")} *
                  </Label>
                  <Controller
                    name="subCategoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!category}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          className="w-full h-11 transition-all"
                        >
                          <SelectValue
                            placeholder={t("swapping:postItem.subcategory")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory?.subcategories.map(
                            (subcategory) => (
                              <SelectItem
                                key={subcategory.id}
                                value={String(subcategory.id)}
                              >
                                {subcategory.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subCategoryId && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.subCategoryId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">
                  {t("swapping:postItem.condition")} *
                </Label>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-3 flex-col md:flex-row">
                      {conditionOptions.map((option) => {
                        const isSelected = field.value === option.value;

                        return (
                          <Button
                            key={option.value}
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange(option.value)}
                            className={`flex-1 h-11 transition-all ${
                              isSelected
                                ? option.activeClass
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                />

                {errors.condition && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.condition.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-none shadow-sm pt-0">
            <CardHeader className="border-b border-border pt-7 bg-swap-secondary/30 rounded-t-xl">
              <CardTitle className="text-xl">
                {t("swapping:postItem.photos")} *
              </CardTitle>
              <CardDescription>
                {t("swapping:postItem.photosSub")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-swap-primary/50 hover:bg-swap-secondary/20 transition-all">
                  <Controller
                    name="photos"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={5}
                      />
                    )}
                  />
                </div>

                {errors.photos && (
                  <p className="text-sm text-red-600 font-medium">
                    {errors.photos.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Desired Items */}
          <Card className="border-none shadow-sm pt-0">
            <CardHeader className="border-b border-border pt-7 bg-swap-secondary/30 rounded-t-xl">
              <CardTitle className="text-xl">
                {t("swapping:postItem.desiredItems")}
              </CardTitle>
              <CardDescription>
                {t("swapping:postItem.desiredItemsSub")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <Controller
                name="desiredCategories"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <div className="space-y-4">
                    <Label>{t("swapping:postItem.desiredCategories")} *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories?.map((cat) => {
                        const isSelected =
                          field.value?.includes(String(cat.id)) ?? false;
                        return (
                          <div
                            key={cat.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-swap-secondary/50 ${
                              isSelected
                                ? "border-primary bg-swap-secondary"
                                : "border-border bg-card"
                            }`}
                            onClick={() => {
                              const updated = isSelected
                                ? field.value.filter(
                                    (c: string) => c !== String(cat.id),
                                  )
                                : [...(field.value || []), String(cat.id)];
                              field.onChange(updated);
                            }}
                          >
                            <div
                              className={`size-4 shrink-0 rounded-sm border transition-shadow ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-background"
                              }`}
                            >
                              {isSelected && <CheckIcon className="size-3.5" />}
                            </div>
                            <Label className="font-normal cursor-pointer flex-1">
                              {cat.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {errors.desiredCategories && (
                      <p className="text-sm text-red-600 font-medium">
                        {errors.desiredCategories.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minValue">
                    {t("swapping:postItem.minValue")} *
                  </Label>
                  <Input
                    id="minValue"
                    type="number"
                    step="any"
                    {...register("desireMinPrice")}
                    placeholder="0.00"
                  />
                  {errors.desireMinPrice && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.desireMinPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxValue">
                    {t("swapping:postItem.maxValue")} *
                  </Label>
                  <Input
                    id="maxValue"
                    type="number"
                    step="any"
                    {...register("desireMaxPrice")}
                    placeholder="0.00"
                  />
                  {errors.desireMaxPrice && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.desireMaxPrice.message}
                    </p>
                  )}
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Link
              to={cameFromTradeOffer ? "/swapping/trade-offer" : "/swapping"}
            >
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="px-8"
              >
                {t("swapping:postItem.cancel")}
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              className="px-8 bg-swap-primary hover:bg-swap-primary/90"
            >
              {t("swapping:postItem.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
