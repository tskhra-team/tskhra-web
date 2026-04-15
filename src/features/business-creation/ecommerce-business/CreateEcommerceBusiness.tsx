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
import { ArrowLeft, Check, Package, Info } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  "Electronics",
  "Fashion & Clothing",
  "Home & Garden",
  "Books & Media",
  "Sports & Outdoors",
] as const;

const CATEGORY_SPECS: Record<string, string[]> = {
  Electronics: ["Brand", "Model", "Warranty", "Color", "Weight"],
  "Fashion & Clothing": ["Brand", "Size", "Color", "Material", "Gender"],
  "Home & Garden": ["Brand", "Material", "Dimensions", "Color", "Weight"],
  "Books & Media": ["Author", "Publisher", "Language", "Pages", "Format"],
  "Sports & Outdoors": ["Brand", "Size", "Color", "Material", "Weight"],
};

interface EcommerceFormData {
  productTitle: string;
  description: string;
  price: string;
  stockQuantity: string;
  sku: string;
  category: string;
  coverImage: File[];
  additionalImages: File[];
  specifications: Record<string, string>;
}

export default function CreateEcommerceBusiness() {
  const { t } = useTranslation("common");
  const [, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

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
      category: "",
      coverImage: [],
      additionalImages: [],
      specifications: {},
    },
  });

  const selectedCategory = watch("category");
  const specFields = selectedCategory ? CATEGORY_SPECS[selectedCategory] || [] : [];

  const onSubmit = (data: EcommerceFormData) => {
    console.log("Ecommerce product submitted:", data);
    setSubmitted(true);
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pb-16"
        >
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
                      {t("ecommerceForm.productTitle")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("productTitle", {
                        required: t("ecommerceForm.validation.productTitleRequired"),
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
                      {t("ecommerceForm.description")} <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      {...register("description", {
                        required: t("ecommerceForm.validation.descriptionRequired"),
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
                        {t("ecommerceForm.price")} <span className="text-red-500">*</span>
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
                        {t("ecommerceForm.stockQuantity")} <span className="text-red-500">*</span>
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
                        {t("ecommerceForm.sku")} <span className="text-red-500">*</span>
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
                      {t("ecommerceForm.coverImage")} <span className="text-red-500">*</span>
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
              {/* Category */}
              <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm lg:sticky lg:top-8">
                <CardHeader className="pb-6 space-y-1">
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {t("ecommerceForm.organization")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-medium">
                      {t("ecommerceForm.category")}
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{
                        required: t("ecommerceForm.validation.categoryRequired"),
                      }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            setValue("specifications", {});
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-full h-11 transition-all">
                            <SelectValue
                              placeholder={t("ecommerceForm.categoryPlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <div className="px-6 pb-6 space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    {t("ecommerceForm.publishProduct")}
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
