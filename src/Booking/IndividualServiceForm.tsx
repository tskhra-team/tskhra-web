import {
  IndividualBusiessSchema,
  type IndividualBusinessFormData,
} from "@/Booking/IndividualBusinessSchema";
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
import { categoryNameToKey } from "@/shared/categories/categoryTranslations";
import { useCategories } from "@/shared/categories/useCategories";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ServiceFormSkeleton from "./ServiceFormSkeleton";
import useCreaetIndividualBusiness from "./useCreateIndividualBusiness";
import useUploadPhotos from "./useUploadPhotos";

export default function IndividualServiceForm() {
  const { t } = useTranslation("categories");
  const { data: categories, isLoading } = useCategories("booking");
  const createBusiness = useCreaetIndividualBusiness();
  const uploadPhotos = useUploadPhotos();

  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IndividualBusinessFormData>({
    resolver: yupResolver(IndividualBusiessSchema) as any,
    defaultValues: {
      businessName: "",
      callType: undefined,
      city: "",
      address: "",
      description: "",
      images: undefined,
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

  const addService = () => {
    if (!newService.name || newService.price <= 0 || newService.duration <= 0) {
      return;
    }

    if (newService.duration % 5 !== 0 || newService.duration < 5) {
      return;
    }

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

      alert("სერვისი წარმატებით გამოქვეყნდა!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
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
        {errors.callType && (
          <p className="text-sm text-red-600 mt-1">{errors.callType.message}</p>
        )}
      </div>

      {/* City and District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">ქალაქი</label>
          <Input {...register("city")} placeholder="ქალაქი" />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2">მისამართი</Label>
          <Input
            {...register("address")}
            disabled={callType === "outcall"}
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

      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium mb-2">
          სერვისის მთავარი სურათი
        </label>
        <Controller
          name="images.businessPhoto"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              type="file"
              accept="image/*"
              {...field}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file);
              }}
            />
          )}
        />
        {errors.images?.businessPhoto && (
          <p className="text-sm text-red-600 mt-1">
            {errors.images.businessPhoto.message}
          </p>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium mb-2">
          გალერეის სურათები
        </label>
        <Controller
          name="images.galleryPhoto"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              type="file"
              accept="image/*"
              multiple
              {...field}
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                onChange(files);
              }}
            />
          )}
        />
        {errors.images?.galleryPhoto && (
          <p className="text-sm text-red-600 mt-1">
            {errors.images.galleryPhoto.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          შეგიძლიათ აირჩიოთ რამდენიმე სურათი (მაქსიმუმ 4)
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            აირჩიე კატეგორია
          </label>
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
          {errors.mainCategory && (
            <p className="text-sm text-red-600 mt-1">
              {errors.mainCategory.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            აირჩიე ქვეკატეგორია
          </label>
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
          {errors.subCategory && (
            <p className="text-sm text-red-600 mt-1">
              {errors.subCategory.message}
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
          name="workTimes"
          control={control}
          render={({ field }) => {
            const days = [
              { value: "MON", label: "ორშაბათი" },
              { value: "TUE", label: "სამშაბათი" },
              { value: "WED", label: "ოთხშაბათი" },
              { value: "THU", label: "ხუთშაბათი" },
              { value: "FRI", label: "პარასკევი" },
              { value: "SAT", label: "შაბათი" },
              { value: "SUN", label: "კვირა" },
            ];

            const timeToMinutes = (time: string) => {
              const [hours, minutes] = time.split(":").map(Number);
              return hours * 60 + minutes;
            };

            const minutesToTime = (minutes: number) => {
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
            };

            const toggleDay = (dayKey: string) => {
              const currentTimes = field.value || [];
              const existingIndex = currentTimes.findIndex(
                (t) => t.weekDay === dayKey,
              );

              if (existingIndex >= 0) {
                field.onChange(
                  currentTimes.filter((_, i) => i !== existingIndex),
                );
              } else {
                field.onChange([
                  ...currentTimes,
                  {
                    weekDay: dayKey,
                    startTime: 540,
                    endTime: 1080,
                  },
                ]);
              }
            };

            const updateTime = (
              dayKey: string,
              timeType: "startTime" | "endTime",
              value: string,
            ) => {
              const currentTimes = field.value || [];
              const minutes = timeToMinutes(value);
              field.onChange(
                currentTimes.map((t) =>
                  t.weekDay === dayKey ? { ...t, [timeType]: minutes } : t,
                ),
              );
            };

            return (
              <div className="space-y-3">
                {days.map((day) => {
                  const daySchedule = (field.value || []).find(
                    (t) => t.weekDay === day.value,
                  );
                  const isEnabled = !!daySchedule;

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

                      {isEnabled && daySchedule && (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            value={minutesToTime(daySchedule.startTime)}
                            onChange={(e) =>
                              updateTime(day.value, "startTime", e.target.value)
                            }
                            step="300"
                            className="w-32"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={minutesToTime(daySchedule.endTime)}
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
        {errors.workTimes && (
          <p className="text-sm text-red-600 mt-1">
            {errors.workTimes.message}
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
                value={newService.price || ""}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    price: Number(e.target.value),
                  })
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
                value={newService.duration || ""}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    duration: Number(e.target.value),
                  })
                }
                placeholder="30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              აღწერა (არასავალდებულო)
            </label>
            <Input
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder="სერვისის აღწერა"
            />
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
        <label className="block text-sm font-medium mb-2">ნომერი</label>
        <Input
          type="text"
          {...register("info.phoneNumber")}
          placeholder="+995511111111"
        />
        {errors.info?.phoneNumber && (
          <p className="text-sm text-red-600 mt-1">
            {errors.info.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Social Media URLs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Facebook URL</label>
          <Input
            type="text"
            {...register("info.facebookUrl")}
            placeholder="https://facebook.com/yourpage"
          />
          {errors.info?.facebookUrl && (
            <p className="text-sm text-red-600 mt-1">
              {errors.info.facebookUrl.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Instagram URL
          </label>
          <Input
            type="text"
            {...register("info.instagramUrl")}
            placeholder="https://instagram.com/youraccount"
          />
          {errors.info?.instagramUrl && (
            <p className="text-sm text-red-600 mt-1">
              {errors.info.instagramUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline">
          გაუქმება
        </Button>
        <Button
          type="submit"
          disabled={createBusiness.isPending || uploadPhotos.isPending}
        >
          {createBusiness.isPending || uploadPhotos.isPending
            ? "მიმდინარეობს..."
            : "გამოაქვეყნე სერვისი"}
        </Button>
      </div>
    </form>
  );
}
