import { privateInstance } from "@/api";
import type { NotificationResponse as ScheduledResponse } from "@/features/my-businesses/Notifications/hooks/useGetNotifications";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

const getScheduledBookings = async (businessId: string) => {
  const response = await privateInstance.get(
    `business/${businessId}/bookings/scheduled`,
  );

  return response.data;
};

const useGetScheduledBookings = (businessId: string) => {
  return useQuery<ScheduledResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getScheduledBookings(businessId),
    queryKey: ["getScheduledBookings", businessId],
    enabled: !!businessId,
  });
};

export default useGetScheduledBookings;
