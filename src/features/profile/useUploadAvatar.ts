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
    // Убедись, что бэкенд ждет именно ключ "avatar", а не "file" или что-то еще
    formData.append("file", avatar);
  }

  const response = await privateInstance.post(
    "/user-profile/me/avatar",
    formData,
    {
      // НОВОЕ: Явно указываем тип контента для загрузки файлов
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
