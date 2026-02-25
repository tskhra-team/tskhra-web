import {
  IndividualBusiessSchema,
  type IndividualBusinessFormData,
} from "@/Booking/IndividualBusinessSchema";
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

  // Локальный стейт для создания нового сервиса
  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    duration: 0,
    description: "",
  });
  // Локальный стейт для ошибок при добавлении сервиса
  const [serviceError, setServiceError] = useState("");

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

  const addService = () => {
    // Сбрасываем ошибку перед новой проверкой
    setServiceError("");

    if (!newService.name || newService.name.length < 2) {
      setServiceError("სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს");
      return;
    }
    if (newService.price <= 0) {
      setServiceError("ფასი უნდა იყოს 0-ზე მეტი");
      return;
    }
    if (newService.duration < 5 || newService.duration % 5 !== 0) {
      setServiceError("ხანგრძლივობა უნდა იყოს 5-ის ჯერადი (მინიმუმ 5)");
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
      // Если нужно загружать фото отдельным запросом, раскомментируйте код ниже:
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
      {/* Business Name */}
      <div className="my-12">
        <Label className="block text-lg font-medium mb-2">
          თქვენი პირადი ბიზნესის სახელი
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
          როგორ აპირებთ მომხმარებლის მომსახურებას?
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
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.callType.message}
          </p>
        )}
      </div>

      {/* City and Address */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div>
          <Label className="block text-lg font-medium mb-2">ქალაქი</Label>
          <Input {...register("city")} placeholder="ქალაქი" />
          {errors.city && (
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label className="block text-lg font-medium mb-2">მისამართი</Label>
          <Input
            {...register("address")}
            disabled={callType === "outcall"}
            placeholder="შეიყვანეთ მისამართი"
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
        <Label className="block text-lg font-medium mb-2">ვრცელი აღწერა</Label>
        <textarea
          {...register("description")}
          placeholder="აღწერეთ თქვენი სერვისი დეტალურად"
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
          ბიზნესის მთავარი სურათი
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
          გალერეის სურათები
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
          შეგიძლიათ აირჩიოთ რამდენიმე სურათი (მაქსიმუმ 4)
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div>
          <Label className="block text-lg font-medium mb-2">
            აირჩიე კატეგორია
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
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.mainCategory.message}
            </p>
          )}
        </div>

        <div>
          <Label className="block text-lg font-medium mb-2">
            აირჩიე ქვეკატეგორია
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
            <p className="text-xs text-red-500 font-bold mt-2">
              {errors.subCategory.message}
            </p>
          )}
        </div>
      </div>

      {/* Working Schedule */}
      <div className="mb-16">
        <Label className="block text-lg font-medium mb-2">
          სამუშაო გრაფიკი
        </Label>
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
                  { weekDay: dayKey, startTime: 540, endTime: 1080 },
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
                  const dayIndex = (field.value || []).findIndex(
                    (t) => t.weekDay === day.value,
                  );
                  const daySchedule =
                    dayIndex >= 0 ? field.value[dayIndex] : null;
                  const isEnabled = !!daySchedule;

                  // Достаем ошибку конкретного дня из массива ошибок RHF
                  const dayErrors =
                    Array.isArray(errors.workTimes) && dayIndex >= 0
                      ? (errors.workTimes[dayIndex] as any)
                      : null;

                  return (
                    <div key={day.value} className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 p-3 border rounded-md">
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
                                updateTime(
                                  day.value,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              step="300"
                              className={`w-32 ${dayErrors?.startTime ? "border-red-500" : ""}`}
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              value={minutesToTime(daySchedule.endTime)}
                              onChange={(e) =>
                                updateTime(day.value, "endTime", e.target.value)
                              }
                              step="300"
                              className={`w-32 ${dayErrors?.endTime ? "border-red-500" : ""}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Ошибки для конкретного дня */}
                      {dayErrors?.startTime && (
                        <p className="text-xs text-red-600 pl-4">
                          {dayErrors.startTime.message}
                        </p>
                      )}
                      {dayErrors?.endTime && (
                        <p className="text-xs text-red-600 pl-4">
                          {dayErrors.endTime.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
        {/*  Global error if day isnt choosen */}
        {errors.workTimes && !Array.isArray(errors.workTimes) && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.workTimes.message as string}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          აირჩიეთ სამუშაო დღეები და საათები (წუთები უნდა იყოს 5-ის ჯერადი)
        </p>
      </div>

      {/* Services */}
      <div className="mb-16">
        <Label className="block text-lg font-medium mb-2">სერვისები</Label>

        {/* Add Service Form */}
        <div className="border rounded-md p-4 mb-4 space-y-3 bg-muted/20">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="block text-xs font-medium mb-1">
                სერვისის დასახელება
              </Label>
              <Input
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="მაგ: სტრიჟკა"
              />
            </div>
            <div>
              <Label className="block text-xs font-medium mb-1">ფასი (₾)</Label>
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
              <Label className="block text-xs font-medium mb-1">
                ხანგრძლივობა (წუთი)
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
                placeholder="30"
              />
            </div>
          </div>
          <div>
            <Label className="block text-xs font-medium mb-1">
              აღწერა (არასავალდებულო)
            </Label>
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

          {/* Локальная ошибка добавления сервиса */}
          {serviceError && (
            <p className="text-sm text-red-600 mt-2 text-center">
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

        {/* Глобальная ошибка (например, если нет ни одного сервиса) */}
        {errors.services && !Array.isArray(errors.services) && (
          <p className="text-xs text-red-500 font-bold mt-2">
            {errors.services.message as string}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          დაამატეთ სერვისები, რომლებსაც სთავაზობთ (ხანგრძლივობა უნდა იყოს 5-ის
          ჯერადი)
        </p>
      </div>

      {/* Contact Info */}
      <div>
        <Label className="block text-sm font-medium mb-2">ნომერი</Label>
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
