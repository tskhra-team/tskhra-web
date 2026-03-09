import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Service } from "@/Booking/types/booking.types";


const getBookingBusinessServices = async (businessId: string) => {
  const response = await publicInstance.get(`/business/${businessId}/services`);
  return response.data;
};



const useGetBookingBusinessServices = (
  businessId: string,
  enabled: boolean = true,
) => {
  return useQuery<Service[], AxiosError<ErrorResponse>>({
    queryFn: () => getBookingBusinessServices(businessId),
    queryKey: ["business", businessId, "services"],
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!businessId,
  });
};

export default useGetBookingBusinessServices;