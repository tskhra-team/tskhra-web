import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  profileSchema,
  type ProfileFormData,
} from "@/features/profile/profileSchema";
import useGetProfile from "@/features/profile/useGetProfile";
import useUnVerify from "@/features/profile/useUnVerify";
import useUpdateProfile from "@/features/profile/useUpdateProfile";
import queryClient from "@/query/queryClient";
import { yupResolver } from "@hookform/resolvers/yup";
import { Calendar as CalendarIcon, Check, Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarCropperModal from "@/features/profile/AvatarCropperModal";
import BlurVerifiedUser from "@/features/profile/BlurVerifiedUser";
import useUploadAvatar from "@/features/profile/useUploadAvatar";
import useVerify from "@/features/profile/useVerify";
import imageCompression from "browser-image-compression";

function ProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { data: profile, refetch } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const [timeZone, setTimeZone] = useState<string>();
  const { t } = useTranslation("profile");
  const { mutate: verifyUser } = useVerify();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();

  const isPending = isUpdating || isUploading;

  // STATES FOR CROPPING PHOTO
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const fullName = useMemo(() => {
    if (profile?.firstName && profile?.lastName) {
      return profile.firstName + " " + profile.lastName;
    }
    return profile?.userName;
  }, [profile?.firstName, profile?.lastName, profile?.userName]);

  //TESTS ONLY
  const { mutate: unVerifyUser } = useUnVerify();

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      phoneNumber: "",
      birthDate: new Date(),
      avatarFile: undefined,
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        gender: profile.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate)
          : new Date(new Date().getFullYear() - 16, 11),
        phoneCountryCode: "+995",
        phoneNumber: profile.phoneNumber?.slice(4) ?? "",
      });
      setPreviewAvatar(null);
    }
  }, [profile, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file size (4MB max)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size can't be more than 5MB", {
          position: "top-center",
        });
        e.target.value = "";
        return;
      }

      // Validate file format
      const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        toast.error("Unsupported file format. Please use JPG, PNG, or WEBP", {
          position: "top-center",
        });
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCropSuccess = async (croppedFile: File) => {
    try {
      // 1. Настройки сжатия (максимум 100 КБ, размер не больше 400x400)
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      // 2. Сжимаем файл, который пришел из кроппера
      const compressedFile = await imageCompression(croppedFile, options);

      // Показываем превью уже сжатой картинки
      setPreviewAvatar(URL.createObjectURL(compressedFile));

      // 3. Отправляем сжатый файл на сервер или сохраняем в форму
      if (!isEditMode || profile?.status) {
        uploadAvatar(
          { avatar: compressedFile }, // Отправляем compressedFile вместо croppedFile
          {
            onSuccess: () => {
              toast.success("Avatar successfully updated!", {
                position: "top-center",
              });
              refetch();
              queryClient.invalidateQueries({ queryKey: ["getUser"] });
            },
            onError: () => {
              toast.error("Avatar didn't update");
              setPreviewAvatar(null);
            },
          },
        );
      } else {
        setValue("avatarFile", compressedFile, { shouldValidate: true }); // Сохраняем compressedFile
      }
    } catch (error) {
      console.error("Ошибка при сжатии картинки:", error);
      toast.error("Error compressing image", { position: "top-center" });
    }
  };

  const handleSuccessFinish = () => {
    setIsEditMode(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ["getUser"] });
    toast.success(t("form.messages.updateSuccess"), { position: "top-center" });
  };

  const onSubmit = (data: ProfileFormData) => {
    const { avatarFile, ...profileData } = data;

    updateProfile(profileData, {
      onSuccess: () => {
        if (avatarFile) {
          uploadAvatar(
            { avatar: avatarFile },
            {
              onSuccess: () => {
                handleSuccessFinish();
              },
              onError: () => {
                toast.error("Profile is updated, but avatar didn't update");
                handleSuccessFinish();
              },
            },
          );
        } else {
          handleSuccessFinish();
        }
      },
      onError: () => {
        toast.error(t("form.messages.updateError"));
      },
    });
  };
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* НОВОЕ: МОДАЛКА КРОППЕРА */}
      <AvatarCropperModal
        imageSrc={imageSrc}
        onClose={() => setImageSrc(null)}
        onSave={handleCropSuccess}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6 bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={previewAvatar || profile?.avatar}
                  alt={fullName}
                />
                <AvatarFallback className="text-4xl">
                  {fullName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-300"
                >
                  <Pencil className="md:w-4 md:h-4 w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">
                {t("form.hello")},
              </p>
              <p className="text-lg md:text-2xl font-semibold">{fullName}</p>
              {errors.avatarFile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.avatarFile.message}
                </p>
              )}
            </div>
          </div>

          {profile?.status ? (
            <Button
              type="button"
              variant="link"
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Pencil className="h-4 w-4" />
              {t("form.changePrfPic")}
            </Button>
          ) : !isEditMode ? (
            <Button
              type="button"
              variant="link"
              onClick={() => setIsEditMode((value) => !value)}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              {t("form.editInfo")}
            </Button>
          ) : (
            <div className="flex flex-col justify-end sm:flex-row gap-2 md:gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                type="button"
                variant="link"
                className="cursor-pointer text-red-700"
                onClick={() => {
                  setIsEditMode(false);
                  reset();
                  setPreviewAvatar(null);
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                variant="link"
                className="cursor-pointer text-green-700"
              >
                <Check />
                {isPending ? t("form.saving") : t("form.save")}
              </Button>
            </div>
          )}
        </div>
        <BlurVerifiedUser isVerified={profile?.status}>
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                {t("form.firstName")}
              </label>
              <Input
                {...register("firstName")}
                type="text"
                placeholder={t("form.placeholders.firstName")}
                className={`transition-all duration-300 ${
                  isEditMode
                    ? "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-left-1"
                    : "border-gray-200 bg-gray-50"
                }`}
                disabled={!isEditMode}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                {t("form.lastName")}
              </label>
              <Input
                {...register("lastName")}
                type="text"
                placeholder={t("form.placeholders.lastName")}
                className={`transition-all duration-300 ${
                  isEditMode
                    ? "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-right-1"
                    : "border-gray-200 bg-gray-50"
                }`}
                disabled={!isEditMode}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                {t("form.gender.label")}
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isEditMode}
                    key={field.value}
                  >
                    <SelectTrigger
                      className={`w-full transition-all duration-300 ${
                        isEditMode
                          ? "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-left-1"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <SelectValue placeholder={t("form.gender.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEMALE">
                        {t("form.gender.female")}
                      </SelectItem>
                      <SelectItem value="MALE">
                        {t("form.gender.male")}
                      </SelectItem>
                      <SelectItem value="OTHER">
                        {t("form.gender.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                {t("form.birthDate.label")}
              </label>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        disabled={!isEditMode}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border rounded-lg transition-all duration-300 ${
                          isEditMode
                            ? "border-green-500 border-2 shadow-lg shadow-green-100 bg-white hover:bg-gray-50 animate-in slide-in-from-right-1"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        {field.value ? (
                          field.value.toLocaleDateString()
                        ) : (
                          <span className="text-gray-500">
                            {t("form.birthDate.placeholder")}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    {isCalendarOpen && (
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          defaultMonth={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
                          startMonth={
                            new Date(new Date().getFullYear() - 100, 0)
                          }
                          endMonth={new Date(new Date().getFullYear() - 16, 11)}
                          timeZone={timeZone}
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                )}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              {t("form.phoneNumber")}
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="w-16 md:w-20"
                placeholder="+995"
                disabled
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className={`flex-1 transition-all duration-300 ${
                      isEditMode
                        ? "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-bottom-2"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder={t("form.placeholders.phoneNumber")}
                    disabled={!isEditMode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                    onKeyDown={(e) => {
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Home",
                          "End",
                        ].includes(e.key) &&
                        !(e.ctrlKey || e.metaKey)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              {t("form.email")}
            </label>
            <Input
              placeholder={profile?.userEmail}
              type="email"
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </BlurVerifiedUser>
      </form>

      <Button
        type="button"
        onClick={() => {
          unVerifyUser(undefined, {
            onSuccess: () => {
              toast.success("TEST: UNVERIFY SUCCESSFULLY", {
                position: "top-center",
              });
              queryClient.invalidateQueries({
                queryKey: ["getUser"],
              });
              refetch();
            },
            onError: () => {
              toast.error(t("form.messages.unverifyError"), {
                position: "top-center",
              });
            },
          });
        }}
      >
        TEST ONLY UNVERIFY
      </Button>

      <Button
        type="button"
        onClick={() => {
          verifyUser(undefined, {
            onSuccess: () => {
              toast.success("TEST: VERIFY SUCCESSFULLY", {
                position: "top-center",
              });
              queryClient.invalidateQueries({
                queryKey: ["getUser"],
              });
              refetch();
            },
            onError: () => {
              toast.error(t("form.messages.unverifyError"), {
                position: "top-center",
              });
            },
          });
        }}
      >
        TEST ONLY VERIFY
      </Button>
    </>
  );
}

export default ProfileForm;
