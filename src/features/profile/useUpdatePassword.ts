import { privateInstance } from "@/api";
import type { PasswordSchemaType } from "@/features/profile/passwordSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}

const updatePassword = async (data: PasswordSchemaType) => {
  const { currentPassword, newPassword } = data;
  const response = await privateInstance.post("/users/changePass", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

const useUpdatePassword = () => {
  return useMutation<
    UpdatePasswordResponse,
    AxiosError<ErrorResponse>,
    PasswordSchemaType
  >({
    mutationFn: updatePassword,
  });
};

export default useUpdatePassword;
