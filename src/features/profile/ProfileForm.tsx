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
import { useAuth } from "@/context/useAuth";
import {
  profileSchema,
  type ProfileFormData,
} from "@/features/profile/profileSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";
import { useState } from "react";
import Avatar from "react-avatar";
import { Controller, useForm } from "react-hook-form";
import PasswordChangeModal from "./PasswordChangeModal";
import useGetUser from "@/features/user/useGetUser";

function ProfileForm() {
  const [enableEdit, setEnableEdit] = useState(true);
  const { data: user } = useGetUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  let fullName = user?.userName;
  if (user?.firstName && user?.secondName) {
    fullName = user?.firstName + " " + user?.secondName;
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || undefined,
      lastName: user?.secondName || undefined,
      gender: user?.gender || undefined,
      birthDate: user?.birthDate
        ? new Date(user.birthDate.split("-").reverse().join("-"))
        : undefined,
      phoneCountryCode: "+995",
      phoneNumber: user?.phoneNumber || undefined,
      email: user?.userEmail,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form data:", data);
    // Handle form submission here
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative">
            <Avatar
              name={fullName}
              size="60"
              round
              className="md:w-20! md:h-20!"
            />
            {!enableEdit && (
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
            <p className="text-xs md:text-sm text-gray-600">გამარჯობა,</p>
            <p className="text-lg md:text-2xl font-semibold">{fullName}</p>
          </div>
        </div>

        {/* Name Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              სახელი
            </label>
            <Input
              {...register("firstName")}
              type="text"
              placeholder="სახელი"
              className={`transition-all duration-300 ${
                enableEdit
                  ? "border-gray-200 bg-gray-50"
                  : "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-left-1"
              }`}
              disabled={enableEdit}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              გვარი
            </label>
            <Input
              {...register("lastName")}
              type="text"
              placeholder="გვარი"
              className={`transition-all duration-300 ${
                enableEdit
                  ? "border-gray-200 bg-gray-50"
                  : "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-right-1"
              }`}
              disabled={enableEdit}
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
              სქესი
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={enableEdit}
                >
                  <SelectTrigger
                    className={`w-full transition-all duration-300 ${
                      enableEdit
                        ? "border-gray-200 bg-gray-50"
                        : "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-left-1"
                    }`}
                  >
                    <SelectValue placeholder="აირჩიეთ სქესი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">მდედრობითი</SelectItem>
                    <SelectItem value="male">მამრობითი</SelectItem>
                    <SelectItem value="other">სხვა</SelectItem>
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
              დაბადების თარიღი
            </label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={enableEdit}
                      variant="outline"
                      className={`w-full justify-start text-left font-normal px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border rounded-lg transition-all duration-300 ${
                        enableEdit
                          ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          : "border-green-500 border-2 shadow-lg shadow-green-100 bg-white hover:bg-gray-50 animate-in slide-in-from-right-1"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      {field.value ? (
                        field.value.toLocaleDateString()
                      ) : (
                        <span className="text-gray-500">აირჩიეთ თარიღი</span>
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
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
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
            ტელეფონის ნომერი
          </label>
          <div className="flex gap-2">
            <Input
              {...register("phoneCountryCode")}
              type="text"
              className="w-16 md:w-20"
              placeholder="+995"
              disabled
            />
            <Input
              {...register("phoneNumber")}
              type="text"
              className={`flex-1 transition-all duration-300 ${
                enableEdit
                  ? "border-gray-200 bg-gray-50"
                  : "border-green-500 border-2 shadow-lg shadow-green-100 bg-white animate-in slide-in-from-bottom-2"
              }`}
              placeholder="ტელეფონის ნომერი"
              disabled={enableEdit}
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
            ელფოსტა
          </label>
          <Input
            {...register("email")}
            type="email"
            readOnly
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.email.message}
            </p>
          )}
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
          {enableEdit ? (
            <Button
              type="button"
              className="px-6 py-3 text-sm md:text-base 
bg-blue-500 hover:bg-blue-600 
text-white rounded-xl 
transition-all duration-200 
w-full sm:w-auto border-0 
flex items-center gap-2"
              onClick={() => setEnableEdit((value) => !value)}
            >
              <Pencil className="h-4 w-4" />
              მონაცემების შეცვლა
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Button
                type="button"
                variant="outline"
                className="px-4 md:px-6 py-2 text-sm md:text-base border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 w-full sm:w-auto"
                onClick={() => setEnableEdit((value) => !value)}
              >
                გაუქმება
              </Button>
              <Button
                type="submit"
                className="px-4 md:px-6 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 w-full sm:w-auto shadow-sm hover:shadow-md"
              >
                შენახვა
              </Button>
            </div>
          )}
        </div>
      </form>
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}

export default ProfileForm;
