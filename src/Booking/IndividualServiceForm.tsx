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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import ServiceFormSkeleton from "./ServiceFormSkeleton";

const serviceFormSchema = yup.object({
  businessName: yup
    .string()
    .required("სათაური აუცილებელია")
    .min(3, "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო"),
  serviceType: yup
    .string()
    .required("აირჩიეთ მომსახურების ტიპი")
    .oneOf(["outcall", "onsite", "both"], "არასწორი მომსახურების ტიპი"),
  city: yup.string().required("ქალაქი აუცილებელია"),
  district: yup.string().optional(),
  description: yup
    .string()
    .required("აღწერა აუცილებელია")
    .min(10, "აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო"),
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
  workingSchedule: yup
    .object()
    .test(
      "at-least-one-day",
      "აირჩიეთ მინიმუმ ერთი სამუშაო დღე",
      function (value) {
        if (!value) return false;
        return Object.values(value).some((day: any) => day?.enabled === true);
      },
    )
    .test(
      "valid-times",
      "შეავსეთ სამუშაო საათები ყველა არჩეულ დღეს",
      function (value) {
        if (!value) return true;
        for (const day of Object.values(value) as any[]) {
          if (day?.enabled) {
            if (!day.startTime || !day.endTime) {
              return false;
            }
            // Проверка что время в формате HH:MM
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (
              !timeRegex.test(day.startTime) ||
              !timeRegex.test(day.endTime)
            ) {
              return this.createError({
                message: "დრო უნდა იყოს ფორმატში HH:MM",
              });
            }
            // Проверка что минуты делятся на 5
            const startMinutes = parseInt(day.startTime.split(":")[1]);
            const endMinutes = parseInt(day.endTime.split(":")[1]);
            if (startMinutes % 5 !== 0 || endMinutes % 5 !== 0) {
              return this.createError({
                message: "წუთები უნდა იყოს 5-ის ჯერადი (00, 05, 10...)",
              });
            }
            // Проверка что время окончания позже начала
            if (day.startTime >= day.endTime) {
              return this.createError({
                message: "დასრულების დრო უნდა იყოს დაწყების დროზე გვიან",
              });
            }
          }
        }
        return true;
      },
    )
    .required("სამუშაო გრაფიკი აუცილებელია"),
  services: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("სერვისის სახელი აუცილებელია"),
        price: yup
          .number()
          .required("ფასი აუცილებელია")
          .min(0, "ფასი უნდა იყოს დადებითი"),
        duration: yup
          .number()
          .required("ხანგრძლივობა აუცილებელია")
          .min(5, "მინიმუმ 5 წუთი")
          .test("divisible-by-5", "უნდა იყოს 5-ის ჯერადი", (value) => {
            return value ? value % 5 === 0 : false;
          }),
      }),
    )
    .min(1, "დაამატეთ მინიმუმ ერთი სერვისი")
    .required("სერვისები აუცილებელია"),
  websiteUrl: yup
    .string()
    .optional()
    .url("URL უნდა იყოს სწორი ფორმატის")
    .matches(/^https?:\/\/.+/, "URL უნდა იწყებოდეს http:// ან https://"),
  email: yup
    .string()
    .required("ელ-ფოსტა აუცილებელია")
    .email("არასწორი ელ-ფოსტის ფორმატი"),
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

interface WorkingDay {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface WorkingSchedule {
  monday?: WorkingDay;
  tuesday?: WorkingDay;
  wednesday?: WorkingDay;
  thursday?: WorkingDay;
  friday?: WorkingDay;
  saturday?: WorkingDay;
  sunday?: WorkingDay;
}

interface Service {
  name: string;
  price: number;
  duration: number; // в минутах
}

interface ServiceFormData {
  businessName?: string;
  serviceType?: "outcall" | "onsite" | "both";
  city?: string;
  district?: string;
  description?: string;
  address?: string;
  mainImage?: FileList;
  galleryImages?: FileList;
  categoryId?: string;
  subcategoryId?: string;
  estimatedTime?: string;
  workingSchedule?: WorkingSchedule;
  services?: Service[];
  websiteUrl?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function IndividualServiceForm() {
  const { t } = useTranslation("categories");
  const { data: categories, isLoading } = useCategories("booking");

  const [newService, setNewService] = useState<{
    name: string;
    price: string;
    duration: string;
  }>({ name: "", price: "", duration: "" });

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
      businessName: "",
      serviceType: undefined, //calTYpe
      city: "",
      // district: undefined,
      description: "",
      address: "",
      mainImage: undefined,
      galleryImages: undefined,
      categoryId: "",
      subcategoryId: undefined,
      estimatedTime: undefined,
      workingSchedule: {
        monday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        tuesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        wednesday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        thursday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        friday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        saturday: { enabled: false, startTime: "09:00", endTime: "18:00" },
        sunday: { enabled: false, startTime: "09:00", endTime: "18:00" },
      },
      services: [],
      websiteUrl: undefined,
      email: "",
      facebookUrl: undefined,
      instagramUrl: undefined,
    },
  });

  const categoryId = watch("categoryId");
  const serviceType = watch("serviceType");
  const services = watch("services");
  const selectedCategory = categories?.find((cat) => cat.name === categoryId);

  const addService = () => {
    const price = parseFloat(newService.price);
    const duration = parseInt(newService.duration);

    if (!newService.name || isNaN(price) || isNaN(duration)) {
      return;
    }

    if (duration % 5 !== 0 || duration < 5) {
      return;
    }

    const currentServices = services || [];
    setValue("services", [
      ...currentServices,
      { name: newService.name, price, duration },
    ]);

    setNewService({ name: "", price: "", duration: "" });
  };

  const removeService = (index: number) => {
    const currentServices = services || [];
    setValue(
      "services",
      currentServices.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: ServiceFormData) => {
    console.log("Form submitted:", data);
    console.log("Main image:", data.mainImage?.[0]);
    console.log("Gallery images:", Array.from(data.galleryImages || []));
    console.log("Estimated time:", data.estimatedTime);
    console.log("Working schedule:", data.workingSchedule);
    console.log("Services:", data.services);
    // TODO: Implement form submission logic
  };

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
    setValue("subcategoryId", "");
  };

  if (isLoading) {
    return <ServiceFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          თქვენი პირადი ბიზნესის სახელი
        </label>
        <Input
          {...register("businessName")}
          placeholder="შეიყვანეთ ბიზნენის სახელი"
        />
        {errors.businessName && (
          <p className="text-sm text-red-600 mt-1">
            {errors.businessName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          როგორ აპირებთ მომხმარებლის მომსახურებას?
        </label>
        <Controller
          name="serviceType"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={field.value === "outcall" ? "default" : "outline"}
                onClick={() => field.onChange("outcall")}
                className="flex-1"
              >
                გამოძახებით
              </Button>
              <Button
                type="button"
                variant={field.value === "onsite" ? "default" : "outline"}
                onClick={() => field.onChange("onsite")}
                className="flex-1"
              >
                ადგილზე
              </Button>
              <Button
                type="button"
                variant={field.value === "both" ? "default" : "outline"}
                onClick={() => field.onChange("both")}
                className="flex-1"
              >
                ორივე
              </Button>
            </div>
          )}
        />
        {errors.serviceType && (
          <p className="text-sm text-red-600 mt-1">
            {errors.serviceType.message}
          </p>
        )}
      </div>

      {/* City and District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">ქალაქი</label>
          <Input
            {...register("city")}
            // disabled={serviceType === "outcall"}
            placeholder="ქალაქი"
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">მისამართი</label>
          <Input
            {...register("address")}
            disabled={serviceType === "outcall"}
            placeholder="შეიყვანეთ მისამართი"
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">
              {errors.address.message}
            </p>
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
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Main Image 1*/}
      <div>
        <label className="block text-sm font-medium mb-2">
          სერვისის მთავარი სურათი
        </label>
        <Input type="file" accept="image/*" {...register("mainImage")} />
        {errors.mainImage && (
          <p className="text-sm text-red-600 mt-1">
            {errors.mainImage.message}
          </p>
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
          <p className="text-sm text-red-600 mt-1">
            {errors.galleryImages.message}
          </p>
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
            <p className="text-sm text-red-600 mt-1">
              {errors.categoryId.message}
            </p>
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
          {errors.subcategoryId && (
            <p className="text-sm text-red-600 mt-1">
              {errors.subcategoryId.message}
            </p>
          )}
        </div>
      </div>

      {/* Working Schedule */}
      <div>
        <label className="block text-sm font-medium mb-2">
          სამუშაო გრაფიკი
        </label>
        <Controller
          name="workingSchedule"
          control={control}
          render={({ field }) => {
            const days = [
              { value: "monday", label: "ორშაბათი" },
              { value: "tuesday", label: "სამშაბათი" },
              { value: "wednesday", label: "ოთხშაბათი" },
              { value: "thursday", label: "ხუთშაბათი" },
              { value: "friday", label: "პარასკევი" },
              { value: "saturday", label: "შაბათი" },
              { value: "sunday", label: "კვირა" },
            ];

            const toggleDay = (dayKey: string) => {
              const currentSchedule = field.value || {};
              const daySchedule =
                currentSchedule[dayKey as keyof WorkingSchedule];

              field.onChange({
                ...currentSchedule,
                [dayKey]: {
                  ...daySchedule,
                  enabled: !daySchedule?.enabled,
                  startTime: daySchedule?.startTime || "09:00",
                  endTime: daySchedule?.endTime || "18:00",
                },
              });
            };

            const updateTime = (
              dayKey: string,
              timeType: "startTime" | "endTime",
              value: string,
            ) => {
              const currentSchedule = field.value || {};
              const daySchedule =
                currentSchedule[dayKey as keyof WorkingSchedule];

              field.onChange({
                ...currentSchedule,
                [dayKey]: {
                  ...daySchedule,
                  [timeType]: value,
                },
              });
            };

            return (
              <div className="space-y-3">
                {days.map((day) => {
                  const daySchedule =
                    field.value?.[day.value as keyof WorkingSchedule];
                  const isEnabled = daySchedule?.enabled || false;

                  return (
                    <div
                      key={day.value}
                      className="flex items-center gap-4 p-3 border rounded-md"
                    >
                      <Button
                        type="button"
                        variant={isEnabled ? "default" : "outline"}
                        onClick={() => toggleDay(day.value)}
                        className="w-32"
                      >
                        {day.label}
                      </Button>

                      {isEnabled && (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            value={daySchedule?.startTime || "09:00"}
                            onChange={(e) =>
                              updateTime(day.value, "startTime", e.target.value)
                            }
                            step="300"
                            className="w-32"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={daySchedule?.endTime || "18:00"}
                            onChange={(e) =>
                              updateTime(day.value, "endTime", e.target.value)
                            }
                            step="300"
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
        {errors.workingSchedule && (
          <p className="text-sm text-red-600 mt-1">
            {errors.workingSchedule.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          აირჩიეთ სამუშაო დღეები და საათები (წუთები უნდა იყოს 5-ის ჯერადი)
        </p>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium mb-2">სერვისები</label>

        {/* Add Service Form */}
        <div className="border rounded-md p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                სერვისის დასახელება
              </label>
              <Input
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="მაგ: სტრიჟკა"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">ფასი (₾)</label>
              <Input
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                ხანგრძლივობა (წუთი)
              </label>
              <Input
                type="number"
                step="5"
                min="5"
                value={newService.duration}
                onChange={(e) =>
                  setNewService({ ...newService, duration: e.target.value })
                }
                placeholder="30"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={addService}
            className="w-full"
            variant="outline"
          >
            დაამატე სერვისი
          </Button>
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
                    {service.price} ₾ • {service.duration} წუთი
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  წაშლა
                </Button>
              </div>
            ))}
          </div>
        )}

        {errors.services && (
          <p className="text-sm text-red-600 mt-1">{errors.services.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          დაამატეთ სერვისები, რომლებსაც სთავაზობთ (ხანგრძლივობა უნდა იყოს 5-ის
          ჯერადი)
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
          <p className="text-sm text-red-600 mt-1">
            {errors.websiteUrl.message}
          </p>
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
          <label className="block text-sm font-medium mb-2">Facebook URL</label>
          <Input
            type="url"
            {...register("facebookUrl")}
            placeholder="https://facebook.com/yourpage"
          />
          {errors.facebookUrl && (
            <p className="text-sm text-red-600 mt-1">
              {errors.facebookUrl.message}
            </p>
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
            <p className="text-sm text-red-600 mt-1">
              {errors.instagramUrl.message}
            </p>
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
