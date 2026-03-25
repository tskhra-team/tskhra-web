import { publicInstance } from "@/api";
import type { Service } from "@/Booking/types/booking.types";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getBookingBusinessServices = async (businessId: string, lang: string) => {
  const response = await publicInstance.get(
    `/business/${businessId}/services`,
    { params: { lang } },
  );
  return response.data;
};

const useGetBookingBusinessServices = (
  businessId: string,
  enabled: boolean = true,
  lang: string,
) => {
  return useQuery<Service[], AxiosError<ErrorResponse>>({
    queryFn: () => getBookingBusinessServices(businessId, lang),
    queryKey: ["business", businessId, "services", lang],
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!businessId,
  });
};

export default useGetBookingBusinessServices;
