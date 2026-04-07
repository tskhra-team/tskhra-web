import { privateInstance } from "@/api";
import type { BookingStatus } from "@/features/my-businesses/Calendar/ReadOnlyCalendar";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type ErrorResponse } from "react-router-dom";

export type NotificationResponse = {
  id: string;
  serviceName: string;
  userName: string;
  startTime: number;
  duration: number;
  status: BookingStatus;
  date: string;
  price: number;
};

const getNotifications = async (
  businessId: string | undefined,
  lang: string,
) => {
  const response = await privateInstance.get<NotificationResponse[]>(
    `/business/${businessId}/bookings/awaiting`,
    { params: { lang } },
  );
  return response.data;
};

const useGetNotifications = (businessId: string | undefined, lang: string) => {
  return useQuery<NotificationResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getNotifications(businessId, lang),
    queryKey: ["getNotifications", businessId, lang],
    enabled: !!businessId,
  });
};

export default useGetNotifications;
