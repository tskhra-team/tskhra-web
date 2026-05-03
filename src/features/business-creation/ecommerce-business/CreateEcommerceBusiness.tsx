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
import useCreateProduct from "@/features/vendor-profile/hooks/useCreateProduct";
import useGetSellerProfiles from "@/features/vendor-profile/hooks/useGetSellerProfiles";
import type { ProductSpecification } from "@/features/vendor-profile/types";
import useGetEcommerceFilters from "@/shared/api/useGetEcommerceFilters";
import useGetMainEcommerceCategories, {
  type EcommerceCategory,
} from "@/shared/api/useGetMainEcommerceCategories";
import useGetSubEcommerceCategories from "@/shared/api/useGetSubEcommerceCategories";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Check,
  Info,
  Loader2,
  Package,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

function SubcategoryLevel({
  parentId,
  value,
  onSelect,
  label,
  placeholder,
}: {
  parentId: number;
  value: string;
  onSelect: (cat: EcommerceCategory) => void;
  label: string;
  placeholder: string;
}) {
  const { data: subcategories } = useGetSubEcommerceCategories(parentId);

  return (
    <div className="space-y-2.5">
      <Label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </Label>
      <Select
        value={value}
        onValueChange={(val) => {
          const cat = subcategories?.find((c) => c.id === Number(val));
          if (cat) onSelect(cat);
        }}
      >
        <SelectTrigger className="w-full h-11 transition-all">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {subcategories?.map((sub) => (
            <SelectItem key={sub.id} value={String(sub.id)}>
              {sub.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface EcommerceFormData {
  productTitle: string;
  description: string;
  price: string;
  stockQuantity: string;
  sku: string;
  categoryId: string;
  brandId: string;
  coverImage: File[];
  additionalImages: File[];
  specifications: Record<string, string>;
}

export default function CreateEcommerceBusiness() {
  const { t } = useTranslation("common");
  const [, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { data: sellerData } = useGetSellerProfiles();
  const sellers = Array.isArray(sellerData)
    ? sellerData
    : sellerData?.sellers || [];
  const activeSeller = sellers.find((s) => s.status === "ACTIVE");

  const { data: categories } = useGetMainEcommerceCategories();
  const [categoryPath, setCategoryPath] = useState<EcommerceCategory[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EcommerceFormData>({
    defaultValues: {
      productTitle: "",
      description: "",
      price: "",
      stockQuantity: "1",
      sku: "",
      categoryId: "",
      brandId: "",
      coverImage: [],
      additionalImages: [],
      specifications: {},
    },
  });

  const selectedCategoryId = watch("categoryId");

  const { data: filtersData } = useGetEcommerceFilters(
    { category_id: selectedCategoryId ? Number(selectedCategoryId) : null },
    !!selectedCategoryId,
  );
  const brands = filtersData?.brands || [];
  const specFields = [
    ...new Set(
      filtersData?.filters?.flatMap((group) =>
        group.fields.map((field) => field.field_name),
      ) ?? [],
    ),
  ];

  const createMutation = useCreateProduct();

  const onSubmit = async (data: EcommerceFormData) => {
    if (!activeSeller) return;
    setSubmitError("");

    const specifications: ProductSpecification[] = Object.entries(
      data.specifications,
    )
      .filter(([, value]) => value.trim())
      .map(([field_name, field_value]) => ({ field_name, field_value }));

    const allImages = [...data.coverImage, ...data.additionalImages];

    try {
      await createMutation.mutateAsync({
        supplierId: activeSeller.supplier_id,
        data: {
          category_id: Number(data.categoryId),
          brand_id: Number(data.brandId),
          title: data.productTitle,
          description: data.description,
          price: Number(data.price),
          quantity: Number(data.stockQuantity),
          sku: data.sku,
          specifications,
        },
        images: allImages,
      });
      setSubmitted(true);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (isAxiosError(error) && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        setSubmitError(
          Array.isArray(detail)
            ? detail.map((d: { msg: string }) => d.msg).join(". ")
            : detail,
        );
      } else {
        setSubmitError(t("ecommerceForm.validation.submitFailed"));
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {t("ecommerceForm.successTitle")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("ecommerceForm.successMessage")}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setSubmitted(false);
                }}
                className="flex-1 cursor-pointer"
              >
                {t("ecommerceForm.addAnother")}
              </Button>
              <Button
                onClick={() => setSearchParams({})}
                className="flex-1 cursor-pointer"
              >
                {t("buttons.goBack")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setSearchParams({})}
          className="mb-6 hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("buttons.goBack")}
        </Button>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("ecommerceForm.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("ecommerceForm.subtitle")}
            </p>
          </div>
        </div>

        {!activeSeller && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              {t("ecommerceForm.validation.noActiveSeller")}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.basicInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.productTitle")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("productTitle", {
                        required: t(
                          "ecommerceForm.validation.productTitleRequired",
                        ),
                      })}
                      placeholder={t("ecommerceForm.productTitlePlaceholder")}
                      className="h-11 transition-all"
                    />
                    {errors.productTitle && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.productTitle.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.description")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      {...register("description", {
                        required: t(
                          "ecommerceForm.validation.descriptionRequired",
                        ),
                      })}
                      placeholder={t("ecommerceForm.descriptionPlaceholder")}
                      rows={5}
                      className="w-full rounded-lg border border-input bg-background/50 px-4 py-3.5 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("ecommerceForm.descriptionHint")}
                    </p>
                    {errors.description && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.pricingInventory")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">
                        {t("ecommerceForm.price")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register("price", {
                          required: t("ecommerceForm.validation.priceRequired"),
                          min: {
                            value: 0.01,
                            message: t("ecommerceForm.validation.priceMin"),
                          },
                        })}
                        placeholder="0.00"
                        className="h-11 transition-all"
                      />
                      {errors.price && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">
                        {t("ecommerceForm.stockQuantity")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        {...register("stockQuantity", {
                          required: t("ecommerceForm.validation.stockRequired"),
                          min: {
                            value: 1,
                            message: t("ecommerceForm.validation.stockMin"),
                          },
                        })}
                        placeholder="1"
                        className="h-11 transition-all"
                      />
                      {errors.stockQuantity && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.stockQuantity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">
                        {t("ecommerceForm.sku")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("sku", {
                          required: t("ecommerceForm.validation.skuRequired"),
                        })}
                        placeholder={t("ecommerceForm.skuPlaceholder")}
                        className="h-11 transition-all"
                      />
                      {errors.sku && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.sku.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.productImages")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.coverImage")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="coverImage"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value.length > 0 ||
                          t("ecommerceForm.validation.coverImageRequired"),
                      }}
                      render={({ field }) => (
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={1}
                        />
                      )}
                    />
                    {errors.coverImage && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.coverImage.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        {t("ecommerceForm.additionalImages")}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("ecommerceForm.additionalImagesSub")}
                      </p>
                    </div>
                    <Controller
                      name="additionalImages"
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
                </CardContent>
              </Card>

              {/* Product Specifications */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.specifications")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {specFields.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {specFields.map((spec) => (
                        <div key={spec} className="space-y-2.5">
                          <Label className="text-sm font-medium">{spec}</Label>
                          <Input
                            {...register(`specifications.${spec}`)}
                            placeholder={`${t("ecommerceForm.enterSpec")} ${spec.toLowerCase()}`}
                            className="h-11 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground py-4">
                      <Info className="w-5 h-5 shrink-0" />
                      <p className="text-sm">
                        {t("ecommerceForm.selectCategoryForSpecs")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm lg:sticky lg:top-8">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.organization")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.category")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={
                        categoryPath.length > 0
                          ? String(categoryPath[0].id)
                          : ""
                      }
                      onValueChange={(value) => {
                        const cat = categories?.find(
                          (c) => c.id === Number(value),
                        );
                        if (!cat) return;
                        setCategoryPath([cat]);
                        setValue("brandId", "");
                        setValue("specifications", {});
                        setValue("categoryId", value);
                      }}
                    >
                      <SelectTrigger className="w-full h-11 transition-all">
                        <SelectValue
                          placeholder={t("ecommerceForm.categoryPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {categoryPath.map(
                    (cat, index) =>
                      cat.has_subcategories && (
                        <SubcategoryLevel
                          key={cat.id}
                          parentId={cat.id}
                          value={
                            categoryPath[index + 1]
                              ? String(categoryPath[index + 1].id)
                              : ""
                          }
                          onSelect={(sub) => {
                            const newPath = [
                              ...categoryPath.slice(0, index + 1),
                              sub,
                            ];
                            setCategoryPath(newPath);
                            setValue("brandId", "");
                            setValue("specifications", {});
                            setValue("categoryId", String(sub.id));
                          }}
                          label={t("ecommerceForm.subcategory")}
                          placeholder={t(
                            "ecommerceForm.subcategoryPlaceholder",
                          )}
                        />
                      ),
                  )}
                  <input
                    type="hidden"
                    {...register("categoryId", {
                      required: t(
                        "ecommerceForm.validation.categoryRequired",
                      ),
                    })}
                  />
                  {errors.categoryId && !selectedCategoryId && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.categoryId.message}
                    </p>
                  )}

                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.brand")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="brandId"
                      control={control}
                      rules={{
                        required: t("ecommerceForm.validation.brandRequired"),
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedCategoryId}
                        >
                          <SelectTrigger className="w-full h-11 transition-all">
                            <SelectValue
                              placeholder={t("ecommerceForm.brandPlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {brands
                              .filter(
                                (brand, i, arr) =>
                                  arr.findIndex((b) => b.id === brand.id) === i,
                              )
                              .map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={String(brand.id)}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.brandId && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.brandId.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <div className="px-6 pb-6 space-y-3">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createMutation.isPending || !activeSeller}
                    className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("ecommerceForm.publishing")}
                      </>
                    ) : (
                      t("ecommerceForm.publishProduct")
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setSearchParams({})}
                    className="w-full h-12 text-base cursor-pointer"
                  >
                    {t("ecommerceForm.cancel")}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
