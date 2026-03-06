import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type AvatarType = {
  avatar: File | undefined;
};

type AvatarUploadResponse = {
  status: number;
  message: string;
};

const uploadAvatar = async ({ avatar }: AvatarType) => {
  const formData = new FormData();

  if (avatar) {
    formData.append("file", avatar);
  }

  const response = await privateInstance.post(
    "/user-profile/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

const useUploadAvatar = () => {
  return useMutation<
    AvatarUploadResponse,
    AxiosError<ErrorResponse>,
    AvatarType
  >({
    mutationFn: uploadAvatar,
  });
};

export default useUploadAvatar;
