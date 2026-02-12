import { privateInstance } from "@/api";
import type { ProfileFormData } from "@/features/profile/profileSchema";
import type { ErrorResponse, ProfileType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const updateProfile = async (data: ProfileFormData) => {
  const { birthDate, ...rest } = data;
  const updateData = {
    birthDate: data.birthDate
      ? data.birthDate.toISOString().split("T")[0]
      : undefined,
    ...rest,
  };
  const response = await privateInstance.put("user-profile/me", updateData);

  return response.data;
};

const useUpdateProfile = () => {
  return useMutation<ProfileType, AxiosError<ErrorResponse>, ProfileFormData>({
    mutationFn: updateProfile,
  });
};

export default useUpdateProfile;
