import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useModal } from "@/context/ModalContext";
import AvatarCropperModal from "@/features/profile/AvatarCropperModal";
import useDeleteAvatar from "@/features/profile/hooks/useDeleteAvatar";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import useUnVerify from "@/features/profile/hooks/useUnVerify";
import useUpdateProfile from "@/features/profile/hooks/useUpdateProfile";
import useUploadAvatar from "@/features/profile/hooks/useUploadAvatar";
import useVerify from "@/features/profile/hooks/useVerify";
import {
  MAX_FILE_SIZE,
  profileSchema,
  SUPPORTED_FORMATS,
  type ProfileFormData,
} from "@/features/profile/profileSchema";
import queryClient from "@/query/queryClient";
import type { ProfileType } from "@/types";
import { scrollToTop } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import imageCompression from "browser-image-compression";
import {
  AtSign,
  Building2,
  Calendar as CalendarIcon,
  Check,
  Loader,
  Pencil,
  ShieldCheck,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type ProfileSettingsProps = {
  profile: ProfileType | undefined;
  isEditMode: boolean;
  onSetIsEditMode: (value: boolean) => void;
};

export default function ProfileSettings({
  profile: _initialProfile,
  isEditMode,
  onSetIsEditMode,
}: ProfileSettingsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { data: profile, refetch } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const [timeZone, setTimeZone] = useState<string>();
  const { t } = useTranslation(["profile", "modal"]);
  const { mutate: verifyUser } = useVerify();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { mutate: deleteAvatar } = useDeleteAvatar();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const isPending = isUpdating || isUploading;

  // STATES FOR CROPPING PHOTO
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const verificationStatus = profile?.status;
  // const isFullnameExist = profile?.firstName && profile?.lastName;
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

  const form = useForm({
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

  const {
    register,
    handleSubmit,
    control,
    reset,

    formState: { errors },
  } = form;

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        gender: profile.gender as "MALE" | "FEMALE" | "",
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
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size can't be more than 5MB", {
          position: "top-center",
        });
        e.target.value = "";
        return;
      }

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        toast.error("Unsupported file format. Please use JPG, PNG, or WEBP", {
          position: "top-center",
        });
        e.target.value = "";
        return;
      }

      setOriginalFile(file);
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
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(croppedFile, options);

      // Get file extension from original file name
      const originalName = originalFile?.name || "avatar.jpg";
      const extension = originalName.split(".").pop() || "jpg";
      const nameWithoutExt =
        originalName.substring(0, originalName.lastIndexOf(".")) || "avatar";

      // Create new file with original name pattern and compressed blob type
      const compressedFile = new File(
        [compressedBlob],
        `${nameWithoutExt}.${extension}`,
        {
          type: compressedBlob.type,
          lastModified: Date.now(),
        },
      );

      setPreviewAvatar(URL.createObjectURL(compressedFile));

      uploadAvatar(
        { avatar: compressedFile },
        {
          onSuccess: () => {
            toast.success("Avatar successfully updated!", {
              position: "top-center",
            });
            refetch();
            queryClient.invalidateQueries({ queryKey: ["getUser"] });
          },
          onError: () => {
            toast.error("Avatar didn't update", { position: "top-center" });
            setPreviewAvatar(null);
          },
        },
      );
    } catch (error) {
      toast.error("Error compressing image", { position: "top-center" });
    }
  };

  const handleSuccessFinish = () => {
    onSetIsEditMode(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ["getUser"] });
    toast.success(t("form.messages.updateSuccess"), { position: "top-center" });
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        handleSuccessFinish();
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

      <AvatarCropperModal
        imageSrc={imageSrc}
        onClose={() => setImageSrc(null)}
        onSave={handleCropSuccess}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-indigo-200 ring-4 ring-indigo-50">
                  <AvatarImage
                    src={previewAvatar || profile?.avatar}
                    alt={fullName}
                  />
                  <AvatarFallback className="text-4xl bg-linear-to-br from-indigo-50 to-indigo-100 text-indigo-700">
                    {fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-full p-2 hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200"
                >
                  {isUploading ? (
                    <Loader className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t("form.hello")}</p>
                <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                  {fullName}
                </p>
                {errors.avatarFile && (
                  <p className="text-rose-600 text-xs mt-1">
                    {errors.avatarFile.message}
                  </p>
                )}
              </div>
            </div>

            {profile?.avatar && (
              <Button
                type="button"
                variant="outline"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                onClick={() =>
                  showModal(
                    "idle",
                    t("modal:titles.deleteAvatar"),
                    t("modal:messages.confirmDeleteAvatar"),
                    t("modal:buttons.yesDelete"),
                    () => {
                      deleteAvatar(undefined, {
                        onSuccess: () => {
                          toast.success("Avatar deleted successfully", {
                            position: "top-center",
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["getUser"],
                          });
                          refetch();
                        },
                        onError: () => {
                          toast.error("Failed to delete avatar");
                        },
                      });
                    },
                    "Cancel",
                  )
                }
              >
                <X className="h-4 w-4 mr-2" />
                {t("form.deleteAvatar")}
              </Button>
            )}
          </div>
        </section>

        {/* Personal & Contact Information Section (Merged) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              {t("infoTab.personalInfo")}
            </h3>

            {profile?.status ? (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>{t("form.alreadyVerified")}</span>
              </div>
            ) : !isEditMode ? (
              <Button
                type="button"
                onClick={() => onSetIsEditMode(true)}
                variant="outline"
                className="hover:bg-slate-50 hover:border-indigo-400"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t("form.editInfo")}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-slate-50"
                  onClick={() => {
                    onSetIsEditMode(false);
                    reset();
                    setPreviewAvatar(null);
                  }}
                >
                  {t("form.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md"
                >
                  <Check className="w-4 h-4 " />
                  {isPending ? t("form.saving") : t("form.save")}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("form.firstName")}
                </label>
                <Input
                  {...register("firstName")}
                  type="text"
                  placeholder={t("form.placeholders.firstName")}
                  className={`transition-colors ${
                    isEditMode && !profile?.status
                      ? "border-indigo-300 bg-white focus:border-indigo-600 focus:ring-indigo-600"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                  disabled={!isEditMode || profile?.status}
                />
                {errors.firstName && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("form.lastName")}
                </label>
                <Input
                  {...register("lastName")}
                  type="text"
                  placeholder={t("form.placeholders.lastName")}
                  className={`transition-colors ${
                    isEditMode && !profile?.status
                      ? "border-indigo-300 bg-white focus:border-indigo-600 focus:ring-indigo-600"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                  disabled={!isEditMode || profile?.status}
                />
                {errors.lastName && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Gender & Birth Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("form.gender.label")}
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isEditMode || profile?.status}
                      key={field.value}
                    >
                      <SelectTrigger
                        className={`w-full transition-colors ${
                          isEditMode && !profile?.status
                            ? "border-indigo-300 bg-white focus:border-indigo-600 focus:ring-indigo-600"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <SelectValue
                          placeholder={t("form.gender.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEMALE">
                          {t("form.gender.female")}
                        </SelectItem>
                        <SelectItem value="MALE">
                          {t("form.gender.male")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
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
                          disabled={!isEditMode || profile?.status}
                          variant="outline"
                          className={`w-full justify-start text-left font-normal transition-colors ${
                            isEditMode && !profile?.status
                              ? "border-indigo-300 bg-white hover:bg-slate-50 focus:border-indigo-600 focus:ring-indigo-600"
                              : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-5 w-5 text-slate-400" />
                          {field.value ? (
                            field.value.toLocaleDateString()
                          ) : (
                            <span className="text-slate-500">
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
                            endMonth={
                              new Date(new Date().getFullYear() - 16, 11)
                            }
                            timeZone={timeZone}
                          />
                        </PopoverContent>
                      )}
                    </Popover>
                  )}
                />
                {errors.birthDate && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number Row */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("form.phoneNumber")}
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  className="w-20 bg-slate-50"
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
                      className={`flex-1 transition-colors ${
                        isEditMode && !profile?.status
                          ? "border-indigo-300 bg-white focus:border-indigo-600 focus:ring-indigo-600"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                      placeholder={t("form.placeholders.phoneNumber")}
                      disabled={!isEditMode || profile?.status}
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
                <p className="text-rose-600 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Username Read-only Card */}
            <div className="flex items-center gap-4 p-4 bg-linear-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
              <div className="p-3 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg">
                <UserCircle className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">
                  {t("infoTab.username")}
                </p>
                <p className="font-medium text-slate-900 wrap-break-word">
                  {profile?.userName}
                </p>
              </div>
            </div>

            {/* Email Read-only Card */}
            <div className="flex items-center gap-4 p-4 bg-linear-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
              <div className="p-3 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg">
                <AtSign className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">
                  {t("infoTab.email")}
                </p>
                <p className="font-medium text-slate-900 wrap-break-word">
                  {profile?.userEmail}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            {t("infoTab.accountStatus")}
          </h3>

          <div className="space-y-4">
            {/* Account Created Card */}
            <div className="flex items-center gap-4 p-4 bg-linear-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
              <div className="p-3 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">
                  {t("infoTab.accountCreated")}
                </p>
                <p className="font-medium text-slate-900">
                  {profile?.createDate}
                </p>
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="flex items-center justify-between p-4 bg-linear-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    verificationStatus
                      ? "bg-linear-to-br from-emerald-50 to-emerald-100"
                      : "bg-linear-to-br from-slate-100 to-slate-50"
                  }`}
                >
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      verificationStatus ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    {t("infoTab.accountStatus")}
                  </p>
                  <p
                    className={`text-base font-semibold ${
                      verificationStatus ? "text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    {verificationStatus
                      ? t("infoTab.verified")
                      : t("infoTab.notVerified")}
                  </p>
                </div>
              </div>

              {!verificationStatus && (
                <Button
                  type="button"
                  onClick={() => {
                    navigate("/verification");
                  }}
                  className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md"
                >
                  {t("infoTab.goToVerification")}
                </Button>
              )}
            </div>

            {/* Add Business Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full p-6 hover:bg-slate-50 hover:border-indigo-400 transition-all duration-200"
              onClick={() => {
                if (!verificationStatus) {
                  showModal(
                    "error",
                    "You aren't verified!",
                    "To create a business you need to verify",
                    "Close",
                    () => {},
                    "Go to verifications",
                    () => {
                      navigate("/verification");
                    },
                  );
                } else {
                  scrollToTop();
                  navigate("/create-business");
                }
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Building2 className="w-5 h-5 text-slate-600" />
                <span className="text-base font-medium">
                  {t("infoTab.addBusinessButton")}
                </span>
              </div>
            </Button>

            {/* Test Buttons (Development Only) */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
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
                TEST: Unverify
              </Button>

              <Button
                type="button"
                variant="outline"
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
                TEST: Verify
              </Button>
            </div>
          </div>
        </section>
      </form>
    </>
  );
}
