import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const deleteAvatar = async () => {
  const response = await privateInstance.delete("user-profile/me/avatar");

  return response.data;
};

const useDeleteAvatar = () => {
  return useMutation<Response, AxiosError<ErrorResponse>>({
    mutationFn: deleteAvatar,
  });
};

export default useDeleteAvatar;
