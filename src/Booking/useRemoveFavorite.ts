import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type RemoveFavoriteRequest = {
  businessId: string;
};

const removeFavorite = async ({ businessId }: RemoveFavoriteRequest) => {
  const response = await privateInstance.delete(
    `users/me/favorites/businesses/${businessId}`,
  );
  return response.data;
};

const useRemoveFavorite = () => {
  return useMutation<unknown, AxiosError<ErrorResponse>, RemoveFavoriteRequest>(
    {
      mutationFn: removeFavorite,
    },
  );
};

export default useRemoveFavorite;
