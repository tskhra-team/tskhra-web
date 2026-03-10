import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

type NotificationResponse = {
  id: string;
  serviceName: string;
  userName: string;
  startTime: number;
  duration: number;
  status: string;
};

const getNotifications = async (businessId: string) => {
  const response = await privateInstance.get<NotificationResponse[]>(
    `/business/${businessId}/bookings/awaiting`,
  );
  return response.data;
};

const useGetNotifications = (businessId: string) => {
  return useQuery<NotificationResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getNotifications(businessId),
    queryKey: ["getNotifications", businessId],
    staleTime: 1000,
    enabled: !!businessId,
  });
};

export default useGetNotifications;
