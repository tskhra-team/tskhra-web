import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type AddFavoriteRequest = {
  businessId: string;
};

const addFavorite = async ({ businessId }: AddFavoriteRequest) => {
  const response = await privateInstance.put(
    `users/me/favorites/businesses/${businessId}`,
  );
  return response.data;
};

const useAddFavorite = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, AddFavoriteRequest>({
    mutationFn: addFavorite,
  });
};

export default useAddFavorite;
