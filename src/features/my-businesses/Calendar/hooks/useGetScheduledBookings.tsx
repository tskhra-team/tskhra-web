import { privateInstance } from "@/api";
import type { NotificationResponse as ScheduledResponse } from "@/features/my-businesses/Notifications/hooks/useGetNotifications";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

const getScheduledBookings = async (businessId: string, lang: string) => {
  const response = await privateInstance.get(
    `business/${businessId}/bookings/scheduled`,
    { params: { lang } },
  );

  return response.data;
};

const useGetScheduledBookings = (businessId: string, lang: string) => {
  return useQuery<ScheduledResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getScheduledBookings(businessId, lang),
    queryKey: ["getScheduledBookings", businessId, lang],
    enabled: !!businessId,
  });
};

export default useGetScheduledBookings;
