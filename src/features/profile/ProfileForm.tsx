import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Calendar } from "lucide-react";
import { useState } from "react";
import Avatar from "react-avatar";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PasswordChangeModal from "./PasswordChangeModal";

const profileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female", "other"], "Please select a valid gender"),
  birthDate: yup
    .string()
    .required("Birth year is required")
    .min(1900, "Invalid birth year")
    .max(new Date().getFullYear(), "Birth year cannot be in the future"),
  personalNumber: yup.string().defined(""),
  phoneCountryCode: yup.string().required("Country code is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{9}$/, "Phone number must be 9 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

function ProfileForm() {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  let fullName = user?.userName;
  if (user?.firstName && user?.secondName) {
    fullName = user?.firstName + " " + user?.secondName;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.secondName,
      gender: user?.gender,
      birthDate: user?.birthDate,
      phoneCountryCode: "+995",
      phoneNumber: user?.phoneNumber,
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
              სახელი<span className="text-red-500">*</span>
            </label>
            <input
              {...register("firstName")}
              type="text"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              გვარი<span className="text-red-500">*</span>
            </label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              სქესი<span className="text-red-500">*</span>
            </label>
            <select
              {...register("gender")}
              className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="female">მდედრობითი</option>
              <option value="male">მამრობითი</option>
              <option value="other">სხვა</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              დაბადების წელი<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("birthDate")}
                type="number"
                className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.birthDate && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.birthDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            ტელეფონის ნომერი<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              {...register("phoneCountryCode")}
              type="text"
              className="w-16 md:w-20 px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              {...register("phoneNumber")}
              type="text"
              className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            ელფოსტა<span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            readOnly
            className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            variant="outline"
            className="px-4 md:px-6 py-2 text-sm md:text-base border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 w-full sm:w-auto"
          >
            პაროლის შეცვლა
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="px-4 md:px-6 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
          >
            გაუქმება
          </Button>
          <Button
            type="submit"
            className="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            შენახვა
          </Button>
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
