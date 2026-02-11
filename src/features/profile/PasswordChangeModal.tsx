import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  passwordSchema,
  type PasswordSchemaType,
} from "@/features/profile/passwordSchema";
import useUpdatePassword from "@/features/profile/useUpdatePassword";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordSchemaType>({
    resolver: yupResolver(passwordSchema),
  });

  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const onSubmit = (data: PasswordSchemaType) => {
    updatePassword(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Password changed successfully", {
          position: "top-center",
        });
        handleClose();
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message;

        if (error.response?.status === 401) {
          toast.error(errorMessage || "Current password is incorrect", {
            position: "top-center",
          });
        } else if (error.response?.status === 400) {
          toast.error(errorMessage || "Invalid password format", {
            position: "top-center",
          });
        } else if (error.response?.status === 500) {
          toast.error(errorMessage || "Server error - Please try again later", {
            position: "top-center",
          });
        } else {
          toast.error(errorMessage || "Failed to change password", {
            position: "top-center",
          });
        }
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">პაროლის შეცვლა</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              მიმდინარე პაროლი<span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register("currentPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ახალი პაროლი<span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register("newPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              გაიმეორეთ პაროლი<span className="text-red-500">*</span>
            </label>
            <PasswordInput
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isPending ? "მიმდინარეობს..." : "შენახვა"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
