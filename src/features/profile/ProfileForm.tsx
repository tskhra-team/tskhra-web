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
import { Calendar as CalendarIcon, Pencil, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Avatar from "react-avatar";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import VerifyUser from "./VerifyUser";

function ProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { data: profile, refetch } = useGetProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isVerifyUserOpen, setIsVerifyUserOpen] = useState(false);
  const [timeZone, setTimeZone] = useState<string>();
  const { t } = useTranslation("profile");

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
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      birthDate: new Date(),
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        birthDate: profile.birthDate
          ? new Date(profile.birthDate)
          : new Date(new Date().getFullYear() - 8, 11),
        phoneCountryCode: "+995",
        phoneNumber: profile.phoneNumber?.slice(4),
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditMode(false);
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["getUser"],
        });
        toast.success(t("form.messages.updateSuccess"), {
          position: "top-center",
        });
      },
      onError: () => {
        toast.error(t("form.messages.updateError"));
      },
    });
  };

  const isUserhasAllData = Boolean(
    profile?.firstName &&
    profile?.lastName &&
    profile?.gender &&
    profile?.birthDate &&
    profile?.phoneNumber,
  );

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6 bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl"
      >
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative">
            <Avatar
              name={fullName}
              size="60"
              round
              className="md:w-20! md:h-20!"
            />
            {isEditMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1.5 md:p-2 hover:bg-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="md:w-4 md:h-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>
            )}
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600">
              {t("form.hello")},
            </p>
            <p className="text-lg md:text-2xl font-semibold">{fullName}</p>
          </div>
        </div>

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
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                      startMonth={new Date(1925, 0)}
                      endMonth={new Date(new Date().getFullYear() - 8, 11)}
                      timeZone={timeZone}
                    />
                  </PopoverContent>
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

        {/* <div className="pt-2">
          <Button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            variant="outline"
            className="px-4 md:px-6 py-2 text-sm md:text-base border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 w-full sm:w-auto"
          >
            პაროლის შეცვლა
          </Button>
        </div> */}

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4">
          {!isEditMode ? (
            <>
              <Button
                type="button"
                className="px-6 py-3 text-sm md:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 w-full sm:w-auto border-0 flex items-center gap-2"
                onClick={() => setIsEditMode((value) => !value)}
              >
                <Pencil className="h-4 w-4" />
                {t("form.editInfo")}
              </Button>

              {!profile?.status && (
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (!isUserhasAllData) {
                      toast.info(t("form.messages.allFieldsRequired"), {
                        position: "top-center",
                      });
                      setIsEditMode((edit) => !edit);
                    } else {
                      setIsVerifyUserOpen(true);
                    }
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t("form.goToVerification")}
                </Button>
              )}

              <Button
                type="button"
                onClick={() => {
                  unVerifyUser(undefined, {
                    onSuccess: () => {
                      toast.success(t("form.messages.unverifySuccess"), {
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
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                type="button"
                variant="outline"
                className="px-4 md:px-6 py-2 text-sm md:text-base border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 w-full sm:w-auto"
                onClick={() => {
                  setIsEditMode(false);
                  reset();
                }}
              >
                {t("form.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-4 md:px-6 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-full sm:w-auto shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? t("form.saving") : t("form.save")}
              </Button>
            </div>
          )}
        </div>
      </form>

      <VerifyUser open={isVerifyUserOpen} onOpenChange={setIsVerifyUserOpen} />
    </>
  );
}

export default ProfileForm;
