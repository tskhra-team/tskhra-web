import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getUserNotifications = async (): Promise<number> => {
  const response = await privateInstance.get<number>("/notifications/count");
  return response.data;
};

const useGetUserNotifications = (isVerified: boolean | undefined) => {
  return useQuery<number, AxiosError<ErrorResponse>>({
    queryFn: getUserNotifications,
    queryKey: ["getUserNotifications"],
    enabled: !!isVerified,
    staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - data cached
  });
};

export default useGetUserNotifications;
