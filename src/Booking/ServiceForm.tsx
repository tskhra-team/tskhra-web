import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { useCategories } from "@/shared/categories/useCategories";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

const serviceFormSchema = yup.object({
  title: yup.string().required("სათაური აუცილებელია").min(3, "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო"),
  city: yup.string().required("ქალაქი აუცილებელია"),
  district: yup.string().optional(),
  description: yup.string().required("აღწერა აუცილებელია").min(10, "აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო"),
  address: yup.string().required("მისამართი აუცილებელია"),
  mainImage: yup
    .mixed<FileList>()
    .required("მთავარი სურათი აუცილებელია")
    .test("fileLength", "მთავარი სურათი აუცილებელია", (value) => {
      return value && value.length > 0;
    })
    .test("fileType", "მხოლოდ სურათის ფაილები დაშვებულია", (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type?.startsWith("image/");
    }),
  galleryImages: yup
    .mixed<FileList>()
    .optional()
    .test("fileType", "მხოლოდ სურათის ფაილები დაშვებულია", (value) => {
      if (!value || value.length === 0) return true;
      return Array.from(value).every((file) => file.type.startsWith("image/"));
    }),
  categoryId: yup.string().required("კატეგორია აუცილებელია"),
  subcategoryId: yup.string().optional(),
  estimatedTime: yup.string().optional(),
  price: yup
    .number()
    .transform((value, originalValue) => originalValue === "" ? undefined : value)
    .typeError("ფასი უნდა იყოს რიცხვი")
    .required("ფასი აუცილებელია")
    .min(0, "ფასი უნდა იყოს დადებითი"),
  priceMin: yup
    .number()
    .typeError("მინიმალური ფასი უნდა იყოს რიცხვი")
    .optional()
    .min(0, "ფასი უნდა იყოს დადებითი")
    .test("price-range", "მინიმალური ფასი უნდა იყოს ნაკლები მაქსიმალურზე", function(value) {
      const { priceMax } = this.parent;
      if (value && priceMax) {
        return value <= priceMax;
      }
      return true;
    }),
  priceMax: yup
    .number()
    .typeError("მაქსიმალური ფასი უნდა იყოს რიცხვი")
    .optional()
    .min(0, "ფასი უნდა იყოს დადებითი")
    .test("price-range", "მაქსიმალური ფასი უნდა იყოს მეტი მინიმალურზე", function(value) {
      const { priceMin } = this.parent;
      if (value && priceMin) {
        return value >= priceMin;
      }
      return true;
    }),
  websiteUrl: yup
    .string()
    .optional()
    .url("URL უნდა იყოს სწორი ფორმატის")
    .matches(/^https?:\/\/.+/, "URL უნდა იწყებოდეს http:// ან https://"),
  email: yup.string().required("ელ-ფოსტა აუცილებელია").email("არასწორი ელ-ფოსტის ფორმატი"),
  facebookUrl: yup
    .string()
    .optional()
    .url("URL უნდა იყოს სწორი ფორმატის")
    .matches(/^https?:\/\/.+/, "URL უნდა იწყებოდეს http:// ან https://"),
  instagramUrl: yup
    .string()
    .optional()
    .url("URL უნდა იყოს სწორი ფორმატის")
    .matches(/^https?:\/\/.+/, "URL უნდა იწყებოდეს http:// ან https://"),
});

interface ServiceFormData {
  title?: string;
  city?: string;
  district?: string;
  description?: string;
  address?: string;
  mainImage?: FileList;
  galleryImages?: FileList;
  categoryId?: string;
  subcategoryId?: string;
  estimatedTime?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  websiteUrl?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function ServiceForm() {
  const { t } = useTranslation("categories");
  const { data: categories, isLoading } = useCategories("booking");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: yupResolver(serviceFormSchema) as any,
    defaultValues: {
      title: "",
      city: "",
      district: undefined,
      description: "",
      address: "",
      mainImage: undefined,
      galleryImages: undefined,
      categoryId: "",
      subcategoryId: undefined,
      estimatedTime: undefined,
      price: undefined,
      priceMin: undefined,
      priceMax: undefined,
      websiteUrl: undefined,
      email: "",
      facebookUrl: undefined,
      instagramUrl: undefined,
    },
  });

  const categoryId = watch("categoryId");
  const selectedCategory = categories?.find((cat) => cat.name === categoryId);

  const onSubmit = (data: ServiceFormData) => {
    console.log("Form submitted:", data);
    console.log("Main image:", data.mainImage?.[0]);
    console.log("Gallery images:", Array.from(data.galleryImages || []));
    console.log("Estimated time:", data.estimatedTime);
    console.log("Price:", data.price);
    if (data.priceMin || data.priceMax) {
      console.log("Price range:", { min: data.priceMin, max: data.priceMax });
    }
    // TODO: Implement form submission logic
  };

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
    setValue("subcategoryId", "");
  };

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          სერვისის სათაური
        </label>
        <Input
          {...register("title")}
          placeholder="შეიყვანეთ სერვისის სათაური"
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* City and District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">ქალაქი</label>
          <Input
            {...register("city")}
            placeholder="ქალაქი"
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">რაიონი</label>
          <Input {...register("district")} placeholder="რაიონი" />
          {errors.district && (
            <p className="text-sm text-red-600 mt-1">{errors.district.message}</p>
          )}
        </div>
      </div>

      {/* Detailed Description */}
      <div>
        <label className="block text-sm font-medium mb-2">ვრცელი აღწერა</label>
        <textarea
          {...register("description")}
          placeholder="აღწერეთ თქვენი სერვისი დეტალურად"
          rows={6}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-2">მისამართი</label>
        <Input
          {...register("address")}
          placeholder="შეიყვანეთ მისამართი"
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>
      {/* Main Image 1*/}
      <div>
        <label className="block text-sm font-medium mb-2">
          სერვისის მთავარი სურათი
        </label>
        <Input
          type="file"
          accept="image/*"
          {...register("mainImage")}
        />
        {errors.mainImage && (
          <p className="text-sm text-red-600 mt-1">{errors.mainImage.message}</p>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium mb-2">
          გალერეის სურათები
        </label>
        <Input
          type="file"
          accept="image/*"
          multiple
          {...register("galleryImages")}
        />
        {errors.galleryImages && (
          <p className="text-sm text-red-600 mt-1">{errors.galleryImages.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          შეგიძლიათ აირჩიოთ რამდენიმე სურათი
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            აირჩიე კატეგორია
          </label>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="აირჩიე კატეგორია" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => {
                    const translationKey = categoryNameToKey[category.name];
                    const displayName = translationKey
                      ? t(translationKey)
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
          {errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            აირჩიე ქვეკატეგორია
          </label>
          <Controller
            name="subcategoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!categoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="აირჩიე ქვეკატეგორია" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.childItems?.map((subcategory) => {
                    const translationKey = categoryNameToKey[subcategory.name];
                    const displayName = translationKey
                      ? t(translationKey)
                      : subcategory.name;
                    return (
                      <SelectItem key={subcategory.name} value={subcategory.name}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.subcategoryId && (
            <p className="text-sm text-red-600 mt-1">{errors.subcategoryId.message}</p>
          )}
        </div>
      </div>

      {/* Estimated Time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          სავარაუდო დრო
        </label>
        <Input
          {...register("estimatedTime")}
          placeholder="მაგ: 2 საათი, 3 დღე, 1 კვირა"
        />
        {errors.estimatedTime && (
          <p className="text-sm text-red-600 mt-1">{errors.estimatedTime.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          რამდენი დრო სჭირდება სერვისის გასაწევად
        </p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">
          ფასი
        </label>
        <Input
          type="number"
          step="0.01"
          {...register("price")}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Price Range (Optional) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          ფასების დიაპაზონი (არასავალდებულო)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              step="0.01"
              {...register("priceMin")}
              placeholder="მინ. ფასი"
            />
            {errors.priceMin && (
              <p className="text-sm text-red-600 mt-1">{errors.priceMin.message}</p>
            )}
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              {...register("priceMax")}
              placeholder="მაქს. ფასი"
            />
            {errors.priceMax && (
              <p className="text-sm text-red-600 mt-1">{errors.priceMax.message}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          თუ გაქვთ ფასების დიაპაზონი, მიუთითეთ მინიმალური და მაქსიმალური ფასი
        </p>
      </div>

    
      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          ვებ-გვერდის URL
        </label>
        <Input
          type="url"
          {...register("websiteUrl")}
          placeholder="https://example.com"
        />
        {errors.websiteUrl && (
          <p className="text-sm text-red-600 mt-1">{errors.websiteUrl.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">ელ-ფოსტა</label>
        <Input
          type="email"
          {...register("email")}
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Social Media URLs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Facebook URL
          </label>
          <Input
            type="url"
            {...register("facebookUrl")}
            placeholder="https://facebook.com/yourpage"
          />
          {errors.facebookUrl && (
            <p className="text-sm text-red-600 mt-1">{errors.facebookUrl.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Instagram URL
          </label>
          <Input
            type="url"
            {...register("instagramUrl")}
            placeholder="https://instagram.com/youraccount"
          />
          {errors.instagramUrl && (
            <p className="text-sm text-red-600 mt-1">{errors.instagramUrl.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline">
          გაუქმება
        </Button>
        <Button type="submit">გამოაქვეყნე სერვისი</Button>
      </div>
    </form>
  );
}
