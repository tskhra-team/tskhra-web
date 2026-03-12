import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getBusinessTimeslots = async (
  businessId: string,
  date: string,
  serviceId: string,
) => {
  const response = await publicInstance.get(
    `/business/${businessId}/timeslots`,
    {
      params: {
        date,
        serviceId,
      },
    },
  );
  return response.data;
};

const useGetBusinessTimeslots = (
  businessId: string,
  date: string | null,
  serviceId: string | null,
  enabled: boolean = true,
) => {
  return useQuery<number[], AxiosError<ErrorResponse>>({
    queryFn: () =>
      getBusinessTimeslots(businessId, date!, serviceId!),
    queryKey: ["business", businessId, "timeslots", date, serviceId],
    staleTime: 30 * 1000, // 30 seconds - shorter to get fresh data more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache but allow garbage collection
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    enabled: enabled && !!businessId && !!date && !!serviceId,
  });
};

export default useGetBusinessTimeslots;
